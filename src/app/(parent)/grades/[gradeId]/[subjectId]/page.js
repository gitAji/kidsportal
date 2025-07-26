"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LevelCard from "@/app/components/ui/LevelCard";
import LevelPath from "@/app/components/ui/LevelPath";
import Timeline from "@/app/components/ui/Timeline";
import { useSubscription } from "@/hooks/useSubscription";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";

const LevelsPage = () => {
  const { gradeId, subjectId } = useParams();
  const { isPremium } = useSubscription();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardRefs, setCardRefs] = useState([]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`/api/grades/${gradeId}/subjects/${subjectId}/levels`);
        if (!res.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await res.json();
        setLevels(data);
        setCardRefs(data.map(() => React.createRef()));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (gradeId && subjectId) {
      fetchLevels();
    }
  }, [gradeId, subjectId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url('/images/intro11.png')" }}
    >
      <Timeline />
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <LevelPath cardRefs={cardRefs} />
        <h1 className="page-heading text-center mb-8">
          {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} - Grade{" "}
          {gradeId}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {levels.map((level, i) => {
            const isUnlocked = !level.isLocked || isPremium;
            return (
              <LevelCard
                key={level.levelId}
                ref={cardRefs[i]}
                grade={gradeId}
                subject={subjectId}
                level={level}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
