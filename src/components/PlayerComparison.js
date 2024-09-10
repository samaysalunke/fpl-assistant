'use client'
import React, { useState } from 'react';

const PlayerComparison = ({ players }) => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const getPlayerStats = (playerName) => {
    return players.find(p => p.name === playerName) || null;
  };

  const player1Stats = getPlayerStats(player1);
  const player2Stats = getPlayerStats(player2);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Player Comparison</h2>
      <div className="flex space-x-4 mb-4">
      <select
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
        className="p-2 border rounded flex-1"
        >
    <option value="">Select Player 1</option>
    {players.map(p => (
    <option key={p.id} value={p.id}>{p.web_name}</option>
    ))}
        </select>
        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="p-2 border rounded flex-1"
        >
          <option value="">Select Player 2</option>
          {players.map(p => (
    <option key={p.id} value={p.id}>{p.web_name}</option>
    ))}
        </select>
      </div>
      {player1Stats && player2Stats && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-semibold">{player1Stats.name}</p>
            <p>{player1Stats.position}</p>
            <p>£{player1Stats.price}m</p>
            <p>xG: {player1Stats.xG.toFixed(2)}</p>
          </div>
          <div className="font-semibold">
            <p>VS</p>
          </div>
          <div>
            <p className="font-semibold">{player2Stats.name}</p>
            <p>{player2Stats.position}</p>
            <p>£{player2Stats.price}m</p>
            <p>xG: {player2Stats.xG.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerComparison;