import React from 'react';
import { Menu, Moon, Search, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTaskbar } from '@/app/hooks/useTaskbar';
import { useDarkMode } from '@/app/hooks/useDarkMode';

export const Navbar = () => {
  const { isTaskbarCollabsed, toggleTaskbar } = useTaskbar();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {isTaskbarCollabsed && (
          <button onClick={toggleTaskbar}>
            <Menu className="size-8 dark:text-gray-200" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-gray-200" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/*icons*/}
      <div className="flex items-center">
        <button
          onClick={toggleDarkMode}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-gray-200" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-gray-200" />
          )}
        </button>
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-gray-200" />
        </Link>
        {/* vertical lajna vedle settings */}
        <div className="ml-2 mr-5 min-h-[32px] w-[2px] bg-gray-200 md:inline-block"></div>
      </div>
    </div>
  );
};
