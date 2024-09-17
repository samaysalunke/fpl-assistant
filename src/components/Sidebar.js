'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BarChart2, Repeat, Scale, Grid, Lightbulb } from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
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
    <nav className={`bg-black text-white w-64 min-h-screen fixed left-0 top-16 z-10 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
      <ul className="p-4">
        {links.map(({ icon: Icon, text, href }, index) => (
          <li key={index} className="mb-4">
            <Link 
              href={href} 
              className={`flex items-center text-gray-300 hover:text-white ${pathname === href ? 'text-white font-bold' : ''}`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  closeSidebar();
                }
              }}
            >
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