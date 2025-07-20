import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-9xl font-extrabold text-gray-800">
            Sorry, we couldn’t find that page.
          </h1>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Go to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
