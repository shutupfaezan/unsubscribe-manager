// src/components/GoogleAuthProviderWrapper.js
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './Login';

const GoogleAuthProviderWrapper = ({ setAccessToken }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Login setAccessToken={setAccessToken} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProviderWrapper;