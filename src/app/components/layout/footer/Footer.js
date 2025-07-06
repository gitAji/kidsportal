// app/src/components/Footer.js

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gray-800 text-white py-10">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 MyLearning Platform. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
