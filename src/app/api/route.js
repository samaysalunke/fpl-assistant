import { NextResponse } from 'next/server';
import { fetchGeneralInfo, fetchH2HLeague } from '@/utils/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Starting test reminder process...');
    
    console.log('Fetching general info...');
    const generalInfo = await fetchGeneralInfo();
    console.log('General info fetched successfully');

    console.log('Fetching H2H league data...');
    const leagueId = process.env.H2H_LEAGUE_ID; // Make sure this is set in your Vercel environment variables
    const h2hLeagueData = await fetchH2HLeague(leagueId);
    console.log('H2H league data fetched successfully');

    return NextResponse.json({ 
      message: 'Test reminder process completed',
      generalInfo: generalInfo,
      h2hLeagueData: h2hLeagueData
    });
  } catch (error) {
    console.error('Error in test-reminder:', error);
    return NextResponse.json({ 
      message: 'Error in test reminder process', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}