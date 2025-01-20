import React, { useState } from 'react';
import { Menu, Moon, PlusSquare, Search, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsTaskbarCollabsed } from '@/state';
import { useGetAuthUserQuery } from '@/state/api';
import { signOut } from 'aws-amplify/auth';
import Image from 'next/image';
import CreatePlanModal from '@/app/projects/CreatePlanModal';

export const Navbar = () => {
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isTaskbarCollabsed = useAppSelector(
    (state) => state.global.isTaskbarCollabsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!currentUser) return null;
  const currentUserDetails = currentUser?.userDetails;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      <div className="flex items-center gap-8">
        {!isTaskbarCollabsed ? null : (
          <button
            onClick={() => dispatch(setIsTaskbarCollabsed(!isTaskbarCollabsed))}
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center">
        <CreatePlanModal
          isOpen={isCreatePlanModalOpen}
          onClose={() => setIsCreatePlanModalOpen(false)}
        />
        <div className="px-4">
          <button
            className="hover:bg-green_dark flex items-center rounded-md bg-green px-3 py-2 text-white"
            onClick={() => setIsCreatePlanModalOpen(true)}
          >
            <PlusSquare className="mr-2 size-5" /> New Plan
          </button>
        </div>
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-modernwhite" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-modernwhite" />
          )}
        </button>
        <div className="ml-3 mr-3 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
        <div className="hidden items-center justify-between md:flex">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://fm-s3-images.s3.eu-central-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || 'User Profile Picture'}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <Link
                href="/users"
                className={
                  isDarkMode
                    ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
                    : `h-min w-min rounded p-2 hover:bg-gray-100`
                }
              >
                <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
              </Link>
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="hover:bg-green_dark hidden rounded bg-green px-4 py-2 text-xs font-bold text-white md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
