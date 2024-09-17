'use client';

import React, { useState, useEffect } from 'react';
import { fetchTeamDetails } from '../../utils/api';
import TeamDisplay from '../../components/TeamDisplay';
import TeamIdInput from '../../components/TeamIdInput';

export default function YourTeamPage() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedTeamId = localStorage.getItem('fplTeamId');
    if (storedTeamId) {
      fetchTeam(storedTeamId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchTeam = async (teamId) => {
    setLoading(true);
    try {
      const data = await fetchTeamDetails(teamId);
      setTeamData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch team data. Please try again.');
      setLoading(false);
    }
  };

  const handleTeamIdSubmit = (teamId) => {
    localStorage.setItem('fplTeamId', teamId);
    fetchTeam(teamId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Team</h1>
      {teamData ? (
        <TeamDisplay teamData={teamData} />
      ) : (
        <div>
          <p>Please enter your FPL Team ID to view your team:</p>
          <TeamIdInput onSubmit={handleTeamIdSubmit} />
        </div>
      )}
    </div>
  );
}