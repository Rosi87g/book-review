import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PublisherContext } from '../../context/PublisherContext';

const ReviewInsights = () => {
  const { aToken, backendUrl } = useContext(PublisherContext);
  const [insights, setInsights] = useState([]);
  const [filterRating, setFilterRating] = useState(null);
  const [sortOption, setSortOption] = useState('rating-desc');

  useEffect(() => {
    const fetchInsights = async () => {
      const { data } = await axios.get(`${backendUrl}/api/admin/review-insights`, {
        headers: { aToken }
      });
      if (data.success) setInsights(data.insights);
    };
    fetchInsights();
  }, []);

  const filteredBooks = insights.filter(book =>
    filterRating ? Math.round(book.averageRating) === filterRating : true
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOption === 'rating-desc') return b.averageRating - a.averageRating;
    if (sortOption === 'rating-asc') return a.averageRating - b.averageRating;
    if (sortOption === 'reviews-desc') return b.totalReviews - a.totalReviews;
    if (sortOption === 'reviews-asc') return a.totalReviews - b.totalReviews;
    if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
    if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <div className="flex">

      <div className="flex-1 h-screen overflow-y-auto p-6">
        <h2 className="text-3xl font-semibold mb-6">⭐ Rating Insights</h2>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="font-medium mr-2">Filter by Avg Rating:</label>
            {[5, 4, 3, 2, 1].map(star => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-3 py-1 border rounded mx-1 ${filterRating === star ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                {star}★
              </button>
            ))}
            <button onClick={() => setFilterRating(null)} className="px-3 py-1 border rounded mx-1 bg-gray-100">Clear</button>
          </div>

          <div>
            <label className="font-medium mr-2">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="rating-desc">Rating ↓</option>
              <option value="rating-asc">Rating ↑</option>
              <option value="reviews-desc">Reviews ↓</option>
              <option value="reviews-asc">Reviews ↑</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedBooks.map(book => (
            <div key={book.bookId} className="border p-4 rounded-lg bg-white shadow">
              <div className="flex gap-4 items-center mb-4">
                <img src={book.image} alt={book.title} className="w-20 h-28 object-cover rounded" />
                <div>
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <p className="text-sm text-gray-600">Average Rating: ⭐ {book.averageRating}</p>
                  <p className="text-sm text-gray-600">Total Reviews: {book.totalReviews}</p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="min-w-[50px]">{star}★</span>
                    <div className="flex-1 bg-gray-200 h-3 rounded">
                      <div
                        className="bg-blue-500 h-3 rounded"
                        style={{
                          width: `${(book.distribution[star - 1] / book.totalReviews) * 100 || 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700">{book.distribution[star - 1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewInsights;