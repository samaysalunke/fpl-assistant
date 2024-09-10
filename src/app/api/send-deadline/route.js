import { NextResponse } from 'next/server';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';

async function fetchGeneralInfo() {
  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function GET() {
  try {
    console.log('Fetching FPL data...');
    const generalInfo = await fetchGeneralInfo();
    console.log('FPL data fetched successfully');

    const nextEvent = generalInfo.events.find(event => !event.finished);
    if (!nextEvent) {
      return NextResponse.json({ message: 'No upcoming deadline found' });
    }

    const deadlineTime = new Date(nextEvent.deadline_time);
    const message = `FPL Reminder: Gameweek ${nextEvent.id} deadline is on ${deadlineTime.toUTCString()}`;

    console.log('Sending WhatsApp message...');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${process.env.WHATSAPP_GROUP_ID}`
    });
    console.log('WhatsApp message sent successfully');

    return NextResponse.json({ 
      message: 'Deadline reminder sent successfully',
      sentMessage: message
    });
  } catch (error) {
    console.error('Error sending deadline reminder:', error);
    return NextResponse.json({ 
      message: 'Error sending deadline reminder', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}