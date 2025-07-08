import React from 'react';
import Image from 'next/image';

const RewardsDisplay = () => {
  const rewards = [
    { id: 1, name: 'Star Achiever', type: 'badge', image: '/images/star_badge.png' },
    { id: 2, name: 'Math Whiz', type: 'trophy', image: '/images/math_trophy.png' },
    { id: 3, name: 'Reading Champion', type: 'badge', image: '/images/reading_badge.png' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {rewards.length === 0 ? (
        <p className="text-gray-700">No rewards earned yet. Keep up the great work!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm">
              <Image src={reward.image} alt={reward.name} width={80} height={80} className="w-20 h-20 mb-2" />
              <p className="text-center font-medium">{reward.name}</p>
              <p className="text-center text-sm text-gray-500 capitalize">{reward.type}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">Unlock new rewards by completing tasks and achieving milestones!</p>
        {/* Placeholder for animations, mini-games, or learning rewards */}
      </div>
    </div>
  );
};

export default RewardsDisplay;
