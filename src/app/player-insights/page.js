import React from 'react';
import Header from '../../components/Header';
import PlayerInsights from '../../components/PlayerInsights';

export default function PlayerInsights() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Player Insights</h1>
        <PlayerInsights />
      </main>
    </>
  );
}