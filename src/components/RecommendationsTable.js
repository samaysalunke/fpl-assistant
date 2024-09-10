import React, { useState, useMemo } from 'react';

const RecommendationsTable = ({ players }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'points_per_game', direction: 'descending' });
  
  const sortedPlayers = useMemo(() => {
    let sortablePlayers = [...players];
    if (sortConfig !== null) {
      sortablePlayers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlayers.slice(0, 10); // Top 10 players
  }, [players, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Top Recommendations</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th onClick={() => requestSort('web_name')} className="px-4 py-2 cursor-pointer">Player</th>
              <th onClick={() => requestSort('element_type')} className="px-4 py-2 cursor-pointer">Position</th>
              <th onClick={() => requestSort('points_per_game')} className="px-4 py-2 cursor-pointer">Points per Game</th>
              <th onClick={() => requestSort('now_cost')} className="px-4 py-2 cursor-pointer">Price</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player) => (
              <tr key={player.id}>
                <td className="px-4 py-2">{player.web_name}</td>
                <td className="px-4 py-2">{['GK', 'DEF', 'MID', 'FWD'][player.element_type - 1]}</td>
                <td className="px-4 py-2">{player.points_per_game}</td>
                <td className="px-4 py-2">£{(player.now_cost / 10).toFixed(1)}m</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendationsTable;