import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleCallback({ onLogin }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const userName = searchParams.get('user');

        console.log('GoogleCallback URL Params:', { token, userName });

        if (token) {
            console.log('Token found. Saving to localStorage...');
            localStorage.setItem('token', token);
            if (userName) {
                localStorage.setItem('user', userName);
            }

            // Verify storage
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                console.error('CRITICAL: Token not saved to localStorage!');
                return;
            }

            console.log('Token saved successfully. Updating auth state...');
            onLogin();

            // Short delay to ensure state updates before navigation
            setTimeout(() => {
                console.log('Navigating to dashboard...');
                navigate('/dashboard');
            }, 500);
        } else {
            console.error('No token found in URL');
            // navigate('/login'); // Comment out for debugging if needed
        }
    }, [searchParams, navigate, onLogin]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            color: '#fff'
        }}>
            <h2>Completing Login...</h2>
        </div>
    );
}
