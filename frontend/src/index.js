
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/* ❌ This is invalid inside a .css file */
import '@fortawesome/fontawesome-free/css/all.min.css';
import "animate.css";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

