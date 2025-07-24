"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card', 'paypal', 'vipps'
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState(""); // 'visa', 'mastercard', 'other'
  const [saveCard, setSaveCard] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setSelectedPlan("Premium Plan"); // Assuming only Premium Plan leads to payment
      setBillingCycle(plan); // 'monthly' or 'yearly'
    }
  }, [searchParams]);

  useEffect(() => {
    // Determine card type based on card number
    if (cardNumber.startsWith("4")) {
      setCardType("visa");
    } else if (cardNumber.startsWith("5")) {
      setCardType("mastercard");
    } else {
      setCardType("");
    }
  }, [cardNumber]);

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation (more robust validation would be needed for production)
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        setErrorMessage("Please fill in all card details.");
        return;
      }
      if (!/^[0-9]{16}$/.test(cardNumber)) {
        setErrorMessage("Card number must be 16 digits.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
        setErrorMessage("Expiry date must be in MM/YY format.");
        return;
      }
      if (!/^[0-9]{3,4}$/.test(cvv)) {
        setErrorMessage("CVV must be 3 or 4 digits.");
        return;
      }
    }

    if (!agreed) {
      setErrorMessage("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setSuccessMessage("Payment successful! Redirecting...");
      // In a real app, you'd integrate with a payment gateway here
      // On success, redirect to a confirmation page or dashboard
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Complete Your Purchase
      </h1>
      {selectedPlan && (
        <p className="text-center text-lg text-gray-600 mb-4">
          You are purchasing the <span className="font-semibold">{selectedPlan}</span> ({billingCycle})
        </p>
      )}

      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handlePaymentSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Payment Method:</label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-lg font-semibold ${
                paymentMethod === "card" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              Card
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-lg font-semibold ${
                paymentMethod === "paypal" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-md text-lg font-semibold ${
                paymentMethod === "vipps" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setPaymentMethod("vipps")}
            >
              Vipps
            </button>
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="**** **** **** ****"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="16"
                required
              />
              <div className="flex justify-end mt-2">
                {cardType === "visa" && <FaCcVisa className="text-blue-600 text-3xl" />}
                {cardType === "mastercard" && <FaCcMastercard className="text-orange-600 text-3xl" />}
              </div>
            </div>
            <div>
              <label htmlFor="cardName" className="block text-gray-700 text-sm font-bold mb-2">Name on Card:</label>
              <input
                type="text"
                id="cardName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Full Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">Expiry Date (MM/YY):</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  if (value.length > 2) {
                    setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
                  } else {
                    setExpiryDate(value);
                  }
                }}
                  maxLength="5"
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="cvv" className="block text-gray-700 text-sm font-bold mb-2">CVV:</label>
                <input
                  type="text"
                  id="cvv"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="123" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength="4"
                  required
                />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="saveCard"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
              />
              <label htmlFor="saveCard" className="ml-2 text-gray-700">Save card for future payments</label>
            </div>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="text-center py-8">
            <FaPaypal className="text-blue-700 text-6xl mx-auto mb-4" />
            <p className="text-gray-700 text-lg">You will be redirected to PayPal to complete your purchase.</p>
            <button
              type="button"
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
              onClick={() => alert("Redirecting to PayPal...")}
            >
              Continue with PayPal
            </button>
          </div>
        )}

        {paymentMethod === "vipps" && (
          <div className="text-center py-8">
            <Image src="/images/vipps-logo.png" alt="Vipps Logo" width={100} height={100} className="mx-auto mb-4" />
            <p className="text-gray-700 text-lg">You will be redirected to Vipps to complete your purchase.</p>
            <button
              type="button"
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
              onClick={() => alert("Redirecting to Vipps...")}
            >
              Continue with Vipps
            </button>
          </div>
        )}

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
