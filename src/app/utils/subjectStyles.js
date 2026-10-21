// Single source of truth for each subject's color identity and icon,
// used by the Learning Zone hub and every page that should carry a
// subject's color through (e.g. its modules/levels page). Keeping this in
// one place avoids the two copies drifting apart, which is what happened
// before this file existed — the modules page hard-coded its own copy of
// these exact colors, but cycled through all of them per-level instead of
// using the one that actually matches the subject you're in.
import { FaBookOpen, FaCalculator, FaMicroscope, FaLanguage, FaStar, FaCode, FaLaptopCode } from 'react-icons/fa';

export const SUBJECT_STYLE_MAP = {
  "English": { bg: "bg-[#FF9B9B]", border: "border-[#FF7272]", icon: "text-[#FF7272]" },
  "Math": { bg: "bg-[#72C6FF]", border: "border-[#40A5E5]", icon: "text-[#40A5E5]" },
  "Tamil": { bg: "bg-[#72E5A8]", border: "border-[#4CC287]", icon: "text-[#4CC287]" },
  "Science": { bg: "bg-[#FFC972]", border: "border-[#E5A840]", icon: "text-[#E5A840]" },
  "Coding": { bg: "bg-[#C48CFF]", border: "border-[#A05CFF]", icon: "text-[#A05CFF]" },
  "Computer Science": { bg: "bg-[#8CEFFF]", border: "border-[#5CCEE5]", icon: "text-[#5CCEE5]" },
  "default": { bg: "bg-[#D1D5DB]", border: "border-[#9CA3AF]", icon: "text-[#9CA3AF]" },
};

export const SUBJECT_ICON_MAP = {
  "English": FaBookOpen,
  "Math": FaCalculator,
  "Tamil": FaLanguage,
  "Science": FaMicroscope,
  "Coding": FaCode,
  "Computer Science": FaLaptopCode,
  "default": FaStar,
};
