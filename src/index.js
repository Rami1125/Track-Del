import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ייבוא קובץ ה-CSS הגלובלי שלנו
import App from './App'; // ייבוא רכיב האפליקציה הראשי שלנו
import reportWebVitals from './reportWebVitals';

// יצירת Root של React 18 עבור האפליקציה
// זוהי הדרך המומלצת ב-React 18 לניהול ה-root של עץ הרכיבים
const root = ReactDOM.createRoot(document.getElementById('root'));

// רינדור רכיב ה-App לתוך ה-DOM
// <React.StrictMode> עוזר לאתר בעיות פוטנציאליות באפליקציה בזמן הפיתוח
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// אם ברצונך להתחיל למדוד את הביצועים באפליקציה שלך,
// שלח פונקציה כדי לרשום תוצאות (לדוגמה: console.log)
// או שלח לנקודת קצה אנליטית. למד עוד: https://bit.ly/CRA-vitals
reportWebVitals();
