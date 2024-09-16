import React from 'react';
import { ClockIcon, UserGroupIcon, ChartBarIcon, TableCellsIcon, ArrowsRightLeftIcon, ScaleIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ setActiveComponent }) => {
  const menuItems = [
    { name: 'Deadline Reminder', icon: ClockIcon, key: 'deadline' },
    { name: 'Your Team', icon: UserGroupIcon, key: 'team' },
    { name: 'User Stats', icon: ChartBarIcon, key: 'stats' },
    { name: 'Recommendations', icon: TableCellsIcon, key: 'recommendations' },
    { name: 'Transfer Suggestions', icon: ArrowsRightLeftIcon, key: 'transfers' },
    { name: 'Player Comparison', icon: ScaleIcon, key: 'comparison' },
    { name: 'H2H League', icon: TableCellsIcon, key: 'h2h' },
  ];

  return (
    <div className="bg-purple-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => setActiveComponent(item.key)}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-purple-700 rounded w-full"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;