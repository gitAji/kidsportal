"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../data/db.json';
import SkeletonLoader from '@/app/components/ui/SkeletonLoader';
import { FaArrowLeft } from 'react-icons/fa';
import InteractiveQuiz from '@/app/components/learning/InteractiveQuiz';
import CompletionModal from '@/app/components/learning/CompletionModal';
import LevelPath from '@/app/components/learning/LevelPath';
import MinimalBackButton from '@/app/components/child/MinimalBackButton';

const LessonViewer = ({ task, subjectId }) => {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.push(`/learning-zone/subjects/${subjectId}`)}
        className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Levels
      </button>
      <h2 className="text-2xl font-bold mb-4">{task.taskName}</h2>
      <div dangerouslySetInnerHTML={{ __html: task.content }} />
    </div>
  );
};

export default function LevelPage() {
    const [childUser, setChildUser] = useState(null);
    const [levelData, setLevelData] = useState(null);
    const [subjectId, setSubjectId] = useState(null); // Add state for subjectId
    const [activeTask, setActiveTask] = useState(null);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completionResults, setCompletionResults] = useState(null);
    const params = useParams();
    const router = useRouter();
    const { levelId } = params;

    useEffect(() => {
        const storedChildUser = sessionStorage.getItem("childUser");
        if (storedChildUser) {
            const user = JSON.parse(storedChildUser);
            setChildUser(user);
            const completed = user.assignedTasks?.filter(t => t.status === 'completed').map(t => t.taskId) || [];
            setCompletedTasks(completed);
        } else {
            router.push("/child-login");
            return;
        }

        let foundLevel = null;
        let foundSubjectId = null;
        for (const grade of dbData.grades) {
            for (const subject of grade.subjects) {
                foundLevel = subject.levels.find(l => l.levelId === levelId);
                if (foundLevel) {
                    foundSubjectId = subject.subjectId;
                    break;
                }
            }
            if (foundLevel) break;
        }

        if (foundLevel) {
            setLevelData(foundLevel);
            setSubjectId(foundSubjectId); // Set the found subjectId
            // Set the first uncompleted task as active, or the first task overall
            const firstUncompleted = foundLevel.tasks.find(t => !completed.includes(t.taskId));
            setActiveTask(firstUncompleted || foundLevel.tasks[0]);
        }
        setLoading(false);
    }, [levelId, router]);

    const handleQuizComplete = (results) => {
        const updatedCompletedTasks = [...completedTasks, results.taskId];
        setCompletedTasks(updatedCompletedTasks);
        setCompletionResults(results);
        setShowCompletionModal(true);

        const updatedUser = {
            ...childUser,
            points: (childUser.points || 0) + results.pointsEarned,
            assignedTasks: childUser.assignedTasks.map(t => 
                t.taskId === results.taskId ? { ...t, status: 'completed' } : t
            ),
            ...(results.stickerAwarded && {
                stickers: [...(childUser.stickers || []), results.stickerAwarded]
            })
        };
        sessionStorage.setItem('childUser', JSON.stringify(updatedUser));
        setChildUser(updatedUser);
    };

    const handleCloseModal = () => {
        setShowCompletionModal(false);
        // Find the next task and set it as active
        const currentIndex = levelData.tasks.findIndex(t => t.taskId === activeTask.taskId);
        if (currentIndex < levelData.tasks.length - 1) {
            setActiveTask(levelData.tasks[currentIndex + 1]);
        }
    };

    if (loading) return <SkeletonLoader />;
    if (!levelData) return <div className="text-center p-10">Level not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-teal-100 p-4 sm:p-8">
            <MinimalBackButton />
            <div className="max-w-7xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">{levelData.levelName}</h2>
                    <LevelPath 
                        tasks={levelData.tasks}
                        activeTaskId={activeTask?.taskId}
                        completedTaskIds={completedTasks}
                        onTaskSelect={setActiveTask}
                    />
                </div>

                <main className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
                    {activeTask && (
                        <>
                            {activeTask.type === 'lesson' && <LessonViewer task={activeTask} subjectId={subjectId} />}
                            {(activeTask.type === 'quiz' || activeTask.type === 'exam') && 
                                <InteractiveQuiz 
                                    task={activeTask} 
                                    childUser={childUser} 
                                    onQuizComplete={handleQuizComplete} 
                                />
                            }
                        </>
                    )}
                </main>
            </div>
            <CompletionModal 
                isOpen={showCompletionModal}
                onClose={handleCloseModal}
                results={completionResults}
            />
        </div>
    );
}
