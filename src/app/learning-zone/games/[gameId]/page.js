"use client";

import { useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChild } from '../../../providers/ChildProvider';
import dbData from '../../../data/db.json';
import { loadStats } from '../../../utils/achievements';
import { hasCompletedLessonInSubject, recordGamePlay } from '../../../utils/gameStats';
import { getGameById } from '../../../components/games/gamesContent';
import TapMatchGame from '../../../components/games/TapMatchGame';
import MemoryPairsGame from '../../../components/games/MemoryPairsGame';
import TimedReflexGame from '../../../components/games/TimedReflexGame';
import LabelDropGame from '../../../components/games/LabelDropGame';
import MinimalBackButton from '../../../components/child/MinimalBackButton';

const ENGINES = {
  'tap-match': TapMatchGame,
  'memory-pairs': MemoryPairsGame,
  'timed-reflex': TimedReflexGame,
  'label-diagram': LabelDropGame,
};

export default function GamePlayerPage() {
  const { childUser } = useChild();
  const router = useRouter();
  const { gameId } = useParams();

  const game = useMemo(() => getGameById(childUser?.gradeId, gameId), [childUser?.gradeId, gameId]);

  const childId = childUser?.uid || childUser?.id;
  const unlocked = useMemo(() => {
    if (!game || !childId) return false;
    const completedTasksList = loadStats(childId).completedTasks_list || [];
    return hasCompletedLessonInSubject(completedTasksList, dbData, childUser.gradeId, game.subjectId);
  }, [game, childId, childUser?.gradeId]);

  const handleFinish = useCallback((stars) => {
    if (childId && game) recordGamePlay(childId, game.id, stars);
    router.push('/learning-zone/games');
  }, [childId, game, router]);

  if (!childUser) return null;

  if (!game) {
    return (
      <>
        <MinimalBackButton />
        <div className="text-center p-10 font-bold text-2xl text-gray-600">Game not found.</div>
      </>
    );
  }

  if (!unlocked) {
    return (
      <>
        <MinimalBackButton />
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-4">
          <p className="text-6xl">🔒</p>
          <h1 className="text-2xl font-black text-slate-700">Finish a {game.subjectLabel} lesson first!</h1>
          <p className="text-slate-500 font-medium max-w-sm">This game unlocks once you've completed a lesson in {game.subjectLabel}.</p>
          <button
            onClick={() => router.push('/learning-zone/games')}
            className="mt-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to Games
          </button>
        </div>
      </>
    );
  }

  const Engine = ENGINES[game.engine];
  if (!Engine) {
    return (
      <>
        <MinimalBackButton />
        <div className="text-center p-10 font-bold text-2xl text-gray-600">This game type isn't supported yet.</div>
      </>
    );
  }

  return (
    <>
      <MinimalBackButton />
      <Engine game={game} onFinish={handleFinish} />
    </>
  );
}
