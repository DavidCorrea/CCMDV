import React, { useEffect, useState } from 'react';
import { EventCard } from './EventCard';

interface Event {
  title: string;
  start: string;
  description?: string;
  location?: string;
  hasTime: boolean;
  isRecurring: boolean;
}

interface RecurringEventsListProps {
  emptyMessage?: string;
}

export function RecurringEventsList({ emptyMessage = 'No hay actividades regulares programadas.' }: RecurringEventsListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await fetch('/api/calendar-events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.recurringEvents || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando eventos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          <strong>Error:</strong> {error}
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {events.map((event, index) => (
        <EventCard key={`${event.title}-${event.start}-${index}`} event={event} />
      ))}
    </div>
  );
}

