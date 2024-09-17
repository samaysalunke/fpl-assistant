import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../../components/Header';
import PlayerInsights from '../../components/PlayerInsights';
import { fetchGeneralInfo } from '../../utils/api';

export default async function PlayerInsightsPage() {
  const cookieStore = cookies();
  const teamIdCookie = cookieStore.get('fplTeamId');

  if (!teamIdCookie) {
    redirect('/');
  }

  let generalInfo;
  let error;

  try {
    generalInfo = await fetchGeneralInfo();
  } catch (err) {
    console.error('Error fetching general info:', err);
    error = err.message;
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Player Insights</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : generalInfo ? (
          <PlayerInsights players={generalInfo.elements} />
        ) : (
          <p>Loading player insights...</p>
        )}
      </main>
    </>
  );
}