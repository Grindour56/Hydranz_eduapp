import React, { useState, useEffect } from 'react';

// A small status box that shows system connection message and bandwidth saved.
// Accepts props: statusMessage, bandwidthSaved
export default function SystemStatus({ statusMessage = '', bandwidthSaved = 0 }) {
  // maintain local copy in state in case the parent passes updated props later
  const [message, setMessage] = useState(statusMessage);
  const [bytes, setBytes] = useState(bandwidthSaved);

  useEffect(() => {
    setMessage(statusMessage);
  }, [statusMessage]);

  useEffect(() => {
    setBytes(bandwidthSaved);
  }, [bandwidthSaved]);

  return (
    <div className="system-status">
      <div>Status: {message}</div>
      <div>Total Bandwidth Saved: {bytes} bytes</div>
    </div>
  );
}