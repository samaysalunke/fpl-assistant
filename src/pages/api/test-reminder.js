import { checkAndSendReminders } from './send-reminders';

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      await checkAndSendReminders(true); // Pass true to force sending the reminder
      res.status(200).json({ message: 'Test reminder sent successfully' });
    } catch (error) {
      console.error('Error sending test reminder:', error);
      res.status(500).json({ message: 'Error sending test reminder', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}