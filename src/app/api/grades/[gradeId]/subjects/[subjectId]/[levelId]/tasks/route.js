import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/app/data/db.json');

export async function GET(request, { params }) {
  const { gradeId, subjectId, levelId } = params;

  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const grade = dbData.grades.find(g => g.gradeId === gradeId);
    if (!grade) {
      return NextResponse.json({ error: 'Grade not found' }, { status: 404 });
    }

    const subject = grade.subjects.find(s => s.subjectId === subjectId);
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const level = subject.levels.find(l => l.levelId === levelId);
    if (!level) {
      return NextResponse.json({ error: 'Level not found' }, { status: 404 });
    }

    const tasks = level.tasks || [];
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}