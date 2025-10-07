import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublisherContext } from '../../context/PublisherContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PublisherResetPassword = () => {
  const { token } = useParams();
  const { backendUrl } = useContext(PublisherContext);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/reset/${token}`, { newPassword });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center pt-20 px-4'>
      <form onSubmit={handleReset} className='flex flex-col gap-3 p-8 w-full max-w-md border rounded-xl shadow-2xl bg-white'>
        <h2 className='text-xl font-semibold'>Reset Password</h2>
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='border border-zinc-300 rounded w-full p-2 mt-1' required />
        <button type="submit" className='bg-black text-white w-full py-2 rounded-md'>Reset Password</button>
      </form>
    </div>
  );
};

export default PublisherResetPassword;