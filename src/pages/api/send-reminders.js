import cron from 'node-cron';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import { fetchGeneralInfo } from '../../utils/api';

const getH2HLeagueStandings = async (leagueId) => {
    const leagueData = await fetchH2HLeague(leagueId);
    return leagueData.standings.results.slice(0, 5).map((team, index) => 
      `${index + 1}. ${team.entry_name} (${team.points} pts)`
    ).join('\n');
  };
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWhatsAppMessage = async (to, message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
    console.log('WhatsApp message sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};

const sendEmail = async (to, subject, text) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const checkAndSendReminders = async (forceReminder = false) => {
    const generalInfo = await fetchGeneralInfo();
    const nextEvent = generalInfo.events.find(event => !event.finished);
  
    if (nextEvent) {
      const deadline = new Date(nextEvent.deadline_time);
      const now = new Date();
      const timeUntilDeadline = deadline.getTime() - now.getTime();
  
      if (forceReminder || (timeUntilDeadline <= 6 * 60 * 60 * 1000 && timeUntilDeadline > 5.5 * 60 * 60 * 1000)) {
        const h2hStandings = await getH2HLeagueStandings(process.env.H2H_LEAGUE_ID);
        const message = `FPL Reminder: Gameweek ${nextEvent.id} deadline is in 6 hours (${deadline.toLocaleString()})\n\nH2H League Top 5:\n${h2hStandings}`;
        
        // Send WhatsApp message
        await sendWhatsAppMessage(process.env.WHATSAPP_GROUP_ID, message);
  
        // Send Email
        await sendEmail(process.env.EMAIL_RECIPIENTS, 'FPL Deadline Reminder', message);
      }
    }
  };

// Schedule the job to run every 30 minutes
cron.schedule('*/30 * * * *', checkAndSendReminders);

export default async function handler(req, res) {
  res.status(200).json({ message: 'Reminder service is running' });
}