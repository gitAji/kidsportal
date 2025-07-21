"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCube, faTasks } from "@fortawesome/free-solid-svg-icons";

const SimpleTimeline = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const grade = segments[1];
  const subject = segments[2];
  const level = segments[4];
  const task = segments[5];

  const subjectName = subject?.charAt(0).toUpperCase() + subject?.slice(1);
  const taskName = task?.replace(/-/g, " ");

  const steps = [];

  // Subject Step
  if (grade && subject) {
    steps.push({
      label: subjectName,
      icon: faBook,
      href: `/grades/${grade}/${subject}`,
    });
  }

  // Level Step
  if (grade && subject && level) {
    steps.push({
      label: `Level ${level}`,
      icon: faCube,
      href: `/grades/${grade}/${subject}/levels/${level}`,
    });
  }

  // Task Step
  if (grade && subject && level && task) {
    steps.push({
      label: taskName,
      icon: faTasks,
      href: `/grades/${grade}/${subject}/levels/${level}/${task}`,
    });
  }

  return (
    <div className="w-full bg-white p-3 shadow-md mb-4 rounded-lg">
      <div className="flex justify-center gap-4 sm:gap-6">
        {steps.map((step, idx) => (
          <Link
            key={idx}
            href={step.href}
            className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                pathname.startsWith(step.href)
                  ? "bg-blue-500 text-white scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <FontAwesomeIcon icon={step.icon} className="text-lg mb-1" />
            <span>{step.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimpleTimeline;