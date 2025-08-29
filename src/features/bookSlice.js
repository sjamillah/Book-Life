import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for searching books
export const searchBooksAPI = createAsyncThunk(
  'books/searchAPI',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.trim().length < 2) throw new Error('Search query must be at least 2 characters');
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.items?.map(item => ({
        id: item.id,
        title: item.volumeInfo.title || 'Unknown Title',
        authors: item.volumeInfo.authors || ['Unknown Author'],
        publishedDate: item.volumeInfo.publishedDate || 'Unknown',
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || null,
        categories: item.volumeInfo.categories || ['Uncategorized'],
        pageCount: item.volumeInfo.pageCount || 0,
        averageRating: item.volumeInfo.averageRating || 0,
      })) || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    favorites: JSON.parse(localStorage.getItem('bookapp-favorites') || '[]'),
    searchResults: [],
    searchQuery: '',
    sortBy: 'dateAdded',
    filterBy: 'all',
    darkMode: localStorage.getItem('bookapp-theme') === 'dark',
    isSearching: false,
    searchError: null,
    validationErrors: {},
  },
  reducers: {
    addBookToFavorites: (state, action) => {
      const book = action.payload;
      if (state.favorites.some(fav => fav.id === book.id)) return; // prevent duplicates
      state.favorites.push({ ...book, dateAdded: new Date().toISOString(), personalRating: 0, readingStatus: 'want-to-read', notes: '' });
      localStorage.setItem('bookapp-favorites', JSON.stringify(state.favorites));
    },
    removeBookFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(b => b.id !== action.payload);
      localStorage.setItem('bookapp-favorites', JSON.stringify(state.favorites));
    },
    updateBookRating: (state, action) => {
      const { bookId, rating } = action.payload;
      const book = state.favorites.find(b => b.id === bookId);
      if (book) {
        book.personalRating = rating;
        localStorage.setItem('bookapp-favorites', JSON.stringify(state.favorites));
      }
    },
    updateReadingStatus: (state, action) => {
      const { bookId, status } = action.payload;
      const book = state.favorites.find(b => b.id === bookId);
      if (book) {
        book.readingStatus = status;
        localStorage.setItem('bookapp-favorites', JSON.stringify(state.favorites));
      }
    },
    updateBookNotes: (state, action) => {
      const { bookId, notes } = action.payload;
      const book = state.favorites.find(b => b.id === bookId);
      if (book) {
        book.notes = notes;
        localStorage.setItem('bookapp-favorites', JSON.stringify(state.favorites));
      }
    },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setFilterBy: (state, action) => { state.filterBy = action.payload; },
    toggleDarkMode: (state) => { state.darkMode = !state.darkMode; },
    clearSearchResults: (state) => { state.searchResults = []; state.searchError = null; },
    clearValidationErrors: (state) => { state.validationErrors = {}; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBooksAPI.pending, (state) => { state.isSearching = true; state.searchError = null; })
      .addCase(searchBooksAPI.fulfilled, (state, action) => { state.isSearching = false; state.searchResults = action.payload; })
      .addCase(searchBooksAPI.rejected, (state, action) => { state.isSearching = false; state.searchError = action.payload; });
  },
});

export const {
  addBookToFavorites,
  removeBookFromFavorites,
  updateBookRating,
  updateReadingStatus,
  updateBookNotes,
  setSearchQuery,
  setSortBy,
  setFilterBy,
  toggleDarkMode,
  clearSearchResults,
  clearValidationErrors,
} = booksSlice.actions;

export default booksSlice.reducer;
