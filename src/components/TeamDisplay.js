import React from 'react';

const TeamDisplay = ({ teamData }) => {
  if (!teamData || !teamData.picks) {
    return <p>No team data available.</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">{teamData.name}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Overall Rank</p>
          <p className="text-lg font-bold">{teamData.stats.overallRank.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="text-lg font-bold">{teamData.stats.totalPoints}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Gameweek Points</p>
          <p className="text-lg font-bold">{teamData.stats.gameweekPoints}</p>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300 text-gray-800">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Player</th>
            <th className="px-4 py-2 border-b">Position</th>
            <th className="px-4 py-2 border-b">Points</th>
          </tr>
        </thead>
        <tbody>
          {teamData.picks.map((player, index) => (
            <tr key={index} className={player.is_captain ? 'bg-yellow-100' : player.is_vice_captain ? 'bg-gray-100' : ''}>
              <td className="px-4 py-2 border-b">
                {player.name} {player.is_captain ? '(C)' : player.is_vice_captain ? '(VC)' : ''}
              </td>
              <td className="px-4 py-2 border-b">{player.position}</td>
              <td className="px-4 py-2 border-b">{player.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamDisplay;