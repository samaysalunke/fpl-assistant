import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserStats from '../../components/UserStats';
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
    const data = await fetchUserStats(teamId);
    userStatsData = {
      current: data.current,
      past: data.past
    };
  } catch (err) {
    console.error('Error fetching user stats:', err);
    error = err.message;
  }

  return (
    <>
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