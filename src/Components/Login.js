// src/components/LoginPage.js
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../css/LoginButton.css'; // CSS import

const LoginPage = ({ setAccessToken }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = async ({ access_token }) => {
    console.log('Login Success:', access_token);
    setAccessToken(access_token); // Save the access token in the parent state
    navigate('/senders'); // Redirect to the senders list page after login
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginFailure,
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  });

  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={login} className="custom-login-button">
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
