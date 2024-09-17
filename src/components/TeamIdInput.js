'use client';
import React, { useState } from 'react';

const TeamIdInput = ({ onSubmit }) => {
    const [teamId, setTeamId] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (teamId) {
        onSubmit(teamId);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
        <div className="flex items-center border-b border-gray-300 py-2">
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="Enter your Team ID"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-black hover:bg-gray-700 border-black hover:border-gray-700 text-sm border-4 text-white py-1 px-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    );
  };
  
  export default TeamIdInput;