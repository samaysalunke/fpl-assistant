'use client'
import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo, fetchTeamDetails } from '../utils/api';
import RecommendationsTable from '../components/RecommendationsTable';
import TeamDisplay from '../components/TeamDisplay';
import DeadlineReminder from '../components/DeadlineReminder';
import UserStats from '../components/UserStats';
import TransferSuggestions from '../components/TransferSuggestions';
import PlayerComparison from '../components/PlayerComparison';

export default function Home() {
  const [generalInfo, setGeneralInfo] = useState(null);
  const [teamId, setTeamId] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await fetchGeneralInfo();
        setGeneralInfo(data);
        setPlayerList(data.elements || []);
      } catch (err) {
        setError('Failed to fetch general information');
      }
    };

    fetchInitialData();
  }, []);

  const handleFetchTeam = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTeamDetails(teamId);
      // Map player IDs to names and add points
      data.picks = data.picks.map(pick => {
        const player = playerList.find(p => p.id === pick.element);
        return {
          ...pick,
          name: player ? player.web_name : 'Unknown Player',
          points: player ? player.event_points * pick.multiplier : 0,
        };
      });
      setTeamData(data);
      localStorage.setItem('fplTeamId', teamId);
      localStorage.setItem('fplTeamData', JSON.stringify(data));
    } catch (err) {
      console.error('Error fetching team:', err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleTeamIdChange = (e) => {
    const newTeamId = e.target.value;
    setTeamId(newTeamId);
    localStorage.setItem('fplTeamId', newTeamId);
  };

  const handleClearData = () => {
    setTeamId('');
    setTeamData(null);
    localStorage.removeItem('fplTeamId');
    localStorage.removeItem('fplTeamData');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">FPL Assistant</h1>
        </header>
        
        <main className="space-y-8">
          {isLoading && <p className="text-center text-xl">Loading...</p>}
          {error && <p className="text-center text-xl text-red-500">{error}</p>}
          
          {generalInfo && <DeadlineReminder events={generalInfo.events} />}
          
          {teamData && <UserStats stats={teamData.stats} />}
          
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Top Recommendations</h2>
            <RecommendationsTable players={playerList} />
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Team</h2>
            <input 
              type="text" 
              value={teamId}
              onChange={handleTeamIdChange}
              placeholder="Enter your team ID" 
              className="w-full p-2 border rounded mb-4 text-gray-800"
            />
            <div className="flex space-x-4">
              <button 
                onClick={handleFetchTeam}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isLoading ? 'Fetching...' : 'Fetch Team'}
              </button>
              <button 
                onClick={handleClearData}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Clear Data
              </button>
            </div>
            {teamData && <TeamDisplay teamData={teamData} />}
          </section>
          
          <TransferSuggestions suggestions={[]} />
          
          <PlayerComparison players={playerList} />
        </main>

        <footer className="mt-12 text-center text-gray-600">
          <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            Official FPL Website
          </a>
        </footer>
      </div>
    </div>
  );
}