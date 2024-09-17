'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';

const Header = () => (
  <header className="bg-white p-4 shadow flex justify-between items-center">
    <h1 className="text-2xl font-bold text-black">FPL Assistant</h1>
    <Link href="/deadline" className="flex items-center text-gray-600 hover:text-black">
      <Clock className="mr-2" size={18} />
      <span>GW5 Deadline: 4d 17h left</span>
    </Link>
  </header>
);

export default Header;