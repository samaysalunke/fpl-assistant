'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart2, Repeat, Scale, Grid, Lightbulb } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { icon: Users, text: 'Your Team', href: '/your-team' },
    { icon: BarChart2, text: 'User Stats', href: '/user-stats' },
    { icon: Grid, text: 'Recommendations', href: '/recommendations' },
    { icon: Repeat, text: 'Transfer Suggestions', href: '/transfer-suggestions' },
    { icon: Scale, text: 'Player Comparison', href: '/player-comparison' },
    { icon: Grid, text: 'H2H League', href: '/h2h-league' },
    { icon: Lightbulb, text: 'Player Insights', href: '/player-insights' },
  ];

  return (
    <nav className="w-64 bg-black text-white p-4">
      <div className="mb-8">
        <img src="https://www.premierleague.com/resources/rebrand/v7.152.3/i/elements/pl-main-logo.png" alt="Premier League Logo" className="mx-auto" />
      </div>
      <ul>
        {links.map(({ icon: Icon, text, href }, index) => (
          <li key={index} className="mb-4">
            <Link href={href} className={`flex items-center text-gray-300 hover:text-white ${pathname === href ? 'text-white font-bold' : ''}`}>
              <Icon className="mr-2" size={18} />
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;