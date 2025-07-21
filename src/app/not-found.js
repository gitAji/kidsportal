import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="p-8 text-center">
          <div className="text-9xl font-extrabold text-purple-600 animate-bounce">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mt-4 mb-8">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-lg"
            >
              <FaHome className="mr-2" />
              Go to Home
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300 shadow-lg"
            >
              <FaSearch className="mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
