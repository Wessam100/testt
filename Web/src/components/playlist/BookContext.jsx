import { createContext, useContext, useState } from 'react';

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [selectedBookId, setSelectedBookId] = useState(null);

  const handlePlayBook = (bookId) => {
    setSelectedBookId(bookId);
  };

  return (
    <BookContext.Provider value={{ selectedBookId, handlePlayBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);