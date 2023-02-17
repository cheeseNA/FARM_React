/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useProcessAuth } from '../hooks/useProcessAuth';
import { useQueryTasks } from '../hooks/useQueryTasks';
import { useQueryUser } from '../hooks/useQueryUser';

export const Todo = () => {
  const { logout } = useProcessAuth();
  const {data: dataUser} = useQueryUser();
  const {data: dataTasks, isLoading: isLoadingTasks} = useQueryTasks();
  return (
    <div className='flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono'>
      <ArrowRightOnRectangleIcon onClick={logout} className='h-7 w-7 mt-1 mb-5 text-blue-500 cursor-pointer' />
    </div>
  );
};
