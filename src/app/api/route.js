import { NextResponse } from 'next/server';
import { fetchGeneralInfo } from '@/utils/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Starting test reminder process...');
    console.log('Fetching general info...');
    const generalInfo = await fetchGeneralInfo();
    console.log('General info fetched successfully');

    return NextResponse.json({ 
      message: 'Test reminder process completed',
      generalInfo: generalInfo
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