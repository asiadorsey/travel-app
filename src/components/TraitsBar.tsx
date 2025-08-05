// src/components/TraitsBar.tsx
import React from 'react';

interface TraitsBarProps {
  selectedTrait: string;
  onTraitSelect: (trait: string) => void;
}

const TraitsBar: React.FC<TraitsBarProps> = ({ selectedTrait, onTraitSelect }) => {
  const traits = [
    { id: 'all', label: 'All Tales', default: true },
    { id: 'your-traits', label: 'Your Traits' },
    { id: 'trending', label: 'Trending Locations' },
    { id: 'saved', label: 'Saved Locations' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'culture', label: 'Culture & Arts' },
    { id: 'food', label: 'Food & Dining' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'budget', label: 'Budget Friendly' }
  ];

  return (
    <div className="sticky top-0 w-full bg-white border-b border-gray-100 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
          {traits.map((trait) => {
            const isSelected = selectedTrait === trait.id;
            return (
              <button
                key={trait.id}
                onClick={() => onTraitSelect(trait.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#57A57A] text-white shadow-md'
                    : 'bg-[#FCF8F7] text-gray-700 hover:bg-[#ECF9EC] hover:text-[#57A57A]'
                }`}
              >
                {trait.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TraitsBar; 