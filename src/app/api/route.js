import { NextResponse } from 'next/server';
import { checkAndSendReminders } from '../send-reminders/route';
import { fetchGeneralInfo } from '../../../utils/api';

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

    console.log('Attempting to send test reminder...');
    await checkAndSendReminders(true, generalInfo);
    console.log('Test reminder sent successfully');

    return NextResponse.json({ message: 'Test reminder sent successfully' });
  } catch (error) {
    console.error('Error in test-reminder:', error);
    return NextResponse.json({ 
      message: 'Error sending test reminder', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}