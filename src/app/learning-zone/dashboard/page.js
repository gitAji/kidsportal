"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaThLarge, FaTrophy, FaCog } from "react-icons/fa";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import MinimalBackButton from "../../components/child/MinimalBackButton";
import OverviewTabContent from "../../components/child/dashboard/OverviewTabContent";
import RewardsTabContent from "../../components/child/dashboard/RewardsTabContent";
import SettingsTabContent from "../../components/child/dashboard/SettingsTabContent";

const TABS = [
  { id: "overview", label: "Overview", icon: FaThLarge },
  { id: "rewards", label: "Rewards", icon: FaTrophy },
  { id: "settings", label: "Settings", icon: FaCog },
];

// One consolidated place for everything that used to be separate links in
// the profile dropdown (Rewards, Settings) plus a quick-glance summary —
// so the dropdown itself only ever needs two links: Dashboard and Logout.
function DashboardTabs() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    TABS.some((t) => t.id === requestedTab) ? requestedTab : "overview"
  );

  return (
    <div className="flex flex-col p-2 sm:p-4 relative font-sans">
      <MinimalBackButton />

      <div className="max-w-3xl mx-auto px-4 py-8 w-full relative z-10">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 text-center mb-6">
          My Dashboard
        </h1>

        <div className="flex gap-2 mb-8 bg-slate-100 rounded-2xl p-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all ${
                  isActive
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="text-sm" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && <OverviewTabContent />}
        {activeTab === "rewards" && <RewardsTabContent />}
        {activeTab === "settings" && <SettingsTabContent />}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8"><SkeletonLoader variant="page" message="Loading your dashboard..." /></div>}>
      <DashboardTabs />
    </Suspense>
  );
}
