"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get("plan"); // 'monthly' or 'yearly'

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const price = planType === "yearly" ? "$100" : "$10";
  const billingPeriod = planType === "yearly" ? "year" : "month";

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Simulate payment processing
    try {
      // In a real application, you would integrate with a payment gateway here (e.g., Stripe, PayPal)
      // This is a placeholder for demonstration purposes.
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network request

      const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (paymentSuccess) {
        setMessage("Payment successful! Redirecting...");
        // In a real app, update user's subscription status in your database
        setTimeout(() => {
          router.push("/profile?payment=success"); // Redirect to profile with success message
        }, 1500);
      } else {
        throw new Error("Payment failed. Please check your details.");
      }
    } catch (error) {
      setMessage(`Payment failed: ${error.message}. Please try again.`);
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 flex items-center justify-center">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center"
        >
          <h1 className="text-4xl font-bold text-blue-700 mb-6">Complete Your Purchase</h1>
          <p className="text-lg text-gray-700 mb-4">
            You are upgrading to the <span className="font-semibold">Premium Plan</span> for{' '}
            <span className="font-bold text-blue-600">{price}</span> per {billingPeriod}.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will be charged {price} every {billingPeriod}.
          </p>

          {message && (
            <div
              className={`p-3 mb-4 rounded text-center ${
                message.includes("successful")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-left text-gray-700 text-sm font-bold mb-2">
                Card Number:
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="**** **** **** ****"
                required
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label htmlFor="expiryDate" className="block text-left text-gray-700 text-sm font-bold mb-2">
                  Expiry Date (MM/YY):
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="cvv" className="block text-left text-gray-700 text-sm font-bold mb-2">
                  CVV:
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="***"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="cardHolderName" className="block text-left text-gray-700 text-sm font-bold mb-2">
                Cardholder Name:
              </label>
              <input
                type="text"
                id="cardHolderName"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Full Name"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>

          <div className="mt-6 text-gray-600">
            <p className="mb-2">Other payment options:</p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg">
                <img src="/images/paypal-logo.png" alt="PayPal" className="h-5 mr-2" />
                PayPal
              </button>
              <button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">
                <img src="/images/vipps-logo.png" alt="Vipps" className="h-5 mr-2" />
                Vipps
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
