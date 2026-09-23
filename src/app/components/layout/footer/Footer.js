import Link from "next/link";
import { FaStar, FaChalkboardTeacher } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-10 sm:py-12 shadow-lg">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
            KidsPortal <FaStar className="ml-2 text-yellow-300" />
          </h3>
          <p className="text-base text-white/90 max-w-md mx-auto font-medium">
            Empowering young minds with engaging and interactive learning experiences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
          <Link href="/safety" className="hover:text-yellow-200 transition-colors text-base font-bold uppercase tracking-wider text-white/90">
            Safety
          </Link>
          <Link href="/privacy" className="hover:text-yellow-200 transition-colors text-base font-bold uppercase tracking-wider text-white/90">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-yellow-200 transition-colors text-base font-bold uppercase tracking-wider text-white/90">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-yellow-200 transition-colors text-base font-bold uppercase tracking-wider text-white/90">
            Contact Us
          </Link>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-white/80 font-semibold">&copy; {currentYear} KidsPortal. All rights reserved.</p>

          <Link
            href="/teacher-admin/login"
            className="group p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 opacity-40 hover:opacity-100"
            title="Teacher Portal Login"
          >
            <FaChalkboardTeacher className="text-xl group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
