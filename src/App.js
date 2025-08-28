import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Assets and Data (Mocked for Client-side) ---
// נתוני משתמשים מדומים: לקוחות, נהגים, מנהלים
const mockUsers = {
    'client1': { id: 'C1', username: 'client1', password: '123', role: 'לקוח', name: 'משה כהן', avatar: 'https://placehold.co/96x96/60A5FA/FFFFFF?text=MC' },
    'client2': { id: 'C2', username: 'client2', password: '456', role: 'לקוח', name: 'שרה לוי', avatar: 'https://placehold.co/96x96/818CF8/FFFFFF?text=SL' },
    'driver1': { id: 'D1', username: 'driver1', password: '789', role: 'נהג', name: 'יוסי הנהג', avatar: 'https://placehold.co/96x96/4CAF50/FFFFFF?text=YH' },
    'admin1': { id: 'A1', username: 'admin1', password: 'abc', role: 'מנהל', name: 'אנה המנהלת', avatar: 'https://placehold.co/96x96/FFC107/FFFFFF?text=AM' },
};

// רשימת ערים מדומות לבחירת מוצא ויעד
const mockCities = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'נתניה', 'רמת גן', 'פתח תקווה', 'ראשון לציון'];

// קטלוג סוגי מטען מדומים
const mockCargoCatalog = [
    { name: 'ריהוט וקרטונים', type: 'הובלת דירה', weightCapacity: 1000, volumeCapacity: 15 },
    { name: 'ציוד משרדי', type: 'הובלה מסחרית', weightCapacity: 500, volumeCapacity: 8 },
    { name: 'מכשירי חשמל', type: 'הובלה מסחרית', weightCapacity: 300, volumeCapacity: 5 },
    { name: 'מטענים קטנים', type: 'הובלת חבילות', weightCapacity: 100, volumeCapacity: 2 },
    { name: 'מזון בקירור', type: 'הובלה בקירור', weightCapacity: 800, volumeCapacity: 10 },
    { name: 'פסולת בניין', type: 'פינוי פסולת', weightCapacity: 2000, volumeCapacity: 20 },
];

// סוגי רכבים מדומים ותכולתם
const mockVehicleTypes = [
    { name: 'משאית קלה', cargoTypes: ['ריהוט וקרטונים', 'ציוד משרדי', 'מטענים קטנים'], weightLimit: 1000, volumeLimit: 10 },
    { name: 'משאית בינונית', cargoTypes: ['ריהוט וקרטונים', 'ציוד משרדי', 'מכשירי חשמל', 'מזון בקירור'], weightLimit: 2000, volumeLimit: 20 },
    { name: 'משאית כבדה', cargoTypes: ['ריהוט וקרטונים', 'פסולת בניין'], weightLimit: 5000, volumeLimit: 30 },
    { name: 'משאית קירור', cargoTypes: ['מזון בקירור'], weightLimit: 1500, volumeLimit: 15 },
    { name: 'טנדר', cargoTypes: ['מטענים קטנים'], weightLimit: 500, volumeLimit: 5 },
];

// נתוני נהגים מדומים לצורך התאמה
const mockDrivers = [
    { id: 'D1', name: 'הובלות אקספרס', truckType: 'משאית בינונית', specialties: ['ריהוט וקרטונים', 'ציוד משרדי'], rating: 4.8, distance: 15, weightCapacity: 1800, volumeCapacity: 18, avatar: 'https://placehold.co/96x96/22C55E/FFFFFF?text=HE' },
    { id: 'D2', name: 'לוגיסטיקה בקירור', truckType: 'משאית קירור', specialties: ['מזון בקירור'], rating: 4.9, distance: 20, weightCapacity: 1400, volumeCapacity: 14, avatar: 'https://placehold.co/96x96/10B981/FFFFFF?text=LB' },
    { id: 'D3', name: 'מוביל העמק', truckType: 'טנדר', specialties: ['מטענים קטנים'], rating: 4.5, distance: 5, weightCapacity: 450, volumeCapacity: 4, avatar: 'https://placehold.co/96x96/F59E0B/FFFFFF?text=MH' },
    { id: 'D4', name: 'פסולת ופינוי', truckType: 'משאית כבדה', specialties: ['פסולת בניין'], rating: 4.7, distance: 25, weightCapacity: 4500, volumeCapacity: 28, avatar: 'https://placehold.co/96x96/EF4444/FFFFFF?text=PF' },
    { id: 'D5', name: 'אחים לדרך', truckType: 'משאית קלה', specialties: ['ריהוט וקרטונים'], rating: 4.6, distance: 10, weightCapacity: 900, volumeCapacity: 9, avatar: 'https://placehold.co/96x96/6366F1/FFFFFF?text=AL' },
];

// נתוני הזמנות מדומים - משתמשים ב-let כדי לאפשר עדכון דינמי בממשקים
let mockOrders = [
    { id: 'ORD001', customerId: 'C1', customerName: 'משה כהן', cargoType: 'ריהוט וקרטונים', status: 'בהמתנה למוביל', from: 'תל אביב', to: 'חיפה', driverId: null, driverName: null, date: '2024-08-25', time: '10:00' },
    { id: 'ORD002', customerId: 'C1', customerName: 'משה כהן', cargoType: 'ציוד משרדי', status: 'בטיפול', from: 'ירושלים', to: 'באר שבע', driverId: 'D1', driverName: 'הובלות אקספרס', date: '2024-08-26', time: '12:30' },
    { id: 'ORD003', customerId: 'C2', customerName: 'שרה לוי', cargoType: 'מזון בקירור', status: 'נמסר', from: 'נתניה', to: 'אשדוד', driverId: 'D2', driverName: 'לוגיסטיקה בקירור', date: '2024-08-27', time: '09:00' },
    { id: 'ORD004', customerId: 'C1', customerName: 'משה כהן', cargoType: 'מטענים קטנים', status: 'בדרך', from: 'פתח תקווה', to: 'רמת גן', driverId: 'D3', driverName: 'מוביל העמק', date: '2024-08-28', time: '14:00' },
    { id: 'ORD005', customerId: 'C2', customerName: 'שרה לוי', cargoType: 'פסולת בניין', status: 'הושלם', from: 'ראשון לציון', to: 'תל אביב', driverId: 'D4', driverName: 'פסולת ופינוי', date: '2024-08-24', time: '11:00' },
    { id: 'ORD006', customerId: 'D1', customerName: 'יוסי הנהג', cargoType: 'ריהוט וקרטונים', status: 'בהמתנה לאיסוף', from: 'אילת', to: 'באר שבע', driverId: 'D1', driverName: 'הובלות אקספרס', date: '2024-08-29', time: '16:00' },
];


// --- Custom Icons (Inline SVG) ---
// רכיבי אייקונים מותאמים אישית ב-SVG
const UserCircleIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.753 0-5.45-1.127-7.234-3.21a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>;
const LockClosedIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3 9V6.75a3.75 3.75 0 10-7.5 0v3a.75.75 0 011.5 0v-3a2.25 2.25 0 114.5 0v3a.75.75 0 011.5 0z" clipRule="evenodd" /></svg>;
const TruckIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.5 7.5a3 3 0 10-3-3 3 3 0 003 3zm6 0a3 3 0 10-3-3 3 3 0 003 3zm2.25 9.75c0 .72-.09 1.4-.26 2.05L16.5 21l-3-1.5-.75-.38V15h-1.5v4.5L12 21l-3-1.5-.75-.38V15H6.75v5.75L3 21l-.75-.38L2.25 18c0-.72.09-1.4.26-2.05H7.5V12h9v4.5H17.75zM12 9a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0v-2.5A.75.75 0 0012 9z" /></svg>;
const ArrowUpIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" clipRule="evenodd" /></svg>;
const ChatBubbleOvalLeftEllipsisIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.34-2.58 2.872-2.58 1.118 0 2.052.71 2.433 1.638.256.617.51 1.258.756 1.897a7.485 7.485 0 002.433 1.638c1.118 0 2.052.71 2.433 1.638.256.617.51 1.258.756 1.897a7.485 7.485 0 002.433 1.638 2.872 2.872 0 012.872 2.58v2.247c0 1.426-1.34 2.58-2.872 2.58-1.118 0-2.052-.71-2.433-1.638-.256-.617-.51-1.258-.756-1.897a7.485 7.485 0 00-2.433-1.638c-1.118 0-2.052-.71-2.433-1.638-.256-.617-.51-1.258-.756-1.897A7.485 7.485 0 006.096 17c-1.118 0-2.052-.71-2.433-1.638-.256-.617-.51-1.258-.756-1.897a7.485 7.485 0 00-2.433-1.638 2.872 2.872 0 01-2.872-2.58V5.653z" clipRule="evenodd" /></svg>;
const DocumentTextIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M19.5 7.5a3 3 0 00-3-3h-7.5a3 3 0 00-3 3v9a3 3 0 003 3h7.5a3 3 0 003-3v-9zm-3 2.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" clipRule="evenodd" /></svg>;
const HomeModernIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 4.06l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5zM12 3v7.5H4.5V19.5a3 3 0 003 3h9a3 3 0 003-3V10.5H12V3z" clipRule="evenodd" /></svg>;
const PhotoIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M1.5 6a3 3 0 013-3h15a3 3 0 013 3v12a3 3 0 01-3 3H4.5a3 3 0 01-3-3V6zm.75 3a.75.75 0 000 1.5h.007a.75.75 0 000-1.5H2.25zM15 6a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0V6zm-3.75 0a.75.75 0 00-1.5 0v9.75a.75.75 0 001.5 0V6zM8.25 6a.75.75 0 00-1.5 0v11.25a.75.75 0 001.5 0V6z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.538-1.693-1.694a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const WrenchScrewdriverIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.17.653l-.613 2.066A2.25 2.25 0 009.136 7.5h4.728a2.25 2.25 0 002.103-2.963l-.613-2.066a.75.75 0 01.17-.653l.9.9a.75.75 0 01.077 1.056l-1.574 1.573.018.018a.75.75 0 11-.994 1.12l-1.573-1.573-.018-.019a.75.75 0 01-1.056-.077l-.9-.9a.75.75 0 01-.17-.653zM8.25 11.25c0-.966.784-1.75 1.75-1.75h.5c.966 0 1.75.784 1.75 1.75v.5c0 .966-.784 1.75-1.75 1.75h-.5c-.966 0-1.75-.784-1.75-1.75v-.5zM12 15.75a.75.75 0 00-.75.75v2.25c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-2.25a.75.75 0 00-.75-.75h-.5z" clipRule="evenodd" /><path fillRule="evenodd" d="M12 1.5a.75.75 0 00-.75.75V3h1.5v-.75A.75.75 0 0012 1.5zm-5.25.75a.75.75 0 01.75-.75H7.5v1.5h-.75a.75.75 0 01-.75-.75zm10.5 0a.75.75 0 01-.75-.75H16.5v1.5h.75a.75.75 0 01.75.75zM12 18.75a.75.75 0 00-.75.75v2.25c0 .414.336.75.75.75h.5a.75.75 0 00.75-.75v-2.25a.75.75 0 00-.75-.75h-.5zm-5.25-.75a.75.75 0 01.75-.75H7.5v1.5h-.75a.75.75 0 01-.75-.75zm10.5 0a.75.75 0 01-.75-.75H16.5v1.5h.75a.75.75 0 01.75.75zM12 21.75a.75.75 0 00-.75.75v.75h1.5v-.75a.75.75 0 00-.75-.75z" clipRule="evenodd" /></svg>;
const RectangleStackIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.25 10.5a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zM15 10.5a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zM8.25 10.5a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zM3 14.25a3 3 0 013-3h12a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zM1.5 10.5a3 3 0 013-3h15a3 3 0 013 3v2.25a.75.75 0 01-1.5 0V14.25a1.5 1.5 0 00-1.5-1.5H4.5a1.5 1.5 0 00-1.5 1.5v-1.5a.75.75 0 01-1.5 0V10.5z" clipRule="evenodd" /></svg>;
const MapPinIcon = ({ className = "w-6 h-6" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.54 22.351A7.5 7.5 0 0118 1.5a6 6 0 00-6.46 20.851z" clipRule="evenodd" /><path fillRule="evenodd" d="M20.25 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" /></svg>;


// --- Shared Components (Toast & Modal) ---
// רכיב טוסט להצגת הודעות קופצות למשתמש
const Toast = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const typeClasses = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <motion.div
            className={`fixed top-4 left-4 rounded-md px-6 py-4 shadow-lg text-white font-medium ${typeClasses[type]} z-[9999]`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
            {message}
        </motion.div>
    );
};

// רכיב מודל (חלון קופץ) כללי
const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg w-full"
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">{title}</h2>
                        {children}
                        <button onClick={onClose} className="mt-6 text-gray-500 hover:text-gray-700 w-full">סגור</button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Login Screen Component ---
// רכיב מסך ההתחברות הראשוני
const LoginScreen = ({ onLogin, loginLoading, showToast }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        onLogin(username, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 sm:p-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md backdrop-blur-sm bg-opacity-70 border border-gray-700"
            >
                <div className="flex justify-center mb-6">
                    <TruckIcon className="w-20 h-20 text-blue-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-2 text-white">
                    ברוכים הבאים
                </h1>
                <p className="text-center text-sm mb-8 text-gray-400">
                    התחבר למערכת הזמנות ההובלה שלך
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <UserCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="username"
                            placeholder="שם משתמש"
                            required
                            className="w-full p-3 pr-10 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        />
                    </div>
                    <div className="relative">
                        <LockClosedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="סיסמה"
                            required
                            className="w-full p-3 pr-10 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                        {loginLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'התחברות'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

// --- Progress Stepper for Client App ---
// רכיב פס התקדמות עבור תהליך הזמנה של לקוח
const ProgressStepper = ({ currentStep, totalSteps = 2 }) => {
    const steps = ['פרטי הזמנה', 'בחירת מוביל'];
    const progressPercentage = ((currentStep - 1) / (totalSteps -1)) * 100;

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between mb-2 text-sm font-semibold">
                {steps.map((step, index) => (
                    <span
                        key={index}
                        className={`transition-colors duration-300 ${
                            index + 1 === currentStep ? 'text-blue-600 font-bold' :
                            index + 1 < currentStep ? 'text-green-600' :
                            'text-gray-500'
                        }`}
                    >
                        {step} {index + 1 < currentStep && <CheckCircleIcon className="inline-block w-4 h-4 mr-1" />}
                    </span>
                ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

// --- Driver Card for Client App ---
// רכיב כרטיס נהג המוצג ללקוח בבחירת מוביל
const DriverCard = ({ driver, onSelect, isSelected }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`bg-white p-4 rounded-xl shadow-md border-2 cursor-pointer transition-all duration-300 ${
            isSelected ? 'border-green-500 ring-4 ring-green-200' : 'border-gray-200 hover:shadow-lg hover:border-blue-300'
        }`}
        onClick={() => onSelect(driver)}
    >
        <div className="flex items-center mb-3">
            <img src={driver.avatar} alt={driver.name} className="w-12 h-12 rounded-full border-2 border-blue-400 ml-3" />
            <div>
                <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                <p className="text-sm text-gray-600">{driver.truckType}</p>
            </div>
        </div>
        <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">התמחות:</span>
            <span className="text-gray-600">{driver.specialties.join(', ')}</span>
        </div>
        <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium text-gray-700">דירוג:</span>
            <span className="text-yellow-500">{'⭐'.repeat(Math.floor(driver.rating))} ({driver.rating})</span>
        </div>
        <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">מרחק:</span>
            <span className="text-gray-600">{driver.distance} ק"מ</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <motion.div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${driver.matchScore}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${driver.matchScore}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <span className="text-xs text-blue-700 mt-1 block text-left">{driver.matchScore}% התאמה</span>
        </div>
    </motion.div>
);

// --- Client Dashboard Component ---
// רכיב לוח בקרה ומסך הזמנה עבור לקוחות
const ClientDashboard = ({ user, onLogout, showToast }) => {
    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true); // מודל קבלת פנים נפתח בטעינה ראשונית
    const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // שלב נוכחי בטופס (1: פרטי הזמנה, 2: בחירת מוביל)
    const [formData, setFormData] = useState({ // נתוני הטופס
        companyId: '',
        deliveryDetails: '',
        stopsCount: 1,
        transactionType: '',
        cargoType: '',
        weight: '',
        dimensions: '',
        escort: '',
        pictures: [],
        documents: [],
    });
    const [filteredDrivers, setFilteredDrivers] = useState([]); // נהגים מסוננים ומוצעים
    const [selectedDriver, setSelectedDriver] = useState(null); // נהג שנבחר
    const [formSubmitting, setFormSubmitting] = useState(false); // מצב שליחת טופס

    // מטפל בשינויים בשדות הטופס
    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // פונקציית עזר לחישוב מרחק (מדמה)
    const calculateDistance = (fromCity, toCity) => {
        const idx1 = mockCities.indexOf(fromCity);
        const idx2 = mockCities.indexOf(toCity);
        if (idx1 === -1 || idx2 === -1) return 50; // ברירת מחדל אם לא נמצא
        return Math.abs(idx1 - idx2) * 10 + 20; // חישוב מדמה
    };

    // מטפל במעבר לשלב הבא בטופס
    const handleNextStep = async () => {
        // ולידציה בסיסית לשלב 1
        if (currentStep === 1) {
            const { companyId, deliveryDetails, stopsCount, transactionType, cargoType, weight, dimensions, escort } = formData;
            if (!companyId || !deliveryDetails || !stopsCount || !transactionType || !cargoType || !weight || !dimensions || !escort) {
                showToast('אנא מלא את כל השדות הנדרשים בשלב זה.', 'error');
                return;
            }

            // מדמה העלאת קבצים ל-Google Drive
            showToast('מעלה קבצים ל-Google Drive (הדמיה)...', 'info');
            await new Promise(resolve => setTimeout(resolve, 1000)); // מדמה זמן העלאה

            // מדמה התאמת נהגים על בסיס נתוני ההזמנה
            const orderWeight = parseFloat(formData.weight);
            const orderVolume = (dimensions) => { // חישוב נפח פשוט מתוך מחרוזת "LxWxH"
                const parts = dimensions.split('x').map(s => parseFloat(s.trim()));
                return parts.length === 3 ? parts[0] * parts[1] * parts[2] : 1;
            };
            const actualOrderVolume = orderVolume(formData.dimensions);

            const scoredDrivers = mockDrivers.map(driver => {
                let score = 0;
                // 1. התאמת סוג משאית והתמחות (40%)
                const isSpecialtyMatch = driver.specialties.includes(formData.cargoType);
                if (isSpecialtyMatch) score += 40;
                else { // התאמה חלקית אם סוג המשאית תומך באופן כללי במטען
                    const compatibleVehicleType = mockVehicleTypes.find(v => v.name === driver.truckType && v.cargoTypes.includes(formData.cargoType));
                    if (compatibleVehicleType) score += 20;
                }

                // 2. התאמת קיבולת משקל ונפח (30%)
                const weightRatio = Math.min(1, orderWeight / driver.weightCapacity);
                const volumeRatio = Math.min(1, actualOrderVolume / driver.volumeCapacity);
                score += (weightRatio + volumeRatio) / 2 * 30; // ממוצע של התאמת משקל ונפח

                // 3. התאמת מרחק (20%) - מניחים ש-formData.deliveryDetails מכיל "עיר מוצא"
                // לצורך הדגמה, נשתמש במרחק קבוע או מדמה פשוט
                const fromCityGuess = formData.deliveryDetails.split(',')[0].trim();
                const driverDistance = driver.distance; // מרחק מדמה קבוע של הנהג
                score += Math.max(0, 20 - (Math.abs(driverDistance - calculateDistance(fromCityGuess, fromCityGuess)) / 5)); // יחס הפוך פשוט

                // 4. התאמת דירוג (10%)
                score += (driver.rating / 5) * 10;

                return { ...driver, matchScore: Math.round(Math.max(0, Math.min(100, score))) };
            });

            setFilteredDrivers(scoredDrivers.sort((a, b) => b.matchScore - a.matchScore)); // ממיין לפי ציון התאמה
            setCurrentStep(2); // מעבר לשלב 2
        }
    };

    // מטפל בשליחת הזמנה
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!selectedDriver) {
            showToast('אנא בחר מוביל לפני שליחת ההזמנה.', 'error');
            return;
        }

        setFormSubmitting(true);
        showToast('שולח הזמנה (הדמיה)...', 'info');
        await new Promise(resolve => setTimeout(resolve, 2000)); // מדמה זמן שליחה

        // מדמה שמירת ההזמנה
        const newOrderId = `ORD${String(mockOrders.length + 1).padStart(3, '0')}`;
        const newOrder = {
            id: newOrderId,
            customerId: user.id,
            customerName: user.name,
            cargoType: formData.cargoType,
            status: 'בהמתנה למוביל',
            from: formData.deliveryDetails.split(',')[0].trim(), // חילוץ עיר מפרטי אספקה
            to: 'יעד נבחר', // מחזיק מקום כרגע
            driverId: selectedDriver.id,
            driverName: selectedDriver.name,
            date: new Date().toLocaleDateString('he-IL'),
            time: new Date().toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})
        };
        mockOrders.push(newOrder); // הוספה לנתונים המדומים הגלובליים

        showToast(`הזמנה ${newOrderId} נשלחה בהצלחה ל${selectedDriver.name}!`, 'success');
        // איפוס טופס וחזרה לשלב 1
        setFormData({
            companyId: '', deliveryDetails: '', stopsCount: 1, transactionType: '',
            cargoType: '', weight: '', dimensions: '', escort: '',
            pictures: [], documents: [],
        });
        setSelectedDriver(null);
        setFilteredDrivers([]);
        setCurrentStep(1);
        setFormSubmitting(false);
    };

    // מטפל בחזרה לשלב הקודם בטופס
    const handlePreviousStep = () => {
        setCurrentStep(1);
    };

    // --- FAB Functions --- (Floating Action Buttons)
    // גלילה למעלה
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // פתיחת מודל וואטסאפ
    const openWhatsappModal = () => {
        setIsWhatsappModalOpen(true);
    };

    // שליחת הודעת וואטסאפ
    const sendWhatsappMessage = () => {
        const message = "שלום, אני מעוניין לבצע הזמנת הובלה חדשה דרך המערכת. אשמח לסיוע נוסף.";
        window.open(`https://wa.me/972508861080?text=${encodeURIComponent(message)}`, '_blank');
        setIsWhatsappModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-800 p-4 sm:p-8" dir="rtl">
            {/* Header של לוח הלקוח */}
            <header className="flex justify-between items-center py-4 px-2 mb-8 bg-white rounded-xl shadow-lg backdrop-filter backdrop-blur-md bg-opacity-70">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-700">הזמנה חדשה</h1>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-all text-sm"
                >
                    התנתק
                </button>
            </header>

            {/* תוכן הטופס הראשי */}
            <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-12 backdrop-filter backdrop-blur-md bg-opacity-80 border border-gray-200">
                <ProgressStepper currentStep={currentStep} totalSteps={2} />

                <form onSubmit={handleSubmitOrder}>
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && ( // שלב 1: פרטי הזמנה
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-6 mt-8"
                            >
                                <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                    <HomeModernIcon className="w-7 h-7 ml-2 text-blue-500" />
                                    פרטי הזמנה
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">ח.פ. / ת.ז.</label>
                                        <input
                                            type="text"
                                            id="companyId"
                                            name="companyId"
                                            value={formData.companyId}
                                            onChange={handleFormChange}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                            placeholder="הכנס ח.פ. או ת.ז."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="deliveryDetails" className="block text-sm font-medium text-gray-700 mb-1">פרטי אספקה (כתובת, איש קשר, טלפון)</label>
                                        <input
                                            type="text"
                                            id="deliveryDetails"
                                            name="deliveryDetails"
                                            value={formData.deliveryDetails}
                                            onChange={handleFormChange}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                            placeholder="רחוב, עיר, שם, טלפון"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="stopsCount" className="block text-sm font-medium text-gray-700 mb-1">מספר נקודות עצירה</label>
                                        <input
                                            type="number"
                                            id="stopsCount"
                                            name="stopsCount"
                                            value={formData.stopsCount}
                                            onChange={handleFormChange}
                                            min="1"
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-1">סוג עסקה</label>
                                        <select
                                            id="transactionType"
                                            name="transactionType"
                                            value={formData.transactionType}
                                            onChange={handleFormChange}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">בחר סוג עסקה</option>
                                            <option value="רגיל">רגיל</option>
                                            <option value="דחוף">דחוף</option>
                                            <option value="הקפצה">הקפצה</option>
                                        </select>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mt-8 mb-4 text-blue-700 flex items-center">
                                    <PackageIcon className="w-6 h-6 ml-2 text-blue-500" />
                                    פרטי הובלה
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-1">סוג מטען</label>
                                        <select
                                            id="cargoType"
                                            name="cargoType"
                                            value={formData.cargoType}
                                            onChange={handleFormChange}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">בחר סוג מטען</option>
                                            {mockCargoCatalog.map((cargo, index) => (
                                                <option key={index} value={cargo.name}>{cargo.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">משקל (ק"ג)</label>
                                        <input
                                            type="number"
                                            id="weight"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleFormChange}
                                            min="1"
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                            placeholder="הכנס משקל"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">מימדים (אורך x רוחב x גובה במטרים)</label>
                                        <input
                                            type="text"
                                            id="dimensions"
                                            name="dimensions"
                                            value={formData.dimensions}
                                            onChange={handleFormChange}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                                            placeholder="למשל: 2x1x1.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="escort" className="block text-sm font-medium text-gray-700 mb-1">ליווי מיוחד</label>
                                        <select
                                            id="escort"
                                            name="escort"
                                            value={formData.escort}
                                            onChange={handleFormChange}
                                            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">בחר ליווי</option>
                                            <option value="רגיל">רגיל</option>
                                            <option value="מנוף">מנוף</option>
                                            <option value="משטחים">משטחים</option>
                                            <option value="הובלה עדינה">הובלה עדינה</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div>
                                        <label htmlFor="pictures" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <PhotoIcon className="w-5 h-5 ml-2 text-blue-500" />
                                            העלאת תמונות
                                        </label>
                                        <input type="file" id="pictures" name="pictures" multiple onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept="image/*" />
                                    </div>
                                    <div>
                                        <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <DocumentTextIcon className="w-5 h-5 ml-2 text-blue-500" />
                                            העלאת מסמכים (PDF, DOC)
                                        </label>
                                        <input type="file" id="documents" name="documents" multiple onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept=".pdf,.doc,.docx" />
                                        {/* תצוגת PDF מדומה לדוגמה */}
                                        {formData.documents.length > 0 && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                                <p className="text-sm text-gray-600">קובץ מסמך לדוגמה (מוצג כ-PDF משוקף):</p>
                                                <img src="https://placehold.co/400x500/E5E7EB/4B5563?text=Mirrored+Document" alt="Mock Document" className="w-full h-40 object-contain mx-auto my-2 border border-gray-300 rounded-md" />
                                                <p className="text-xs text-gray-500">העלאת מסמכים מבוצעת לדוגמה בלבד.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-8">
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                                    >
                                        הבא
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && ( // שלב 2: בחירת מוביל
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-6 mt-8"
                            >
                                <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                    <TruckIcon className="w-7 h-7 ml-2 text-blue-500" />
                                    בחירת מוביל
                                </h2>
                                <p className="text-gray-600 mb-6">המערכת ניתחה את פרטי ההובלה שלך ומציגה את המובילים המומלצים:</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AnimatePresence>
                                        {filteredDrivers.length > 0 ? (
                                            filteredDrivers.map(driver => (
                                                <DriverCard
                                                    key={driver.id}
                                                    driver={driver}
                                                    onSelect={setSelectedDriver}
                                                    isSelected={selectedDriver && selectedDriver.id === driver.id}
                                                />
                                            ))
                                        ) : (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center text-gray-500 md:col-span-2 py-8"
                                            >
                                                <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                מחפש מובילים מתאימים...
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex justify-between mt-8">
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-500 transition-all transform hover:scale-105"
                                    >
                                        חזור
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={formSubmitting || !selectedDriver}
                                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {formSubmitting ? (
                                            <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                        ) : (
                                            'שלח הזמנה'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Floating Action Buttons - כפתורים צפים (גלילה למעלה, וואטסאפ) */}
            <div className="fixed bottom-8 right-8 flex flex-col items-center space-y-4 z-40">
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={scrollToTop}
                    className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUpIcon className="w-8 h-8" />
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                    onClick={openWhatsappModal}
                    className="w-14 h-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center transition-transform transform hover:scale-110"
                    aria-label="WhatsApp Support"
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
                </motion.button>
            </div>

            {/* Modals - חלונות קופצים */}
            <Modal isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} title="ברוכים הבאים!">
                <div className="flex flex-col items-center">
                    <img src={user?.avatar} alt="אווטאר" className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4" />
                    <p className="text-xl font-bold text-gray-900 mb-2">שלום, {user?.name}!</p>
                    <p className="text-gray-600 text-center">אנו שמחים לראות אותך בחזרה. בוא נתחיל הזמנה חדשה.</p>
                </div>
            </Modal>

            <Modal isOpen={isWhatsappModalOpen} onClose={() => setIsWhatsappModalOpen(false)} title="שליחת הודעת WhatsApp">
                <p className="text-gray-700 mb-4 text-center">שלח הודעה למספר 972508861080 לקבלת עזרה או מידע נוסף.</p>
                <button
                    onClick={sendWhatsappMessage}
                    className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105"
                >
                    שלח הודעה ב-WhatsApp
                </button>
            </Modal>
        </div>
    );
};


// --- Driver Dashboard Component ---
// רכיב לוח בקרה עבור נהגים
const DriverDashboard = ({ user, onLogout, showToast }) => {
    const [driverOrders, setDriverOrders] = useState([]); // הזמנות המשויכות לנהג
    const [selectedOrder, setSelectedOrder] = useState(null); // הזמנה שנבחרה לצפייה

    // טוען הזמנות עבור הנהג הנוכחי בטעינת הרכיב
    useEffect(() => {
        const ordersForDriver = mockOrders.filter(order => order.driverId === user.id);
        setDriverOrders(ordersForDriver);
    }, [user]);

    // מטפל בעדכון סטטוס הזמנה
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        showToast(`מעדכן סטטוס הזמנה ${orderId} ל: ${newStatus} (הדמיה)...`, 'info');
        // ביישום אמיתי, זו תהיה קריאת API לעדכון ה-backend
        setTimeout(() => {
            // עדכון מערך mockOrders גלובלי
            mockOrders = mockOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            // סינון מחדש של ההזמנות עבור הנהג הנוכחי
            setDriverOrders(mockOrders.filter(order => order.driverId === user.id));
            // עדכון ההזמנה הנבחרת במודל, אם היא זו שמתעדכנת
            setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
            showToast(`סטטוס הזמנה ${orderId} עודכן בהצלחה!`, 'success');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 text-gray-800 p-4 sm:p-8" dir="rtl">
            {/* Header של לוח הנהג */}
            <header className="flex justify-between items-center py-4 px-2 mb-8 bg-white rounded-xl shadow-lg backdrop-filter backdrop-blur-md bg-opacity-70">
                <h1 className="text-xl sm:text-2xl font-bold text-indigo-700">לוח בקרה לנהג</h1>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-all text-sm"
                >
                    התנתק
                </button>
            </header>

            <h2 className="text-2xl font-bold mb-6 text-indigo-800 flex items-center">
                <TruckIcon className="w-7 h-7 ml-2 text-indigo-600" />
                ההובלות שלי ({user.name})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {driverOrders.length > 0 ? ( // מציג כרטיסי הזמנות אם ישנן
                    driverOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-2">הזמנה #{order.id}</h3>
                            <p className="text-sm text-gray-600">לקוח: {order.customerName}</p>
                            <p className="text-sm text-gray-600">מקור: {order.from}</p>
                            <p className="text-sm text-gray-600">יעד: {order.to}</p>
                            <p className="text-sm font-medium mt-2">סטטוס:
                                <span className={`mr-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                    order.status === 'בדרך' || order.status === 'בהמתנה לאיסוף' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'בטיפול' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'נמסר' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {order.status}
                                </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">תאריך: {order.date} {order.time}</p>
                        </motion.div>
                    ))
                ) : ( // הודעה אם אין הזמנות
                    <p className="md:col-span-3 text-center text-gray-500 py-8">אין לך הובלות פעילות כרגע.</p>
                )}
            </div>

            <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`פרטי הזמנה #${selectedOrder?.id}`}>
                {selectedOrder && (
                    <div className="space-y-4">
                        <p><strong>לקוח:</strong> {selectedOrder.customerName}</p>
                        <p><strong>מקור:</strong> {selectedOrder.from}</p>
                        <p><strong>יעד:</strong> {selectedOrder.to}</p>
                        <p><strong>סוג מטען:</strong> {selectedOrder.cargoType}</p>
                        <p><strong>סטטוס:</strong> {selectedOrder.status}</p>
                        <div className="flex justify-around mt-4">
                            <button
                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'בדרך')}
                                className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600 transition-all text-sm"
                            >
                                סמן בדרך
                            </button>
                            <button
                                onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'נמסר')}
                                className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-all text-sm"
                            >
                                סמן נמסר
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// --- Admin Dashboard Component ---
// רכיב לוח בקרה עבור מנהלים
const AdminDashboard = ({ user, onLogout, showToast }) => {
    const [allOrders, setAllOrders] = useState([]); // כל ההזמנות במערכת
    const [allDrivers, setAllDrivers] = useState([]); // כל הנהגים במערכת
    const [searchTerm, setSearchTerm] = useState(''); // מונח חיפוש
    const [filterStatus, setFilterStatus] = useState('All'); // פילטר לפי סטטוס

    // טוען את כל ההזמנות והנהגים בטעינת הרכיב
    useEffect(() => {
        setAllOrders(mockOrders); // משתמש במערך mockOrders הגלובלי המשתנה
        setAllDrivers(mockDrivers);
    }, []);

    // מסנן הזמנות לפי מונח חיפוש וסטטוס
    const filteredOrders = allOrders.filter(order => {
        const matchesSearch = searchTerm === '' ||
            order.id.includes(searchTerm) ||
            order.customerName.includes(searchTerm) ||
            order.from.includes(searchTerm) ||
            order.to.includes(searchTerm) ||
            order.cargoType.includes(searchTerm) ||
            (order.driverName && order.driverName.includes(searchTerm));
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 text-gray-800 p-4 sm:p-8" dir="rtl">
            {/* Header של לוח המנהל */}
            <header className="flex justify-between items-center py-4 px-2 mb-8 bg-white rounded-xl shadow-lg backdrop-filter backdrop-blur-md bg-opacity-70">
                <h1 className="text-xl sm:text-2xl font-bold text-purple-700">לוח בקרה למנהל</h1>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-all text-sm"
                >
                    התנתק
                </button>
            </header>

            <h2 className="text-2xl font-bold mb-6 text-purple-800 flex items-center">
                <RectangleStackIcon className="w-7 h-7 ml-2 text-purple-600" />
                כל ההזמנות
            </h2>

            {/* פקדי חיפוש וסינון */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    placeholder="חפש הזמנה..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="All">כל הסטטוסים</option>
                    <option value="בהמתנה למוביל">בהמתנה למוביל</option>
                    <option value="בטיפול">בטיפול</option>
                    <option value="בדרך">בדרך</option>
                    <option value="נמסר">נמסר</option>
                    <option value="הושלם">הושלם</option>
                    <option value="בהמתנה לאיסוף">בהמתנה לאיסוף</option>
                </select>
            </div>

            {/* טבלת הזמנות */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200 mb-8">
                <table className="min-w-full divide-y divide-gray-200 text-right">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">מזהה</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">לקוח</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">מקור</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">יעד</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">מטען</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">מוביל</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">תאריך/שעה</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.from}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.to}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.cargoType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.driverName || 'טרם שובץ'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'בדרך' || order.status === 'בהמתנה לאיסוף' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'בטיפול' || order.status === 'בהמתנה למוביל' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'נמסר' || order.status === 'הושלם' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date} {order.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-purple-800 flex items-center">
                <MapPinIcon className="w-7 h-7 ml-2 text-purple-600" />
                כל המובילים
            </h2>
            {/* רשימת כרטיסי נהגים */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDrivers.map(driver => (
                    <motion.div
                        key={driver.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center mb-3">
                            <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full border-2 border-purple-400 ml-3" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                                <p className="text-sm text-gray-600">{driver.truckType}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">התמחות: {driver.specialties.join(', ')}</p>
                        <p className="text-sm text-gray-600">דירוג: {driver.rating}/5</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


// --- Main App Component (Handles Authentication and Role-based Rendering) ---
// רכיב הראשי של כל האפליקציה, מטפל באימות משתמש והצגה מותנית של לוחות הבקרה
export default function App() {
    const [user, setUser] = useState(null); // אובייקט המשתמש המחובר
    const [loginLoading, setLoginLoading] = useState(false); // מצב טעינה להתחברות
    const [toasts, setToasts] = useState([]); // רשימת הודעות טוסט

    // פונקציה להצגת הודעת טוסט
    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    };

    // מטפל בתהליך ההתחברות (מדמה)
    const handleLogin = (username, password) => {
        setLoginLoading(true);
        setTimeout(() => { // מדמה קריאת API ל-Apps Script
            const matchedUser = Object.values(mockUsers).find(
                u => u.username === username && u.password === password
            );

            if (matchedUser) {
                setUser(matchedUser);
                showToast(`ברוך הבא, ${matchedUser.name}!`, 'success');
            } else {
                showToast('שם משתמש או סיסמה שגויים.', 'error');
            }
            setLoginLoading(false);
        }, 1500);
    };

    // מטפל בתהליך ההתנתקות
    const handleLogout = () => {
        setUser(null);
        showToast('התנתקת בהצלחה.', 'info');
    };

    // פונקציה לבחירת לוח הבקרה להצגה בהתאם לתפקיד המשתמש
    const renderDashboard = () => {
        if (!user) { // אם אין משתמש מחובר, הצג מסך התחברות
            return <LoginScreen onLogin={handleLogin} loginLoading={loginLoading} showToast={showToast} />;
        }

        // הצג לוח בקרה מתאים לפי תפקיד
        switch (user.role) {
            case 'לקוח':
                return <ClientDashboard user={user} onLogout={handleLogout} showToast={showToast} />;
            case 'נהג':
                return <DriverDashboard user={user} onLogout={handleLogout} showToast={showToast} />;
            case 'מנהל':
                return <AdminDashboard user={user} onLogout={handleLogout} showToast={showToast} />;
            default: // למקרה של תפקיד לא מוכר
                return <p className="text-center text-red-500">תפקיד לא מוכר.</p>;
        }
    };

    return (
        <div dir="rtl">
            {/* סגנונות גלובליים בסיסיים */}
            <style>{`
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                    background-color: #f0f4f8; /* רקע ברירת מחדל */
                }
            `}</style>
            {renderDashboard()} {/* הצגת לוח הבקרה הרלוונטי */}

            {/* Toasts Container - מיכל להודעות טוסט */}
            <div className="fixed top-4 right-4 z-[9999] space-y-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
