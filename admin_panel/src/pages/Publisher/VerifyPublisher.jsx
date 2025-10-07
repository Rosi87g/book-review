import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Login from '../Login';

const VerifyPublisher = () => {
    const { token } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/admin/verify/${token}`);
                toast.success("Registration successful! Check your email for your Publisher ID.");
                setTimeout(() => {
                    navigate('/publisher-login', { state: { redirectToLogin: true } });
                }, 1500);
                setVerified(true);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Verification failed');
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [token]);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center pt-20 px-4'>
                <p className='text-lg font-medium'>Verifying your account...</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center pt-20 px-4'>
            {verified ? (
                <Login />
            ) : (
                <p className='text-lg font-medium text-red-600'>Verification failed. Please try again or contact support.</p>
            )}
        </div>
    );
};

export default VerifyPublisher;