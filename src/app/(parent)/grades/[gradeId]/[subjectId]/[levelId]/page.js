import React from 'react';
import TaskCard from '@/app/components/ui/TaskCard';
import Timeline from '@/app/components/ui/Timeline';
import dbData from '../../../../../data/db.json';
import { getBackgroundImage } from '@/utils/getBackgroundImage';

async function getLevel(gradeId, subjectId, levelId) {
  const grade = dbData.grades.find(g => g.gradeId === gradeId);
  if (!grade) return null;
  const subject = grade.subjects.find(s => s.subjectId === subjectId);
  if (!subject) return null;
  return subject.levels.find(l => l.levelId === levelId) || null;
}

const LevelDetailPage = async ({ params }) => {
  const { gradeId, subjectId, levelId } = params;
  const level = await getLevel(gradeId, subjectId, levelId);
  const backgroundImage = getBackgroundImage();

  if (!level) {
    return <div className="text-center text-lg">Level not found.</div>;
  }

  const lessons = level.tasks.filter(task => task.type === 'lesson');
  const quizzes = level.tasks.filter(task => task.type === 'quiz');
  const exams = level.tasks.filter(task => task.type === 'exam');

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <Timeline />
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8">{level.levelName}</h1>

        {level.tasks.length > 0 ? (
          <>
            {lessons.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Lessons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {lessons.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      grade={gradeId}
                      subject={subjectId}
                      level={levelId}
                      task={task}
                      isUnlocked={!level.isLocked}
                    />
                  ))}
                </div>
              </section>
            )}

            {quizzes.length > 0 && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Quizzes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {quizzes.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      grade={gradeId}
                      subject={subjectId}
                      level={levelId}
                      task={task}
                      isUnlocked={!level.isLocked}
                    />
                  ))}
                </div>
              </section>
            )}

            {exams.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Exams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {exams.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      grade={gradeId}
                      subject={subjectId}
                      level={levelId}
                      task={task}
                      isUnlocked={!level.isLocked}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <p>No tasks for this level.</p>
        )}
      </div>
    </div>
  );
};

export default LevelDetailPage;
