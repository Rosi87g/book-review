import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import dropdown from '../../assets/dropdown_icon.svg';
import logoBlack from '../../assets/LogoBlack.png';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';


const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showLogoutConfirm ? 'hidden' : 'auto';
  }, [showLogoutConfirm]);

  const confirmLogout = () => {
    setToken(false);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className='flex items-center justify-between text-base py-4 mb-5 border-b border-b-gray-400 relative'>
      <NavLink to='/'><img className='w-48 cursor-pointer' src={logoBlack} alt="Logo" /></NavLink>

      {/* Desktop Nav */}
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'border-b-2 border-black pb-1' : 'pb-1'}>
          <li>Home</li>
        </NavLink>
        <NavLink to='/Allbooks' className={({ isActive }) => isActive ? 'border-b-2 border-black pb-1' : 'pb-1'}>
          <li>ALL BOOKS</li>
        </NavLink>
        <NavLink to='/favourites' className={({ isActive }) => isActive ? 'border-b-2 border-black pb-1' : 'pb-1'}>
          <li>MY FAVOURITES</li>
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => isActive ? 'border-b-2 border-black pb-1' : 'pb-1'}>
          <li>ABOUT</li>
        </NavLink>
      </ul>

      {/* Right Side */}
      <div className='flex items-center gap-4'>
        {token && userData ? (
          <>
            {/* Desktop Only Add Book Button */}
            <NavLink onClick={() => window.open('http://localhost:5180/add-book', '_blank')} className="hidden md:block">
              <button className="bg-[#5f6FFF] text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-all">
                Publisher Login/Add Book
              </button>
            </NavLink>

            {/* Profile Dropdown */}
            <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-12 rounded-full' src={userData.image} alt="Profile" />
              <img className='w-2.5' src={dropdown} alt="Dropdown" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-black z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-black text-white rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('favourites')} className='hover:text-stone-500 cursor-pointer'>My Favourites</p>
                  <p onClick={() => navigate('my-profile')} className='hover:text-stone-500 cursor-pointer'>My Profile</p>
                  <p onClick={() => setShowLogoutConfirm(true)} className='hover:text-stone-500 cursor-pointer'>Log out</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className='bg-black text-white px-8 py-3 rounded-full font-light hidden md:block'>
            Create Account / Login
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img onClick={() => setShowMenu(true)} className='cursor-pointer w-6 md:hidden' src={assets.menu_icon} alt="Menu" />

        {/* Mobile Menu */}
        <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='cursor-pointer w-48' src={logoBlack} alt="Logo" />
            <img className='cursor-pointer w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-2 rounded inline-block ${isActive ? 'bg-black text-white' : 'text-black'}`}>Home</NavLink>
            <NavLink to="/Allbooks" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-2 rounded inline-block ${isActive ? 'bg-black text-white' : 'text-black'}`}>All Books</NavLink>
            <NavLink to="/favourites" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-2 rounded inline-block ${isActive ? 'bg-black text-white' : 'text-black'}`}>My Favourites</NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)} className={({ isActive }) => `px-4 py-2 rounded inline-block ${isActive ? 'bg-black text-white' : 'text-black'}`}>About Us</NavLink>

            {/* Mobile Menu Add Book Button */}
            {token && (
              <button
                onClick={() => {
                  setShowMenu(false);
                  window.open('http://localhost:5180/add-book', '_blank');
                }}
                className='mt-2 bg-[#5f6FFF] text-white px-6 py-2 rounded w-full text-center'
              >
                Publisher Login/Add Book
              </button>
            )}

            {/* Auth Button */}
            {token ? (
              <button onClick={() => setShowLogoutConfirm(true)} className='mt-4 bg-black text-white px-6 py-2 rounded'>Log Out</button>
            ) : (
              <NavLink to="/login" onClick={() => setShowMenu(false)} className='mt-4 bg-black text-white px-6 py-2 rounded'>Login</NavLink>
            )}
          </ul>
        </div>
      </div>

      {/* Logout Confirmation Prompt */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  confirmLogout();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                OK
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;