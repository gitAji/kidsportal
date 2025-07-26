// src/app/contact/page.js


export default function ContactPage() {
  return (
    <>
 
      <main className="flex-grow p-4 md:p-8">
        <div className="container mx-auto text-center py-16">
          <h1 className="page-heading mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">We&apos;d love to hear from you!</p>
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <p className="text-gray-700 mb-4">For support or inquiries, please email us at:</p>
            <a href="mailto:support@kidsportal.com" className="text-blue-600 hover:underline text-xl font-semibold">support@kidsportal.com</a>
          </div>
        </div>
      </main>
    
    </>
  );
}
