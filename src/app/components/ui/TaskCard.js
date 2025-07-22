import Link from 'next/link';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLock } from '@fortawesome/free-solid-svg-icons';
import { slugify } from '../../../utils/slugify';

const TaskCard = ({
  grade,
  subject,
  level,
  task,
  isUnlocked,
}) => {
  const { taskId, taskName, type, status } = task;

  const getCardColors = () => {
    if (!isUnlocked) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    if (status === 'completed') {
      return 'bg-green-500 hover:bg-green-600';
    }
    switch (type) {
      case 'lesson':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'quiz':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'exam':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const cardClasses = `
    p-6
    rounded-lg
    shadow-lg
    text-center
    transform
    transition
    duration-300
    hover:scale-110
    hover:shadow-2xl
    relative
    text-white
    ${getCardColors()}
  `;

  const taskSlug = slugify(taskName);

  const content = (
    <>
      <h3 className="text-xl font-bold mb-2">{taskName}</h3>
      <p className="mb-2">{type}</p>
      <p className="text-sm font-light capitalize">
        Status: {status.replace(/_/g, ' ')}
      </p>
      {status === 'completed' && (
        <div className="absolute top-2 right-2 text-yellow-400">
          <FontAwesomeIcon icon={faTrophy} size="2x" />
        </div>
      )}
      {!isUnlocked && (
        <div className="absolute bottom-2 right-2">
          <FontAwesomeIcon icon={faLock} size="2x" />
        </div>
      )}
    </>
  );

  return isUnlocked ? (
    <Link href={`/grades/${grade}/${subject}/${level}/tasks/${taskSlug}`} className={cardClasses}>
      {content}
    </Link>
  ) : (
    <div className={cardClasses}>
      {content}
    </div>
  );
};

export default TaskCard;
