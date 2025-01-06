import { Task } from '@/state/api';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

type Attachment = {
  fileURL: string;
  fileName: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment;
};

const Modal = React.memo(({ isOpen, onClose, attachment }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-300 hover:text-gray-100"
          aria-label="Close"
        >
          <X size={30} />
        </button>
        <Image
          src={`https://fm-s3-images.s3.eu-central-1.amazonaws.com/${attachment.fileURL}`}
          alt={attachment.fileName}
          width={800}
          height={600}
          className="max-h-full max-w-full rounded-lg"
          style={{ display: 'block', margin: '0 auto' }}
        />
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

type Props = {
  task: Task;
};

const ListCard = ({ task }: Props) => {
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAttachment(null);
    setIsModalOpen(false);
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-gradient-to-r p-6 shadow-lg transition-transform dark:border-gray-700 dark:text-gray-200">
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold text-white dark:text-gray-300">
            Attachments
          </h3>
          <div className="flex flex-wrap gap-4">
            {task.attachments.map((attachment, index) => (
              <button
                key={index}
                onClick={() => openModal(attachment)}
                className="rounded-md border border-gray-200 shadow-md dark:border-gray-600"
              >
                <Image
                  src={`https://fm-s3-images.s3.eu-central-1.amazonaws.com/${attachment.fileURL}`}
                  alt={attachment.fileName}
                  width={150}
                  height={100}
                  className="rounded-md"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            ID:
          </span>{' '}
          {task.id}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Title:
          </span>{' '}
          {task.title}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Description:
          </span>{' '}
          {task.description || 'No description provided'}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Status:
          </span>{' '}
          {task.status}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Priority:
          </span>{' '}
          {task.priority}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Tags:
          </span>{' '}
          {task.tags || 'No tags'}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Start Date:
          </span>{' '}
          {task.startDate ? format(new Date(task.startDate), 'P') : 'Not set'}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Due Date:
          </span>{' '}
          {task.dueDate ? format(new Date(task.dueDate), 'P') : 'Not set'}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Author:
          </span>{' '}
          {task.author ? task.author.username : 'Unknown'}
        </p>
        <p>
          <span className="font-bold text-gray-600 dark:text-gray-300">
            Assignee:
          </span>{' '}
          {task.assignee ? task.assignee.username : 'Unassigned'}
        </p>
      </div>

      {selectedAttachment && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          attachment={selectedAttachment}
        />
      )}
    </div>
  );
};

export default ListCard;
