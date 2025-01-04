import React from 'react';
import Header from '@/components/Header';
import { Task, useGetTasksQuery } from '@/state/api';
import ListCard from '@/components/ListCard';

type Props = {
  id: string;
  setIsModalOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => <ListCard key={task.id} task={task} />)}
      </div>
    </div>
  );
};

export default ListView;
