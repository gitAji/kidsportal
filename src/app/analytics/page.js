"use client"; // Ensure this component is treated as a client component

import { useState, useEffect } from "react"; // Import useState and useEffect
import AnimatedNumber from "../components/ui/CountUp"; // Import the new component
import BackToTop from "../components/ui/BackToTop"; // BackToTop component

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    totalHoursStudied: 0,
    subjectsCompleted: 0,
    quizzesTaken: 0,
    averageScore: 0,
    goalsAchieved: 0,
    recentActivity: [],
  });

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalyticsData = async () => {
      // In a real application, you would fetch this from an API
      // For now, we'll use a setTimeout to simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAnalyticsData({
        totalHoursStudied: 50,
        subjectsCompleted: 8,
        quizzesTaken: 15,
        averageScore: 85,
        goalsAchieved: 3,
        recentActivity: [
          "Math - Completed Chapter 2",
          "Science - Scored 90% on Quiz",
          "English - Read 5 chapters",
        ],
      });
    };

    fetchAnalyticsData();
  }, []);

  return (
    <>
      {/* Header Section */}

      {/* Analytics Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="page-heading">
            Analytics Overview
          </h1>
          <p className="mt-4 text-gray-600">
            Here you can view your childs learning analytics and progress.
          </p>

          {/* Analytics Data Display */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Total Hours Studied
              </h3>
              <p className="mt-4 text-lg text-gray-800">
                <AnimatedNumber number={analyticsData.totalHoursStudied} /> hours
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Subjects Completed
              </h3>
              <p className="mt-4 text-lg text-gray-800">
                <AnimatedNumber number={analyticsData.subjectsCompleted} /> subjects
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Quizzes Taken
              </h3>
              <p className="mt-4 text-lg text-gray-800">
                <AnimatedNumber number={analyticsData.quizzesTaken} /> quizzes
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Average Score
              </h3>
              <p className="mt-4 text-lg text-gray-800">
                <AnimatedNumber number={analyticsData.averageScore} />%
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Recent Activity
              </h3>
              <ul className="mt-4 text-gray-800">
                {analyticsData.recentActivity.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600">
                Goals Achieved
              </h3>
              <p className="mt-4 text-lg text-gray-800">
                <AnimatedNumber number={analyticsData.goalsAchieved} /> goals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}

      <BackToTop />
    </>
  );
}
