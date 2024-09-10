'use client'
import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo, fetchTeamDetails } from '../utils/api';
import RecommendationsTable from '../components/RecommendationsTable';
import TeamDisplay from '../components/TeamDisplay';
import DeadlineReminder from '../components/DeadlineReminder';
import UserStats from '../components/UserStats';
import TransferSuggestions from '../components/TransferSuggestions';
import PlayerComparison from '../components/PlayerComparison';

// Mock data for recommendations
const mockRecommendations = [
  { name: 'Harry Kane', position: 'FWD', xG: 0.75, price: 12.5 },
  { name: 'Mohamed Salah', position: 'MID', xG: 0.68, price: 13.0 },
  { name: 'Erling Haaland', position: 'FWD', xG: 0.82, price: 14.0 },
  { name: 'Kevin De Bruyne', position: 'MID', xG: 0.65, price: 12.0 },
  { name: 'Trent Alexander-Arnold', position: 'DEF', xG: 0.15, price: 8.5 },
  { name: 'Bruno Fernandes', position: 'MID', xG: 0.55, price: 11.5 },
  { name: 'Ederson', position: 'GK', xG: 0.01, price: 6.0 },
];

// Mock function to fetch team data
const fetchTeamData = async (teamId) => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock team data with more variety in points
  return [
    { name: 'David de Gea', position: 'GK', points: 34 },
    { name: 'Trent Alexander-Arnold', position: 'DEF', points: 52 },
    { name: 'Virgil van Dijk', position: 'DEF', points: 48 },
    { name: 'Andrew Robertson', position: 'DEF', points: 46 },
    { name: 'Reece James', position: 'DEF', points: 44 },
    { name: 'Kevin De Bruyne', position: 'MID', points: 78 },
    { name: 'Bruno Fernandes', position: 'MID', points: 70 },
    { name: 'Mohamed Salah', position: 'MID', points: 82 },
    { name: 'Mason Mount', position: 'MID', points: 35 },
    { name: 'Harry Kane', position: 'FWD', points: 86 },
    { name: 'Erling Haaland', position: 'FWD', points: 90 },
  ];
};

// Mock data for deadline and fixtures
const mockDeadline = '2024-09-16T11:00:00';
const mockFixtures = [
  { home: 'Liverpool', away: 'Manchester City' },
  { home: 'Arsenal', away: 'Chelsea' },
  { home: 'Manchester United', away: 'Tottenham' },
  { home: 'Leicester City', away: 'West Ham' },
  { home: 'Everton', away: 'Aston Villa' },
];

// Add mock data for user stats
const mockUserStats = {
  overallRank: 100000,
  gameweekPoints: 65,
  totalPoints: 1200,
};

// Add mock data for transfer suggestions
const mockTransferSuggestions = [
  { out: 'Mason Mount', in: 'Phil Foden', reason: 'Better form and fixtures' },
  { out: 'Reece James', in: 'Joao Cancelo', reason: 'Higher assist potential' },
];

export default function Home() {
  const [generalInfo, setGeneralInfo] = useState(null);
  const [teamId, setTeamId] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await fetchGeneralInfo();
        setGeneralInfo(data);
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
      setTeamData(data);
      localStorage.setItem('fplTeamId', teamId);
      localStorage.setItem('fplTeamData', JSON.stringify(data));
    } catch (err) {
      setError('Failed to fetch team data. Please try again.');
    }
    setIsLoading(false);
  };

  const handleTeamIdChange = (e) => {
    const newTeamId = e.target.value;
    setTeamId(newTeamId);
    // Save team ID to local storage as it's typed
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
          {isLoading ? (
            <p className="text-center text-xl">Loading...</p>
          ) : error ? (
            <p className="text-center text-xl text-red-500">{error}</p>
          ) : (
            <>
              <DeadlineReminder events={generalInfo?.events || []} />
              <UserStats stats={teamData?.stats || null} />
              <UserStats stats={generalInfo?.user_stats || mockUserStats} />
              
              <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Top Recommendations</h2>
                <RecommendationsTable players={generalInfo?.elements || []} />
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
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {teamData && <TeamDisplay teamData={teamData} />}
              </section>
              
              <TransferSuggestions suggestions={mockTransferSuggestions} />
              
              <PlayerComparison players={generalInfo?.elements || []} />
            </>
          )}
        </main>
  
        <footer className="mt-12 text-center text-gray-600">
          <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            Official FPL Website
          </a>
        </footer>
      </div>
    </div>
  );
  {generalInfo && <DeadlineReminder events={generalInfo.events} />}
}