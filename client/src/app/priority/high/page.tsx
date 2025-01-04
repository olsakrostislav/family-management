import React from 'react';
import PriorityPage from '@/app/priority/components';
import { Priority } from '@/state/api';

const High = () => {
  return <PriorityPage priority={Priority.High} />;
};

export default High;
