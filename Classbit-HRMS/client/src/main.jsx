import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import toast, { Toaster } from 'react-hot-toast'

// Override default window.alert globally to use beautiful UI Toasts instead
window.alert = (message) => {
  if (typeof message === 'string' && (message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') || message.toLowerCase().includes('exceeded') || message.toLowerCase().includes('must apply'))) {
      toast.error(message, { duration: 5000 });
  } else if (typeof message === 'string' && (message.toLowerCase().includes('success') || message.toLowerCase().includes('welcome'))) {
      toast.success(message, { duration: 4000 });
  } else {
      toast(message, {
          duration: 4000,
          style: {
            background: 'var(--card-bg, #1e293b)',
            color: 'var(--text-primary, #f8fafc)',
            border: '1px solid var(--border-color, #334155)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }
      });
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <App />
  </StrictMode>,
)
