// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAuthProviderWrapper from './Components/GoogleAuthProviderWrapper';
import SendersListPage from './Components/SendersList';

function App() {
  const [accessToken, setAccessToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleAuthProviderWrapper setAccessToken={setAccessToken} />}
        />
        <Route path="/senders" element={<SendersListPage accessToken={accessToken} />}/>
      </Routes>
    </Router>
  );
}

export default App;
