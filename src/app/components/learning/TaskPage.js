"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Timeline from "@/components/ui/Timeline";
import InteractiveQuiz from "@/components/learning/InteractiveQuiz";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

// This is a unified component to render all task pages consistently.
const TaskPageComponent = () => {
  const params = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { gradeId, subjectId, levelId, taskId } = params;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const res = await fetch(`/api/tasks/${gradeId}/${subjectId}/${levelId}/${taskId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        const data = await res.json();
        setQuizData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gradeId && subjectId && levelId && taskId) {
      fetchQuizData();
    }
  }, [gradeId, subjectId, levelId, taskId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  const currentTaskNumber = parseInt((taskId || "task0").replace('task', ''), 10);
  const nextTaskNumber = currentTaskNumber + 1;
  const nextTaskPath = `/grades/${gradeId}/${subjectId}/levels/${levelId}/tasks/task${nextTaskNumber}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <Timeline />
      </div>
      {quizData ? (
        <InteractiveQuiz quizData={quizData} nextTaskPath={nextTaskPath} />
      ) : (
        <div className="text-center p-8">Task data not found.</div>
      )}
    </div>
  );
};

export default TaskPageComponent;
