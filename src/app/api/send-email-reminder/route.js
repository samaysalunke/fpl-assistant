import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

async function fetchGeneralInfo() {
  const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function GET() {
  try {
    const generalInfo = await fetchGeneralInfo();
    const nextEvent = generalInfo.events.find(event => !event.finished);

    if (!nextEvent) {
      return NextResponse.json({ message: 'No upcoming deadline found' });
    }

    const deadlineTime = new Date(nextEvent.deadline_time);
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
  to: process.env.EMAIL_RECIPIENTS,  // This will work with multiple comma-separated emails
  subject: "FPL Deadline Reminder",
  text: message,
  html: `<b>${message}</b>`
});

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return NextResponse.json({ 
      message: 'Email reminder sent successfully',
      sentMessage: message
    });
  } catch (error) {
    console.error('Error sending email reminder:', error);
    return NextResponse.json({ 
      message: 'Error sending email reminder', 
      error: error.message
    }, { status: 500 });
  }
}