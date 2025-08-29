import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../features/bookSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer
  }
});
