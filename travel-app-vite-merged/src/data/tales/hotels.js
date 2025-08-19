// src/data/tales/hotels.js

export const hotels = [
  {
    id: 'hotel-1',
    type: 'hotel',
    title: 'Aman Tokyo - Luxury Urban Retreat',
    description: 'Experience unparalleled luxury in the heart of Tokyo with stunning city views, world-class amenities, and traditional Japanese hospitality.',
    imageUrl: '/images/placeholder-1.svg',
    location: 'Tokyo, Japan',
    rating: 4.9,
    priceRange: '$$$$',
    starRating: 5,
    tags: ['luxury', 'urban', 'japan', 'wellness'],
    category: 'Luxury Hotel',
    featured: true,
    personalityType: 'luxury-seeker',
    amenities: ['Spa', 'Rooftop Pool', 'Fine Dining', 'Concierge Service', 'City Views'],
    checkInTime: '3:00 PM',
    checkOutTime: '12:00 PM',
    price: 800
  },
  {
    id: 'hotel-2',
    type: 'hotel',
    title: 'Treehouse Lodge - Eco Adventure',
    description: 'Stay in sustainable treehouse accommodations surrounded by nature, perfect for adventure seekers and eco-conscious travelers.',
    imageUrl: '/images/patagonia-thumb.jpg',
    location: 'Costa Rica',
    rating: 4.7,
    priceRange: '$$',
    starRating: 4,
    tags: ['eco-friendly', 'adventure', 'nature', 'sustainable'],
    category: 'Eco Lodge',
    personalityType: 'explorer',
    amenities: ['Guided Tours', 'Organic Restaurant', 'Hiking Trails', 'Wildlife Viewing'],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    price: 150
  },
  {
    id: 'hotel-3',
    type: 'hotel',
    title: 'Riad Al Ksar - Traditional Moroccan',
    description: 'Immerse yourself in authentic Moroccan culture with traditional riad architecture, courtyard gardens, and local hospitality.',
    imageUrl: '/images/waterfall-thumb.jpg',
    location: 'Marrakech, Morocco',
    rating: 4.6,
    priceRange: '$$$',
    starRating: 4,
    tags: ['traditional', 'morocco', 'cultural', 'authentic'],
    category: 'Traditional Riad',
    personalityType: 'culture-vulture',
    amenities: ['Courtyard Garden', 'Traditional Hammam', 'Rooftop Terrace', 'Local Cuisine'],
    checkInTime: '2:00 PM',
    checkOutTime: '11:00 AM',
    price: 200
  }
];
