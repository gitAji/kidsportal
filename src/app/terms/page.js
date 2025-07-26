// src/app/terms/page.js
import Link from "next/link";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-16 px-4 md:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Terms of Service</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg prose lg:prose-xl max-w-4xl mx-auto">
            <p className="text-sm text-gray-500">Last Updated: July 26, 2024</p>

            <h2 className="text-2xl font-semibold mt-6">1. Your Agreement</h2>
            <p>By using our services, you agree to these Terms of Service and our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. You must be at least 18 years old or have the permission of a parent or guardian to use our services.</p>

            <h2 className="text-2xl font-semibold mt-6">2. Account Registration</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

            <h2 className="text-2xl font-semibold mt-6">3. Subscription and Payments</h2>
            <p>We offer both free and paid subscription plans. By choosing a paid plan, you agree to pay the subscription fees. All payments are processed through a secure third-party payment processor.</p>

            <h2 className="text-2xl font-semibold mt-6">4. Intellectual Property</h2>
            <p>All content on our platform, including lessons, quizzes, and games, is the exclusive property of KidsPortal. You may not reproduce, distribute, or create derivative works from our content without our express permission.</p>

            <h2 className="text-2xl font-semibold mt-6">5. Termination</h2>
            <p>We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of our services.</p>

            <h2 className="text-2xl font-semibold mt-6">6. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@kidsportal.com">support@kidsportal.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
