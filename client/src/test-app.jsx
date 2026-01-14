// Temporary test file to verify React is working
import React from 'react';
import { createRoot } from 'react-dom/client';

const TestApp = () => {
  return (
    <div style={{ padding: '50px', background: '#1A1A1A', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ React is Working!</h1>
      <p style={{ fontSize: '24px' }}>If you see this, React is rendering correctly.</p>
      <p style={{ fontSize: '18px', marginTop: '20px', color: '#E91E63' }}>
        The issue is likely in App.jsx or one of its imports.
      </p>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<TestApp />);
}
