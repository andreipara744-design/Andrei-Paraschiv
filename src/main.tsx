import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root') as any;
if (!(window as any).reactRoot) {
  (window as any).reactRoot = ReactDOM.createRoot(rootElement);
}
(window as any).reactRoot.render(<App />);
