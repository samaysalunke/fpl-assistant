import React from 'react';

const TransferSuggestions = ({ currentTeam, allPlayers }) => {
  const suggestTransfers = () => {
    const suggestions = [];
    const positions = ['GK', 'DEF', 'MID', 'FWD'];

    currentTeam.picks.forEach(player => {
      const currentPlayer = allPlayers.find(p => p.id === player.element);
      if (!currentPlayer) return;

      const betterPlayers = allPlayers.filter(p => 
        p.element_type === currentPlayer.element_type &&
        p.total_points > currentPlayer.total_points &&
        p.now_cost <= currentPlayer.now_cost * 1.1 && // allowing for a 10% price increase
        !currentTeam.picks.some(pick => pick.element === p.id)
      );

      if (betterPlayers.length > 0) {
        const bestPlayer = betterPlayers.reduce((a, b) => a.total_points > b.total_points ? a : b);
        suggestions.push({
          out: currentPlayer,
          in: bestPlayer,
          reason: `Higher total points (${bestPlayer.total_points} vs ${currentPlayer.total_points}) and similar price`
        });
      }
    });

    return suggestions.sort((a, b) => (b.in.total_points - b.out.total_points) - (a.in.total_points - a.out.total_points)).slice(0, 3);
  };

  const transfers = suggestTransfers();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Transfer Suggestions</h2>
      {transfers.length > 0 ? (
        <ul className="space-y-4">
          {transfers.map((transfer, index) => (
            <li key={index} className="border-b pb-2">
              <p><span className="font-semibold">Out:</span> {transfer.out.web_name} ({transfer.out.total_points} pts, £{(transfer.out.now_cost / 10).toFixed(1)}m)</p>
              <p><span className="font-semibold">In:</span> {transfer.in.web_name} ({transfer.in.total_points} pts, £{(transfer.in.now_cost / 10).toFixed(1)}m)</p>
              <p className="text-sm text-gray-600">{transfer.reason}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transfer suggestions at this time.</p>
      )}
    </div>
  );
};

export default TransferSuggestions;