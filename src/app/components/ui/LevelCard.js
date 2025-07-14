
import Link from 'next/link';
import Image from 'next/image';

const LevelCard = ({ grade, subject, level, isUnlocked, isCompleted }) => {
  const levelPath = `/grades/${grade}/${subject}/level${level}`;

  const subjectIcons = {
    tamil: '/images/sticker-png-tamil-script-tamil-wikipedia-english-Уйирелутты-背景图-english-text-trademark-logo-tamil-wikipedia.png',
    math: '/images/math.jpg',
    english: '/images/english.jpg',
    ariviyal: '/images/science.jpg',
    social: '/images/social.jpg',
    tech: '/images/tech.jpg',
  };

  const icon = subjectIcons[subject] || '/images/apple.png';

  const cardContent = (
    <>
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="mb-4">
          <Image src={icon} alt={`${subject} icon`} width={70} height={70} className="rounded-full" />
        </div>
        <div className="text-lg sm:text-xl font-bold text-gray-800">{`Level ${level}`}</div>
      </div>
      {isCompleted && (
        <div className="absolute top-2 right-2 text-xl sm:text-2xl text-green-500">
          ✓
        </div>
      )}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center rounded-lg">
          <span className="text-3xl sm:text-4xl text-white">🔒</span>
        </div>
      )
    }</>
  );

  const cardClasses = `relative p-4 sm:p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 flex flex-col
    ${isUnlocked ? 'bg-white cursor-pointer' : 'bg-gray-200 cursor-not-allowed'}
    ${isCompleted ? 'border-2 border-green-500' : 'border-2 border-transparent'}`;

  return (
    <div className={cardClasses}>
      {isUnlocked ? (
        <Link href={levelPath} className={`flex flex-col flex-grow ${cardClasses}`}>
          {cardContent}
        </Link>
      ) : (
        <div className={cardClasses}>
          {cardContent}
        </div>
      )}
    </div>
  );
};

export default LevelCard;
