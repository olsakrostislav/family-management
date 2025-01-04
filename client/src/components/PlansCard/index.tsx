import { Project } from '@/state/api';
import React from 'react';

type Props = {
  plan: Project;
};

const PlansCard = ({ plan }: Props) => {
  return (
    <div className="rounded border p-4 shadow">
      <h3>{plan.name}</h3>
      <p>{plan.description}</p>
      <p>Start Date: {plan.startDate}</p>
      <p>End Date: {plan.endDate}</p>
    </div>
  );
};

export default PlansCard;
