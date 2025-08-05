// src/components/Footer.tsx

"use client";

import React from 'react';

// Define props for the Footer component, including an optional className
interface FooterProps {
  className?: string; // Add className as an optional string prop
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`bg-gray-800 text-white py-6 px-6 text-center ${className || ''}`}>
      <p>&copy; {new Date().getFullYear()} Experiential Travel App. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-3">
        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;