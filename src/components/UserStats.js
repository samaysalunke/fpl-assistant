'use client';

import React, { useState } from 'react';

const UserStats = ({ stats }) => {
  const [activeTab, setActiveTab] = useState('current');

  if (!stats) return null;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${activeTab === 'current' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('current')}
        >
          Current Season
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('history')}
        >
          Season History
        </button>
      </div>

      {activeTab === 'current' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Current Season</h2>
          <p>Total Points: {stats.current[0].total_points}</p>
          <p>Overall Rank: {stats.current[0].overall_rank}</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Season History</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Season</th>
                <th className="px-4 py-2">Total Points</th>
                <th className="px-4 py-2">Overall Rank</th>
              </tr>
            </thead>
            <tbody>
              {stats.past.map((season, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{season.season_name}</td>
                  <td className="border px-4 py-2">{season.total_points}</td>
                  <td className="border px-4 py-2">{season.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserStats;