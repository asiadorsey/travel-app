'use client';

import Link from 'next/link';

// Import Heroicons
import {
  HomeIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  BookmarkIcon, // For Saved/Trips (could also be folder/archive)
  UserCircleIcon,
  Cog6ToothIcon, // For Settings
  HandRaisedIcon // For Welcome back!
} from '@heroicons/react/24/solid'; // Using solid icons for a consistent look

const Sidebar = () => {
  // Map Heroicon components directly to a 'HeroIcon' property
  const navigationItems = [
    { label: 'Home/Discover', href: '/', HeroIcon: HomeIcon }, // Replaced 🏠
    { label: 'Search', href: '/search', HeroIcon: MagnifyingGlassIcon }, // Replaced 🔍
    { label: 'Create/Add', href: '/create', HeroIcon: PlusCircleIcon }, // Replaced ➕
    { label: 'Saved/Trips', href: '/saved', HeroIcon: BookmarkIcon }, // Replaced 💾
    { label: 'Profile', href: '/profile', HeroIcon: UserCircleIcon }, // Replaced 👤
    { label: 'Settings', href: '/settings', HeroIcon: Cog6ToothIcon }, // Replaced ⚙️
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-green-100 shadow-lg z-50">
      <div className="flex flex-col h-full p-6">
        {/* Logo/Brand Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Travel App</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-green-200 hover:text-green-800 transition-colors duration-200 group"
                >
                  {/* Render Heroicon component */}
                  <item.HeroIcon className="h-6 w-6 mr-3 text-gray-500 group-hover:text-green-700 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section - User Info or Additional Actions */}
        <div className="mt-auto pt-6 border-t border-green-200">
          <div className="flex items-center px-4 py-3 text-gray-600">
            {/* Replaced 👋 with HandRaisedIcon */}
            <HandRaisedIcon className="h-6 w-6 mr-3 text-gray-500" />
            <span className="text-sm">Welcome back!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;