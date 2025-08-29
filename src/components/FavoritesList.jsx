import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import { removeBookFromFavorites, updateBookRating, updateReadingStatus, updateBookNotes, setSortBy, setFilterBy, clearValidationErrors } from '../features/bookSlice';
import StarRating from './StarRating';
import ErrorMessage from './ErrorMessage';

const FavoritesList = () => {
  const dispatch = useDispatch();
  const { favorites, sortBy, filterBy, validationErrors } = useSelector(state => state.books);
  const [editingNotes, setEditingNotes] = useState(null);
  const [noteText, setNoteText] = useState('');

  const sortedFavorites = [...favorites].sort((a,b) => {
    switch(sortBy){
      case 'title': return a.title.localeCompare(b.title);
      case 'author': return a.authors[0].localeCompare(b.authors[0]);
      case 'rating': return b.personalRating - a.personalRating;
      case 'dateAdded': default: return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  const filteredFavorites = sortedFavorites.filter(book => filterBy === 'all' ? true : book.readingStatus === filterBy);

  const handleNotesEdit = book => { setEditingNotes(book.id); setNoteText(book.notes || ''); };
  const handleNotesSave = bookId => { dispatch(updateBookNotes({ bookId, notes: noteText })); setEditingNotes(null); setNoteText(''); };
  const handleNotesCancel = () => { setEditingNotes(null); setNoteText(''); };

  const getStatusColor = status => {
    switch(status){
      case 'finished': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'reading': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'want-to-read': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {validationErrors.duplicate && (
        <ErrorMessage message={validationErrors.duplicate} onDismiss={()=>dispatch(clearValidationErrors())} />
      )}
      
      {favorites.length > 0 ? (
        <>
          {/* Header with Controls */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              My Library ({favorites.length})
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <select 
                value={sortBy} 
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="input-field"
              >
                <option value="dateAdded">Sort by Date Added</option>
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="rating">Sort by Rating</option>
              </select>
              
              <select 
                value={filterBy} 
                onChange={(e) => dispatch(setFilterBy(e.target.value))}
                className="input-field"
              >
                <option value="all">All Books</option>
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFavorites.map((book) => (
              <div 
                key={book.id} 
                className="card p-6 space-y-4"
              >
                {/* Book Header */}
                <div className="flex items-start space-x-4">
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
                  <div className="flex-grow min-w-0 space-y-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {book.authors.join(', ')}
                    </p>
                    {book.publishedDate && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {book.publishedDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Reading Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reading Status
                  </label>
                  <select
                    value={book.readingStatus}
                    onChange={(e) => dispatch(updateReadingStatus({ bookId: book.id, status: e.target.value }))}
                    className="input-field"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Currently Reading</option>
                    <option value="finished">Finished</option>
                  </select>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.readingStatus)}`}>
                    {book.readingStatus === 'want-to-read' ? 'Want to Read' : 
                     book.readingStatus === 'reading' ? 'Currently Reading' : 'Finished'}
                  </span>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Rating
                  </label>
                  <StarRating
                    rating={book.personalRating}
                    onRatingChange={(rating) => dispatch(updateBookRating({ bookId: book.id, rating }))}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  {editingNotes === book.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your thoughts about this book..."
                        className="input-field resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleNotesSave(book.id)}
                          className="btn-primary text-sm px-3 py-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleNotesCancel}
                          className="btn-secondary text-sm px-3 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleNotesEdit(book)}
                      className="min-h-[2.5rem] p-2 border border-gray-300 dark:border-gray-600 rounded cursor-text bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {book.notes || 'Click to add notes...'}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => dispatch(removeBookFromFavorites(book.id))}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from Library
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Library is Empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Search for books above and add them to your favorites to get started.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
