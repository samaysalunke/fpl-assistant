import React from 'react';

const DeadlineReminder = ({ events }) => {
  const nextEvent = events && events.length > 0 
    ? events.find(event => !event.finished) 
    : null;

  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Deadline Reminder</h2>
        <p className="text-lg text-gray-700">Loading deadline information...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Deadline Reminder</h2>
      {nextEvent ? (
        <>
          <p className="text-lg text-gray-700">Next deadline: {new Date(nextEvent.deadline_time).toLocaleString()}</p>
          <p className="text-xl font-bold text-blue-600">Gameweek {nextEvent.id}</p>
        </>
      ) : (
        <p className="text-lg text-gray-700">No upcoming deadlines.</p>
      )}
    </div>
  );
};

export default DeadlineReminder;