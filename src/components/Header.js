'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Menu } from 'lucide-react';
import fplLogo from '../fpl.png'; // Adjust the path as needed

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white p-4 shadow flex justify-between items-center fixed w-full z-20">
      <div className="flex items-center">
      <Link href="/" className="flex items-center">
        <div className="flex items-center">
          <Image src={fplLogo} alt="FPL Assistant Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-black ml-2">FPL Assistant</h1>
        </div>
      </Link>
      </div>
      <div className="flex items-center">
        <Link href="/deadline" className="flex items-center text-gray-600 hover:text-black mr-4">
          <Clock className="mr-2" size={18} />
          <span className="hidden md:inline">GW5 Deadline: 4d 17h left</span>
        </Link>
        <button onClick={toggleSidebar} className="text-purple-600 md:hidden">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
