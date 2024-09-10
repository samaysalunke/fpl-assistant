import { checkAndSendReminders } from './send-reminders';
import { fetchGeneralInfo } from '../../utils/api';

export default async function handler(req, res) {
  if (req.method === 'GET' || req.method === 'POST') {
    try {
      console.log('Fetching general info...');
      const generalInfo = await fetchGeneralInfo();
      console.log('General info fetched successfully');

      console.log('Attempting to send test reminder...');
      await checkAndSendReminders(true, generalInfo);
      console.log('Test reminder sent successfully');

      res.status(200).json({ message: 'Test reminder sent successfully' });
    } catch (error) {
      console.error('Error in test-reminder:', error);
      res.status(500).json({ 
        message: 'Error sending test reminder', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}