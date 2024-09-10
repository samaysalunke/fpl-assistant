import React from 'react';

const TransferSuggestions = ({ suggestions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Transfer Suggestions</h2>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="border-b pb-2">
            <p><span className="font-semibold">Out:</span> {suggestion.out}</p>
            <p><span className="font-semibold">In:</span> {suggestion.in}</p>
            <p className="text-sm text-gray-600">{suggestion.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferSuggestions;
