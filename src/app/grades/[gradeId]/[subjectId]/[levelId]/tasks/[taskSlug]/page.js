"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Timeline from "@/components/ui/Timeline";
import ContentCard from "@/components/ui/ContentCard";
import InteractiveQuiz from "@/components/learning/InteractiveQuiz";
import LessonViewer from '@/components/learning/LessonViewer';
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import Timer from "@/components/ui/Timer";
import QuizResults from '@/components/learning/QuizResults';

const TaskPage = () => {
  const { gradeId, subjectId, levelId, taskSlug } = useParams();
  const router = useRouter();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!gradeId || !subjectId || !levelId || !taskSlug) return;

      console.log("Fetching data for taskSlug:", taskSlug);
      const apiUrl = `/api/grades/${gradeId}/${subjectId}/${levelId}/tasks/${taskSlug}`;
      console.log("API URL:", apiUrl);

      try {
        const res = await fetch(apiUrl);
        console.log("API Response Status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error Response:", errorText);
          throw new Error(`Failed to fetch task. Status: ${res.status}`);
        }
        
        const task = await res.json();
        console.log("Fetched Task Data:", task);
        setTaskData(task);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [gradeId, subjectId, levelId, taskSlug]);

  const handleCorrectAnswer = () => {
    setScore(score + 1);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (taskData && currentQuestionIndex < taskData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleTimeUp = () => {
    setQuizFinished(true);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
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
          ) : quizFinished ? (
            <QuizResults score={score} total={taskData.questions.length} onRetry={handleRetry} />
          ) : taskData.type === 'lesson' ? (
            <LessonViewer content={taskData.content} />
          ) : taskData.questions && taskData.questions.length > 0 ? (
            <>
              {taskData.timeLimit && <div className="flex justify-center mb-4"><Timer initialTime={taskData.timeLimit} onTimeUp={handleTimeUp} /></div>}
              <InteractiveQuiz
                quizData={taskData.questions[currentQuestionIndex]}
                onCorrectAnswer={handleCorrectAnswer}
                onWrongAnswer={handleNextQuestion}
              />
            </>
          ) : (
            <p>No content available for this task.</p>
          )
        }
      />
    </div>
  );
};

export default TaskPage;
