'use client';

import React, { use, useState } from 'react';
import ProjectHeader from '@/app/projects/ProjectHeader';
import Board from '@/app/projects/TaskBoardView';
import List from '@/app/projects/ListView';
import Timeline from '@/app/projects/TimelineView';
import Table from '@/app/projects/TableView';
import { BOARD, LIST, TABLE, TIMELINE } from '@/app/constants/tabs';
import CreateModalTask from '@/components/CreateModalTask';

type Props = {
  params: Promise<{ id: string }>;
};

const Project = ({ params }: Props) => {
  const { id } = use(params);
  const [currentTab, setCurrentTab] = useState(BOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <CreateModalTask
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={id}
      />
      <ProjectHeader currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === BOARD && (
        <Board id={id} setIsModalOpen={setIsModalOpen} />
      )}
      {currentTab === LIST && <List id={id} setIsModalOpen={setIsModalOpen} />}
      {currentTab === TIMELINE && (
        <Timeline id={id} setIsModalOpen={setIsModalOpen} />
      )}
      {currentTab === TABLE && (
        <Table id={id} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default Project;
