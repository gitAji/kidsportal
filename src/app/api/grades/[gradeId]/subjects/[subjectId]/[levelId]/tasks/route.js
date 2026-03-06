import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/app/data/db.json');

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { gradeId, subjectId, levelId } = resolvedParams;

  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const cleanSubjectId = decodeURIComponent(subjectId)?.toLowerCase().replace(/ /g, '-');
    const cleanLevelId = decodeURIComponent(levelId)?.toLowerCase().replace(/ /g, '-');

    const grade = dbData.grades.find(g => g.gradeId?.toLowerCase().replace(/-/g, '') === gradeId?.toLowerCase().replace(/-/g, ''));
    if (!grade) {
      return NextResponse.json({ error: 'Grade not found' }, { status: 404 });
    }

    const subject = grade.subjects.find(s =>
      s.subjectId?.toLowerCase() === cleanSubjectId ||
      s.subjectName?.toLowerCase() === cleanSubjectId
    );
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const level = subject.levels.find(l => l.levelId?.toLowerCase() === cleanLevelId);
    if (!level) {
      return NextResponse.json({ error: 'Level not found' }, { status: 404 });
    }

    const tasks = level.tasks || [];
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}