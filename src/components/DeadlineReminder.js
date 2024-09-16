import React, { useState, useEffect } from 'react';

const DeadlineReminder = ({ events }) => {
  const [nextEvent, setNextEvent] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (events && events.length > 0) {
      const next = events.find(event => !event.finished);
      setNextEvent(next);
    }
  }, [events]);

  useEffect(() => {
    if (nextEvent) {
      const timer = setInterval(() => {
        const now = new Date();
        const deadline = new Date(nextEvent.deadline_time);
        const difference = deadline - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining('Deadline passed');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [nextEvent]);

  if (!nextEvent) return <p>No upcoming deadlines.</p>;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
      <p className="font-bold">Next Deadline: Gameweek {nextEvent.id}</p>
      <p>Deadline: {new Date(nextEvent.deadline_time).toLocaleString()}</p>
      <p>Time Remaining: {timeRemaining}</p>
    </div>
  );
};

export default DeadlineReminder;