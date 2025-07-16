import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaStar } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-10 sm:py-12 shadow-lg">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center">
            Kids Learning Portal <FaStar className="ml-2 text-yellow-300 animate-pulse" />
          </h3>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            Empowering young minds with engaging and interactive learning experiences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
          <Link href="/privacy" className="hover:underline text-xl">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline text-xl">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:underline text-xl">
            Contact Us
          </Link>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors duration-200">
            <FaFacebook className="text-3xl" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors duration-200">
            <FaTwitter className="text-3xl" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400 transition-colors duration-200">
            <FaInstagram className="text-3xl" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition-colors duration-200">
            <FaLinkedin className="text-3xl" />
          </a>
        </div>

        <p className="text-sm opacity-80">&copy; {currentYear} Kids Learning Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}
