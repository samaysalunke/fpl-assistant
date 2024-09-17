let h2hLeagueCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const fetchGeneralInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fpl-data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    throw new Error(`Failed to fetch general information: ${error.message}`);
  }
};
  
export const fetchPlayerData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fpl-proxy?url=bootstrap-static/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.elements;
  } catch (error) {
    console.error("Failed to fetch player data:", error);
    throw new Error(`Failed to fetch player data: ${error.message}`);
  }
};

export const fetchFixtures = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fpl-proxy?url=fixtures/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch fixtures:", error);
    throw new Error(`Failed to fetch fixtures: ${error.message}`);
  }
};
export const fetchH2HLeague = async (leagueId) => {
  console.log(`Attempting to fetch H2H league data for league ID: ${leagueId}`);
  const now = Date.now();
  if (h2hLeagueCache && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('Returning cached H2H league data');
    return h2hLeagueCache;
  }

  try {
    console.log(`Fetching fresh H2H league data from API`);
    const response = await fetch(`/api/fpl-proxy?url=leagues-h2h/${leagueId}/standings/`);
    console.log(`Received response with status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully parsed H2H league data');
    h2hLeagueCache = data;
    lastFetchTime = now;
    return data;
  } catch (error) {
    console.error("Failed to fetch H2H league data:", error);
    throw new Error(`Failed to fetch H2H league data: ${error.message}`);
  }
};

export const fetchTeamData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/fpl-data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.teams; // Assuming the teams data is under a 'teams' key
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    throw new Error(`Failed to fetch team data: ${error.message}`);
  }
};
  
export const fetchTeamDetails = async (teamId) => {
  try {
    const generalInfo = await fetchGeneralInfo();
    const currentEvent = generalInfo.events.find(event => event.is_current)?.id || 1;

    const [teamResponse, picksResponse, liveResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/fpl-proxy?url=entry/${teamId}/`),
      fetch(`${API_BASE_URL}/api/fpl-proxy?url=entry/${teamId}/event/${currentEvent}/picks/`),
      fetch(`${API_BASE_URL}/api/fpl-proxy?url=event/${currentEvent}/live/`)
    ]);

    if (!teamResponse.ok || !picksResponse.ok || !liveResponse.ok) {
      throw new Error(`HTTP error! status: ${teamResponse.status}`);
    }

    const teamData = await teamResponse.json();
    const picksData = await picksResponse.json();
    const liveData = await liveResponse.json();

    const playerMap = generalInfo.elements.reduce((acc, player) => {
      acc[player.id] = player;
      return acc;
    }, {});

    const transformedData = {
      id: teamData.id,
      name: teamData.name,
      stats: {
        overallRank: teamData.summary_overall_rank,
        gameweekPoints: teamData.summary_event_points,
        totalPoints: teamData.summary_overall_points,
      },
      picks: picksData.picks.map(pick => ({
        ...pick,
        playerName: playerMap[pick.element].web_name,
        position: ['GK', 'DEF', 'MID', 'FWD'][playerMap[pick.element].element_type - 1],
        points: liveData.elements[pick.element].stats.total_points * pick.multiplier
      })),
    };

    return transformedData;
  } catch (error) {
    console.error("Failed to fetch team details:", error);
    throw new Error("Failed to fetch team details. Please try again later.");
  }
}

