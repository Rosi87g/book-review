import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const BooksList = () => {
  const navigate = useNavigate();
  const { bookslist, favorites, toggleFavorite } = useContext(AppContext);

  const topRatedBooks = Array.isArray(bookslist)
    ? [...bookslist]
        .filter(book => book.publish === true)
        .sort((a, b) => {
          const avgA = a.reviews?.length > 0
            ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length
            : 0;
          const avgB = b.reviews?.length > 0
            ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length
            : 0;
          return avgB - avgA;
        })
        .slice(0, 5)
    : [];

  const latestBooks = Array.isArray(bookslist)
    ? [...bookslist]
        .filter(book => book.publish === true)
        .sort((a, b) => b.year - a.year)
        .slice(0, 5)
    : [];

  const renderBookCard = (item, index) => (
    <div
      key={index}
      onClick={() => navigate(`/book/${item._id}`)}
      className="relative mt-6 border border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
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
          {item.reviews?.length > 0
            ? `${(
                item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length
              ).toFixed(1)}/5`
            : 'No ratings yet'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 my-3 text-black md:mx-16 mt-1">
      <p className="sm:w-2/3 text-center text-md font-medium">
        Explore the shelves of BookReview — a curated collection of titles across genres, each waiting to be discovered, rated, and reviewed. Browse through paginated listings of top reads, from timeless classics to trending releases, and find your next favorite book.
      </p>

      {/* 🔹 Top Rated Section */}
      <h1 className="text-3xl font-medium mt-1">Top Rated Books</h1>
      <hr className="border-none outline-none h-1 bg-black w-28 m-auto" />
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 px-3 sm:px-0">
        {topRatedBooks.map(renderBookCard)}
      </div>

      {/* 🔹 Latest Books Section */}
      <h1 className="text-3xl font-medium mt-10">Latest Books</h1>
      <hr className="border-none outline-none h-1 bg-black w-28 m-auto" />
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 px-3 sm:px-0">
        {latestBooks.map(renderBookCard)}
      </div>

      {/* View More Button */}
      <button
        onClick={() => {
          navigate('/Allbooks');
          scrollTo(0, 0);
        }}
        className="bg-blue-500 text-white px-12 py-3 rounded-full mt-10"
      >
        View More
      </button>
    </div>
  );
};

export default BooksList;