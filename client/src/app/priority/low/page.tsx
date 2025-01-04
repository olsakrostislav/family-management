import React from 'react';
import PriorityPage from '@/app/priority/components';
import { Priority } from '@/state/api';

const Low = () => {
  return <PriorityPage priority={Priority.Low} />;
};

export default Low;
