import React, { useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { PublisherContext } from '../../context/PublisherContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddBook = () => {
  const [bookImg, setBookImg] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [publish, setPublish] = useState(true);

  const { backendUrl, aToken, publisherName } = useContext(PublisherContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!bookImg) {
        return toast.error('Image Not Selected');
      }

      const formData = new FormData();
      formData.append('image', bookImg);
      formData.append('title', title);
      formData.append('author', author);
      formData.append('genre', genre);
      formData.append('year', year);
      formData.append('description', description);
      formData.append('publish', publish);

      const { data } = await axios.post(`${backendUrl}/api/admin/add-book`, formData, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(data.message);
        setBookImg(false);
        setTitle('');
        setAuthor('');
        setGenre('');
        setYear('');
        setDescription('');
        setPublish(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-4 text-xl text-center font-medium text-neutral">Add Your Book for Publishing</p>

      <div className="bg-white px-8 py-8 border border-zinc-400 shadow-lg rounded w-full max-h-[80vh] overflow-y-scroll">
        {/* Upload Section */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="book-img">
            <img
              className="w-20 bg-gray-100 rounded-full cursor-pointer"
              src={bookImg ? URL.createObjectURL(bookImg) : assets.upload_area}
            />
          </label>
          <input onChange={(e) => setBookImg(e.target.files[0])} name="image" type="file" id="book-img" hidden />
          <p>Upload the Book image</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-600 mb-8">
          <div className="flex flex-col gap-2">
            <label className='text-lg font-medium'>Title:</label>
            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder="Enter Book Title..." required className="border border-zinc-600 shadow-md px-3 py-2 rounded" />
          </div>

          <div className="flex flex-col gap-2">
            <label className='text-lg font-medium'>Author:</label>
            <input onChange={(e) => setAuthor(e.target.value)} value={author} type="text" placeholder="Enter Author Name..." required className="border border-zinc-600 shadow-md px-3 py-2 rounded" />
          </div>

          <div className="flex flex-col gap-2">
            <label className='text-lg font-medium'>Genre:</label>
            <input onChange={(e) => setGenre(e.target.value)} value={genre} type="text" placeholder="Enter Genre (Like Sci-Fi, Romance)..." required className="border border-zinc-600 shadow-md px-3 py-2 rounded" />
          </div>

          <div className="flex flex-col gap-2">
            <label className='text-lg font-medium'>Published Year:</label>
            <input onChange={(e) => setYear(e.target.value)} value={year} type="number" placeholder="Enter Published Year..." required className="border border-zinc-600 shadow-md px-3 py-2 rounded" />
          </div>

          <div className="flex flex-col gap-2 lg:col-span-1">
            <label className='text-lg font-medium'>Published by:</label>
            <input
              type="text"
              value={publisherName || 'Unknown Publisher'}
              disabled
              className="border border-zinc-600 shadow-md px-3 py-2 rounded bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-2 lg:col-span-1">
            <label className='text-lg font-medium'>Publish Status:</label>
            <select value={publish ? 'true' : 'false'} onChange={(e) => setPublish(e.target.value === 'true')} className="border border-zinc-600 shadow-md px-3 py-2 rounded">
              <option value="true">Publish</option>
              <option value="false">Unpublish</option>
            </select>
          </div>
        </div>

        {/* Description Section */}
        <div className="flex flex-col gap-2 text-gray-600 mb-8">
          <label className='text-lg font-medium'>Description:</label>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Write the Story Overview Here." rows={5} required className="border border-zinc-600 shadow-md px-3 py-2 rounded resize-none" />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-black px-10 py-3 mt-4 text-white rounded-full">Add Book</button>
      </div>
    </form>
  );
};

export default AddBook;