import Link from 'next/link';

const LevelCard = ({ grade, subject, level, isUnlocked }) => {
  const cardClasses = `
    p-6 
    rounded-lg 
    shadow-lg 
    text-center 
    transform 
    transition 
    duration-300 
    hover:scale-105
    ${isUnlocked ? 'bg-[var(--primary-blue)] hover:bg-[var(--deep-ocean)]' : 'bg-gray-700 cursor-not-allowed'}
  `;

  const content = (
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">Level {level}</h3>
      <p className="text-gray-400">{isUnlocked ? 'Unlocked' : 'Locked'}</p>
    </div>
  );

  return isUnlocked ? (
    <Link href={`/grades/${grade}/${subject}/levels/${level}`} className={cardClasses}>
      {content}
    </Link>
  ) : (
    <div className={cardClasses}>
      {content}
    </div>
  );
};

export default LevelCard;