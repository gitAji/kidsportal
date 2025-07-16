"use client";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

export default function GlobalError({ error, reset }) {
  // Log the error to an error reporting service in production
  console.error("Global Error Caught:", error);

  return (
    <html>
      <body>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 text-center">
          <h1 className="text-5xl font-bold mb-4 text-red-600">Oops! Something went wrong.</h1>
          <p className="text-lg mb-4">We apologize for the inconvenience. Our team has been notified.</p>
          <p className="text-md text-gray-600 mb-6">Error details: {error.message}</p>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
        <Footer />
      </body>
    </html>
  );
}
