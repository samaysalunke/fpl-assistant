import React from 'react';
import Header from '../../components/Header';
import UserStats from '../../components/UserStats';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchUserStats } from '../../utils/api';


 export default async function UserStatsPage() {
  const cookieStore = cookies();
  const teamIdCookie = cookieStore.get('fplTeamId');

  if (!teamIdCookie) {
    redirect('/');
  }
  const teamId = teamIdCookie.value;
  let userStatsData;
  let error;

  try {
    userStatsData = await fetchUserStats(teamId);
  } catch (err) {
    console.error('Error fetching user stats:', err);
    error = err.message;
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">User Stats</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : userStatsData ? (
          <UserStats stats={userStatsData} />
        ) : (
          <p>Loading user stats...</p>
        )}
      </main>
    </>
  );
}