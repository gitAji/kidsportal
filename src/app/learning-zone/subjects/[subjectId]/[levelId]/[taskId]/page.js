"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../../../data/db.json';
import SkeletonLoader from '../../../../../components/ui/SkeletonLoader';
import { FaArrowLeft } from 'react-icons/fa';
import { useChild } from '../../../../../providers/ChildProvider';

export default function TaskContentPage() {
  const { childUser } = useChild();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId, levelId, taskId } = params;

  useEffect(() => {
    if (childUser && childUser.gradeId) {
      const gradeData = dbData.grades.find(g => g.gradeId === childUser.gradeId);
      if (gradeData) {
        const foundSubject = gradeData.subjects.find(s => s.subjectId === subjectId);
        if (foundSubject) {
          const foundLevel = foundSubject.levels.find(l => l.levelId === levelId);
          if (foundLevel) {
            const foundTask = foundLevel.tasks.find(t => t.taskId === taskId);
            setTaskData(foundTask);
          } else {
            console.warn(`Level data not found for levelId: ${levelId}`);
          }
        } else {
          console.warn(`Subject data not found for subjectId: ${subjectId}`);
        }
      } else {
        console.warn(`Grade data not found for gradeId: ${childUser.gradeId}`);
      }
    } else if (!childUser) {
      router.push("/child-login");
    }
    setLoading(false);
  }, [childUser, subjectId, levelId, taskId, router]);

  if (loading) return <SkeletonLoader />;
  if (!childUser) return null;
  if (!taskData) return <div className="text-center p-10">Task not found.</div>;

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Tasks
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{taskData.taskName}</h1>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-700 text-lg mb-4">{taskData.content}</p>
        {/* Render questions/quiz/exam content based on taskData.type */}
        {taskData.questions && taskData.questions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Questions:</h3>
            {taskData.questions.map((q, index) => (
              <div key={q.questionId} className="mb-4 p-4 border rounded-lg">
                <p className="font-medium">{index + 1}. {q.questionText}</p>
                {q.options && (
                  <ul className="mt-2 list-disc list-inside">
                    {q.options.map((option, optIndex) => (
                      <li key={optIndex} className="text-gray-600">{option}</li>
                    ))}
                  </ul>
                )}
                {q.correctAnswer && <p className="text-green-600 mt-2">Correct Answer: {q.correctAnswer}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
