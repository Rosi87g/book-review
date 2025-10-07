// components/MyBooksList.jsx
import React, { useContext, useEffect } from 'react';
import { PublisherContext } from '../../context/PublisherContext';
import { useNavigate } from 'react-router-dom';

const MyBooksList = () => {
  const { bookslist, aToken, getAllBooksList, loadingBooks } = useContext(PublisherContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllBooksList();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-2xl text-center font-medium">📚 My Published Books</h1>

      {loadingBooks ? (
        <p className="text-gray-500">Loading books...</p>
      ) : (
        <div className="w-full flex flex-wrap gap-7 pt-5 gap-y-6">
          {Array.isArray(bookslist) && bookslist.length > 0 ? (
            bookslist.map((item, index) => (
              <div className='border border-indigo-200 rounded-xl max-w-722 overflow-hidden cursor-pointer group' key={index}>
                <img className='w-60 h-72 object-cover primary-transition-all duration-500' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>Title: {item.title}</p>
                  <p className='text-neutral-800 text-base font-medium'>Author: {item.author}</p>
                  <p className='text-neutral-800 text-base font-medium'>Genre: {item.genre}</p>
                  <p className='text-neutral-800 text-base font-medium'>
                    Published by: {item.addedBy?.name || 'Unknown Publisher'} {/* ✅ Updated */}
                  </p>

                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => navigate(`/edit-book/${item._id}`)}
                      className="bg-[#5f6FFF] text-sm sm:text-base text-white font-medium px-6 py-3 rounded-full hover:scale-105 transition-all"
                    >✏️ Edit </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No books found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBooksList;