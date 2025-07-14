import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-10 sm:py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Kids Learning Portal</h3>
          <p className="text-sm opacity-90 max-w-md mx-auto">
            Empowering young minds with engaging and interactive learning experiences.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
          <Link href="/privacy" className="hover:underline text-lg">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline text-lg">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:underline text-lg">
            Contact Us
          </Link>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors duration-200">
            <FaFacebook className="text-3xl" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors duration-200">
            <FaTwitter className="text-3xl" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors duration-200">
            <FaInstagram className="text-3xl" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors duration-200">
            <FaLinkedin className="text-3xl" />
          </a>
        </div>

        <p className="text-sm opacity-80">&copy; {currentYear} Kids Learning Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}
