import React from 'react';

const TeamDisplay = ({ teamData }) => {
  if (!teamData || !teamData.picks) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{teamData.name}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Player</th>
              <th className="px-4 py-2 text-left">Position</th>
              <th className="px-4 py-2 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {teamData.picks.map((player, index) => (
              <tr key={index} className={`${player.is_captain ? 'bg-yellow-100' : ''} ${player.is_vice_captain ? 'bg-gray-100' : ''}`}>
                <td className="px-4 py-2">
                  {player.playerName} 
                  {player.is_captain ? ' (C)' : player.is_vice_captain ? ' (VC)' : ''}
                </td>
                <td className="px-4 py-2">{player.position}</td>
                <td className="px-4 py-2">{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamDisplay;