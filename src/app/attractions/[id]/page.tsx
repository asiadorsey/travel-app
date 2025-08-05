"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DetailPageSidebar from '../../../components/DetailPageSidebar';
import MobileNavigation from '../../../components/MobileNavigation';
import { dummyTales, ITale } from '../../../data/dummyTales';

export default function AttractionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [attraction, setAttraction] = useState<ITale | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`🔍 Searching for attraction with ID: ${id}`);

    const foundAttraction = dummyTales.find(tale => {
      return tale.id === id && tale.type === 'attraction';
    });

    if (foundAttraction) {
      console.log('✅ Found attraction:', foundAttraction);
      setAttraction(foundAttraction);
      setError(null);
    } else {
      console.log('❌ Attraction not found for ID:', id);
      const allAttractionIds = dummyTales.filter(t => t.type === 'attraction').map(t => `${t.id} (${t.title})`);
      setError(`Attraction with ID "${id}" not found. Available attractions: ${allAttractionIds.join(', ')}`);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading attraction details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Error: Attraction Not Found</h1>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Attraction Data Missing</h1>
        <p>Could not retrieve attraction details. Please check the ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <DetailPageSidebar
        taleType={attraction.type}
        title={attraction.title}
        location={attraction.location}
        rating={attraction.rating}
        priceRange={attraction.priceRange}
      />



      <main className="flex-grow w-full lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-20 lg:pb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{attraction.title}</h1>

        {attraction.imageUrl && (
          <div className="relative w-full aspect-video mb-4 sm:mb-6"> {/* <--- THIS LINE IS THE FIX! It was "<d//" */}
            <Image
              src={attraction.imageUrl}
              alt={attraction.title}
              fill
              priority // <--- ADD THIS LINE. You can put it before or after 'fill'.
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
        )} {/* <--- Ensure this closing parenthesis and curly brace are here */}

        <p className="text-gray-700 mb-4 text-sm sm:text-base">{attraction.description}</p>

        {/* Attraction Details Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Attraction Information</h3>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <p><strong>Location:</strong> {attraction.location}</p>
              {attraction.category && <p><strong>Category:</strong> {attraction.category}</p>}
              {attraction.rating && <p><strong>Rating:</strong> {attraction.rating} ★</p>}
              {attraction.priceRange && <p><strong>Price:</strong> {attraction.priceRange}</p>}
              {attraction.duration && <p><strong>Duration:</strong> {attraction.duration}</p>}
            </div>
          </div>

          {/* Experience Highlights */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Experience Highlights</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p>• Unique natural wonder</p>
              <p>• Professional guides available</p>
              <p>• Safety equipment provided</p>
              <p>• Unforgettable memories</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {
          attraction.tags && attraction.tags.length > 0 && (
            <div className="mt-6 sm:mt-8 bg-gray-100 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {attraction.tags.map((tag, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        }
      </main >
    </div >
  );
} 