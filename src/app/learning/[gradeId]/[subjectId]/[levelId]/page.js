'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../../../../components/layout/header/Header'), { ssr: false });
const Footer = dynamic(() => import('../../../../components/layout/footer/Footer'), { ssr: false });
const BackToTop = dynamic(() => import('../../../../components/ui/BackToTop'), { ssr: false });

// Import the new learning components
const LessonViewer = dynamic(() => import('../../../../components/learning/LessonViewer'), { ssr: false });
const QuizTaker = dynamic(() => import('../../../../components/learning/QuizTaker'), { ssr: false });
const ExamTaker = dynamic(() => import('../../../../components/learning/ExamTaker'), { ssr: false });
const TaskViewer = dynamic(() => import('../../../../components/learning/TaskViewer'), { ssr: false });

export default function LearningContentPage({ params }) {
  const { gradeId, subjectId, levelId } = params;

  // Static content data for demonstration
  // In a real application, this would be fetched from a database (e.g., Firebase)
  const contentData = {
    'grade1': {
      'mathematics': {
        'level1': [
          {
            type: 'lesson',
            id: 'lesson1',
            title: 'Introduction to Counting',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            text: 'This lesson introduces the basic concepts of counting from 1 to 10. You will learn to recognize numbers and count objects.',
          },
          {
            type: 'quiz',
            id: 'quiz1',
            title: 'Counting Quiz',
            questions: [
              { questionText: 'What is 1 + 1?', options: ['1', '2', '3'], correctAnswer: '2' },
              { questionText: 'How many fingers on one hand?', options: ['3', '4', '5'], correctAnswer: '5' },
            ],
          },
          {
            type: 'exam',
            id: 'exam1',
            title: 'Level 1 Math Exam',
            questions: [
              { id: 'q1', questionText: 'What is 2 + 2?', options: ['3', '4', '5'], correctAnswer: '4' },
              { id: 'q2', questionText: 'Count the number of wheels on a car.', options: ['2', '3', '4'], correctAnswer: '4' },
            ],
          },
          {
            type: 'task',
            id: 'task1',
            title: 'Daily Math Practice',
            description: 'Complete 10 addition problems.',
            instructions: [
              'Open your math workbook to page 25.',
              'Solve problems 1-10.',
              'Show your work.',
            ],
            dueDate: '2025-07-20',
          },
        ],
      },
    },
  };

  const currentContent = contentData[gradeId]?.[subjectId]?.[levelId];

  if (!currentContent || currentContent.length === 0) {
    return (
      <>
        <Header />
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl font-bold text-blue-600">Content Not Found</h1>
            <p className="mt-4 text-gray-600">No learning content available for {gradeId.replace('grade', 'Grade ')} - {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} - {levelId.replace('level', 'Level ')}.</p>
          </div>
        </section>
        <Footer />
        <BackToTop />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">
            {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} - {gradeId.replace('grade', 'Grade ')} - {levelId.replace('level', 'Level ')}
          </h1>
          <p className="mt-4 text-gray-600">
            Explore your learning content below.
          </p>

          <div className="mt-8">
            {currentContent.map((item) => {
              switch (item.type) {
                case 'lesson':
                  return <LessonViewer key={item.id} content={item} />;
                case 'quiz':
                  return <QuizTaker key={item.id} quizData={item} />;
                case 'exam':
                  return <ExamTaker key={item.id} examData={item} />;
                case 'task':
                  return <TaskViewer key={item.id} taskData={item} />;
                default:
                  return <p key={item.id}>Unknown content type: {item.type}</p>;
              }
            })}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}