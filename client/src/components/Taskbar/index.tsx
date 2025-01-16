'use client';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
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
import { motion } from 'framer-motion';

export const Taskbar = () => {
  const [showTasks, setShowTasks] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakeIndex, setMistakeIndex] = useState<number | null>(null);
  const fullText = 'taskthing.';
  const deleteLimit = fullText.length - 3;

  const { data: projects } = useGetProjectsQuery();
  const { isTaskbarCollabsed, toggleTaskbar } = useTaskbar();
  const { data: currentUser } = useGetAuthUserQuery({});

  useEffect(() => {
    let typingSpeed = isDeleting ? 100 : 150;
    let timeout: NodeJS.Timeout;

    const animateText = () => {
      setText((prev) => {
        if (!isDeleting) {
          if (currentIndex < fullText.length) {
            if (
              mistakeIndex === null &&
              Math.random() < 0.1 &&
              currentIndex >= deleteLimit
            ) {
              setMistakeIndex(currentIndex);
              return (
                prev + String.fromCharCode(97 + Math.floor(Math.random() * 26))
              );
            }

            if (mistakeIndex !== null && currentIndex === mistakeIndex) {
              setMistakeIndex(null);
              return prev.slice(0, -1) + fullText[currentIndex];
            }

            setCurrentIndex(currentIndex + 1);
            return prev + fullText[currentIndex];
          } else if (prev === fullText) {
            timeout = setTimeout(() => {
              setIsDeleting(true);
            }, 3000);
            return prev;
          } else {
            setIsDeleting(true);
            return prev;
          }
        } else {
          if (currentIndex > deleteLimit) {
            setCurrentIndex(currentIndex - 1);
            return prev.slice(0, -1);
          } else {
            setIsDeleting(false);
            setCurrentIndex(deleteLimit);
            return fullText.slice(0, deleteLimit);
          }
        }
      });
    };

    timeout = setTimeout(animateText, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentIndex, mistakeIndex]);

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

  const caretAnimation = {
    initial: { opacity: 1 },
    animate: {
      opacity: [1, 0, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

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
          <div>
            <motion.div
              className="flex items-center text-xl font-bold"
              whileHover={{ scale: 1.1, color: '#e91e63' }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
            >
              <span className="text-modernblack dark:text-modernwhite">
                {text}
              </span>
              <motion.div
                className="ml-1 h-[18px] w-[2px] bg-modernblack dark:bg-modernwhite"
                {...caretAnimation}
              />
            </motion.div>
          </div>
          {!isTaskbarCollabsed && (
            <button className="py-3" onClick={toggleTaskbar}>
              <X className="size-6 text-modernblack hover:text-green dark:text-modernwhite dark:hover:text-green" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image
            src="https://fm-s3-images.s3.eu-central-1.amazonaws.com/logo1.png"
            alt="Logo"
            height={40}
            width={40}
            className="rounded-lg"
          />
          <div className="flex items-center">
            <p className="text-[13px] text-modernblack dark:text-modernwhite">
              u/
            </p>
            <h3 className="text-[14px] font-bold text-green">
              {username ? username.toUpperCase() : 'Loading...'}
            </h3>
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
          'dark:hover-gray-700 relative flex cursor-pointer items-center justify-start gap-3 px-8 py-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800',
          {
            'bg-gray-100 text-white dark:bg-gray-800': isActive,
          }
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-green" />
        )}

        <Icon className="h-6 w-6 text-modernblack dark:text-gray-100" />
        <span className={`font-medium text-modernblack dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};
