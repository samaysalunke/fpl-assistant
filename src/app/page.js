  'use client'
  import { fetchGeneralInfo, fetchTeamDetails, fetchH2HLeague } from '../utils/api';
  import H2HLeague from '../components/H2HLeague';
  import React, { useState, useEffect } from 'react';
  import DeadlineReminder from '../components/DeadlineReminder';
  import UserStats from '../components/UserStats';
  import RecommendationsTable from '../components/RecommendationsTable';
  import TeamDisplay from '../components/TeamDisplay';
  import TransferSuggestions from '../components/TransferSuggestions';
  import PlayerComparison from '../components/PlayerComparison';
  import LoadingSpinner from '../components/LoadingSpinner';



  export default function Home() {
    const [h2hLeagueData, setH2HLeagueData] = useState(null);
    const [generalInfo, setGeneralInfo] = useState(null);
    const [teamId, setTeamId] = useState('');
    const [teamData, setTeamData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchInitialData = async () => {
        setIsLoading(true);
        try {
        const [generalInfoData, h2hLeagueData] = await Promise.all([
          fetchGeneralInfo(),
          fetchH2HLeague(process.env.NEXT_PUBLIC_H2H_LEAGUE_ID) // Add this environment variable
        ]);
        setGeneralInfo(generalInfoData);
        setH2HLeagueData(h2hLeagueData);
      } catch (err) {
        setError('Failed to fetch data');
      }
        setIsLoading(false);
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
        console.error('Error fetching team:', err);
        setError('Failed to fetch team data. Please try again.');
      }
      setIsLoading(false);
    };

    const handleTeamIdChange = (e) => {
      setTeamId(e.target.value);
    };

    const handleClearData = () => {
      setTeamId('');
      setTeamData(null);
      localStorage.removeItem('fplTeamId');
      localStorage.removeItem('fplTeamData');
    };

    return (
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">FPL Assistant</h1>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <>
              {generalInfo && <DeadlineReminder events={generalInfo.events} />}
              {teamData && <UserStats stats={teamData.stats} />}
              {h2hLeagueData && <H2HLeague leagueData={h2hLeagueData} />}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
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
              </div>
              {teamData && <TeamDisplay teamData={teamData} />}
              {generalInfo && <RecommendationsTable players={generalInfo.elements} />}
              {generalInfo && teamData && (
    <TransferSuggestions 
      currentTeam={teamData} 
      allPlayers={generalInfo.elements} 
    />
  )}
              {generalInfo && <PlayerComparison players={generalInfo.elements} />}
            </>
          )}
        </main>

        <footer className="bg-gray-200 py-4 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <a href="https://fantasy.premierleague.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
              Official FPL Website
            </a>
          </div>
        </footer>
      </div>
    );
  }