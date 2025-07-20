"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faHome,
  faBook,
  faCube,
  faTasks,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const Timeline = () => {
  const pathname = usePathname();

  const getPathSegment = (index) => {
    const segments = pathname.split("/").filter((s) => s);
    return segments[index] || "";
  };

  const grade = getPathSegment(1); // Grade
  const subject = getPathSegment(2); // Subject
  const level = getPathSegment(3); // Level
  const task = getPathSegment(4); // Task

  const stages = [
    { name: "Home", href: "/", icon: faHome },
    { name: `Grade ${grade}`, href: `/grades/${grade}`, icon: faBook },
    {
      name: `Subject ${subject}`,
      href: `/grades/${grade}/${subject}`,
      icon: faCube,
    },
    { name: `Levels`, href: `/grades/${grade}/${subject}`, icon: faTasks },
    { name: `Task ${task}`, href: pathname, icon: faTasks },
  ].filter((stage) => stage.name.includes("undefined") === false);

  return (
    <nav className="w-full bg-white p-4 shadow-md mb-4 overflow-x-auto">
      <ol className="flex justify-center items-center space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8">
        {stages.map((stage, index) => {
          const isActive = pathname === stage.href;
          const isCompleted =
            pathname.startsWith(stage.href) && pathname !== stage.href;

          return (
            <li key={stage.href + index} className="flex items-center">
              {index > 0 && (
                <span className="text-gray-400 mx-1 sm:mx-2">
                  {isCompleted ? (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500 text-lg"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-blue-500 text-lg"
                    />
                  )}
                </span>
              )}
              <Link
                href={stage.href}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${isCompleted && !isActive ? "bg-green-100 text-green-700" : ""}
                ${!isActive && !isCompleted ? "opacity-60" : ""}
                hover:scale-105 transform transition-all duration-200 ease-in-out`}
              >
                <FontAwesomeIcon icon={stage.icon} className="text-xl mb-1" />
                <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  {stage.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Timeline;
