import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'public/db.json');

export async function GET(request, { params }) {
  const { gradeId, subjectId } = params;

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

    const levels = subject.levels || [];
    return NextResponse.json(levels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}
