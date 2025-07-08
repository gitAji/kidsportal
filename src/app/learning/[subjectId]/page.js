"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import Header from "../../../../components/layout/header/Header";
import Footer from "../../../../components/layout/footer/Footer";

export default function SubjectDetailPage({ params }) {
  const router = useRouter();
  const { subjectId } = params;
  const [subject, setSubject] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectAndLevels = async () => {
      try {
        // Fetch subject details
        const subjectDocRef = doc(db, 'subjects', subjectId);
        const subjectDocSnap = await getDoc(subjectDocRef);

        if (subjectDocSnap.exists()) {
          setSubject({ id: subjectDocSnap.id, ...subjectDocSnap.data() });

          // Fetch levels for the subject
          const levelsCollectionRef = collection(db, 'subjects', subjectId, 'levels');
          const q = query(levelsCollectionRef);

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const levelsData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setLevels(levelsData);
            setLoading(false);
          }, (err) => {
            console.error("Error fetching levels:", err);
            setError("Failed to load levels.");
            setLoading(false);
          });

          return () => unsubscribe();
        } else {
          setError("Subject not found.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching subject or levels:", err);
        setError("Failed to load subject details.");
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubjectAndLevels();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">Loading subject details...</p>
            <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center">
          <p className="text-gray-700">Subject not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">{subject.name}</h1>
          <p className="mt-4 text-gray-600">{subject.description}</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels.length === 0 ? (
              <p className="text-gray-700">No levels available for this subject yet.</p>
            ) : (
              levels.map((level) => (
                <div
                  key={level.id}
                  className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/learning/${subjectId}/${level.id}`)}
                >
                  <h3 className="text-2xl font-bold text-blue-600 mt-4">
                    {level.name}
                  </h3>
                  <p className="mt-2 text-gray-600">{level.description}</p>
                  {level.isPremium && (
                    <span className="mt-2 inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Premium</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
