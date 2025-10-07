import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PublisherContext } from '../../context/PublisherContext';

const EditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { aToken, backendUrl } = useContext(PublisherContext);

  const [bookData, setBookData] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/book/${bookId}`, {
          headers: { aToken },
        });
        if (data.success) {
          setBookData(data.book);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch book details");
      }
    };
    fetchBook();
  }, [bookId, aToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('bookId', bookId);
      formData.append('title', bookData.title);
      formData.append('author', bookData.author);
      formData.append('genre', bookData.genre);
      formData.append('year', bookData.year);
      formData.append('description', bookData.description);
      formData.append('publish', bookData.publish);
      if (newImage) formData.append('image', newImage);

      const { data } = await axios.post(`${backendUrl}/api/admin/update-book`, formData, {
        headers: { aToken },
      });

      if (data.success) {
        toast.success("Book updated successfully");
        navigate('/my-bookslist');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this book?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-book/${bookId}`, {
        headers: { aToken },
      });

      if (data.success) {
        toast.success("Book deleted successfully");
        navigate('/my-bookslist');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return bookData ? (
    <form
      onSubmit={handleUpdate}
      className="w-full max-w-screen-xl mx-auto p-8 bg-white shadow-lg rounded-lg"
    >
      {/* Image Preview */}
      <div className="mb-6 text-center">
        {bookData.image && (
          <img src={bookData.image} className="mx-auto h-48 object-cover rounded" />
        )}
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={bookData.title}
            onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Author</label>
          <input
            type="text"
            value={bookData.author}
            onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Genre</label>
          <input
            type="text"
            value={bookData.genre}
            onChange={(e) => setBookData({ ...bookData, genre: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Published Year</label>
          <input
            type="number"
            value={bookData.year}
            onChange={(e) => setBookData({ ...bookData, year: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Published By</label>
          <input
            type="text"
            value={bookData.addedBy?.name || 'Unknown Publisher'}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Publish</label>
          <select
            value={bookData.publish}
            onChange={(e) => setBookData({ ...bookData, publish: e.target.value === 'true' })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>

        <div className="col-span-1 sm:col-span-2 md:col-span-4">
          <label className="block font-medium mb-1">Replace Cover Image</label>
          <input
            type="file"
            onChange={(e) => setNewImage(e.target.files[0])}
            className="w-full"
          />
        </div>
      </div>

      {/* Description Full Width */}
      <div className="mt-6">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={bookData.description}
          onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
          rows={6}
          className="w-full border px-3 py-2 rounded resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Book"}
        </button>
      </div>

      {/* Delete Button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 transition"
        >
          {loading ? "Deleting..." : "Delete Book Permanently"}
        </button>
      </div>
    </form>
  ) : (
    <p className="text-center mt-10 text-gray-500">Loading book details...</p>
  );
};

export default EditBook;