import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pl-0 md:pl-64 transition-all duration-200">
        <div className="max-w-full xl:max-w-[90rem] mx-auto py-4 md:py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}