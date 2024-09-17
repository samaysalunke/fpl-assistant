import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../../components/Header';
import H2HLeague from '../../components/H2HLeague';
import { fetchH2HLeague } from '../../utils/api';

export default async function H2HLeaguePage() {
  const cookieStore = cookies();
  const teamIdCookie = cookieStore.get('fplTeamId');

  if (!teamIdCookie) {
    redirect('/');
  }

  let h2hLeagueData;
  let error;

  const leagueId = process.env.NEXT_PUBLIC_H2H_LEAGUE_ID;
  console.log(`H2H League ID: ${leagueId}`);

  try {
    h2hLeagueData = await fetchH2HLeague(leagueId);
  } catch (err) {
    console.error('Error fetching H2H league data:', err);
    error = err.message;
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">H2H League</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : h2hLeagueData ? (
          <H2HLeague leagueData={h2hLeagueData} />
        ) : (
          <p>Loading H2H league data...</p>
        )}
      </main>
    </>
  );
}