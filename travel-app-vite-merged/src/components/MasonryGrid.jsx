// src/components/MasonryGrid.jsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TaleCard from "./TaleCard.jsx";

const MasonryGrid = ({ 
  tales, 
  columns = 3, 
  gap = 16, 
  onLoadMore, 
  hasMore = false,
  isLoading = false 
}) => {
  const [columnHeights, setColumnHeights] = useState(new Array(columns).fill(0));
  const [columnTales, setColumnTales] = useState(new Array(columns).fill().map(() => []));
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Use react-intersection-observer for better performance
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Distribute tales across columns for masonry effect
  useEffect(() => {
    if (!tales || tales.length === 0) return;

    const newColumnTales = new Array(columns).fill().map(() => []);
    const newColumnHeights = new Array(columns).fill(0);

    tales.forEach((tale, index) => {
      // Find the column with the shortest height
      const shortestColumnIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
      
      newColumnTales[shortestColumnIndex].push(tale);
      
      // Estimate height (this will be updated when images load)
      newColumnHeights[shortestColumnIndex] += 400; // Approximate card height
    });

    setColumnTales(newColumnTales);
    setColumnHeights(newColumnHeights);
  }, [tales, columns]);

  // Handle infinite scroll with intersection observer
  useEffect(() => {
    if (inView && hasMore && !isLoading && !isIntersecting) {
      setIsIntersecting(true);
      onLoadMore?.();
    }
  }, [inView, hasMore, isLoading, onLoadMore, isIntersecting]);

  // Reset intersection state after loading
  useEffect(() => {
    if (isIntersecting) {
      setIsIntersecting(false);
    }
  }, [tales]);

  // Handle image load to recalculate column heights
  const handleImageLoad = useCallback(() => {
    // Recalculate column heights based on actual rendered content
    const columns = document.querySelectorAll('.masonry-column');
    const newHeights = Array.from(columns).map(col => col.scrollHeight);
    setColumnHeights(newHeights);
  }, []);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg aspect-video mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );

  if (!tales || tales.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No tales found</div>
        <div className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Masonry Grid */}
      <div 
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap}px`
        }}
      >
        {columnTales.map((columnTales, columnIndex) => (
          <div
            key={columnIndex}
            className="masonry-column space-y-4"
            style={{ minHeight: columnHeights[columnIndex] }}
          >
            <AnimatePresence>
              {columnTales.map((tale, taleIndex) => (
                <motion.div
                  key={tale.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  onLayoutEffect={handleImageLoad}
                  transition={{
                    layout: { duration: 0.3, ease: "easeInOut" }
                  }}
                >
                  <TaleCard tale={tale} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Load More Section */}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="mt-8 text-center"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-gray-600">Loading more tales...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Load More Tales
            </button>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasMore && tales.length > 0 && (
        <div className="mt-8 text-center text-gray-500">
          <div className="text-lg">You've reached the end!</div>
          <div className="text-sm mt-1">All tales have been loaded</div>
        </div>
      )}
    </div>
  );
};

export default MasonryGrid;
