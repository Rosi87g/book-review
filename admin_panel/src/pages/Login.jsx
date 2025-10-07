import React, { useState, useContext, useEffect } from 'react';
import { PublisherContext } from '../context/PublisherContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
  const { backendUrl, aToken, setAToken } = useContext(PublisherContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [publisherId, setPublisherId] = useState('');

  useEffect(() => {
    if (location.state?.redirectToLogin) {
      setState('Login');
    }
  }, [location.state]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const endpoint = state === 'Sign Up' ? '/api/admin/signup' : '/api/admin/login';
      const payload =
        state === 'Sign Up'
          ? { name, email, password }
          : { email, password, publisherId };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success && data.token) {
        localStorage.setItem('aToken', data.token);
        setAToken(data.token);
        toast.success(`${state} successful`);
        navigate('/publisher-dashboard');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message || 'Server error');
    }
  };

  useEffect(() => {
    if (aToken) {
      navigate('/publisher-dashboard');
    }
  }, [aToken]);

  return (
    <div className='min-h-screen flex items-center justify-center pt-20 px-4'>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-3 p-8 w-full max-w-md border rounded-xl shadow-2xl bg-white'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Publisher Sign Up" : "Publisher Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to manage your books</p>

        {state === "Sign Up" && (
          <>
            <label>Publisher Name:</label>
            <input className='border border-zinc-300 rounded w-full p-2' type="text" onChange={(e) => setName(e.target.value)} value={name} required />
          </>
        )}

        <label>Email:</label>
        <input className='border border-zinc-300 rounded w-full p-2' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />

        <label>Password:</label>
        <input className='border border-zinc-300 rounded w-full p-2' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />

        {state === "Login" && (
          <>
            <label>Publisher ID:</label>
            <input className='border border-zinc-300 rounded w-full p-2' type="text" onChange={(e) => setPublisherId(e.target.value)} value={publisherId} required />
          </>
        )}

        <button type='submit' className='bg-black text-white w-full py-2 rounded-md'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>Already have an account? <span onClick={() => setState('Login')} className='text-blue-600 underline cursor-pointer'>Login here</span></p>
        ) : (
          <>
            <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-blue-600 underline cursor-pointer'>Click here</span></p>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;