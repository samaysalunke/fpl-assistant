import React, { useState, useEffect } from 'react';
import { fetchTeamData, fetchFixtures, fetchPlayerData } from '../utils/api';
const EnhancedTransferSuggestions = () => {
  const [teams, setTeams] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, fixtureData, playerData] = await Promise.all([
          fetchTeamData(),
          fetchFixtures(),
          fetchPlayerData()
        ]);
        setTeams(teamData);
        setFixtures(fixtureData);
        setPlayers(playerData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateFixtureDifficulty = (teamId, nextNFixtures = 5) => {
    const teamFixtures = fixtures
      .filter(f => f.team_h === teamId || f.team_a === teamId)
      .slice(0, nextNFixtures);
    
    return teamFixtures.reduce((acc, fixture) => {
      const difficulty = teamId === fixture.team_h ? fixture.team_h_difficulty : fixture.team_a_difficulty;
      return acc + difficulty;
    }, 0) / nextNFixtures;
  };

  const analyzeTeamForm = (teamId, lastNMatches = 5) => {
    const teamFixtures = fixtures
      .filter(f => (f.team_h === teamId || f.team_a === teamId) && f.finished)
      .slice(-lastNMatches);

    const form = teamFixtures.reduce((acc, fixture) => {
      const isHome = teamId === fixture.team_h;
      const goalsScored = isHome ? fixture.team_h_score : fixture.team_a_score;
      const goalsConceded = isHome ? fixture.team_a_score : fixture.team_h_score;
      return {
        goalsScored: acc.goalsScored + goalsScored,
        goalsConceded: acc.goalsConceded + goalsConceded,
        cleanSheets: acc.cleanSheets + (goalsConceded === 0 ? 1 : 0)
      };
    }, { goalsScored: 0, goalsConceded: 0, cleanSheets: 0 });

    return {
      ...form,
      averageGoalsScored: form.goalsScored / lastNMatches,
      averageGoalsConceded: form.goalsConceded / lastNMatches
    };
  };

  const getSetPieceTakers = (teamId) => {
    return players
      .filter(p => p.team === teamId && (p.corners_and_indirect_freekicks_order === 1 || p.direct_freekicks_order === 1 || p.penalties_order === 1))
      .map(p => ({
        id: p.id,
        name: p.web_name,
        corners: p.corners_and_indirect_freekicks_order === 1,
        freeKicks: p.direct_freekicks_order === 1,
        penalties: p.penalties_order === 1
      }));
  };

  const getPositionBasedSuggestions = (teamPlayers, count = 1) => {
    const positions = ['GKP', 'DEF', 'MID', 'FWD'];
    const suggestions = {};

    positions.forEach(position => {
      suggestions[position] = teamPlayers
        .filter(p => p.element_type === positions.indexOf(position) + 1)
        .sort((a, b) => b.form - a.form)
        .slice(0, count)
        .map(p => ({
          id: p.id,
          name: p.web_name,
          form: parseFloat(p.form),
          price: p.now_cost / 10,
          totalPoints: p.total_points,
          goalsScored: p.goals_scored,
          assists: p.assists,
          cleanSheets: p.clean_sheets
        }));
    });

    return suggestions;
  };

  const getTransferSuggestions = () => {
    return teams.map(team => {
      const fixtureDifficulty = calculateFixtureDifficulty(team.id);
      const form = analyzeTeamForm(team.id);
      const setPieceTakers = getSetPieceTakers(team.id);
      const teamPlayers = players.filter(p => p.team === team.id);
      const positionBasedSuggestions = getPositionBasedSuggestions(teamPlayers);

      return {
        teamId: team.id,
        teamName: team.name,
        fixtureDifficulty,
        form,
        setPieceTakers,
        suggestedPlayers: positionBasedSuggestions
      };
    });
  };

  if (loading) return <div>Loading transfer suggestions...</div>;
  if (error) return <div>Error loading transfer suggestions: {error}</div>;

  const transferSuggestions = getTransferSuggestions();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transfer Suggestions</h2>
      <div className="mb-4">
        <label htmlFor="team-select" className="block mb-2">Select a team:</label>
        <select 
          id="team-select"
          className="w-full p-2 border rounded"
          value={selectedTeam || ''}
          onChange={(e) => setSelectedTeam(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Choose a team</option>
          {transferSuggestions.map(suggestion => (
            <option key={suggestion.teamId} value={suggestion.teamId}>
              {suggestion.teamName}
            </option>
          ))}
        </select>
      </div>
      {selectedTeam && (
        (() => {
          const suggestion = transferSuggestions.find(s => s.teamId === selectedTeam);
          return (
            <div>
              <h3 className="text-xl font-semibold mb-2">{suggestion.teamName}</h3>
              <p>Fixture Difficulty (next 5): {suggestion.fixtureDifficulty.toFixed(2)}</p>
              <p>Average Goals Scored (last 5): {suggestion.form.averageGoalsScored.toFixed(2)}</p>
              <p>Average Goals Conceded (last 5): {suggestion.form.averageGoalsConceded.toFixed(2)}</p>
              <p>Clean Sheets (last 5): {suggestion.form.cleanSheets}</p>
              <h4 className="font-semibold mt-4">Set Piece Takers:</h4>
              <ul className="mb-4">
                {suggestion.setPieceTakers.map(taker => (
                  <li key={taker.id}>
                    {taker.name} - 
                    {taker.corners ? ' Corners' : ''}
                    {taker.freeKicks ? ' Free Kicks' : ''}
                    {taker.penalties ? ' Penalties' : ''}
                  </li>
                ))}
              </ul>
              <h4 className="font-semibold">Suggested Players:</h4>
              {Object.entries(suggestion.suggestedPlayers).map(([position, players]) => (
                <div key={position} className="mb-4">
                  <h5 className="font-medium">{position}:</h5>
                  <ul>
                    {players.map(player => (
                      <li key={player.id}>
                        {player.name} (Form: {player.form}, Price: £{player.price}m, 
                        Total Points: {player.totalPoints}, 
                        Goals: {player.goalsScored}, 
                        Assists: {player.assists}, 
                        Clean Sheets: {player.cleanSheets})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })()
      )}
    </div>
  );
};

export default EnhancedTransferSuggestions;