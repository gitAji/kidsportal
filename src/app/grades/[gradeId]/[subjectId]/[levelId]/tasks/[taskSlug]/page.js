"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Timeline from "@/app/components/ui/Timeline";
import ContentCard from "@/app/components/ui/ContentCard";
import InteractiveQuiz from "@/app/components/learning/InteractiveQuiz";
import LessonViewer from "@/app/components/learning/LessonViewer";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";

const TaskPage = () => {
  const { gradeId, subjectId, levelId, taskSlug } = useParams();
  const router = useRouter();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await fetch(`/api/grades/${gradeId}/${subjectId}/${levelId}/tasks/${taskSlug}`);
        if (!res.ok) {
          throw new Error('Failed to fetch task');
        }
        const task = await res.json();
        setTaskData(task);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gradeId && subjectId && levelId && taskSlug) {
      fetchTaskData();
    }
  }, [gradeId, subjectId, levelId, taskSlug]);

  const handleNextQuestion = () => {
    if (taskData && currentQuestionIndex < taskData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Handle quiz completion, e.g., navigate to a results page or back to the level page
      router.push(`/grades/${gradeId}/${subjectId}/${levelId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <Timeline />
      </div>
      <ContentCard
        title={taskData ? taskData.taskName : "Loading..."}
        error={error}
        content={
          loading ? (
            <SkeletonLoader />
          ) : taskData.type === 'lesson' ? (
            <LessonViewer content={taskData.content} />
          ) : taskData.questions && taskData.questions.length > 0 ? (
            <InteractiveQuiz
              quizData={taskData.questions[currentQuestionIndex]}
              onCorrectAnswer={handleNextQuestion}
            />
          ) : (
            <p>No content available for this task.</p>
          )
        }
      />
    </div>
  );
};

export default TaskPage;
