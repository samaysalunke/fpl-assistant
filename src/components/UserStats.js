import React from 'react';

const UserStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Stats</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Overall Rank</p>
          <p className="text-xl font-bold text-blue-600">{stats.overallRank.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Gameweek Points</p>
          <p className="text-xl font-bold text-green-600">{stats.gameweekPoints}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="text-xl font-bold text-purple-600">{stats.totalPoints}</p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;