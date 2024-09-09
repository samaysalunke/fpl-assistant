import React from 'react';

const UserStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Stats</h2>
        <p className="text-center text-gray-600">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Stats</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Overall Rank</p>
          <p className="text-xl font-bold">
            {stats.summary_overall_rank ? stats.summary_overall_rank.toLocaleString() : 'N/A'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Gameweek Points</p>
          <p className="text-xl font-bold">
            {stats.summary_event_points || 'N/A'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="text-xl font-bold">
            {stats.summary_overall_points || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;