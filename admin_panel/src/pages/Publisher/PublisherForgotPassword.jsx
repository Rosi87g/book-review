import React, { useState, useContext } from 'react';
import { PublisherContext } from '../../context/PublisherContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PublisherForgotPassword = () => {
  const { backendUrl } = useContext(PublisherContext);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/publisher/request-reset`, { email });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center pt-20 px-4'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 p-8 w-full max-w-md border rounded-xl shadow-2xl bg-white'>
        <h2 className='text-xl font-semibold'>Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className='border border-zinc-300 rounded w-full p-2 mt-1' required />
        <button type="submit" className='bg-black text-white w-full py-2 rounded-md'>Send Reset Link</button>
      </form>
    </div>
  );
};

export default PublisherForgotPassword;