"use client"; // Ensure this component is treated as a client component

import { useState } from "react"; // Import useState for state management
import Header from "../components/layout/header/Header"; // Header component
import Footer from "../components/layout/footer/Footer"; // Footer component
import BackToTop from "../components/ui/BackToTop"; // BackToTop component
import Link from "next/link"; // Next.js Link for navigation

export default function PricingPage() {
  // State to manage the selected plan
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  // Pricing details for each plan with associated colors
  const pricingOptions = [
    {
      plan: "Bronze",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Access for 1 student to 1 grade",
      color: "bg-[#FFEBEE]", // Light Red
    },
    {
      plan: "Silver",
      monthlyPrice: 20,
      yearlyPrice: 200,
      description: "Access for up to 2 students to 2 grades",
      color: "bg-[#E3F2FD]", // Light Blue
    },
    {
      plan: "Gold",
      monthlyPrice: 30,
      yearlyPrice: 300,
      description: "Access to N# of students and grades",
      color: "bg-[#E8F5E9]", // Light Green
    },
  ];

  return (
    <>
      {/* Header Section */}
      <Header />

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">Pricing Plans</h1>
          <p className="mt-4 text-gray-600">
            Choose the best plan that suits your child learning needs.
          </p>

          {/* Plan Toggle */}
          <div className="mt-8">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`py-2 px-4 rounded-lg mx-2 ${
                selectedPlan === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`py-2 px-4 rounded-lg mx-2 ${
                selectedPlan === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Pricing Table */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingOptions.map((option, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-lg ${option.color}`}
              >
                <h3 className="text-2xl font-bold text-blue-600">
                  {option.plan}
                </h3>
                <p className="mt-4 text-gray-600">
                  {selectedPlan === "monthly" ? (
                    <span className="font-bold">${option.monthlyPrice}</span>
                  ) : (
                    <span className="font-bold">${option.yearlyPrice}</span>
                  )}
                  <span className="text-gray-600">
                    {" "}
                    {selectedPlan === "monthly" ? "per month" : "per year"}
                  </span>
                </p>
                <p className="mt-2 text-gray-600">{option.description}</p>
                <Link href="/signup">
                  <button className="mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700">
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
      <BackToTop />
    </>
  );
}
