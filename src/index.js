import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "mapbox-gl/dist/mapbox-gl.css";
import "flag-icons/css/flag-icons.min.css";
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
