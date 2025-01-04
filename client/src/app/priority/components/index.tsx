'use client';

import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import CreateModalTask from '@/components/CreateModalTask';
import ListCard from '@/components/ListCard';
import { dataGridClassNames, dataGridSxStyles } from '@/helpers/utils';
import { Priority, Task, useGetUserTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';
import {
  COMPLETED,
  TODO,
  UNDER_REVIEW,
  WORK_IN_PROGRESS,
} from '@/app/constants/statuses';

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 100,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 200,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => {
      const statusColors: Record<string, string> = {
        [TODO]: 'bg-blue-100 text-blue-800',
        [UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
        [WORK_IN_PROGRESS]: 'bg-orange-100 text-orange-800',
        [COMPLETED]: 'bg-green-100 text-green-800',
      };

      const colorClasses =
        statusColors[params.value] || 'bg-gray-100 text-gray-800';

      return (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${colorClasses}`}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 75,
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 130,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 130,
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 130,
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 150,
    renderCell: (params) => params.value.username || 'Unknown',
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    renderCell: (params) => params.value.username || 'Unassigned',
  },
];

const PriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = 1;
  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetUserTasksQuery(userId || 0, {
    skip: userId === null,
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority
  );

  if (isTasksError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <CreateModalTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === 'list' ? 'bg-gray-300' : 'bg-white'
          } rounded-l`}
          onClick={() => setView('list')}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${
            view === 'table' ? 'bg-gray-300' : 'bg-white'
          } rounded-l`}
          onClick={() => setView('table')}
        >
          Table
        </button>
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : view === 'list' ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks?.map((task: Task) => (
            <ListCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === 'table' &&
        filteredTasks && (
          <div className="z-0 w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default PriorityPage;
