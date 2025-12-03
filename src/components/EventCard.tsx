import React from 'react';

interface Event {
  title: string;
  start: string;
  description?: string;
  location?: string;
  hasTime: boolean;
  isRecurring: boolean;
}

interface EventCardProps {
  event: Event;
}

// Helper functions for formatting dates/times in client timezone
function formatTimeInClientTimezone(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}

function formatDayOfWeekInClientTimezone(isoString: string): string {
  const date = new Date(isoString);
  const dayName = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  if (dayName && dayName.length > 0) {
    return dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();
  }
  return dayName;
}

function formatDateInClientTimezone(isoString: string): string {
  const date = new Date(isoString);
  const formatted = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  if (formatted && formatted.length > 0) {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return formatted;
}

export function EventCard({ event }: EventCardProps) {
  let dateTimeText = '';
  
  if (event.hasTime) {
    const clientTime = formatTimeInClientTimezone(event.start);
    
    if (event.isRecurring) {
      const clientDay = formatDayOfWeekInClientTimezone(event.start);
      dateTimeText = `${clientDay} a las ${clientTime}`;
    } else {
      const clientDate = formatDateInClientTimezone(event.start);
      dateTimeText = `${clientDate} a las ${clientTime}`;
    }
  } else {
    if (event.isRecurring) {
      const clientDay = formatDayOfWeekInClientTimezone(event.start);
      dateTimeText = clientDay;
    } else {
      const clientDate = formatDateInClientTimezone(event.start);
      dateTimeText = clientDate;
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-blue-600 mb-3">{event.title}</h3>
      <p className="text-lg font-semibold text-gray-900 mb-3">{dateTimeText}</p>
      {event.description && (
        <p className="text-gray-700 mb-4 line-clamp-3">{event.description}</p>
      )}
      {event.location && (
        <p className="text-sm text-gray-600 mt-2">
          <strong>Ubicación:</strong> {event.location}
        </p>
      )}
    </div>
  );
}

