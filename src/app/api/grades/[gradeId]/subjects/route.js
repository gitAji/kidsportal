import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/app/data/db.json');

export async function GET(request, { params }) {
  const { gradeId } = await params;

  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const grade = dbData.grades.find(g => g.gradeId === gradeId);

    if (!grade) {
      return NextResponse.json({ error: 'Grade not found' }, { status: 404 });
    }

    const subjects = grade.subjects.map(s => ({ id: s.subjectId, name: s.subjectName }));
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}