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
import React, { useState } from 'react';
import clsx from 'clsx';
import { useTaskbar } from '@/app/hooks/useTaskbar';
import { useGetProjectsQuery } from '@/state/api';

export const Taskbar = () => {
  const [showTasks, setShowTasks] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const { isTaskbarCollabsed, toggleTaskbar } = useTaskbar();

  const taskbarNames = `fixed flex flex-col h-[100%] justify-between shadow-xl transition-all duration-300 h-full z-70 dark:bg-black overflow-y-auto bg-white w-64 ${isTaskbarCollabsed ? 'w-0 hidden' : 'w-64'}`;

  return (
    <div className={taskbarNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-80 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
            FAMTASK
          </div>
          {!isTaskbarCollabsed && (
            <button className="py-3" onClick={toggleTaskbar}>
              <X className="hover-text-gray-500 size-6 text-gray-800 dark:text-gray-200" />
            </button>
          )}
        </div>
        {/* FAMILY */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image
            src="/familylogo.png"
            alt="Logo"
            height={40}
            width={40}
            className="rounded-lg"
          />
          <div>
            <h3 className="text-[14px] font-bold tracking-widest dark:text-gray-200">
              FAMILY
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[1.6px] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Zamknuto</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        <nav className="z-10 w-full">
          <TaskbarLink icon={Home} label="Home" href="/" />
          <TaskbarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <TaskbarLink icon={Search} label="Search" href="/search" />
          <TaskbarLink icon={Settings} label="Settings" href="/settings" />
          <TaskbarLink icon={User} label="Users" href="/users" />
          <TaskbarLink icon={Users} label="Groups" href="/groups" />
        </nav>

        {/* PROJECTS LINKS*/}
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
        {/* PROJECTS LISTS */}
        {showTasks &&
          projects?.map((project) => (
            <TaskbarLink
              key={project.id}
              icon={Briefcase}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}

        {/* PRIORITIES LINKS */}

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
