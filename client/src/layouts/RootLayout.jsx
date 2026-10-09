import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-[#172033] font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
