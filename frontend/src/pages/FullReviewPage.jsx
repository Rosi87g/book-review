import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const FullReviewPage = () => {
  const { bookId } = useParams();
  const { fetchBookReviews, userData } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const data = await fetchBookReviews(bookId);
      setReviews(data);
    };
    loadReviews();
  }, [bookId]);

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6">All Reviews</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {reviews.map((review) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullReviewPage;