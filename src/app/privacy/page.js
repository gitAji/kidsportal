// src/app/privacy/page.js
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-16 px-4 md:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Privacy Policy</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg prose lg:prose-xl max-w-4xl mx-auto">
            <p className="text-sm text-gray-500">Last Updated: July 26, 2024</p>

            <h2 className="text-2xl font-semibold mt-6">1. Introduction</h2>
            <p>Welcome to KidsPortal (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting the privacy of all our users, especially children. This Privacy Policy outlines how we collect, use, and protect your personal information and the rights you have concerning it. This policy is designed to comply with the Children&apos;s Online Privacy Protection Act (COPPA) and the General Data Protection Regulation (GDPR).</p>

            <h2 className="text-2xl font-semibold mt-6">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mt-4">For Parents/Guardians:</h3>
            <ul>
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
              <li><strong>Payment Information:</strong> If you subscribe to a premium plan, we collect payment information through our secure third-party payment processor. We do not store your credit card details.</li>
            </ul>
            <h3 className="text-xl font-semibold mt-4">For Children:</h3>
            <ul>
              <li><strong>Account Information:</strong> We collect a username and a password for the child. We do not require the child&apos;s real name.</li>
              <li><strong>Usage Information:</strong> We collect information about the child&apos;s progress, including lessons completed, quiz scores, and time spent on the platform. This is used to provide progress reports to the parent/guardian.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6">3. How We Use Your Information</h2>
            <ul>
              <li>To provide and maintain our services.</li>
              <li>To personalize the learning experience for your child.</li>
              <li>To communicate with you about your account and our services.</li>
              <li>To process payments and manage subscriptions.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6">4. Parental Rights (COPPA & GDPR)</h2>
            <p>As a parent or guardian, you have the right to:</p>
            <ul>
              <li>Review the personal information we have collected from your child.</li>
              <li>Request that we delete your child&apos;s personal information.</li>
              <li>Refuse to permit further collection or use of your child&apos;s information.</li>
            </ul>
            <p>To exercise these rights, please contact us at <a href="mailto:privacy@kidsportal.com">privacy@kidsportal.com</a>.</p>

            <h2 className="text-2xl font-semibold mt-6">5. Data Security</h2>
            <p>We have implemented administrative, technical, and physical security measures to protect your personal information. However, no security system is impenetrable, and we cannot guarantee the security of our database.</p>

            <h2 className="text-2xl font-semibold mt-6">6. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. We encourage you to review this policy periodically for any changes.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
