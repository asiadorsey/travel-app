"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DetailPageSidebar from '../../../components/DetailPageSidebar';
import MobileNavigation from '../../../components/MobileNavigation';
import { dummyTales, ITale } from '../../../data/dummyTales';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [event, setEvent] = useState<ITale | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`🔍 Searching for event with ID: ${id}`);

    const foundEvent = dummyTales.find(tale => {
      return tale.id === id && tale.type === 'event';
    });

    if (foundEvent) {
      console.log('✅ Found event:', foundEvent);
      setEvent(foundEvent);
      setError(null);
    } else {
      console.log('❌ Event not found for ID:', id);
      const allEventIds = dummyTales.filter(t => t.type === 'event').map(t => `${t.id} (${t.title})`);
      setError(`Event with ID "${id}" not found. Available events: ${allEventIds.join(', ')}`);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Error: Event Not Found</h1>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10 text-red-600">
        <h1 className="text-2xl font-bold">Event Data Missing</h1>
        <p>Could not retrieve event details. Please check the ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <DetailPageSidebar
        taleType={event.type}
        title={event.title}
        location={event.location}
        rating={event.rating}
        priceRange={event.priceRange}
      />



      <main className="flex-grow w-full lg:ml-64 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-20 lg:pb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{event.title}</h1>

        {event.imageUrl && (
          <div className="relative w-full aspect-video mb-4 sm:mb-6">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4 text-sm sm:text-base">{event.description}</p>

        {/* Event Details Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Event Information</h3>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
              <p><strong>Location:</strong> {event.location}</p>
              {event.category && <p><strong>Category:</strong> {event.category}</p>}
              {event.rating && <p><strong>Rating:</strong> {event.rating} ★</p>}
              {event.priceRange && <p><strong>Price:</strong> {event.priceRange}</p>}
              {event.date && (
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              )}
              {event.duration && <p><strong>Duration:</strong> {event.duration}</p>}
            </div>
          </div>

          {/* Event Highlights */}
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Event Highlights</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p>• Unique cultural experience</p>
              <p>• Professional guidance and support</p>
              <p>• Memorable photo opportunities</p>
              <p>• Local insights and stories</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-gray-100 p-3 sm:p-4 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {event.tags.map((tag, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
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