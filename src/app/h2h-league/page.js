import React from 'react';
import Header from '../../components/Header';
import H2HLeague from '../../components/H2HLeague';

export default function H2HLeaguePage() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">H2H League</h1>
        <H2HLeague />
      </main>
    </>
  );
}