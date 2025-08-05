// src/components/HotelCard.tsx
import React from 'react';
import Image from 'next/image';

interface HotelCardProps {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  location: string;
  rating: number;
  amenities?: string[];
  description?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
  id,
  name,
  imageUrl,
  price,
  location,
  rating,
  amenities = [],
  description
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02] cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-[#57A57A] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          {price}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-md">
          <span className="text-yellow-500">★</span>
          <span>{rating}</span>
        </div>

        {/* Hotel Type Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          Hotel
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Hotel Name */}
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 group-hover:text-[#57A57A] transition-colors duration-200 line-clamp-2">
          {name}
        </h3>

        {/* Location */}
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        {/* Description (if provided) */}
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="inline-block bg-[#ECF9EC] text-[#57A57A] text-xs px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-[#57A57A] font-semibold">{price}</span>
            <span className="text-gray-400 text-sm">per night</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-500">
            <span className="text-sm font-medium">{rating}</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard; 