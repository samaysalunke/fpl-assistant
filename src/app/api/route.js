import { NextResponse } from 'next/server';
import { fetchGeneralInfo } from '@/utils/api';

export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

async function handleRequest() {
  try {
    console.log('Starting test reminder process...');
    console.log('Fetching general info...');
    const generalInfo = await fetchGeneralInfo();
    console.log('General info fetched successfully:', JSON.stringify(generalInfo, null, 2));

    // For now, we'll just return the general info
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