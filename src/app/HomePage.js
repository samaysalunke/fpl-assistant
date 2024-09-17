'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import TeamIdInput from '../components/TeamIdInput';

export default function HomePage() {
  const router = useRouter();

  const handleTeamIdSubmit = async (teamId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fplTeamId', teamId);
    }
    await fetch('/api/set-team-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId }),
    });
    router.push('/your-team');
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to FPL Assistant</h1>
        <p className="mb-4">Enter your FPL Team ID to get started:</p>
        <TeamIdInput onSubmit={handleTeamIdSubmit} />
      </main>
    </>
  );
}