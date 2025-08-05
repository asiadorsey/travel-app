// src/components/MainLayout.tsx

"use client";

import React, { useState } from 'react'; // Import useState
import MobileNavigation from './MobileNavigation';
import Header from './Header'; // Import the Header component
import Footer from './Footer'; // Import the Footer component

// Define props for the MainLayout component
interface MainLayoutProps {
  children: React.ReactNode; // This will be the content passed into the layout
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // State for mobile navigation open/close
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Function to toggle mobile navigation
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    // This div now simply defines the overall flex column structure for Header, Main Content, Footer
    <div className="w-full flex flex-col min-h-screen">
      {/* Mobile navigation - always rendered, but hidden via CSS on larger screens */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        toggleMobileNav={toggleMobileNav}
        currentPage="home" // Default for now, can be made dynamic later
        className="lg:hidden" // Hide on large screens
      />

      {/* Main content area for the page */}
      <main className="flex flex-col flex-grow overflow-y-auto w-full">
        {/* Header for the main content area */}
        <Header />

        {/* Inner content wrapper with responsive padding and horizontal centering */}
        <div className="flex-grow py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 w-full flex justify-center">
          {children} {/* The actual page content (children from page.tsx) */}
        </div>

        {/* Footer for the main content area */}
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;