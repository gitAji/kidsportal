// src/app/privacy/page.js

import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="container mx-auto py-16">
          <h1 className="page-heading mb-6 text-center">Privacy Policy</h1>
          <div className="bg-white p-8 rounded-lg shadow-md leading-relaxed text-gray-700">
            <p className="mb-4">Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Information We Collect</h2>
            <p className="mb-4">We collect personal information that you voluntarily provide to us when you register on the services, express an interest in obtaining information about us or our products and services, when you participate in activities on the services, or otherwise when you contact us.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">How We Use Your Information</h2>
            <p className="mb-4">We use personal information collected via our services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Disclosure of Your Information</h2>
            <p className="mb-4">We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
            <ul className="list-disc list-inside mb-4">
              <li>By Law or to Protect Rights.</li>
              <li>Business Transfers.</li>
              <li>With Your Consent.</li>
            </ul>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Security of Your Information</h2>
            <p className="mb-4">We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Changes to This Privacy Policy</h2>
            <p className="mb-4">We may update this Privacy Policy from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date and the updated version will be effective as soon as it is accessible. We encourage you to review this Privacy Policy frequently to be informed of how we are protecting your information.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
