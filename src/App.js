  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebRTC from './Components/webRTC';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/webrtc" element={<WebRTC />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
