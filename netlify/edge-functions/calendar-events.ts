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
    const calendarUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/' + encodeURIComponent(calendarId) + '/events');
    calendarUrl.searchParams.set('key', apiKey);
    calendarUrl.searchParams.set('maxResults', maxResults.toString());
    calendarUrl.searchParams.set('timeMin', timeMin);
    calendarUrl.searchParams.set('orderBy', 'startTime');
    calendarUrl.searchParams.set('singleEvents', 'true');
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
    const allEvents: CalendarEvent[] = (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.summary || 'Sin título',
      description: item.description || '',
      start: item.start?.dateTime || item.start?.date || '',
      end: item.end?.dateTime || item.end?.date || '',
      location: item.location || undefined,
      htmlLink: item.htmlLink || undefined,
      recurringEventId: item.recurringEventId || undefined,
      isRecurring: !!item.recurringEventId,
    }));

    // Deduplicate recurring weekly events
    // Group events by title + day of week + time (for recurring events)
    const eventMap = new Map<string, CalendarEvent>();
    
    allEvents.forEach((event) => {
      const startDate = new Date(event.start);
      const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const hasTime = event.start.includes('T');
      const time = hasTime ? startDate.toTimeString().slice(0, 5) : 'all-day'; // HH:MM format
      
      // Create a unique key for recurring events: title + dayOfWeek + time
      const recurringKey = `${event.title}|${dayOfWeek}|${time}`;
      
      // If this is a recurring event (has recurringEventId) or matches a pattern
      if (event.recurringEventId || eventMap.has(recurringKey)) {
        // Mark as recurring and only keep the first occurrence (earliest date) of each recurring event
        event.isRecurring = true;
        const existing = eventMap.get(recurringKey);
        if (!existing || new Date(event.start) < new Date(existing.start)) {
          eventMap.set(recurringKey, event);
        }
      } else {
        // Non-recurring event, use event ID as key
        event.isRecurring = false;
        eventMap.set(event.id, event);
      }
    });
    
    // Convert map back to array and sort by start time
    const events = Array.from(eventMap.values()).sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // Format events for display
    const formattedEvents = events.map((event) => {
      const startDate = new Date(event.start);
      const hasTime = event.start.includes('T');
      const isRecurring = event.isRecurring || false;

      // Format date in Spanish
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      };

      const formatDayOfWeek = (date: Date) => {
        return date.toLocaleDateString('es-ES', { 
          weekday: 'long'
        });
      };

      const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      };

      let displayDate = '';
      let displayTime: string | undefined = undefined;

      if (hasTime) {
        if (isRecurring) {
          // Recurring event - show day of week only
          displayDate = formatDayOfWeek(startDate);
          displayTime = formatTime(startDate);
        } else {
          // One-time event - show full date
          displayDate = formatDate(startDate);
          displayTime = formatTime(startDate);
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
        displayTime,
        hasTime,
      };
    });

    return new Response(
      JSON.stringify({ events: formattedEvents }),
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

