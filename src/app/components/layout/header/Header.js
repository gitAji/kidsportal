"use client"; // Ensure this component is treated as a client component
import Image from "next/image";
import Link from "next/link";

export default function Header({ setIsModalOpen, setIsRegister }) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" passHref>
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={50}
              className="mr-2"
            />
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/learning" className="text-gray-600 hover:text-blue-600">
            Learning
          </Link>
          <Link href="/analytics" className="text-gray-600 hover:text-blue-600">
            Analytics
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/help" className="text-gray-600 hover:text-blue-600">
            Help
          </Link>
        </nav>
        <div className="flex space-x-4">
          <button
            className="text-gray-600 hover:text-blue-600"
            onClick={() => {
              setIsModalOpen(true); // Open the modal
              setIsRegister(false); // Set to login mode
            }}
          >
            Sign In
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => {
              setIsModalOpen(true); // Open the modal
              setIsRegister(true); // Set to signup mode
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
