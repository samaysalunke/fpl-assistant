'use client';

import { useState } from 'react';
import TeamIdInput from './TeamIdInput';

const TeamIdHandler = () => {
  const handleTeamIdSubmit = async (teamId) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fplTeamId', teamId);
    }
    // Make a server action call to set the cookie
    await fetch('/api/set-team-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId }),
    });
    // Refresh the page to trigger the server-side redirect
    window.location.href = '/your-team';
  };

  return <TeamIdInput onSubmit={handleTeamIdSubmit} />;
};

export default TeamIdHandler;