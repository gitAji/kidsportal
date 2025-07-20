"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Timeline from "@/components/ui/Timeline";
import Lottie from "lottie-react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";

const GradeOverviewPage = ({ params = {} }) => {
  const router = useRouter();
  const { gradeId } = params;

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  // Define subjects and their corresponding paths
  const subjects = [
    {
      name: "Math",
      path: "math",
      levelPath: "counting",
      color: "bg-[#FF6347]",
      textColor: "text-white",
    },
    {
      name: "Tamil",
      path: "tamil",
      levelPath: "level1",
      color: "bg-[#32CD32]",
      textColor: "text-white",
    },
    {
      name: "English",
      path: "english",
      levelPath: "level1",
      color: "bg-[#1E90FF]",
      textColor: "text-white",
    },
    {
      name: "Ariviyal",
      path: "ariviyal",
      levelPath: "level1",
      color: "bg-[#FFD700]",
      textColor: "text-black",
    }, // Science in Tamil
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#87CEEB", // Sky blue background
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "bubble",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 200,
                size: 40,
                duration: 2,
                opacity: 0.8,
                speed: 3,
              },
              push: {
                quantity: 4,
              },
            },
          },
          particles: {
            color: {
              value: "#FFFFFF", // White bubbles
            },
            links: {
              enable: false,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle", // Bubbles
            },
            size: {
              value: { min: 1, max: 10 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Ensure it's in the background
        }}
      />
      <main className="flex-grow container mx-auto p-4 relative z-10">
        <Timeline />
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home
          </button>
        </div>
        <h1 key="welcome-message" className="page-heading text-center text-blue-700 mb-8 drop-shadow-lg animate__animated animate__bounceIn">
          Welcome to Grade {gradeId}!
        </h1>
        <div key="lottie-animation" className="flex justify-center mb-8">
          <Lottie
            animationData={{
              v: "5.7.4",
              fr: 60,
              ip: 0,
              op: 120,
              w: 100,
              h: 100,
              nm: "Simple Circle",
              ddd: 0,
              assets: [],
              layers: [
                {
                  ind: 1,
                  ty: 4,
                  nm: "Circle",
                  sr: 1,
                  ks: {
                    o: { a: 0, k: [100] },
                    r: { a: 0, k: [0] },
                    p: { a: 0, k: [50, 50, 0] },
                    a: { a: 0, k: [50, 50, 0] },
                    s: { a: 0, k: [100, 100, 100] },
                  },
                  ao: 0,
                  shapes: [
                    {
                      ty: "gr",
                      it: [
                        {
                          d: 1,
                          ty: "el",
                          s: { a: 0, k: [100, 100] },
                          p: { a: 0, k: [0, 0] },
                        },
                        {
                          ty: "fl",
                          c: { a: 0, k: [0.2, 0.8, 0.2, 1] },
                        },
                      ],
                      nm: "Group 1",
                      np: 3,
                      cix: 2,
                      hd: false,
                    },
                  ],
                  bm: 0,
                  sc: "#ffffff",
                  sh: 0,
                  cl: "",
                  ln: "",
                  ip: 0,
                  op: 120,
                  st: 0,
                  bm: 0,
                },
              ],
            }}
            loop={true}
            autoplay={true}
            style={{ width: 150, height: 150 }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {subjects.map((subject) => (
            <Link
              key={subject.path}
              href={`/grades/${gradeId}/${subject.path}`}
              passHref
            >
              <div
                className={`flex flex-col items-center justify-center p-8 rounded-xl shadow-lg 
                  ${subject.color} ${subject.textColor} 
                  transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer
                  border-4 border-transparent hover:border-blue-400 relative overflow-hidden
                  animate__animated animate__fadeInUp animate__delay-${index}s`}
              >
                {/* Subject Icon Placeholder */}
                <div className="mb-4 text-5xl">
                  {/* Replace with actual icons based on subject.name */}
                  {subject.name === "Math" && "🔢"}
                  {subject.name === "Tamil" && "📚"}
                  {subject.name === "English" && "📝"}
                  {subject.name === "Ariviyal" && "🔬"}
                </div>
                <h2 className="text-3xl font-bold mb-2">{subject.name}</h2>
                <p className="text-md">{subject.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GradeOverviewPage;
