import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`transition-colors duration-200 ${
            readonly 
              ? 'cursor-default' 
              : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 rounded-sm'
          }`}
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={`w-5 h-5 transition-colors duration-200 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      )}
    </div>
  );
};

export default StarRating;
