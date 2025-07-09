import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Header from '../../components/layout/header/Header';
import Footer from '../../components/layout/footer/Footer';

const GradeOverviewPage = ({ params }) => {
  const router = useRouter();
  const { gradeId } = params;

  // Define subjects and their corresponding paths
  const subjects = [
    { name: 'Math', path: 'math', color: "bg-[#FF6347]", textColor: "text-white" },
    { name: 'Tamil', path: 'tamil', color: "bg-[#32CD32]", textColor: "text-white" },
    { name: 'English', path: 'english', color: "bg-[#1E90FF]", textColor: "text-white" },
    { name: 'Ariviyal', path: 'ariviyal', color: "bg-[#FFD700]", textColor: "text-black" }, // Science in Tamil
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Grades
          </button>
        </div>
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          Grade {gradeId} - Subjects
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.path}
              href={`/grades/${gradeId}/${subject.path}`}
              passHref
            >
              <div
                className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-lg 
                  ${subject.color} ${subject.textColor} 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                <h2 className="text-2xl font-bold mb-2">{subject.name}</h2>
                <p className="text-sm">Explore lessons in {subject.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GradeOverviewPage;
