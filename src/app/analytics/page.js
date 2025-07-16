"use client"; // Ensure this component is treated as a client component

import { useEffect } from "react"; // Import useEffect for side effects

import BackToTop from "../components/ui/BackToTop"; // BackToTop component

export default function AnalyticsPage() {
  // Example of analytics data fetching
  useEffect(() => {
    // This could be where you fetch analytics data
    console.log("Fetching analytics data...");
    // Example: Fetch analytics data from an API
    // fetch('/api/analytics')
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error fetching analytics:', error));
  }, []);

  return (
    <>
      {/* Header Section */}

      {/* Analytics Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">
            Analytics Overview
          </h1>
          <p className="mt-4 text-gray-600">
            Here you can view your childs learning analytics and progress.
          </p>

          {/* Sample Analytics Data Display */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Total Hours Studied
              </h3>
              <p className="mt-4 text-lg text-gray-800">50 hours</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Subjects Completed
              </h3>
              <p className="mt-4 text-lg text-gray-800">8 subjects</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Quizzes Taken
              </h3>
              <p className="mt-4 text-lg text-gray-800">15 quizzes</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Average Score
              </h3>
              <p className="mt-4 text-lg text-gray-800">85%</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Recent Activity
              </h3>
              <ul className="mt-4 text-gray-800">
                <li>Math - Completed Chapter 2</li>
                <li>Science - Scored 90% on Quiz</li>
                <li>English - Read 5 chapters</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Goals Achieved
              </h3>
              <p className="mt-4 text-lg text-gray-800">3 goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}

      <BackToTop />
    </>
  );
}
