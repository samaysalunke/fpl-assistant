import React, { useState, useEffect } from 'react';
import { fetchPlayerData, fetchFixtures } from '../utils/api';
import { calculateForm, calculateFixtureDifficulty, predictPoints } from '../utils/fplStats';

const PlayerInsights = () => {
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playerData, fixtureData] = await Promise.all([fetchPlayerData(), fetchFixtures()]);
        setPlayers(playerData);
        setFixtures(fixtureData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateValue = (totalPoints, cost) => {
    if (cost === 0) return 0;
    return (totalPoints / cost).toFixed(2);
  };

  const getPlayerInsights = (player) => {
    const form = player.form ? parseFloat(player.form) : 0;
    const value = calculateValue(player.total_points, player.now_cost / 10);
    const fixtureDifficulty = calculateFixtureDifficulty(fixtures, player.team);
    const predictedPoints = predictPoints([form], fixtureDifficulty);

    return {
      ...player,
      form,
      value,
      predictedPoints,
    };
  };

  const topPlayers = players
    .map(getPlayerInsights)
    .sort((a, b) => b.predictedPoints - a.predictedPoints)
    .slice(0, 10);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Form
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value (Points per £1m)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Predicted Points
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {topPlayers.map((player) => (
            <tr key={player.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{player.web_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{player.form}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{player.value}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{player.predictedPoints.toFixed(2)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerInsights;