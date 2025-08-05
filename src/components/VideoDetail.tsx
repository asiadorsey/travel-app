// src/components/VideoDetail.tsx
import React from 'react';

// Updated interface to match the new data structure
interface VideoData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  category: string;
  location: string;
  rating: number;
  price: string;
}

interface VideoDetailProps {
  video: VideoData;
}

const VideoDetail: React.FC<VideoDetailProps> = ({ video }) => {
  if (!video) {
    return <div className="text-center text-gray-500 py-8">Video not found.</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{video.title}</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-2">Location: {video.location}</p>
      <p className="text-base md:text-lg text-gray-600 mb-6">Category: {video.category}</p>

      {/* Embedded YouTube video player */}
      <div className="w-full aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="text-gray-800 text-base md:text-lg leading-relaxed mb-6">{video.description}</p>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <div className="text-2xl md:text-3xl font-semibold text-blue-600">{video.price}</div>
        <div className="flex items-center text-yellow-500">
          <span className="text-xl md:text-2xl mr-1">{video.rating}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail; 