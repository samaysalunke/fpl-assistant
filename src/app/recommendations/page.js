import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../../components/Header';
import RecommendationsTable from '../../components/RecommendationsTable';
import { fetchGeneralInfo } from '../../utils/api';

export default async function RecommendationsPage() {
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
        <h1 className="text-3xl font-bold mb-4">Recommendations</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : generalInfo ? (
          <RecommendationsTable players={generalInfo.elements} />
        ) : (
          <p>Loading recommendations...</p>
        )}
      </main>
    </>
  );
}