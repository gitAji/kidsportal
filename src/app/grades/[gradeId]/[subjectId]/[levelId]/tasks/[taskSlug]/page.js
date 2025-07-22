"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Timeline from "../../../../../../../components/ui/Timeline";
import ContentCard from "../../../../../../../components/ui/ContentCard";
import InteractiveQuiz from "../../../../../../../components/learning/InteractiveQuiz";
import { slugify } from "../../../../../../../utils/slugify";

const TaskPage = () => {
  const { gradeId, subjectId, levelId, taskSlug } = useParams();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await fetch(`/api/grades/${gradeId}/${subjectId}/${levelId}/tasks`);
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const tasks = await res.json();
        const task = tasks.find(t => slugify(t.taskName) === taskSlug);
        if (!task) {
          throw new Error('Task not found');
        }
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

  const nextTaskPath = `/grades/${gradeId}/${subjectId}/${levelId}/tasks/task${parseInt(taskData?.taskId.replace('task-', '') || 0) + 1}`;

  const quizQuestion = taskData?.questions?.[0];

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
            <p>Loading...</p>
          ) : taskData.type === 'lesson' ? (
            <div className="p-4">{taskData.content}</div>
          ) : quizQuestion ? (
            <InteractiveQuiz quizData={quizQuestion} nextTaskPath={nextTaskPath} />
          ) : (
            <p>No quiz content available for this task.</p>
          )
        }
      />
    </div>
  );
};

export default TaskPage;
