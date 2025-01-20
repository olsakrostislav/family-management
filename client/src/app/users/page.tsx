'use client';

import React, { useEffect, useState } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import Header from '@/components/Header';
import { useGetUsersQuery } from '@/state/api';
import { useAppSelector } from '@/app/redux';
import { fetchAuthSession } from 'aws-amplify/auth';
import clsx from 'clsx';

interface UserDetails {
  username?: string;
  email?: string;
  emailVerified?: boolean;
}

const useFetchCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session?.tokens?.idToken) {
          throw new Error('Session or ID token not found');
        }

        const { payload: idTokenPayload } = session.tokens.idToken;
        setCurrentUser({
          username:
            (idTokenPayload['cognito:username'] as string) ||
            'Error fetching username',
          email: (idTokenPayload.email as string) || 'Error fetching email',
          emailVerified: Boolean(idTokenPayload.email_verified),
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return currentUser;
};

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const currentUser = useFetchCurrentUser();

  if (isLoading) return <div>Loading users...</div>;
  if (isError || !users)
    return <div>Error fetching users. Please try again later.</div>;

  return (
    <Authenticator>
      <div className="p-8">
        <Header name="INFORMATION" />
        <div className="space-y-6">
          {[
            { label: 'USERNAME', value: currentUser?.username },
            { label: 'EMAIL', value: currentUser?.email },
            {
              label: 'EMAIL VERIFIED',
              value: currentUser
                ? currentUser.emailVerified
                  ? 'Yes'
                  : 'No'
                : 'Loading...',
            },
          ].map(({ label, value }, index) => (
            <div key={index}>
              <label className="block font-sans text-xl font-medium text-green dark:text-green">
                {label}
              </label>
              <div
                className={clsx(
                  'mt-1 block w-full rounded-md border p-2 shadow-sm',
                  isDarkMode
                    ? 'border-gray-600 bg-gray-800 text-white'
                    : 'border-gray-300 bg-white text-black'
                )}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Authenticator>
  );
};

export default Users;
