import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/app/data/db.json');

export async function GET() {
  try {
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    // Return the full grade data, not just a mapped subset
    const grades = dbData.grades;
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
