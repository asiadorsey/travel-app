// src/components/MobileNavigation.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Import close icon

// Define props for MobileNavigation component
interface MobileNavigationProps {
  isOpen: boolean; // This prop is crucial and must be boolean
  toggleMobileNav: () => void;
  currentPage: string; // To highlight the current page (though not used in this simplified version)
  className?: string; // Optional for responsive hiding
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, toggleMobileNav, className }) => {
  return (
    <div
      className={`fixed inset-0 bg-white z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden ${className}`} // md:hidden to hide on larger screens
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleMobileNav} className="text-gray-600 hover:text-blue-600 focus:outline-none">
          <XMarkIcon className="h-7 w-7" />
        </button>
      </div>
      <nav className="flex flex-col items-center space-y-6 text-xl mt-10">
        <Link href="/" onClick={toggleMobileNav} className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
          Home
        </Link>
        <Link href="/explore" onClick={toggleMobileNav} className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
          Explore
        </Link>
        <Link href="/favorites" onClick={toggleMobileNav} className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
          Favorites
        </Link>
        <Link href="/saved" onClick={toggleMobileNav} className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
          Saved
        </Link>
        <Link href="/about" onClick={toggleMobileNav} className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
          About
        </Link>
        <Link href="/contact" className="text-gray-800 hover:text-blue-600 transition-colors duration-200">
          Contact
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavigation;