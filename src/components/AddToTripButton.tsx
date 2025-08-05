// src/components/AddToTripButton.tsx
import React, { useState } from 'react';

interface AddToTripButtonProps {
  itemId: string;
  itemType: 'hotel' | 'experience' | 'restaurant';
  itemName: string;
  onAddToTrip?: (itemId: string, itemType: string) => void;
}

const AddToTripButton: React.FC<AddToTripButtonProps> = ({
  itemId,
  itemType,
  itemName,
  onAddToTrip
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToTrip = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAdded(true);
    setIsLoading(false);
    
    if (onAddToTrip) {
      onAddToTrip(itemId, itemType);
    }
    
    // Reset after 3 seconds
    setTimeout(() => setIsAdded(false), 3000);
  };

  const getButtonText = () => {
    if (isLoading) return 'Adding...';
    if (isAdded) return 'Added to Trip!';
    return 'Add to My Trip';
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    
    if (isAdded) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Add to Trip Button */}
      <button
        onClick={handleAddToTrip}
        disabled={isLoading || isAdded}
        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
          isAdded
            ? 'bg-[#57A57A] text-white shadow-lg'
            : isLoading
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-[#57A57A] hover:bg-[#4A8A6A] text-white shadow-md hover:shadow-lg transform hover:scale-105'
        }`}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </button>

      {/* Trip Preview (Conceptual) */}
      <div className="bg-[#FCF6F3] rounded-lg p-4 border border-[#ECF9EC]">
        <h4 className="font-semibold text-gray-900 mb-2">Your Current Trip</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Items in trip:</span>
            <span className="font-medium text-[#57A57A]">3</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Estimated cost:</span>
            <span className="font-medium text-[#57A57A]">$1,250</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Trip duration:</span>
            <span className="font-medium text-[#57A57A]">5 days</span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-3 pt-3 border-t border-[#ECF9EC]">
          <div className="flex space-x-2">
            <button className="flex-1 text-xs bg-[#ECF9EC] text-[#57A57A] px-3 py-1 rounded-full hover:bg-[#CBF5DB] transition-colors">
              View Trip
            </button>
            <button className="flex-1 text-xs bg-[#ECF9EC] text-[#57A57A] px-3 py-1 rounded-full hover:bg-[#CBF5DB] transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Smart Suggestions (Conceptual) */}
      <div className="bg-[#FCF8F7] rounded-lg p-4 border border-[#ECF9EC]">
        <h4 className="font-semibold text-gray-900 mb-2">Smart Suggestions</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#57A57A] rounded-full"></div>
            <span className="text-gray-600">Nearby restaurants that match your preferences</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#57A57A] rounded-full"></div>
            <span className="text-gray-600">Experiences that complement your hotel choice</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#57A57A] rounded-full"></div>
            <span className="text-gray-600">Transportation options for your dates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToTripButton; 