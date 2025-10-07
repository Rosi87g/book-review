import React, { useContext, useState, useEffect } from 'react';
import { PublisherContext } from '../context/PublisherContext';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { aToken, setAToken } = useContext(PublisherContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showLogoutConfirm ? 'hidden' : 'auto';
  }, [showLogoutConfirm]);

  const confirmLogout = () => {
    setAToken('');
    localStorage.removeItem('aToken');
    toast.success('Logged out successfully');
    navigate('/publisher-login');
  };

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white relative'>
      {/* Left: Logo + Label */}
      <div className='flex items-center gap-2 text-xs'>
        <img
          onClick={() => navigate('/publisher-dashboard')}
          className='w-48 sm:w-48 cursor-pointer'
          src={assets.logoblack}
          alt="Logo"
        />
        <p className='border px-2.5 py-1 rounded-full border-gray-700 text-gray-600 text-base'>
          Publisher Dashboard
        </p>
      </div>

      {/* Right: Logout Button */}
      <button
        onClick={() => setShowLogoutConfirm(true)}
        className='bg-black text-white text-base px-10 py-2 rounded-full'
      >
        Logout
      </button>

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