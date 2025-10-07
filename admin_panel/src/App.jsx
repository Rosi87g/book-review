import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PublisherContext } from './context/PublisherContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Publisher/Dashboard';
import MyBooksList from './pages/Publisher/MyBooksList';
import AddBook from './pages/Publisher/AddBook';
import EditBook from './pages/Publisher/EditBook';
import ReviewInsights from './pages/Publisher/ReviewInsights';
import PublisherForgotPassword from './pages/Publisher/PublisherForgotPassword';
import PublisherResetPassword from './pages/Publisher/PublisherResetPassword';
import RecoverPublisherId from './pages/Publisher/RecoverPublisherId';
import VerifyPublisher from './pages/Publisher/VerifyPublisher';

const App = () => {
  const { aToken } = useContext(PublisherContext);

  return (
    <div>
      <ToastContainer />
      {aToken ? (
        <>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar />
            <Routes>
              <Route path='/' element={<></>} />
              <Route path="/publisher-login" element={<Login />} />
              <Route path='/publisher-dashboard' element={<Dashboard />} />
              <Route path='/my-bookslist' element={<MyBooksList />} />
              <Route path='/add-book' element={<AddBook />} />
              <Route path="/edit-book/:bookId" element={<EditBook />} />
              <Route path="/publisher/review-insights" element={<ReviewInsights />} />
              <Route path="/publisher/forgot-password" element={<PublisherForgotPassword />} />
              <Route path="/publisher/:token" element={<PublisherResetPassword />} />
              <Route path="/publisher/recover-id" element={<RecoverPublisherId />} />
              <Route path="/publisher/verify/:token" element={<VerifyPublisher />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path='*' element={<Login />} />
        </Routes>
      )}
    </div>
  );
};

export default App;