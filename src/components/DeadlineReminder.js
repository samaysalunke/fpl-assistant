import React, { useState, useEffect } from 'react';

const DeadlineReminder = ({ events }) => {
  const [countdown, setCountdown] = useState('');

  const nextEvent = events?.find(event => !event.finished);

  useEffect(() => {
    if (nextEvent) {
      const timer = setInterval(() => {
        const now = new Date();
        const deadline = new Date(nextEvent.deadline_time);
        const difference = deadline - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setCountdown('Deadline passed');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [nextEvent]);

  if (!nextEvent) return null;

  const formatDeadline = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZoneName: 'short' 
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Deadline Reminder</h2>
      <p className="text-lg text-gray-700 mb-2">Next deadline:</p>
      <p className="text-xl font-bold text-blue-600">{formatDeadline(nextEvent.deadline_time)}</p>
      <p className="text-lg font-semibold text-green-600 mt-2">Time remaining: {countdown}</p>
      <p className="mt-4 text-gray-600">Gameweek {nextEvent.id}</p>
    </div>
  );
};

export default DeadlineReminder;