import React from 'react';
import Link from 'next/link';

const DeadlineDetails = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Gameweek 5 Deadline Details</h1>
    <p>Deadline: 9/21/2024, 3:30:00 PM</p>
    <p>Time Remaining: 4d 17h 27m 19s</p>
    {/* Add more detailed information here */}
    <Link href="/" className="text-blue-600 hover:underline mt-4 block">
      Back to Home
    </Link>
  </div>
);

export default DeadlineDetails;