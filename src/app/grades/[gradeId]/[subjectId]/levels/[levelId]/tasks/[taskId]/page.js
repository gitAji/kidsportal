"use client";

import { useParams } from "next/navigation";
import ProgressBar from "../../../../../../../components/ui/ProgressBar";
import Timeline from "@/components/ui/Timeline";

const TaskPage = () => {
  const { gradeId, subjectId, levelId, taskId } = useParams();

  // For demonstration, a static progress. In a real app, this would be dynamic.
  const taskProgress = 75;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 flex flex-col items-center">
      <Timeline />
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-[var(--heading-color)] drop-shadow-lg">
          Task:{" "}
          {taskId
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${taskProgress}%` }}></div>
        </div>
        <p className="text-right text-gray-700 text-sm mt-1">
          {taskProgress.toFixed(0)}% Completed
        </p>
        <div className="bg-white p-10 rounded-lg shadow-xl text-gray-800 text-2xl leading-relaxed mt-8 w-full max-w-3xl mx-auto bg-cover bg-center" style={{ backgroundImage: "url('/images/bg1.jpeg')" }}>
          <p className="mb-4 text-center font-semibold">
            Welcome to the <strong className="text-blue-700">{taskId.replace(/-/g, " ")}</strong> task!
          </p>
          <p className="text-center">
            This is where the interactive content for this task will be
            displayed. Get ready to learn and have fun!
          </p>
          <p className="mt-4 text-center">
            You are currently in Grade <span className="font-bold text-blue-700">{gradeId}</span>, Subject <span className="font-bold text-blue-700">{subjectId}</span>, Level{" "}
            <span className="font-bold text-blue-700">{levelId}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
