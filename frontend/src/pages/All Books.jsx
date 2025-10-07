import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllBooks = () => {
  const { bookslist, favorites, toggleFavorite, token } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!Array.isArray(bookslist)) return;

    let updatedBooks = [...bookslist].filter(book => book.publish === true);

    if (searchTerm.trim()) {
      updatedBooks = updatedBooks.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre) {
      updatedBooks = updatedBooks.filter(book =>
        book.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    if (sortOption === 'year') {
      updatedBooks.sort((a, b) => b.year - a.year);
    } else if (sortOption === 'rating') {
      updatedBooks.sort((a, b) => {
        const avgA = a.reviews?.length > 0
          ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length
          : 0;
        const avgB = b.reviews?.length > 0
          ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length
          : 0;
        return avgB - avgA;
      });
    }

    setFilteredBooks(updatedBooks);
  }, [searchTerm, selectedGenre, sortOption, bookslist]);

  if (!Array.isArray(bookslist)) {
    return <p className="text-center mt-10 text-gray-500">Loading books...</p>;
  }

  return (
    <div className="px-4 py-4">
      <h2 className="text-2xl font-semibold mb-2">Browse All Books</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 px-4 py-3 bg-neutral-100 rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="Search by title or author"
          className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Filter by Genre</option>
          <option value="Romance">Romance</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Thriller">Thriller</option>
          <option value="Mystery">Mystery</option>
          <option value="Motivational">Motivational</option>
          <option value="Historical Fiction">Historical Fiction</option>
        </select>

        <select
          className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="year">Published Year</option>
          <option value="rating">Average Rating</option>
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {filteredBooks.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (!token) {
                toast.info('Please login to view book details');
                navigate('/login');
                return;
              }
              navigate(`/book/${item._id}`);
            }}
            className="relative mt-6 border border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!token) {
                  toast.info('Login required to add to favourites');
                  navigate('/login');
                  return;
                }
                toggleFavorite(item._id);
              }}
              className="absolute top-2 right-2 bg-black rounded-full p-2 shadow-md z-10"
            >
              {favorites.includes(item._id) ? '❤️' : '🤍'}
            </button>

            <img className="w-60 h-72 object-cover" src={item.image} alt={item.title} />
            <div className="p-5">
              <p className="text-black text-lg font-bold">Title: {item.title}</p>
              <p className="text-black text-md font-medium">Author: {item.author}</p>
              <p className="text-black text-md font-medium">Genre: {item.genre}</p>
              <p className="text-black text-md font-medium">Published Year: {item.year}</p>
              <p className="text-black text-md font-medium mt-2">
                Rating: ⭐{' '}
                <span className="text-yellow-600 font-semibold">
                  {item.reviews?.length > 0
                    ? `${(
                        item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length
                      ).toFixed(1)}/5`
                    : 'No ratings yet'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No books found. Try a different search or genre.
        </p>
      )}
    </div>
  );
};

export default AllBooks;