import type { Config } from '@netlify/edge-functions';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location?: string;
  htmlLink?: string;
  recurringEventId?: string;
  isRecurring?: boolean;
  // Formatted display fields
  displayDate?: string;
  displayTime?: string;
  hasTime?: boolean;
}

export default async (request: Request, context: { next: () => Promise<Response> }) => {
  // Only handle GET requests to /api/calendar-events
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  if (url.pathname !== '/api/calendar-events') {
    return context.next();
  }

  // @ts-ignore - Deno is available in Netlify Edge Functions runtime
  const apiKey = Deno.env.get('GOOGLE_API_KEY');
  // @ts-ignore - Deno is available in Netlify Edge Functions runtime
  const calendarId = Deno.env.get('GOOGLE_CALENDAR_ID');

  if (!apiKey || !calendarId) {
    console.error('Missing Google Calendar API credentials:', { 
      hasApiKey: !!apiKey, 
      hasCalendarId: !!calendarId 
    });
    return new Response(
      JSON.stringify({ 
        error: 'Google Calendar API credentials not configured',
        debug: {
          hasApiKey: !!apiKey,
          hasCalendarId: !!calendarId,
        }
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Get query parameters for filtering
    const maxResults = parseInt(url.searchParams.get('maxResults') || '50', 10);
    const timeMin = url.searchParams.get('timeMin') || new Date().toISOString();
    const timeMax = url.searchParams.get('timeMax') || undefined;

    // Build the API URL
    // Use singleEvents=true to expand recurring events into individual instances
    // Then we'll deduplicate to show only the next occurrence of each recurring event
    const calendarUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events');
    calendarUrl.searchParams.set('key', apiKey);
    calendarUrl.searchParams.set('maxResults', maxResults.toString());
    calendarUrl.searchParams.set('timeMin', timeMin);
    calendarUrl.searchParams.set('singleEvents', 'true'); // Expand recurring events into instances
    calendarUrl.searchParams.set('orderBy', 'startTime'); // Order by start time
    if (timeMax) {
      calendarUrl.searchParams.set('timeMax', timeMax);
    }

    const response = await fetch(calendarUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch calendar events',
          status: response.status 
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    // Transform the events to a simpler format
    // With singleEvents=true, recurring events are expanded into individual instances
    const allEvents: CalendarEvent[] = (data.items || [])
      .map((item: any) => {
        const isRecurring = !!item.recurringEventId;
        
        return {
          id: item.id,
          title: item.summary || 'Sin título',
          description: item.description || '',
          start: item.start?.dateTime || item.start?.date || '',
          end: item.end?.dateTime || item.end?.date || '',
          location: item.location || undefined,
          htmlLink: item.htmlLink || undefined,
          recurringEventId: item.recurringEventId || undefined,
          isRecurring: isRecurring,
        };
      })
      .filter((event: CalendarEvent) => {
        // Filter out past events (both recurring and one-time)
        const startDate = new Date(event.start);
        const now = new Date();
        return startDate >= now;
      });

    // Deduplicate recurring events
    // Group by recurringEventId - all instances of the same recurring event share the same recurringEventId
    // Keep only the next (earliest) occurrence of each recurring event
    const eventMap = new Map<string, CalendarEvent>();
    
    allEvents.forEach((event: CalendarEvent) => {
      if (event.isRecurring && event.recurringEventId) {
        // Recurring event - use recurringEventId as key to group instances
        const existing = eventMap.get(event.recurringEventId);
        if (!existing) {
          // First instance of this recurring event
          eventMap.set(event.recurringEventId, event);
        } else {
          // Keep the one with the earliest start date (next occurrence)
          if (new Date(event.start) < new Date(existing.start)) {
            eventMap.set(event.recurringEventId, event);
          }
        }
      } else {
        // One-time event - use event ID as key
        eventMap.set(event.id, event);
      }
    });
    
    // Convert map back to array
    const events = Array.from(eventMap.values());

    // Separate recurring and one-time events
    const recurringEvents = events.filter((event) => event.isRecurring || event.recurringEventId);
    const oneTimeEvents = events.filter((event) => !event.isRecurring && !event.recurringEventId);

    // Sort recurring events by day of week (Sunday = 0, Monday = 1, etc.)
    recurringEvents.sort((a, b) => {
      const dayA = new Date(a.start).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const dayB = new Date(b.start).getDay();
      return dayA - dayB;
    });

    // Sort one-time events by start date/time
    oneTimeEvents.sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

    // Format events for display - helper function
    const formatEvent = (event: CalendarEvent) => {
      const startDate = new Date(event.start);
      const hasTime = event.start.includes('T');
      const isRecurring = event.isRecurring || false;

      // Format date in Spanish (without year for one-time events)
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric' 
        });
      };

      const formatDayOfWeek = (date: Date) => {
        const dayName = date.toLocaleDateString('es-ES', { 
          weekday: 'long'
        });
        // Capitalize first letter - ensure it works even if locale returns lowercase
        if (dayName && dayName.length > 0) {
          return dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
        }
        return dayName;
      };

      const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      };

      let displayDate = '';
      // Don't format time on server - let client format it in their timezone
      // For recurring events with time, we'll format both day and time on client
      // For one-time events, we format the date on server but time on client
      let displayTime: string | undefined = undefined;

      if (hasTime) {
        if (isRecurring) {
          // Recurring event - format day on server, time will be formatted on client
          displayDate = formatDayOfWeek(startDate);
          // Don't set displayTime - client will format from raw start date
        } else {
          // One-time event - show full date on server, time on client
          displayDate = formatDate(startDate);
          // Don't set displayTime - client will format from raw start date
        }
      } else {
        // All-day event
        if (isRecurring) {
          // Recurring all-day event - show day of week only
          displayDate = formatDayOfWeek(startDate);
        } else {
          // One-time all-day event - show full date
          displayDate = formatDate(startDate);
        }
      }

      return {
        ...event,
        displayDate,
        displayTime, // Will be undefined for events with time - client formats it
        hasTime,
      };
    };

    // Format recurring and one-time events separately
    const formattedRecurringEvents = recurringEvents.map(formatEvent);
    const formattedUpcomingEvents = oneTimeEvents.map(formatEvent);

    return new Response(
      JSON.stringify({ 
        recurringEvents: formattedRecurringEvents,
        upcomingEvents: formattedUpcomingEvents
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch calendar events' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const config: Config = {
  path: '/api/calendar-events',
};

