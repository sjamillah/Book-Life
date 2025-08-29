import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Loader2, Plus, Check } from 'lucide-react';
import { addBookToFavorites, clearSearchResults, setSearchQuery, searchBooksAPI } from '../features/bookSlice';
import ErrorMessage from './ErrorMessage';
import useDebounce from '../hooks/useDebounce';

const BookSearch = () => {
  const dispatch = useDispatch();
  const { searchQuery, searchResults, isSearching, searchError, favorites } = useSelector(state => state.books);
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const isBookInFavorites = (bookId) => {
    return favorites.some(fav => fav.id === bookId);
  };

  const handleAddToFavorites = (book) => {
    dispatch(addBookToFavorites(book));
    setRecentlyAdded(book.id);
    setTimeout(() => setRecentlyAdded(null), 2000); // Clear after 2 seconds
  };


  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim().length >= 2) {
      dispatch(searchBooksAPI(debouncedQuery));
    } else {
      dispatch(clearSearchResults());
    }
  }, [debouncedQuery, dispatch]);

  return (
    <div className="space-y-6">
      {/* Simple Search Section */}
      <div className="card p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search for books by title, author, or keyword..."
            className="w-full pl-12 pr-12 py-3 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {searchError && (
        <ErrorMessage message={searchError} onDismiss={() => dispatch(clearSearchResults())} />
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Search Results ({searchResults.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((book) => (
              <div 
                key={book.id} 
                className="card p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start space-x-4">
                  {/* Book Cover */}
                  <div className="flex-shrink-0">
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl} 
                        alt={book.title} 
                        className="w-16 h-24 object-cover rounded" 
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="flex-grow min-w-0 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {book.authors.join(', ')}
                    </p>
                    {book.publishedDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {book.publishedDate}
                      </p>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                      {isBookInFavorites(book.id) ? (
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-md">
                          <Check className="w-4 h-4 mr-1" /> 
                          Added
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleAddToFavorites(book)} 
                          className={`inline-flex items-center px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                            recentlyAdded === book.id 
                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                        >
                          {recentlyAdded === book.id ? (
                            <>
                              <Check className="w-4 h-4 mr-1" /> 
                              Added!
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" /> 
                              Add to Favorites
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSearch;
