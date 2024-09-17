import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../../components/Header';
import TransferSuggestions from '../../components/TransferSuggestions';
import { fetchTeamDetails, fetchGeneralInfo } from '../../utils/api';

export default async function TransferSuggestionsPage() {
  const cookieStore = cookies();
  const teamIdCookie = cookieStore.get('fplTeamId');

  if (!teamIdCookie) {
    redirect('/');
  }

  const teamId = teamIdCookie.value;
  let teamData;
  let generalInfo;
  let error;

  try {
    [teamData, generalInfo] = await Promise.all([
      fetchTeamDetails(teamId),
      fetchGeneralInfo()
    ]);
  } catch (err) {
    console.error('Error fetching data:', err);
    error = err.message;
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Transfer Suggestions</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (teamData && generalInfo) ? (
          <TransferSuggestions currentTeam={teamData} allPlayers={generalInfo.elements} />
        ) : (
          <p>Loading transfer suggestions...</p>
        )}
      </main>
    </>
  );
}