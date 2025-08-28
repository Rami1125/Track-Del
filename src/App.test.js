// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  // בדיקה אם טקסט "ברוכים הבאים" מופיע במסך ההתחברות
  const welcomeElement = screen.getByText(/ברוכים הבאים/i);
  expect(welcomeElement).toBeInTheDocument();
});
