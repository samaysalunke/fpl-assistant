'use client'
import React, { useState, useMemo } from 'react';

const RecommendationsTable = ({ players }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [positionFilter, setPositionFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 20 });
  const getExpectedGoals = (player) => {
    // Check if expected_goals exists and is a number
    if (player.expected_goals && typeof player.expected_goals === 'number') {
      return player.expected_goals.toFixed(2);
    }
    // Fallback to expected_goals_per_90 if available
    if (player.expected_goals_per_90 && typeof player.expected_goals_per_90 === 'number') {
      return player.expected_goals_per_90.toFixed(2);
    }
    // If neither is available or not a number, return 'N/A'
    return 'N/A';
  };
  const recommendations = useMemo(() => {
    return players
      .map(player => ({
        name: player.web_name || player.second_name,
        position: player.element_type,
        xG: getExpectedGoals(player),
        price: player.now_cost / 10
      }))
      .sort((a, b) => b.xG - a.xG)
      .slice(0, 10);
  }, [players]);
  const sortedAndFilteredRecommendations = useMemo(() => {
    let sortableItems = [...recommendations];

    // Apply position filter
    if (positionFilter !== 'All') {
      sortableItems = sortableItems.filter(item => item.position === positionFilter);
    }

    // Apply price filter
    sortableItems = sortableItems.filter(item => 
      item.price >= priceFilter.min && item.price <= priceFilter.max
    );

    // Apply sorting
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [recommendations, sortConfig, positionFilter, priceFilter]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All Positions</option>
          <option value="GK">Goalkeeper</option>
          <option value="DEF">Defender</option>
          <option value="MID">Midfielder</option>
          <option value="FWD">Forward</option>
        </select>
        <div>
          <input
            type="number"
            value={priceFilter.min}
            onChange={(e) => setPriceFilter(prev => ({ ...prev, min: parseFloat(e.target.value) }))}
            className="p-2 border rounded w-24 mr-2"
            placeholder="Min £"
          />
          <input
            type="number"
            value={priceFilter.max}
            onChange={(e) => setPriceFilter(prev => ({ ...prev, max: parseFloat(e.target.value) }))}
            className="p-2 border rounded w-24"
            placeholder="Max £"
          />
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300 text-gray-800">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
              Player
            </th>
            <th onClick={() => requestSort('position')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
              Position
            </th>
            <th onClick={() => requestSort('xG')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
              xG This Week
            </th>
            <th onClick={() => requestSort('price')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((player, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {player.name}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {player.position}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {player.xG}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                £{player.price.toFixed(1)}m
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendationsTable;