import {
  COMPLETED,
  TODO,
  UNDER_REVIEW,
  WORK_IN_PROGRESS,
} from '@/app/constants/statuses';
import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/helpers/utils';
import { useGetTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

type Props = {
  id: string;
  setIsModalOpen: (isOpen: boolean) => void;
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
    renderCell: (params) => params.value?.author || 'Unknown',
  },
  {
    field: 'assignee',
    headerName: 'Assignee',
    width: 150,
    renderCell: (params) => params.value?.assignee || 'Unassigned',
  },
];

const TableView = ({ id, setIsModalOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  );
};

export default TableView;
