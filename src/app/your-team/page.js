import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '../../components/Header';
import TeamDisplay from '../../components/TeamDisplay';
import { fetchTeamDetails } from '../../utils/api';

export default async function YourTeam() {
  const cookieStore = cookies();
  const teamIdCookie = cookieStore.get('fplTeamId');

  if (!teamIdCookie) {
    redirect('/');
  }

  const teamId = teamIdCookie.value;
  let teamData;
  let error;

  try {
    teamData = await fetchTeamDetails(teamId);
  } catch (err) {
    console.error('Error fetching team details:', err);
    error = err.message;
  }

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Your Team</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : teamData ? (
          <TeamDisplay teamData={teamData} />
        ) : (
          <p>Loading team data...</p>
        )}
      </main>
    </>
  );
}