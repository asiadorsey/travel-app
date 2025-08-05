// src/data/tales/attractions.ts

import { ITale } from '../dummyTales';

export const attractions: ITale[] = [
  {
    id: 'dummy-attraction-1',
    type: 'attraction',
    title: 'Secret Hot Springs in Icelandic Highlands',
    description: 'Discover hidden geothermal pools in the remote Icelandic highlands. Soak in natural hot springs surrounded by volcanic landscapes.',
    imageUrl: 'https://picsum.photos/seed/icelandic-hot-springs/400/700',
    location: 'Icelandic Highlands, Iceland',
    rating: 4.9,
    priceRange: '$',
    duration: '6 hours',
    tags: ['hot-springs', 'geothermal', 'iceland', 'nature'],
    category: 'Natural Wonder',
    personalityType: 'The Serenity Seeker'
  },
  {
    id: 'dummy-attraction-2',
    type: 'attraction',
    title: 'Ancient Petra by Candlelight',
    description: 'Explore the ancient city of Petra illuminated by thousands of candles. Experience the magic of this UNESCO World Heritage site at night.',
    imageUrl: 'https://picsum.photos/seed/petra-candlelight/400/600',
    location: 'Petra, Jordan',
    rating: 4.8,
    priceRange: '$$$',
    duration: '3 hours',
    tags: ['ancient-ruins', 'unesco', 'jordan', 'night-tour'],
    category: 'Historical Site',
    personalityType: 'The Cultural Weaver'
  },
  {
    id: 'dummy-attraction-3',
    type: 'attraction',
    title: 'Cave Diving in Cenotes',
    description: 'Explore ancient underwater caves in the Yucatan Peninsula. Discover crystal clear waters and stunning rock formations.',
    imageUrl: 'https://picsum.photos/seed/cenote-diving/400/700',
    location: 'Tulum, Mexico',
    rating: 4.7,
    priceRange: '$',
    duration: '4 hours',
    tags: ['cave-diving', 'cenotes', 'mexico', 'adventure'],
    category: 'Adventure Sport',
    personalityType: 'The Adventurer\'s Call'
  },
  {
    id: 'dummy-attraction-4',
    type: 'attraction',
    title: 'Glacier Hiking in Patagonia',
    description: 'Hike on ancient glaciers in the stunning Patagonian wilderness. Experience the raw power of nature in one of Earth\'s most beautiful regions.',
    imageUrl: 'https://picsum.photos/seed/patagonia-glacier/400/700',
    location: 'Patagonia, Argentina',
    rating: 4.8,
    priceRange: '$$$',
    duration: '8 hours',
    tags: ['glacier', 'hiking', 'patagonia', 'adventure'],
    category: 'Adventure Sport',
    personalityType: 'The Wild Heart'
  },
  {
    id: 'dummy-attraction-5',
    type: 'attraction',
    title: 'Swimming with Whale Sharks',
    description: 'Swim alongside gentle whale sharks in their natural habitat. Experience the thrill of encountering the world\'s largest fish up close.',
    imageUrl: 'https://picsum.photos/seed/whale-shark/400/700',
    location: 'Isla Holbox, Mexico',
    rating: 4.9,
    priceRange: '$$$',
    duration: '6 hours',
    bestTimeToVisit: 'June to September',
    durationRecommended: '6-8 hours',
    accessibilityOptions: ['Wheelchair accessible boat', 'Assisted swimming available'],
    tags: ['whale-shark', 'swimming', 'mexico', 'marine-life'],
    category: 'Wildlife Experience',
    personalityType: 'The Wild Heart'
  },
  {
    id: 'dummy-attraction-6',
    type: 'attraction',
    title: 'Ancient Temple Sunrise Meditation',
    description: 'Begin your day with a peaceful meditation session at an ancient temple as the sun rises over the misty mountains.',
    imageUrl: 'https://picsum.photos/seed/temple-meditation/400/700',
    location: 'Bagan, Myanmar',
    rating: 4.9,
    priceRange: '$',
    bestTimeToVisit: 'Sunrise (5:30 AM)',
    durationRecommended: '2-3 hours',
    accessibilityOptions: ['Wheelchair accessible paths', 'Guided meditation for beginners'],
    tags: ['meditation', 'temple', 'sunrise', 'myanmar'],
    category: 'Spiritual Experience',
    personalityType: 'The Serenity Seeker'
  }
]; 