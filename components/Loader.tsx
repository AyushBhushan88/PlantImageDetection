import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <div className="loading-text">AI Analysis in Progress</div>
      <div className="loading-subtext">Processing image through neural networks...</div>
    </div>
  );
};
