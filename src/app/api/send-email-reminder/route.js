import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

let isProcessing = false;
let lastSentTime = 0;

async function fetchGeneralInfo() {
  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function GET() {
  if (isProcessing) {
    return NextResponse.json({ message: 'Email reminder is already being processed' });
  }
  
  isProcessing = true;
  
  try {
    const generalInfo = await fetchGeneralInfo();
    const nextEvent = generalInfo.events.find(event => !event.finished);

    if (!nextEvent) {
      isProcessing = false;
      return NextResponse.json({ message: 'No upcoming deadline found' });
    }

    const deadlineTime = new Date(nextEvent.deadline_time);
    const now = new Date();
    const timeUntilDeadline = deadlineTime.getTime() - now.getTime();
    const sixHoursInMilliseconds = 6 * 60 * 60 * 1000;
    const oneHourInMilliseconds = 60 * 60 * 1000;

    // Check if it's time to send the email (between 6 hours and 5 hours before the deadline)
    if (timeUntilDeadline <= sixHoursInMilliseconds && timeUntilDeadline > (sixHoursInMilliseconds - oneHourInMilliseconds)) {
      // Check if an email has been sent in the last hour
      if (now.getTime() - lastSentTime < oneHourInMilliseconds) {
        isProcessing = false;
        return NextResponse.json({ message: 'Email reminder already sent recently' });
      }

      const message = `FPL Reminder: Gameweek ${nextEvent.id} deadline is on ${deadlineTime.toUTCString()}`;

      // Create a transporter using SMTP
      console.log('Creating transporter...');
      let transporter = nodemailer.createTransport({
        service: 'gmail',  // Or your email service
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      console.log('Sending email...');
      console.log('From:', process.env.EMAIL_USER);
      console.log('To:', process.env.EMAIL_RECIPIENTS);
      
      // Send email
      let info = await transporter.sendMail({
        from: `"FPL Assistant" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECIPIENTS,
        subject: "FPL Deadline Reminder",
        text: message,
        html: `<b>${message}</b>`
      });

      console.log("Message sent: %s", info.messageId);
      lastSentTime = now.getTime();

      isProcessing = false;
      return NextResponse.json({ 
        message: 'Email reminder sent successfully',
        sentMessage: message
      });
    } else {
      isProcessing = false;
      return NextResponse.json({ message: 'Not time to send reminder yet' });
    }
  } catch (error) {
    console.error('Error sending email reminder:', error);
    isProcessing = false;
    return NextResponse.json({ 
      message: 'Error sending email reminder', 
      error: error.message
    }, { status: 500 });
  }
}