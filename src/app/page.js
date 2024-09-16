'use client'
import React, { useState, useEffect } from 'react';
import { fetchGeneralInfo, fetchTeamDetails, fetchH2HLeague } from '../utils/api';
import Sidebar from '../components/Sidebar';
import DeadlineReminder from '../components/DeadlineReminder';
import UserStats from '../components/UserStats';
import RecommendationsTable from '../components/RecommendationsTable';
import TeamDisplay from '../components/TeamDisplay';
import TransferSuggestions from '../components/TransferSuggestions';
import PlayerComparison from '../components/PlayerComparison';
import H2HLeague from '../components/H2HLeague';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [activeComponent, setActiveComponent] = useState('deadline');
  const [message, setMessage] = useState('');
  const [h2hLeagueData, setH2HLeagueData] = useState(null);
  const [generalInfo, setGeneralInfo] = useState(null);
  const [teamId, setTeamId] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sendEmailReminder = async () => {
    try {
      const response = await fetch('/api/send-email-reminder');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error sending reminder');
    }
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching general info and H2H league data...');
        const [generalInfoData, h2hLeagueData] = await Promise.all([
          fetchGeneralInfo(),
          fetchH2HLeague(process.env.NEXT_PUBLIC_H2H_LEAGUE_ID)
        ]);
        console.log('Fetched general info:', generalInfoData);
        console.log('Fetched H2H league data:', h2hLeagueData);
        setGeneralInfo(generalInfoData);
        setH2HLeagueData(h2hLeagueData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
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
      console.error('Error fetching team:', err);
      setError('Failed to fetch team data. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
  const renderActiveComponent = () => {
    switch(activeComponent) {
      case 'team':
        return (
          <div>
            <input 
              type="text" 
              value={teamId}
              onChange={handleTeamIdChange}
              placeholder="Enter your team ID" 
              className="w-full p-2 border rounded mb-4 text-gray-800"
            />
            <button 
              onClick={handleFetchTeam}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Fetching...' : 'Fetch Team'}
            </button>
            {teamData && <TeamDisplay teamData={teamData} />}
          </div>
        );
      case 'stats':
        return teamData ? <UserStats stats={teamData.stats} /> : <p>Please fetch your team data first.</p>;
      case 'recommendations':
        return generalInfo ? <RecommendationsTable players={generalInfo.elements} /> : <p>Loading recommendations...</p>;
      case 'transfers':
        return (generalInfo && teamData) ? 
          <TransferSuggestions currentTeam={teamData} allPlayers={generalInfo.elements} /> : 
          <p>Please fetch your team data first.</p>;
      case 'comparison':
        return generalInfo ? <PlayerComparison players={generalInfo.elements} /> : <p>Loading player data...</p>;
      case 'h2h':
        return h2hLeagueData ? <H2HLeague leagueData={h2hLeagueData} /> : <p>Loading H2H league data...</p>;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActiveComponent={setActiveComponent} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-purple-700 text-white shadow-lg p-4">
          <h1 className="text-2xl font-bold">FPL Assistant</h1>
        </header>
        {generalInfo && <DeadlineReminder events={generalInfo.events} />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-800">
              {renderActiveComponent()}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Card({ icon, title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold ml-2">{title}</h2>
      </div>
      {children}
    </div>
  );
}