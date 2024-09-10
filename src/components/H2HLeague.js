import React from 'react';

const H2HLeague = ({ leagueData }) => {
  if (!leagueData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{leagueData.name}</h2>
      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">Team</th>
                <th className="px-4 py-2 text-left">Played</th>
                <th className="px-4 py-2 text-left">Won</th>
                <th className="px-4 py-2 text-left">Drawn</th>
                <th className="px-4 py-2 text-left">Lost</th>
                <th className="px-4 py-2 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {leagueData.standings.results.map((team, index) => (
                <tr key={team.entry} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{team.entry_name}</td>
                  <td className="px-4 py-2">{team.matches_played}</td>
                  <td className="px-4 py-2">{team.matches_won}</td>
                  <td className="px-4 py-2">{team.matches_drawn}</td>
                  <td className="px-4 py-2">{team.matches_lost}</td>
                  <td className="px-4 py-2">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default H2HLeague;