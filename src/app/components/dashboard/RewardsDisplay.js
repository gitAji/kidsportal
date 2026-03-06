import React from 'react';
import { FaTrophy, FaLock, FaUnlock, FaStar, FaGamepad, FaPaintBrush } from 'react-icons/fa';

const rewards = [
  { id: 1, name: 'Unlock Premium Avatar', points: 50, icon: <FaStar />, color: 'from-amber-400 to-orange-500' },
  { id: 2, name: 'Cosmic UI Theme', points: 100, icon: <FaPaintBrush />, color: 'from-fuchsia-500 to-purple-600' },
  { id: 3, name: 'Secret Minigame', points: 200, icon: <FaGamepad />, color: 'from-emerald-400 to-teal-500' },
  { id: 4, name: 'Mystery Box Reward', points: 500, icon: <FaTrophy />, color: 'from-rose-500 to-pink-600' },
];

const RewardsDisplay = ({ points }) => {
  return (
    <div>
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 shadow-sm border border-amber-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-amber-300/40 rotate-12 scale-150 pointer-events-none">
          <FaTrophy size={200} />
        </div>

        <div className="relative z-10 text-center md:text-left">
          <h3 className="text-xl font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-3">
            <FaStar className="text-amber-500" /> Star Points Balance
          </h3>
          <p className="text-slate-600 font-medium max-w-sm">Complete tasks and pass quizzes to earn more stars, and unlock permanent rewards on your profile!</p>
        </div>

        <div className="relative z-10 bg-white px-8 py-5 rounded-3xl shadow-lg border-2 border-amber-200 text-center min-w-[200px]">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Stars</p>
          <p className="text-5xl font-black text-amber-500 flex items-center justify-center gap-2">
            {points} <FaStar className="text-3xl text-amber-400" />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {rewards.map(reward => {
          const isUnlocked = points >= Math.abs(reward.points);
          const progress = Math.min(100, Math.max(0, (points / reward.points) * 100));

          return (
            <div
              key={reward.id}
              className={`relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between min-h-[160px] ${isUnlocked
                  ? 'bg-white border-blue-100 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300'
                  : 'bg-slate-50 border-slate-200 opacity-80'
                }`}
            >
              {isUnlocked && (
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${reward.color} rounded-bl-full opacity-10`} />
              )}

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white shadow-md bg-gradient-to-br ${isUnlocked ? reward.color : 'from-slate-400 to-slate-500'}`}>
                    {reward.icon}
                  </div>
                  <div>
                    <h4 className={`font-black text-lg ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>{reward.name}</h4>
                    <p className="text-sm font-bold text-amber-500 flex items-center gap-1">
                      <FaStar /> {reward.points} Stars
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto relative z-10">
                {isUnlocked ? (
                  <button className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-xs text-white shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r ${reward.color}`}>
                    <FaUnlock /> Claim Reward
                  </button>
                ) : (
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>{points} / {reward.points}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RewardsDisplay;