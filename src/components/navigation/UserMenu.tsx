import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User, LogOut } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../lib/auth';

interface UserMenuProps {
  user: SupabaseUser | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
            {user?.email}
          </div>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`${
                  active ? 'bg-gray-100' : ''
                } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}