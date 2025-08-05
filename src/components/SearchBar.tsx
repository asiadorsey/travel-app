// src/components/SearchBar.tsx
"use client";

import React, { useState } from 'react';

// Define the props for the SearchBar component
interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string; // <<< ADD THIS NEW PROP
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value }) => { // Destructure value prop
  // The internal state for the input is now removed, as it will be controlled by the 'value' prop from parent
  // const [searchTerm, setSearchTerm] = useState(''); // REMOVE THIS LINE

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setSearchTerm(event.target.value); // REMOVE THIS LINE
    onSearch(event.target.value); // Directly call onSearch with the input value
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // onSearch(searchTerm); // REMOVE THIS LINE
    // The onSearch is now called on every change, so handleSubmit might not be strictly necessary for filtering
    // but can be kept for consistency if there are other form submission behaviors.
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full">
      <input
        type="text"
        placeholder="Search for tales, locations, or experiences..."
        className="flex-grow p-3 border border-talea-mint rounded-l-lg focus:outline-none focus:ring-3 focus:ring-talea-mint transition-all duration-200 shadow-sm text-talea-dark-slate-gray bg-white"
        value={value} // <<< USE THE 'value' PROP HERE
        onChange={handleChange}
      />
      <button
        type="submit"
        className="bg-talea-mint text-white p-3 rounded-r-lg hover:bg-talea-dark-green transition-colors duration-300 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
