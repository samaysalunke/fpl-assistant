// Add this at the top of the file
let cache = {};

function setCache(key, data, ttl = 3600000) { // TTL default: 1 hour
  cache[key] = {
    data,
    expiry: Date.now() + ttl
  };
}

function getCache(key) {
  const cached = cache[key];
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    delete cache[key];
    return null;
  }
  return cached.data;
}

export const fetchGeneralInfo = async () => {
  try {
    const response = await fetch('/api/fpl-data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch general info:", error);
    throw new Error(`Failed to fetch general information: ${error.message}`);
  }
};
  
  export const fetchH2HLeague = async (leagueId) => {
    try {
      console.log(`Fetching H2H league data for league ID: ${leagueId}`);
      const response = await fetch(`/api/fpl-proxy?url=leagues-h2h/${leagueId}/standings/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('H2H league data fetched successfully');
      return data;
    } catch (error) {
      console.error("Failed to fetch H2H league data:", error);
      throw new Error(`Failed to fetch H2H league data: ${error.message}`);
    }
  };
  
export const fetchTeamDetails = async (teamId) => {
  try {
    const generalInfo = await fetchGeneralInfo();
    const currentEvent = generalInfo.events.find(event => event.is_current)?.id || 1;

    const [teamResponse, picksResponse, liveResponse] = await Promise.all([
      fetch(`/api/fpl-proxy?url=entry/${teamId}/`),
      fetch(`/api/fpl-proxy?url=entry/${teamId}/event/${currentEvent}/picks/`),
      fetch(`/api/fpl-proxy?url=event/${currentEvent}/live/`)
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

