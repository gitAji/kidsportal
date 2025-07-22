"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TaskCard from "@/components/ui/TaskCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import Timeline from "@/components/ui/Timeline";

const LevelDetailPage = () => {
  const { gradeId, subjectId, levelId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/grades/${gradeId}/subjects/${subjectId}/${levelId}/tasks`);
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gradeId && subjectId && levelId) {
      fetchTasks();
    }
  }, [gradeId, subjectId, levelId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  const lessons = tasks.filter(task => task.type === 'lesson');
  const quizzes = tasks.filter(task => task.type === 'quiz');
  const exams = tasks.filter(task => task.type === 'exam');

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url('/images/intro11.png')" }}
    >
      <Timeline />
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <h1 className="page-heading text-center mb-8">
          Level {levelId} Tasks
        </h1>

        {tasks.length > 0 ? (
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
                      isUnlocked={true}
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
                      isUnlocked={true}
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
                      isUnlocked={true}
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