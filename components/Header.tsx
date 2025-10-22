import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <h1 className="logo">AyurVision AI</h1>
      </div>
      <p className="tagline">Next-Generation Medicinal Plant Intelligence</p>
      <p className="subtitle">Powered by advanced neural networks and traditional Ayurvedic knowledge</p>
    </header>
  );
};
