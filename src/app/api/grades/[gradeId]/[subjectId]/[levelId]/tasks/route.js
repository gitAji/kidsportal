// For older Next.js versions (Pages Router):
// pages/api/grades/[gradeId]/subjects/[subjectId]/levels/[levelId]/index.js

// For newer Next.js versions (App Router):
// app/api/grades/[gradeId]/subjects/[subjectId]/levels/[levelId]/route.js
// Make sure this file is inside the correct folder structure:
// app/api/grades/[gradeId]/subjects/[subjectId]/levels/[levelId]/route.js

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Resolve the path to your db.json file
// This assumes db.json is directly inside the 'public' directory at the root of your Next.js project.
const dbPath = path.resolve(process.cwd(), "src/app/data/db.json");

/**
 * Finds the tasks array for a specific grade, subject, and level from the db.json.
 * @param {string} gradeId
 * @param {string} subjectId
 * @param {string} levelId
 * @returns {Array|null} The array of tasks if found, otherwise null.
 */
function findLevelTasks(gradeId, subjectId, levelId) {
  try {
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const dbData = JSON.parse(rawData);

    // Normalize search terms: lowercase and handle 'gradeX' vs 'grade-X'
    const searchGrade = gradeId.toLowerCase().replace('grade', 'grade-').replace('--', '-');
    const searchSubject = subjectId.toLowerCase();
    const searchLevel = levelId.toLowerCase();

    const grade = dbData.grades.find((g) =>
      g.gradeId.toLowerCase() === searchGrade ||
      g.gradeId.toLowerCase() === gradeId.toLowerCase()
    );

    if (grade) {
      // Find subject, sometimes subjectId is 'tamil-1' vs 'tamil'
      const subject = grade.subjects.find((s) =>
        s.subjectId.toLowerCase() === searchSubject ||
        s.subjectName.toLowerCase() === searchSubject
      );

      if (subject) {
        const level = subject.levels.find((l) =>
          l.levelId.toLowerCase() === searchLevel ||
          l.levelName.toLowerCase().includes(searchLevel)
        );
        if (level) {
          return level.tasks;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error reading or parsing db.json:", error);
    return null;
  }
}

/**
 * Handles GET requests to retrieve tasks for a specific level.
 * @param {object} request - The Next.js request object.
 * @param {object} { params } - The parameters from the dynamic route (gradeId, subjectId, levelId).
 * @returns {NextResponse} JSON response containing the tasks or an error message.
 */
export async function GET(request, { params }) {
  try {
    const { gradeId, subjectId, levelId } = await params;
    const tasks = findLevelTasks(gradeId, subjectId, levelId);

    if (tasks) {
      // Successfully found and returned all tasks for the requested level
      return NextResponse.json(tasks);
    } else {
      // Level or its parent entities not found
      return NextResponse.json(
        {
          message:
            "Tasks not found for this level. Please check gradeId, subjectId, and levelId.",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Error fetching tasks:", error);
    // Return a generic error message to the client
    return NextResponse.json(
      {
        message:
          "Internal Server Error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
}
