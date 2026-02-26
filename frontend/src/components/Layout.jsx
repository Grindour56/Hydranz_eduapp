import React from 'react';
import Navbar from './Navbar';

// A simple layout that wraps each page with a navbar and a centered container
export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="page-container">{children}</main>
    </div>
  );
}