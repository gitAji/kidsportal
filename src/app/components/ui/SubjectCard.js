import Link from 'next/link';
import React from 'react';

const SubjectCard = ({ gradeId, subject }) => {
  return (
    <Link href={`/grades/${gradeId}/${subject.id}`} className="p-6 rounded-lg shadow-lg text-center transform transition duration-300 hover:scale-110 hover:shadow-2xl bg-blue-500 hover:bg-blue-600">
        <h3 className="text-2xl font-bold text-white mb-2">{subject.name}</h3>
    </Link>
  );
};

export default SubjectCard;
