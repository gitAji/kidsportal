"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faCube, faTasks, faGraduationCap, faHome } from "@fortawesome/free-solid-svg-icons";

const Timeline = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const steps = [];

  // Always add Home step
  steps.push({
    label: "Home",
    icon: faHome,
    href: "/",
  });

  if (segments[0] === "grades") {
    const grade = segments[1];
    const subject = segments[2];
    const level = segments[3];
    const task = segments[5];

    if (grade) {
      steps.push({
        label: `Grade ${grade}`,
        icon: faGraduationCap,
        href: `/#gradesCard`,
      });
    }
    if (subject) {
      steps.push({
        label: subject.charAt(0).toUpperCase() + subject.slice(1),
        icon: faBook,
        href: `/grades/${grade}/${subject}`,
      });
    }
    if (level) {
      steps.push({
        label: `Level ${level}`,
        icon: faCube,
        href: `/grades/${grade}/${subject}/${level}`,
      });
    }
    if (task) {
      const taskName = task.replace('task', 'Task ').replace(/-/g, ' ');
      steps.push({
        label: taskName.charAt(0).toUpperCase() + taskName.slice(1),
        icon: faTasks,
        href: pathname, // Link to the current full path
      });
    }
  }

  if (steps.length <= 1) {
    return null; // Don't render the timeline if it only has the "Home" link
  }

  return (
    <div className="w-full bg-white p-3 shadow-md mb-4 rounded-lg">
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <Link
              href={step.href}
              className={`flex flex-col items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition
                ${
                  pathname === step.href
                    ? "bg-green-500 text-white scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <FontAwesomeIcon icon={step.icon} className="text-base sm:text-lg mb-1" />
              <span>{step.label}</span>
            </Link>
            {idx < steps.length - 1 && (
              <div className="w-4 h-1 bg-gray-300 sm:w-8"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Timeline;

