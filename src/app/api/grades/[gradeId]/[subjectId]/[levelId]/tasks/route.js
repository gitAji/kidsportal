import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'public/db.json');

function findLevelTasks(gradeId, subjectId, levelId) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  const grade = dbData.grades.find(g => g.gradeId === gradeId);
  if (grade) {
    const subject = grade.subjects.find(s => s.subjectId === subjectId);
    if (subject) {
      const level = subject.levels.find(l => l.levelId === levelId);
      if (level) {
        return level.tasks;
      }
    }
  }
  return null;
}

export async function GET(request, { params }) {
  try {
    const { gradeId, subjectId, levelId } = params;
    const tasks = findLevelTasks(gradeId, subjectId, levelId);

    if (tasks) {
      return NextResponse.json(tasks);
    } else {
      return NextResponse.json({ message: 'Tasks not found for this level' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
