import { NextResponse } from 'next/server';
import { slugify } from '@/utils/slugify';
import dbData from '../../../../../../../data/db.json';

function findTaskBySlug(gradeId, subjectId, levelId, taskSlug) {
  const grade = dbData.grades.find(g => g.gradeId === gradeId);
  if (grade) {
    const subject = grade.subjects.find(s => s.subjectId === subjectId);
    if (subject) {
      const level = subject.levels.find(l => l.levelId === levelId);
      if (level) {
        return level.tasks.find(t => slugify(t.taskName) === taskSlug);
      }
    }
  }
  return null;
}

export async function GET(request, { params }) {
  try {
    const { gradeId, subjectId, levelId, taskSlug } = await params;
    const task = findTaskBySlug(gradeId, subjectId, levelId, taskSlug);

    if (task) {
      return NextResponse.json(task);
    } else {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
