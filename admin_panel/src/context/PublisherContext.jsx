import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const PublisherContext = createContext();

const PublisherContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [publisherName, setPublisherName] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [bookslist, setBooksList] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // 🔍 Fetch publisher profile
  const fetchPublisherProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/profile`, {}, {
        headers: { aToken }
      });
      if (data.success) {
        setPublisherName(data.publisher.name || '');
        setPublisherId(data.publisher.publisherId || '');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch publisher profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchPublisherProfile();
    }
  }, [aToken]);

  // 📚 Fetch all books
  const getAllBooksList = async () => {
    setLoadingBooks(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/all-booksList`, {}, {
        headers: { aToken }
      });

      if (data.success) {
        setBooksList(data.books || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingBooks(false);
    }
  };

  // 🔐 Logout publisher
  const logoutPublisher = () => {
    setAToken('');
    setPublisherName('');
    setPublisherId('');
    setBooksList([]);
    localStorage.removeItem('aToken');
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    publisherName,
    setPublisherName,
    publisherId,
    setPublisherId,
    bookslist,
    getAllBooksList,
    loadingBooks,
    loadingProfile,
    logoutPublisher
  };

  return (
    <PublisherContext.Provider value={value}>
      {children}
    </PublisherContext.Provider>
  );
};

export default PublisherContextProvider;