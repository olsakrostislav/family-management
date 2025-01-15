'use client';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Icon,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTaskbar } from '@/app/hooks/useTaskbar';
import { useGetAuthUserQuery, useGetProjectsQuery } from '@/state/api';
import { signOut, getCurrentUser } from 'aws-amplify/auth';

export const Taskbar = () => {
  const [showTasks, setShowTasks] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { username } = await getCurrentUser();
        setUsername(username);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const { data: projects } = useGetProjectsQuery();
  const { isTaskbarCollabsed, toggleTaskbar } = useTaskbar();

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

  const taskbarNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-70 dark:bg-black overflow-y-auto bg-white w-64 ${isTaskbarCollabsed ? 'w-0 hidden' : 'w-64'}`;

  return (
    <div className={taskbarNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        <div className="z-80 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold">
            <span className="text-modernblack dark:text-modernwhite">task</span>
            <span className="text-pink">thing</span>
            <span className="text-modernblack dark:text-modernwhite">.</span>
          </div>
          {!isTaskbarCollabsed && (
            <button className="py-3" onClick={toggleTaskbar}>
              <X className="hover-text-gray-500 size-6 text-modernblack dark:text-modernwhite" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image
            src="https://fm-s3-images.s3.eu-central-1.amazonaws.com/familylogo.png"
            alt="Logo"
            height={40}
            width={40}
            className="rounded-lg"
          />
          <div>
            <h3 className="text-[14px] font-bold tracking-widest dark:text-gray-200">
              {username ? username.toUpperCase() : 'Loading...'}
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[1.6px] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Zamknuto</p>
            </div>
          </div>
        </div>
        <nav className="z-10 w-full">
          <TaskbarLink icon={Home} label="Home" href="/" />
          <TaskbarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <TaskbarLink icon={Search} label="Search" href="/search" />
          <TaskbarLink icon={Settings} label="Settings" href="/settings" />
          <TaskbarLink icon={User} label="Users" href="/users" />
          <TaskbarLink icon={Users} label="Groups" href="/groups" />
        </nav>

        <button
          onClick={() => setShowTasks((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Plans</span>
          {showTasks ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>

        {showTasks &&
          projects?.map((project) => (
            <TaskbarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}

        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span>Priority</span>
          {showPriority ? (
            <ChevronUp className="size-5" />
          ) : (
            <ChevronDown className="size-5" />
          )}
        </button>
        {showPriority && (
          <>
            <TaskbarLink
              icon={AlertCircle}
              label="Urgent"
              href="/priority/urgent"
            />
            <TaskbarLink
              icon={ShieldAlert}
              label="High"
              href="/priority/high"
            />
            <TaskbarLink
              icon={AlertTriangle}
              label="Medium"
              href="/priority/medium"
            />
            <TaskbarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <TaskbarLink
              icon={Layers3}
              label="Postponed"
              href="/priority/backlog"
            />
          </>
        )}
      </div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || 'User Profile Picture'}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

interface TaskbarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const TaskbarLink = ({ href, icon: Icon, label }: TaskbarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === '/' && href === 'dashboard');

  return (
    <Link href={href} className="w-full">
      <div
        className={clsx(
          'hovor:bg-gray-100 dark:hover-gray-700 relative flex cursor-pointer items-center justify-start gap-3 px-8 py-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700',
          {
            'bg-gray-100 text-white dark:bg-gray-600': isActive,
          }
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};
