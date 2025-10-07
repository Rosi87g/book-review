import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Login from './pages/Login'
import MyProfile from './pages/Myprofile'
import AllBooks from './pages/All Books'
import Book from './pages/Book'
import Navbar from './components/Navbar/Navbar'
import About from './pages/About'
import Footer from './components/Navbar/Footer'
import Favorites from './pages/Favourites'
import FullReviewPage from './pages/FullReviewPage';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[5%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/my-profile' element={<MyProfile />} />

        <Route path='/Allbooks' element={<AllBooks />} />
        <Route path='/book/:bookId' element={<Book />} />
        <Route path="/book/:bookId/reviews" element={<FullReviewPage />} />

        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/reset/:token" element={<ResetPassword />} />

        <Route path='/about' element={<About />} />
        <Route path='/favourites' element={<Favorites />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
