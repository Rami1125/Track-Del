// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // קובץ CSS גלובלי, אם קיים
import App from './App'; // ייבוא הקומפוננטה הראשית שלך

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
