import { NextResponse } from 'next/server';
import { fetchGeneralInfo, fetchTeamDetails, fetchH2HLeague } from '@/utils/api';

export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

async function handleRequest() {
  try {
    console.log('Fetching general info...');
    const generalInfo = await fetchGeneralInfo();
    console.log('General info fetched successfully');

    // For testing purposes, let's fetch some additional data
    const teamId = '1234'; // Replace with a valid team ID
    const leagueId = '5678'; // Replace with a valid league ID

    const [teamDetails, h2hLeague] = await Promise.all([
      fetchTeamDetails(teamId),
      fetchH2HLeague(leagueId)
    ]);

    console.log('Attempting to send test reminder...');
    // Here you would normally send the actual reminder
    // For now, we'll just log the data we've fetched

    return NextResponse.json({ 
      message: 'Test reminder sent successfully',
      generalInfo: generalInfo,
      teamDetails: teamDetails,
      h2hLeague: h2hLeague
    });
  } catch (error) {
    console.error('Error in test-reminder:', error);
    return NextResponse.json({ 
      message: 'Error sending test reminder', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}