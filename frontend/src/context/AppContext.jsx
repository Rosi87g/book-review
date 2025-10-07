import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [bookslist, setBooksList] = useState();
  const [favorites, setFavorites] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  // 🔹 Load User Profile
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // 🔹 Load Favourites
  const loadFavourites = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-favourites`, {
        headers: { token },
      });
      if (data.success) {
        setFavorites(data.favourites.map(book => book._id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load favourites");
    }
  };

  // 🔹 Toggle Favourite
  const toggleFavorite = async (bookId) => {
    if (!token) return;
    try {
      const isFav = favorites.includes(bookId);
      const url = `${backendUrl}/api/user/${isFav ? "remove-favourite" : "add-favourite"}`;
      const { data } = await axios.post(url, { bookId }, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        setFavorites((prev) =>
          isFav ? prev.filter((id) => id !== bookId) : [...prev, bookId]
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update favourites");
    }
  };

  // 🔹 Load All Books
  const getBooksData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/book/list`);
      if (data.success) {
        setBooksList(data.bookslist);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // 🔹 Fetch Reviews for a Book
  const fetchBookReviews = async (bookId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/review/book/${bookId}`);
      return data.reviews;
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      return [];
    }
  };

  // 🔹 Fetch Average Rating for a Book
  const fetchAverageRating = async (bookId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/review/average/${bookId}`);
      return data.average;
    } catch (error) {
      console.error("Failed to fetch average rating", error);
      return 0;
    }
  };

  // 🔹 Submit Review
  const submitReview = async (bookId, rating, reviewText) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/review/add`, {
        bookId,
        rating,
        reviewText,
      }, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        return data.review;
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("submitReview error:", error);
      toast.error("Error submitting review");
    }
  };

  // 🔹 Edit Review
  const editReview = async (reviewId, rating, reviewText) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/review/edit/${reviewId}`, {
        rating,
        reviewText,
      }, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        return data.review;
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("editReview error:", error);
      toast.error("Error updating review");
    }
  };

  // 🔹 Delete Review
  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/review/delete/${reviewId}`, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("deleteReview error:", error);
      toast.error("Error deleting review");
    }
  };

  // 🔁 Resend Verification Email
  const resendVerificationEmail = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/resend-verification`, {}, {
        headers: { token },
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("resendVerificationEmail error:", error);
      toast.error("Failed to resend verification email");
    }
  };

  // 🔐 Change Password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/change-password`, {
        oldPassword,
        newPassword,
      }, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("changePassword error:", error);
      toast.error("Failed to change password");
    }
  };

  // 🔹 Token Sync
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // 🔹 Initial Load
  useEffect(() => {
    getBooksData();
  }, []);

  // 🔹 Load User + Favourites on Token Change
  useEffect(() => {
    if (token) {
      loadUserProfileData();
      loadFavourites();
    } else {
      setUserData(false);
      setFavorites([]);
    }
  }, [token]);

  // 🔹 Context Value
  const value = {
    backendUrl,
    token, setToken,
    userData, setUserData,
    bookslist,
    favorites, toggleFavorite,
    loadUserProfileData,
    loadFavourites,
    fetchBookReviews,
    fetchAverageRating,
    submitReview,
    editReview,
    deleteReview,
    resendVerificationEmail,
    changePassword
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;