import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (location.state?.redirectToLogin) {
      setState('Login');
    }
  }, [location.state]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const endpoint = state === 'Sign Up' ? '/api/user/register' : '/api/user/login';
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

      const { data } = await axios.post(backendUrl + endpoint, payload);

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success(`${state} successful`);
        navigate('/');
      } else if (data.success && !data.token) {
        toast.info(data.message || 'Please verify your email before logging in');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.info(error.response.data.message || 'Email not verified');
      } else {
        toast.error(error.message || 'Server error');
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <div className='pb-20 min-h-screen flex items-center justify-center px-4'>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-3 p-8 w-full max-w-md border rounded-xl shadow-2xl bg-white'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to view the website</p>

        {state === "Sign Up" && (
          <div className='w-full'>
            <p>Full Name:</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email:</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password:</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button type='submit' className='bg-black text-white w-full py-2 rounded-md text-base'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setState('Login')} className='text-neutral underline cursor-pointer'>
              Login here
            </span>
          </p>
        ) : (
          <>
            <p>
              Create a new account?{" "}
              <span onClick={() => setState('Sign Up')} className='text-neutral underline cursor-pointer'>
                Click here
              </span>
            </p>
  
          </>
        )}
      </form>
    </div>
  );
};

export default Login;