"use client"; // Ensure this component is treated as a client component

import BackToTop from "../components/ui/BackToTop"; // BackToTop component

export default function HelpPage() {
  // Sample FAQs data
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the login page and click on 'Forgot Password'. Follow the instructions sent to your registered email.",
    },
    {
      question: "Where can I find my child's progress report?",
      answer:
        "You can find the progress report in the 'Analytics' section of your dashboard.",
    },
    {
      question: "What subjects are available for my child?",
      answer:
        "We offer a variety of subjects including Math, Science, English, and more. You can view the full list in the 'Learning' section.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact customer support through the 'Contact Us' form or by emailing support@example.com.",
    },
  ];

  return (
    <>
      {/* Header Section */}

      {/* Help Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">Help Center</h1>
          <p className="mt-4 text-gray-600">
            Find answers to your questions or contact us for assistance.
          </p>

          {/* FAQs Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-blue-600">
                  {faq.question}
                </h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Contact Information Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-blue-600">Contact Us</h2>
            <p className="mt-4 text-gray-600">
              If you need further assistance, feel free to reach out to us!
            </p>

            {/* Contact Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Support Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-blue-600">
                  Technical Support
                </h3>
                <p className="mt-2 text-gray-600">
                  For any technical issues, please contact:
                </p>
                <p className="mt-1 text-gray-800">
                  Email:{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600"
                  >
                    support@example.com
                  </a>
                </p>
                <p className="mt-1 text-gray-800">
                  Phone: <span className="text-blue-600">+1 234 567 890</span>
                </p>
              </div>

              {/* Subject-Specific Support Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-blue-600">
                  Subject-Specific Support
                </h3>
                <p className="mt-2 text-gray-600">
                  For queries related to subjects, please reach out to:
                </p>
                <p className="mt-1 text-gray-800">
                  Email:{" "}
                  <a
                    href="mailto:subjects@example.com"
                    className="text-blue-600"
                  >
                    subjects@example.com
                  </a>
                </p>
                <p className="mt-1 text-gray-800">
                  Phone: <span className="text-blue-600">+1 987 654 321</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <BackToTop />
    </>
  );
}
