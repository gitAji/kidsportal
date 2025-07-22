import { NextResponse } from 'next/server';
import dbData from '@/public/db.json';

export async function GET(request, { params }) {
  const { gradeId, subjectId } = params;

  try {
    const grade = dbData.grades.find(g => g.id === gradeId);
    if (!grade) {
      return NextResponse.json({ error: 'Grade not found' }, { status: 404 });
    }

    const subject = grade.subjects.find(s => s.id === subjectId);
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const levels = subject.levels || [];
    return NextResponse.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
