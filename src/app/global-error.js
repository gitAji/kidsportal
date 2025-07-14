"use client";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <h1 className="text-5xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-lg text-red-600 mb-4">{error.message}</p>
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
