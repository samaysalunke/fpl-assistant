import { NextResponse } from 'next/server';
import { fetchGeneralInfo } from '../../../utils/api';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Starting test reminder process...');

    const generalInfo = await fetchGeneralInfo();
    const nextEvent = generalInfo.events.find(event => !event.finished);
    const deadlineTime = nextEvent ? new Date(nextEvent.deadline_time) : null;

    if (deadlineTime) {
      const message = `FPL Reminder: Gameweek ${nextEvent.id} deadline is on ${deadlineTime.toLocaleString()}`;
      
      // Send WhatsApp message
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${process.env.WHATSAPP_GROUP_ID}`
      });

      return NextResponse.json({ 
        message: 'Reminder sent successfully',
        sentMessage: message
      });
    } else {
      return NextResponse.json({ 
        message: 'No upcoming deadline found'
      });
    }
  } catch (error) {
    console.error('Error in test-reminder:', error);
    return NextResponse.json({ 
      message: 'Error in test reminder process', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}