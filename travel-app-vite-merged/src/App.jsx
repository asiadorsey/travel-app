import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './context/FirebaseContext.jsx';
import { SavedTalesProvider } from './context/SavedTalesContext.jsx';
import { TripProvider } from './context/TripContext.jsx';
import { PlanningProvider } from './context/PlanningContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection';
import MasonryGrid from './components/MasonryGrid.jsx';
import ToastContainer from './components/Toast.jsx';
import { allTales, searchTales } from './data/index.js';

function App() {
  const [tales, setTales] = useState([]);
  const [filteredTales, setFilteredTales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load tales on mount
  useEffect(() => {
    setTales(allTales);
    setFilteredTales(allTales);
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      if (query.trim()) {
        const results = searchTales(query);
        setFilteredTales(results);
      } else {
        setFilteredTales(tales);
      }
      setIsLoading(false);
    }, 300);
  };

  // Handle load more (for infinite scroll)
  const handleLoadMore = () => {
    // This would typically load more tales from an API
    console.log('Loading more tales...');
  };

  return (
    <FirebaseProvider>
      <SavedTalesProvider>
        <TripProvider>
          <PlanningProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gray-50">
                <Header onSearch={handleSearch} />
                <HeroSection />
                
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {/* Search Results Header */}
                  {searchQuery && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Search Results
                      </h2>
                      <p className="text-gray-600">
                        Found {filteredTales.length} tales for "{searchQuery}"
                      </p>
                    </div>
                  )}

                  {/* Tales Grid */}
                  <MasonryGrid
                    tales={filteredTales}
                    columns={3}
                    gap={16}
                    onLoadMore={handleLoadMore}
                    hasMore={false}
                    isLoading={isLoading}
                  />
                </main>

                {/* Toast Notifications */}
                <ToastContainer />
              </div>
            </ToastProvider>
          </PlanningProvider>
        </TripProvider>
      </SavedTalesProvider>
    </FirebaseProvider>
  );
}

export default App;
