// src/utils/fplStats.js

// Calculate moving average
export function movingAverage(points, window = 5) {
    return points.map((_, index, array) => {
      const start = Math.max(0, index - window + 1);
      const end = index + 1;
      const windowSlice = array.slice(start, end);
      return windowSlice.reduce((sum, num) => sum + num, 0) / windowSlice.length;
    });
  }
  
  // Calculate form (weighted moving average)
  export function calculateForm(points, window = 5) {
    const weights = Array.from({length: window}, (_, i) => i + 1);
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    
    return points.map((_, index, array) => {
      const start = Math.max(0, index - window + 1);
      const end = index + 1;
      const windowSlice = array.slice(start, end);
      return windowSlice.reduce((sum, point, i) => sum + point * weights[i], 0) / weightSum;
    });
  }
  
  // Calculate value (points per cost)
  export function calculateValue(points, cost) {
    return points / cost;
  }
  
  // Update calculateFixtureDifficulty function
export function calculateFixtureDifficulty(fixtures, teamId) {
    const teamFixtures = fixtures.filter(fixture => fixture.team_h === teamId || fixture.team_a === teamId);
    if (teamFixtures.length === 0) return [3]; // Return average difficulty if no fixtures found
    return teamFixtures
      .slice(0, 5) // Consider only next 5 fixtures
      .map(fixture => fixture.team_h === teamId ? fixture.team_h_difficulty : fixture.team_a_difficulty);
  }
  
  // Update predictPoints function
  export function predictPoints(form, fixtureDifficulty) {
    const avgForm = form.reduce((sum, f) => sum + f, 0) / form.length;
    const avgDifficulty = fixtureDifficulty.reduce((sum, d) => sum + d, 0) / fixtureDifficulty.length;
    return avgForm * (3 / avgDifficulty) * 5; // Adjust the multiplier as needed
  }