"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "../../../../../components/ui/ProgressBar";
import Timeline from "@/components/ui/Timeline";

const TaskCard = ({ task }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "In Progress":
        return "bg-yellow-500";
      default:
        return "bg-blue-500"; // Changed default to blue for 'Not Started'
    }
  };

  return (
    <Link
      href={task.href}
      className="block p-6 rounded-lg shadow-lg text-center transform transition duration-300 hover:scale-105 bg-white hover:bg-gray-100 border-4 border-transparent hover:border-blue-400"
    >
      <h3 className="text-2xl font-bold text-gray-800">{task.name}</h3>
      <div
        className={`mt-4 text-sm font-bold text-white px-3 py-1 rounded-full inline-block ${getStatusColor(
          task.status
        )}`}
      >
        {task.status}
      </div>
    </Link>
  );
};

const LevelPage = () => {
  const { gradeId, subjectId, levelId } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  // In a real app, you would fetch the tasks for the level from a database.
  useEffect(() => {
    const fetchedTasks = [
      {
        name: "Introduction to Alphabets",
        href: `/grades/${gradeId}/${subjectId}/levels/${levelId}/tasks/alphabets`,
        status: "Completed",
      },
      {
        name: "Counting Numbers",
        href: `/grades/${gradeId}/${subjectId}/levels/${levelId}/tasks/counting`,
        status: "In Progress",
      },
      {
        name: "Simple Words",
        href: `/grades/${gradeId}/${subjectId}/levels/${levelId}/tasks/words`,
        status: "Not Started",
      },
    ];
    setTasks(fetchedTasks);

    const completedTasks = fetchedTasks.filter(
      (t) => t.status === "Completed"
    ).length;
    setProgress((completedTasks / fetchedTasks.length) * 100);
  }, [gradeId, subjectId, levelId]);

  const handleTakeExam = () => {
    router.push(`/grades/${gradeId}/${subjectId}/levels/${levelId}/exam`);
  };

  const allTasksCompleted = progress === 100;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <Timeline />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-[var(--heading-color)] drop-shadow-lg">
          Level {levelId} -{" "}
          {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}
        </h1>
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
          <ProgressBar percentage={progress} />
          <p className="text-right text-white mt-2 text-lg">
            {progress.toFixed(0)}% Completed
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {tasks.map((task) => (
            <TaskCard key={task.name} task={task} />
          ))}
        </div>
        {allTasksCompleted && (
          <div className="text-center mt-12">
            <button
              onClick={handleTakeExam}
              className="bg-[var(--success-green)] hover:bg-green-700 text-white font-extrabold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition duration-300 text-xl tracking-wide"
            >
              Take Exam!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelPage;
