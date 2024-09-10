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
  
  export const fetchTeamDetails = async (teamId) => {
    try {
      // Fetch basic team info
      const teamResponse = await fetch(`/api/fpl-proxy?url=entry/${teamId}/`);
      if (!teamResponse.ok) {
        throw new Error(`HTTP error! status: ${teamResponse.status}`);
      }
      const teamData = await teamResponse.json();
      console.log('Raw team data:', teamData);
  
      // Fetch current event (gameweek) if not provided in team data
      const currentEvent = teamData.current_event || await getCurrentEvent();
  
      // Fetch picks for the current event
      const picksResponse = await fetch(`/api/fpl-proxy?url=entry/${teamId}/event/${currentEvent}/picks/`);
      if (!picksResponse.ok) {
        throw new Error(`HTTP error! status: ${picksResponse.status}`);
      }
      const picksData = await picksResponse.json();
      console.log('Raw picks data:', picksData);
  
      // Transform the data
      const transformedData = {
        id: teamData.id,
        name: teamData.name,
        stats: {
          overallRank: teamData.summary_overall_rank,
          gameweekPoints: teamData.summary_event_points,
          totalPoints: teamData.summary_overall_points,
        },
        picks: picksData.picks.map(pick => ({
          element: pick.element,
          position: pick.position,
          multiplier: pick.multiplier,
          is_captain: pick.is_captain,
          is_vice_captain: pick.is_vice_captain,
        })),
      };
  
      return transformedData;
    } catch (error) {
      console.error("Failed to fetch team details:", error);
      throw new Error("Failed to fetch team details. Please try again later.");
    }
  };
  
  async function getCurrentEvent() {
    try {
      const response = await fetch('/api/fpl-proxy?url=bootstrap-static/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const currentEvent = data.events.find(event => event.is_current);
      return currentEvent ? currentEvent.id : 1; // Default to 1 if no current event found
    } catch (error) {
      console.error("Failed to fetch current event:", error);
      return 1; // Default to 1 in case of error
    }
  }