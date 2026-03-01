import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faLock } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../../utils/slugify";

const TaskCard = ({ grade, subject, level, task, isUnlocked }) => {
  // Destructure task safely with a default empty object in case 'task' is undefined
  const { taskId, taskName, type, status } = task || {};

  const getCardColors = () => {
    if (!isUnlocked) {
      return "bg-gray-400 cursor-not-allowed";
    }
    // Check if status is explicitly 'completed' before applying green
    if (status === "completed") {
      return "bg-green-500 hover:bg-green-600";
    }
    switch (type) {
      case "lesson":
        return "bg-blue-500 hover:bg-blue-600";
      case "quiz":
        return "bg-cyan-500 hover:bg-cyan-600";
      case "exam":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const cardClasses = `
    p-6
    rounded-lg
    shadow-lg
    text-center
    transform
    transition
    duration-300
    hover:scale-110
    hover:shadow-2xl
    relative
    text-white
    ${getCardColors()}
  `;

  // Ensure taskName is not undefined before slugifying
  const taskSlug = taskName ? slugify(taskName) : "";

  const content = (
    <>
      {/* Use optional chaining for taskName to prevent errors if taskName is undefined */}
      <h3 className="text-xl font-bold mb-2">{taskName || "Unknown Task"}</h3>
      <p className="mb-2">{type || "Unknown Type"}</p>
      <p className="text-sm font-light capitalize">
        {/* Safely call .replace() on status, providing a fallback string if status is undefined */}
        Status: {status?.replace(/_/g, " ") || "Unknown Status"}
      </p>
      {status === "completed" && (
        <div className="absolute top-2 right-2 text-yellow-400">
          <FontAwesomeIcon icon={faTrophy} size="2x" />
        </div>
      )}
      {!isUnlocked && (
        <div className="absolute bottom-2 right-2">
          <FontAwesomeIcon icon={faLock} size="2x" />
        </div>
      )}
    </>
  );

  // Ensure taskId and taskSlug are available for the Link href
  // Also, check if task is defined before rendering Link or div to prevent issues if 'task' itself is missing.
  if (!task || !taskId) {
    // Fallback or error handling if essential task data is missing
    console.error("TaskCard received incomplete or undefined task data:", task);
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error: Task data missing.
      </div>
    );
  }

  return isUnlocked ? (
    <Link
      href={`/grades/${grade}/${subject}/${level}/tasks/${taskSlug}`}
      className={cardClasses}
    >
      {content}
    </Link>
  ) : (
    <div className={cardClasses}>{content}</div>
  );
};

export default TaskCard;
