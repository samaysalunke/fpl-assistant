'use client'
import React, { useState, useMemo } from 'react';

const positionColors = {
  GK: 'bg-yellow-200',
  DEF: 'bg-blue-200',
  MID: 'bg-green-200',
  FWD: 'bg-red-200'
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('');
};

const TeamDisplay = ({ teamData }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedTeamData = useMemo(() => {
    let sortableItems = [...teamData];
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
  }, [teamData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const totalPoints = teamData.reduce((sum, player) => sum + player.points, 0);
  const averagePoints = totalPoints / teamData.length;

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Your Team</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-gray-800">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
                Player
              </th>
              <th onClick={() => requestSort('position')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
                Position
              </th>
              <th onClick={() => requestSort('points')} className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTeamData.map((player, index) => (
              <tr key={index} className={`${positionColors[player.position]} ${player.points > averagePoints ? 'font-bold' : player.points < averagePoints / 2 ? 'text-red-500' : ''}`}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 mr-3 rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold">
                    {getInitials(player.name)}
                  </div>
                  {player.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {player.position}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {player.points}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan="2" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                Total Points
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 font-semibold">
                {totalPoints}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TeamDisplay;