import React from 'react';

export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="progress-bar">
      <div className="progress-filled" style={{ width: `${progress}%` }} />
    </div>
  );
}