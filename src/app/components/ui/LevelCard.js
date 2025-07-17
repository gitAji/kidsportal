import Link from 'next/link';
import React from 'react';

const LevelCard = React.forwardRef(({ grade, subject, level, isUnlocked }, ref) => {
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
    ${isUnlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}
  `;

  const content = (
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">Level {level}</h3>
      {isUnlocked ? (
        <p className="text-white">Unlocked</p>
      ) : (
        <div className="flex justify-center items-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
      )}
    </div>
  );

  return isUnlocked ? (
    <Link href={`/grades/${grade}/${subject}/levels/${level}`} ref={ref} className={cardClasses}>
      {content}
    </Link>
  ) : (
    <div ref={ref} className={cardClasses}>
      {content}
    </div>
  );
});

LevelCard.displayName = 'LevelCard';

export default LevelCard;



