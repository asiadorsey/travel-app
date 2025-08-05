"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DetailPageSidebar from '../../../components/DetailPageSidebar';
import MobileNavigation from '../../../components/MobileNavigation';
import { dummyTales, ITale } from '../../../data/dummyTales';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [restaurant, setRestaurant] = useState<ITale | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`🔍 Searching for restaurant with ID: ${id}`);

    const foundRestaurant = dummyTales.find(tale => {
      return tale.id === id && tale.type === 'restaurant';
    });

    if (foundRestaurant) {
      console.log('✅ Found restaurant:', foundRestaurant);
      setRestaurant(foundRestaurant);
      setError(null);
    } else {
      console.log('❌ Restaurant not found for ID:', id);
      const allRestaurantIds = dummyTales.filter(t => t.type === 'restaurant').map(t => `${t.id} (${t.title})`);
      setError(`Restaurant with ID "${id}" not found. Available restaurants: ${allRestaurantIds.join(', ')}`);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading restaurant details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Error: Restaurant Not Found</h1>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Restaurant Data Missing</h1>
        <p>Could not retrieve restaurant details. Please check the ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <DetailPageSidebar
        taleType={restaurant.type}
        title={restaurant.title}
        location={restaurant.location}
        rating={restaurant.rating}
        priceRange={restaurant.priceRange}
      />



      <main className="flex-grow w-full lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-20 lg:pb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{restaurant.title}</h1>

        {restaurant.imageUrl && (
          <div className="relative w-full aspect-video mb-4 sm:mb-6">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4 text-sm sm:text-base">{restaurant.description}</p>

        {/* Restaurant Details Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Restaurant Information</h3>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <p><strong>Location:</strong> {restaurant.location}</p>
              {restaurant.category && <p><strong>Category:</strong> {restaurant.category}</p>}
              {restaurant.rating && <p><strong>Rating:</strong> {restaurant.rating} ★</p>}
              {restaurant.priceRange && <p><strong>Price Range:</strong> {restaurant.priceRange}</p>}
              {restaurant.duration && <p><strong>Duration:</strong> {restaurant.duration}</p>}
            </div>
          </div>

          {/* Dining Experience */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Dining Experience</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p>• Unique culinary experience</p>
              <p>• Professional chef guidance</p>
              <p>• Fresh, local ingredients</p>
              <p>• Memorable atmosphere</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {restaurant.tags.map((tag, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
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