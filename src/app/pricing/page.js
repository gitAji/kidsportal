"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

import { motion } from "framer-motion";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' or 'yearly'
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const plans = [
    {
      name: "Free Plan",
      priceMonthly: "$0",
      priceYearly: "$0",
      features: [
        "Limited access to grades and subjects",
        "Basic practice sessions",
        "Up to 5 children accounts",
        "Standard support",
      ],
      isCurrent: true,
      isPremium: false,
    },
    {
      name: "Premium Plan",
      priceMonthly: "$9.99",
      priceYearly: "$99.99",
      features: [
        "Full access to all grades and subjects",
        "Unlimited practice sessions",
        "Detailed progress reports",
        "Up to 3 children accounts",
        "Priority support",
        "Exclusive content",
      ],
      isCurrent: false,
      isPremium: true,
    },
  ];

  const handleChoosePlan = (planName) => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    if (planName === "Premium Plan") {
      router.push(`/profile?tab=payment`);
    } else {
      // Handle downgrade or other actions for Free Plan if necessary
      alert(
        "You are already on the Free Plan or cannot downgrade to it directly from here."
      );
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="page-heading mb-4">
            Choose Your Learning Adventure!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock a world of knowledge with our flexible plans. Select the best
            option that fits your family&apos;s learning journey.
          </p>
        </motion.div>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center items-center mb-8 space-x-4 bg-gray-200 rounded-full p-2 shadow-inner">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              billingCycle === "yearly"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-300"
            }`}
          >
            Yearly{" "}
            <span className="text-lime-400 text-sm ml-2">(Save 17%)</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white p-8 rounded-xl shadow-lg border-4 ${
                plan.isPremium ? "border-blue-500" : "border-gray-200"
              } flex flex-col justify-between transform transition-transform duration-300 hover:scale-105`}
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {plan.name}
                </h2>
                <p className="text-5xl font-extrabold text-blue-600 mb-6">
                  {billingCycle === "monthly"
                    ? plan.priceMonthly
                    : plan.priceYearly}
                  <span className="text-lg font-medium text-gray-500">
                    / {billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </p>
                <ul className="text-left text-gray-700 space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-3 text-xl">✔</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {plan.isCurrent ? (
                <button
                  className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-bold cursor-not-allowed"
                  disabled
                >
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => handleChoosePlan(plan.name)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold focus:outline-none focus:shadow-outline transition-colors duration-300"
                >
                  Choose Plan
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
