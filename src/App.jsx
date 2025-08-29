import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BookSearch from './components/BookSearch';
import FavoritesList from './components/FavoritesList';
import ErrorMessage from './components/ErrorMessage';
import { toggleDarkMode, clearValidationErrors } from './features/bookSlice';
import { Moon, Sun } from 'lucide-react';

const BookApp = () => {
  const dispatch = useDispatch();
  const { darkMode, validationErrors } = useSelector(state => state.books);

  useEffect(() => {
    localStorage.setItem('bookapp-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Simple Header */}
          <header className="mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                  <span className="text-orange-500">Book</span>Shelf
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Discover, organize, and track your reading journey
                </p>
              </div>
              
              {/* Simple Dark Mode Toggle */}
              <button 
                onClick={() => dispatch(toggleDarkMode())} 
                className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </header>

          {/* Error Messages */}
          {validationErrors.title && (
            <div className="mb-6">
              <ErrorMessage message={validationErrors.title} onDismiss={() => dispatch(clearValidationErrors())} />
            </div>
          )}

          {/* Main Content */}
          <main className="space-y-12">
            <section>
              <BookSearch />
            </section>
            
            <section>
              <FavoritesList />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookApp;
