import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { bookslist, favorites, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const favoriteBooks = Array.isArray(bookslist)
    ? bookslist.filter(book => favorites.includes(book._id))
    : [];

  // Block access if user is not logged in
  if (!userData) {
    return (
      <div className="px-4 py-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Favorite Books</h2>
        <p className="text-gray-500 mb-4">Please login to view your favourites.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Your Favorite Books</h2>

      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {favoriteBooks.map((book, index) => (
            <div
              key={index}
              onClick={() => navigate(`/book/${book._id}`)}
              className="border border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="w-60 h-72 object-cover" src={book.image} alt={book.title} />
              <div className="p-5">
                <p className="text-black text-lg font-bold">Title: {book.title}</p>
                <p className="text-black text-md font-medium">Author: {book.author}</p>
                <p className="text-black text-md font-medium">Genre: {book.genre}</p>
                <p className="text-black text-md font-medium">Published Year: {book.year}</p>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You haven’t added any favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;