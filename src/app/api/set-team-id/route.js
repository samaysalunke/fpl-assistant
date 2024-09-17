import { cookies } from 'next/headers';

export async function POST(request) {
  const { teamId } = await request.json();
  
  // Set the teamId in a cookie
  cookies().set('fplTeamId', teamId);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}