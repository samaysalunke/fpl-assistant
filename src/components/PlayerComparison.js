import React, { useState } from 'react';

const PlayerComparison = ({ players }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const compareStats = (stat) => {
    if (!player1 || !player2) return null;
    const p1 = players.find(p => p.id === parseInt(player1));
    const p2 = players.find(p => p.id === parseInt(player2));
    if (p1[stat] > p2[stat]) return 'text-green-600 font-bold';
    if (p1[stat] < p2[stat]) return 'text-red-600 font-bold';
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Player Comparison</h2>
      <div className="flex space-x-4 mb-4">
        <select 
          value={player1} 
          onChange={(e) => setPlayer1(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Select Player 1</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.web_name}</option>
          ))}
        </select>
        <select 
          value={player2} 
          onChange={(e) => setPlayer2(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">Select Player 2</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.web_name}</option>
          ))}
        </select>
      </div>
      {player1 && player2 && (
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Stat</th>
              <th className="px-4 py-2">{players.find(p => p.id === parseInt(player1)).web_name}</th>
              <th className="px-4 py-2">{players.find(p => p.id === parseInt(player2)).web_name}</th>
            </tr>
          </thead>
          <tbody>
            {['points_per_game', 'total_points', 'now_cost', 'selected_by_percent'].map(stat => (
              <tr key={stat}>
                <td className="px-4 py-2">{stat.replace('_', ' ')}</td>
                <td className={`px-4 py-2 ${compareStats(stat)}`}>
                  {players.find(p => p.id === parseInt(player1))[stat]}
                </td>
                <td className={`px-4 py-2 ${compareStats(stat)}`}>
                  {players.find(p => p.id === parseInt(player2))[stat]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlayerComparison;