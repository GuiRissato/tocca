import React from 'react';
import Navbar from '../Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function HeaderLayout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className='overflow-y-auto overflow-x-auto'>
        {children}
      </main>
    </div>
  );
}