// Utility functions

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isRegistrationOpen = (event) => {
  if (!event.registration_deadline) return true;
  
  const now = new Date();
  const deadline = new Date(event.registration_deadline);
  return now < deadline;
};

export const isEventActive = (event) => {
  const now = new Date();
  const eventDate = new Date(event.date_time);
  return now < eventDate;
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getEventStatus = (event) => {
  const now = new Date();
  const eventDate = new Date(event.date_time);
  
  if (now > eventDate) return 'completed';
  if (!isRegistrationOpen(event)) return 'registration_closed';
  return 'upcoming';
};