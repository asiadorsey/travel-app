// src/components/VideoCard.tsx
import React from 'react';
import Image from 'next/image';

interface VideoCardProps {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string; // Placeholder for future video integration
  category: string;
  location: string;
  rating: number;
  price: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  imageUrl,
  category,
  location,
  rating,
  price,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] group cursor-pointer border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-300">
            <svg className="w-8 h-8 text-[#57A57A] ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-[#57A57A] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {category}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-md">
          <span className="text-yellow-500">★</span>
          <span>{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Location */}
        <div className="text-sm text-gray-500 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-[#57A57A] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{description}</p>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-[#57A57A] font-semibold text-base sm:text-lg">{price}</span>
            <span className="text-gray-400 text-xs sm:text-sm">per experience</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-500">
            <span className="text-xs sm:text-sm font-medium">{rating}</span>
            <svg className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard; 