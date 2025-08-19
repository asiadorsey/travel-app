// src/components/Header.jsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HeartIcon,
  MapIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

import { useFirebase } from "../context/FirebaseContext.jsx";
import { useSavedTales } from "../context/SavedTalesContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Header = ({ onSearch, onMenuToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { currentUser, getUserTier, getSaveLimit, canSaveMore } = useFirebase();
  const { getSaveStats } = useSavedTales();
  const { success } = useToast();

  const userTier = getUserTier();
  const saveStats = getSaveStats();

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  // Handle tier upgrade
  const handleUpgrade = () => {
    // This would typically open a payment modal
    success("Upgrade functionality coming soon!");
    setIsUserMenuOpen(false);
  };

  // Handle sign out
  const handleSignOut = () => {
    // This would typically call Firebase sign out
    success("Sign out functionality coming soon!");
    setIsUserMenuOpen(false);
  };

  // Get tier display info
  const getTierDisplay = () => {
    switch (userTier) {
      case "premium":
        return {
          name: "Premium",
          icon: StarIcon,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
          description: "Unlimited saves"
        };
      case "freemium":
        return {
          name: "Freemium",
          icon: SparklesIcon,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          description: `${saveStats.remaining} saves left`
        };
      default:
        return {
          name: "Anonymous",
          icon: UserCircleIcon,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          description: `${saveStats.remaining} saves left`
        };
    }
  };

  const tierDisplay = getTierDisplay();
  const TierIcon = tierDisplay.icon;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Tales
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Discover
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Trips
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Saved
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search tales, destinations, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Save Status */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50">
              <HeartIcon className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                {saveStats.current}/{saveStats.limit === Infinity ? '∞' : saveStats.limit}
              </span>
            </div>

            {/* Tier Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50">
              <TierIcon className={`h-5 w-5 ${tierDisplay.color}`} />
              <span className={`text-sm font-medium ${tierDisplay.color}`}>
                {tierDisplay.name}
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
                <span className="hidden lg:block text-sm text-gray-700">
                  {currentUser?.email || "Guest"}
                </span>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <UserCircleIcon className="h-10 w-10 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser?.email || "Anonymous User"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <TierIcon className={`h-4 w-4 ${tierDisplay.color}`} />
                            <span className={`text-xs font-medium ${tierDisplay.color}`}>
                              {tierDisplay.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <a
                        href="#"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        <span>Profile</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <HeartIcon className="h-5 w-5" />
                        <span>Saved Tales</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <MapIcon className="h-5 w-5" />
                        <span>My Trips</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        <span>Settings</span>
                      </a>
                    </div>

                    {/* Upgrade Section */}
                    {userTier !== "premium" && (
                      <div className="px-4 py-3 border-t border-gray-200">
                        <button
                          onClick={handleUpgrade}
                          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
                        >
                          <SparklesIcon className="h-4 w-4" />
                          <span>Upgrade to Premium</span>
                        </button>
                      </div>
                    )}

                    {/* Sign Out */}
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search tales, destinations, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-2 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Discover
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Trips
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                Saved
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                About
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
