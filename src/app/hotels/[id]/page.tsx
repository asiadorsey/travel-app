"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DetailPageSidebar from '../../../components/DetailPageSidebar';
import MobileNavigation from '../../../components/MobileNavigation';
import { dummyTales, ITale } from '../../../data/dummyTales';

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [hotel, setHotel] = useState<ITale | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`🔍 Searching for hotel with ID: ${id}`);

    const foundHotel = dummyTales.find(tale => {
      return tale.id === id && tale.type === 'hotel';
    });

    if (foundHotel) {
      console.log('✅ Found hotel:', foundHotel);
      setHotel(foundHotel);
      setError(null);
    } else {
      console.log('❌ Hotel not found for ID:', id);
      const allHotelIds = dummyTales.filter(t => t.type === 'hotel').map(t => `${t.id} (${t.title})`);
      setError(`Hotel with ID "${id}" not found. Available hotels: ${allHotelIds.join(', ')}`);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading hotel details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Error: Hotel Not Found</h1>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Hotel Data Missing</h1>
        <p>Could not retrieve hotel details. Please check the ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <DetailPageSidebar
        taleType={hotel.type}
        title={hotel.title}
        location={hotel.location}
        rating={hotel.rating}
        priceRange={hotel.priceRange}
      />



      <main className="flex-grow w-full lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-20 lg:pb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{hotel.title}</h1>

        {hotel.imageUrl && (
          <div className="relative w-full aspect-video mb-4 sm:mb-6">
            <Image
              src={hotel.imageUrl}
              alt={hotel.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4 text-sm sm:text-base">{hotel.description}</p>

        {/* Hotel Details Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Hotel Information</h3>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <p><strong>Location:</strong> {hotel.location}</p>
              {hotel.category && <p><strong>Category:</strong> {hotel.category}</p>}
              {hotel.rating && <p><strong>Rating:</strong> {hotel.rating} ★</p>}
              {hotel.priceRange && <p><strong>Price Range:</strong> {hotel.priceRange}</p>}
            </div>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {hotel.tags && hotel.tags.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {hotel.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 