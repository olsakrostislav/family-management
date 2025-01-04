'use client';

import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Taskbar } from '@/components/Taskbar';
import StoreProvider from '@/app/redux';
import { useTaskbar } from '@/app/hooks/useTaskbar';
import { useDarkMode } from '@/app/hooks/useDarkMode';

const DashboardStructure = ({ children }: { children: React.ReactNode }) => {
  const { isTaskbarCollabsed } = useTaskbar();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Taskbar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${!isTaskbarCollabsed && 'md:pl-64'}`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardStructure>{children}</DashboardStructure>
    </StoreProvider>
  );
};

export default DashboardWrapper;
