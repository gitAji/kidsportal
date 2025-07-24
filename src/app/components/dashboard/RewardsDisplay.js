import React from 'react';
import { FaTrophy, FaLock } from 'react-icons/fa';

const rewards = [
  { id: 1, name: 'Unlock a new avatar', points: 50 },
  { id: 2, name: 'Unlock a new theme', points: 100 },
  { id: 3, name: 'Unlock a new game', points: 200 },
  { id: 4, name: 'Get a real-life reward', points: 500 },
];

const RewardsDisplay = ({ points }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-yellow-500 flex items-center">
        <FaTrophy className="mr-2" /> Your Rewards
      </h3>
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600">You have</p>
        <p className="text-5xl font-bold text-yellow-500">{points}</p>
        <p className="text-lg text-gray-600">points</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewards.map(reward => (
          <div
            key={reward.id}
            className={`p-4 rounded-lg shadow-md flex items-center justify-between ${
              points >= reward.points ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <div>
              <p className="font-semibold text-lg">{reward.name}</p>
              <p className="text-sm text-gray-500">{reward.points} points</p>
            </div>
            {points >= reward.points ? (
              <button className="px-4 py-2 bg-green-500 text-white rounded-md">
                Unlock
              </button>
            ) : (
              <FaLock className="text-gray-400 text-2xl" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsDisplay;