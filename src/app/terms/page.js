// src/app/terms/page.js

import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="container mx-auto py-16">
          <h1 className="page-heading mb-6 text-center">Terms of Service</h1>
          <div className="bg-white p-8 rounded-lg shadow-md leading-relaxed text-gray-700">
            <p className="mb-4">Welcome to KidsPortal! These Terms of Service (&quot;Terms&quot;) govern your use of the KidsPortal website and services. By accessing or using our services, you agree to be bound by these Terms and all terms incorporated by reference.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">By creating an account or using KidsPortal, you confirm that you are at least 18 years of age or are accessing the services under the supervision of a parent or legal guardian who agrees to be bound by these Terms.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Changes to Terms</h2>
            <p className="mb-4">We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the services after any such changes constitutes your acceptance of the new Terms.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Accounts</h2>
            <p className="mb-4">When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Content and Conduct</h2>
            <p className="mb-4">You are responsible for any content you post and for any activity that occurs under your account. You agree not to use the service for any unlawful or prohibited activities.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Intellectual Property</h2>
            <p className="mb-4">The service and its original content, features, and functionality are and will remain the exclusive property of KidsPortal and its licensors.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Termination</h2>
            <p className="mb-4">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Governing Law</h2>
            <p className="mb-4">These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms, please contact us at support@kidsportal.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
