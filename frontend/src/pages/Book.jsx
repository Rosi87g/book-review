import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Book = () => {
  const { bookId } = useParams();
  const {
    bookslist,
    favorites,
    toggleFavorite,
    userData,
    backendUrl,
    token,
    fetchBookReviews,
    fetchAverageRating,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [bookinfo, setBookInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.info('Please login to view book details');
      navigate('/login');
    }
  }, [token]);

  const fetchBookInfo = async () => {
    if (Array.isArray(bookslist)) {
      const bookinfo = bookslist.find(book => book._id === bookId);
      setBookInfo(bookinfo);
    }
  };

  const refreshReviews = async () => {
    const fetchedReviews = await fetchBookReviews(bookId);
    const avg = await fetchAverageRating(bookId);
    setReviews(fetchedReviews);
    setAverage(avg);
  };

  useEffect(() => {
    fetchBookInfo();
    refreshReviews();
  }, [bookslist, bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReviewId) {
        await axios.put(`${backendUrl}/api/review/edit-review/${editingReviewId}`, {
          rating: Number(rating),
          reviewText,
        }, { headers: { token } });
      } else {
        await axios.post(`${backendUrl}/api/review/add-review`, {
          bookId,
          rating: Number(rating),
          reviewText,
        }, { headers: { token } });
      }
      setRating('');
      setReviewText('');
      setEditingReviewId(null);
      refreshReviews();
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${backendUrl}/api/review/delete-review/${reviewId}`, {
        headers: { token }
      });
      refreshReviews();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

  return bookinfo && (
    <>
      {/* Book Info Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="w-full sm:max-w-72 rounded-lg" src={bookinfo.image} alt={bookinfo.title} />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 bg-white text-black mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
            Title: {bookinfo.title}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xl mt-1 text-gray-900">
            <p>Author: {bookinfo.author}</p>
            <button className="py-1 px-6 border bg-black text-white text-sm rounded-full">Genre: {bookinfo.genre}</button>
            <button className="py-1 px-6 border bg-black text-white text-sm rounded-full">Published Year: {bookinfo.year}</button>
            <button className="py-1 px-6 border bg-black text-white text-sm rounded-full">
              Published By: {bookinfo.addedBy?.name || 'Unknown Publisher'}
            </button>
            <button onClick={() => toggleFavorite(bookinfo._id)}
              className={`py-1 px-6 border text-white text-base rounded-full ${favorites.includes(bookinfo._id) ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {favorites.includes(bookinfo._id) ? 'Remove from Favourites' : 'Add to Favourites'}
            </button>
          </div>
          <div className="mt-3">
            <p className="flex items-center gap-1 text-lg font-medium">Description: <img src={assets.info_icon} alt="Info" /></p>
            <div className="text-lg mt-3 max-w-full h-60 overflow-y-auto pr-2">{bookinfo.description}</div>
          </div>
        </div>
      </div>

      {/* Reviews + Star Graph Side-by-Side */}
      <div className="mt-10 px-4 sm:px-6 flex flex-col lg:flex-row gap-8">
        {/* Left: Reviews */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">User Reviews</h3>
          {reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedReviews.map((review) => (
                  <div key={review._id} className="border p-4 rounded-md bg-gray-50">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-base text-gray-700">{review.reviewText}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      By: {review.userId?.name}
                      {review.userId?._id === userData?._id && (
                        <span className="text-green-600 ml-2">(You)</span>
                      )}
                    </p>
                    {review.userId?._id === userData?._id && (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => {
                          setEditingReviewId(review._id);
                          setRating(review.rating);
                          setReviewText(review.reviewText);
                        }} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(review._id)} className="text-red-600 hover:underline">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {reviews.length > 3 && (
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/book/${bookId}/reviews`)}
                    className="text-[#5f6FFF] font-medium hover:underline">
                    See All Reviews &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Right: Star Graph */}
        <div className="w-full lg:w-[400px]">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              return (
                <div key={star} className="flex items-center gap-4">
                  <div className="flex gap-1 min-w-[100px]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < star ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded h-4 relative">
                    <div
                      className="bg-[#5f6FFF] h-4 rounded"
                      style={{ width: `${(count / reviews.length) * 100 || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700 min-w-[30px] text-right">{count}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-lg font-medium text-gray-900">Average Rating: ⭐ {average}</p>
        </div>
      </div>

      {/* Write a Review */}
      <div className="mt-10 px-4 sm:px-6 border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              placeholder="Rating (1-5)"
              onChange={(e) => setRating(e.target.value)}
              className="w-40 border border-zinc-600 rounded-md px-3 py-2 text-center"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Enter a number from 1 to 5</p>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-base font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 50) {
                  setReviewText(e.target.value);
                }
              }}
              className="w-full border border-zinc-600 rounded-md px-3 py-2"
              rows="4"
              placeholder="Write Your Review Here....... (Max 50 words)"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {reviewText.trim().split(/\s+/).filter(Boolean).length}/50 words
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              {editingReviewId ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Book;