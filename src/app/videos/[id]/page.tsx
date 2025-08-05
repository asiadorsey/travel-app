// src/app/videos/[id]/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '../../../components/MainLayout';
import DetailPageSidebar from '../../../components/DetailPageSidebar'; // Import DetailPageSidebar directly
import { dummyTales, ITale } from '../../../data/dummyTales';

// YouTube API configuration (same as in page.tsx)
const YOUTUBE_API_KEY = 'AIzaSyAfWg-7VN_i5OqSdfrSajRyO14IdVs35Qc';
const API_URL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=travel%20experience&part=snippet,id&order=relevance&maxResults=50&type=video`;

// Flag to enable/disable YouTube API calls
const ENABLE_YOUTUBE_API = false; // Set to true to re-enable API calls

// Interface for YouTube API item structure
interface YouTubeApiItem {
  id: {
    videoId?: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
}

const VideoDetailPage = () => {
  const params = useParams();
  const id = String(params.id);

  const [video, setVideo] = useState<ITale | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiVideos, setApiVideos] = useState<ITale[]>([]);

  // Fetch API videos
  useEffect(() => {
    const fetchApiVideos = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
          setApiVideos([]);
          return;
        }

        // Apply the new interface to the map function
        const mappedApiVideos = data.items.map((item: YouTubeApiItem) => {
          // Explicitly check for necessary properties before mapping
          if (!item.id || !item.id.videoId || !item.snippet || !item.snippet.title || !item.snippet.description || !item.snippet.thumbnails) {
            return null; // Return null for invalid items
          }

          return {
            id: item.id.videoId,
            type: 'video' as const,
            title: item.snippet.title,
            description: item.snippet.description,
            imageUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
            videoUrl: `https://www.youtube-nocookie.com/embed/${item.id.videoId}?autoplay=1&rel=0`,
            category: "API Data",
            location: "Online",
            rating: 4.5,
            priceRange: "$0",
            tags: ['api-data', 'video']
          };
        }).filter(Boolean) as ITale[]; // Filter out nulls

        setApiVideos(mappedApiVideos);
      } catch (error) {
        setApiVideos([]);
      } finally {
      }
    };

    if (ENABLE_YOUTUBE_API) {
      fetchApiVideos();
    } else {
      setApiVideos([]);
    }
  }, []);

  // Search for video in both dummyTales and API videos
  useEffect(() => {
    let foundVideo = dummyTales.find(tale => {
      return tale.id === id; // Removed the type filter here
    });

    if (!foundVideo && ENABLE_YOUTUBE_API) {
      foundVideo = apiVideos.find(tale => {
        return tale.id === id && tale.type === 'video'; // Keep type filter for API videos if only fetching videos
      });
    }

    if (foundVideo) {
      setVideo(foundVideo);
      setError(null);
    } else {
      const allDummyIds = dummyTales.map(t => `${t.id} (${t.title})`);
      const allApiVideoIds = ENABLE_YOUTUBE_API ? apiVideos.filter(t => t.type === 'video').map(t => `${t.id} (${t.title})`) : [];
      const allAvailableIds = [...allDummyIds, ...allApiVideoIds];
      setError(`Item with ID "${id}" not found. Available IDs: ${allAvailableIds.join(', ')}`); // Changed message to be generic
    }
    setLoading(false);
  }, [id, apiVideos, ENABLE_YOUTUBE_API]);

  if (loading) {
    return (
      <MainLayout> {/* Use MainLayout here without sidebarProps */}
        <div className="text-center py-10">Loading details...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout> {/* Use MainLayout here without sidebarProps */}
        <div className="text-center py-10 text-red-600">
          <h1 className="text-2xl font-bold">Error: Item Not Found</h1>
          <p className="mt-2">{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!video) {
    return (
      <MainLayout> {/* Use MainLayout here without sidebarProps */}
        <div className="text-center py-10 text-red-600">
          <h1 className="text-2xl font-bold">Item Data Missing</h1>
          <p>Could not retrieve item details. Please check the ID.</p>
        </div>
      </MainLayout>
    );
  }

  // Define sidebarProps for this specific detail page
  const detailSidebarProps = {
    taleType: video.type,
    title: video.title,
    location: video.location,
    rating: video.rating ?? 0,
    priceRange: video.priceRange ?? 'N/A'
  };

  return (
    <MainLayout> {/* MainLayout now just provides Header/Footer/MobileNav */}
      {/* This div creates the grid layout for the sidebar and main content */}
      <div className="w-full lg:grid lg:grid-cols-[256px_1fr] min-h-screen">
        {/* Detail Page Sidebar - visible only on large screens */}
        <DetailPageSidebar
          taleType={detailSidebarProps.taleType}
          title={detailSidebarProps.title}
          location={detailSidebarProps.location}
          rating={detailSidebarProps.rating}
          priceRange={detailSidebarProps.priceRange}
        />

        {/* Main content area for the detail page */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl w-full"> {/* Max width for content */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{video.title}</h1>
            {video.imageUrl && (
              <div className="relative w-full aspect-video mb-4 sm:mb-6">
                <Image
                  src={video.imageUrl}
                  alt={video.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                  priority // Added priority as per LCP warning for the main image on this page
                />
              </div>
            )}
            {/* Conditionally render video player only if type is 'video' and videoUrl exists */}
            {video.type === 'video' && video.videoUrl && (
              <div className="mt-4 sm:mt-6 w-full">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Watch Video</h2>
                <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
            <p className="text-gray-700 mb-4 text-sm sm:text-base">{video.description}</p>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Details</h3>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <p><strong>Type:</strong> {video.type.charAt(0).toUpperCase() + video.type.slice(1)}</p>
                  <p><strong>Location:</strong> {video.location}</p>
                  {video.category && <p><strong>Category:</strong> {video.category}</p>}
                  {video.rating && <p><strong>Rating:</strong> {video.rating} / 5</p>}
                  {video.priceRange && <p><strong>Price:</strong> {video.priceRange}</p>}

                  {/* Conditional Details based on Type */}
                  {video.type === 'hotel' && (
                    <>
                      {video.starRating && <p><strong>Star Rating:</strong> {video.starRating} Stars</p>}
                      {video.checkInTime && <p><strong>Check-in:</strong> {video.checkInTime}</p>}
                      {video.checkOutTime && <p><strong>Check-out:</strong> {video.checkOutTime}</p>}
                      {video.amenities && video.amenities.length > 0 && (
                        <p><strong>Amenities:</strong> {video.amenities.join(', ')}</p>
                      )}
                    </>
                  )}

                  {video.type === 'event' && (
                    <>
                      {video.date && <p><strong>Date:</strong> {video.date}</p>}
                      {video.time && <p><strong>Time:</strong> {video.time}</p>}
                      {video.duration && <p><strong>Duration:</strong> {video.duration}</p>}
                      {video.capacity && <p><strong>Capacity:</strong> {video.capacity} people</p>}
                    </>
                  )}

                  {video.type === 'restaurant' && (
                    <>
                      {video.cuisine && video.cuisine.length > 0 && (
                        <p><strong>Cuisine:</strong> {video.cuisine.join(', ')}</p>
                      )}
                      {video.dietaryRestrictions && video.dietaryRestrictions.length > 0 && (
                        <p><strong>Dietary:</strong> {video.dietaryRestrictions.join(', ')}</p>
                      )}
                      {video.reservationsRecommended && <p><strong>Reservations:</strong> Recommended</p>}
                      {video.averageCostPerPerson && <p><strong>Avg. Cost:</strong> {video.averageCostPerPerson}</p>}
                      {video.duration && <p><strong>Dining Duration:</strong> {video.duration}</p>}
                    </>
                  )}

                  {video.type === 'attraction' && (
                    <>
                      {video.bestTimeToVisit && <p><strong>Best Time:</strong> {video.bestTimeToVisit}</p>}
                      {video.durationRecommended && <p><strong>Recommended Duration:</strong> {video.durationRecommended}</p>}
                      {video.accessibilityOptions && video.accessibilityOptions.length > 0 && (
                        <p><strong>Accessibility:</strong> {video.accessibilityOptions.join(', ')}</p>
                      )}
                      {video.duration && <p><strong>Visit Duration:</strong> {video.duration}</p>}
                    </>
                  )}

                  {/* General details that might apply to multiple types */}
                  {video.featured && <p><strong>Featured:</strong> Yes</p>}

                </div>
              </div>
              {video.tags && video.tags.length > 0 && (
                <div className="bg-blue-100 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VideoDetailPage;