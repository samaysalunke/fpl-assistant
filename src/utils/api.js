import { cache } from 'react';

const BASE_URL = 'https://fantasy.premierleague.com/api';

export const fetchGeneralInfo = async () => {
    try {
      const response = await fetch('/api/fpl-proxy?url=bootstrap-static/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch general info:", error);
      throw new Error("Failed to fetch general information. Please try again later.");
    }
  };
  
export const fetchPlayerDetails = async (playerId) => {
  const response = await fetch(`${BASE_URL}/element-summary/${playerId}/`);
  if (!response.ok) throw new Error('Failed to fetch player details');
  return response.json();
};

export const fetchTeamDetails = async (teamId) => {
  const response = await fetch(`${BASE_URL}/entry/${teamId}/`);
  if (!response.ok) throw new Error('Failed to fetch team details');
  return response.json();
};