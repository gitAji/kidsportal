"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaLock, FaCheckCircle, FaTimesCircle, FaMobileAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setSelectedPlan("Premium Plan"); // Assuming only Premium Plan leads to payment
      setBillingCycle(plan); // 'monthly' or 'yearly'
    }
  }, [searchParams]);

  useEffect(() => {
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

    setIsProcessing(true);
    setTimeout(() => {
      setSuccessMessage("Payment successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 w-full max-w-xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500"></div>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
          <FaLock className="text-blue-500" /> Secure Checkout
        </h1>
        {selectedPlan && (
          <p className="text-slate-500 font-medium mt-3 text-lg">
            Upgrading to <span className="font-bold text-blue-600">{selectedPlan}</span> ({billingCycle})
          </p>
        )}
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-100 flex items-center gap-3">
              <FaTimesCircle className="flex-shrink-0 text-xl" />
              <p className="text-sm font-semibold">{errorMessage}</p>
            </div>
          </motion.div>
        )}
        {successMessage && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-2xl border border-green-100 flex items-center gap-3">
              <FaCheckCircle className="flex-shrink-0 text-xl" />
              <p className="text-sm font-semibold">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handlePaymentSubmit} className="space-y-6">

        {/* Payment Methods */}
        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-slate-500">Select Payment Method</label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              className={`flex-1 py-4 px-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 border-2 ${paymentMethod === "card" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
                }`}
              onClick={() => setPaymentMethod("card")}
            >
              <FaCcVisa className="text-2xl" /> Card
            </button>
            <button
              type="button"
              className={`flex-1 py-4 px-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 border-2 ${paymentMethod === "paypal" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-blue-300"
                }`}
              onClick={() => setPaymentMethod("paypal")}
            >
              <FaPaypal className="text-2xl" /> PayPal
            </button>
            <button
              type="button"
              className={`flex-1 py-4 px-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 border-2 ${paymentMethod === "vipps" ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-orange-300"
                }`}
              onClick={() => setPaymentMethod("vipps")}
            >
              <FaMobileAlt className="text-2xl" /> Vipps
            </button>
          </div>
        </div>

        {/* Card Forms */}
        <AnimatePresence mode="wait">
          {paymentMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4"
            >
              <div>
                <label htmlFor="cardNumber" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full px-4 py-3 pr-12 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800"
                    placeholder="**** **** **** ****"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength="16"
                    required
                  />
                  <div className="absolute right-4 top-3.5">
                    {cardType === "visa" && <FaCcVisa className="text-blue-600 text-2xl" />}
                    {cardType === "mastercard" && <FaCcMastercard className="text-orange-600 text-2xl" />}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="cardName" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="expiryDate" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    id="expiryDate"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800 text-center"
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
                <div className="flex-1">
                  <label htmlFor="cvv" className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 transition-colors font-semibold text-slate-800 text-center"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center mt-2 pl-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                />
                <label htmlFor="saveCard" className="ml-3 text-sm font-semibold text-slate-600 cursor-pointer">Securely save card for future purchases</label>
              </div>
            </motion.div>
          )}

          {paymentMethod === "paypal" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10 bg-slate-50/50 rounded-3xl border border-slate-100">
              <FaPaypal className="text-blue-600 text-6xl mx-auto mb-4" />
              <p className="text-slate-600 font-medium px-8 mb-6">You will be securely redirected to PayPal to complete your purchase.</p>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => alert("Redirecting to PayPal...")}
              >
                Proceed to PayPal
              </button>
            </motion.div>
          )}

          {paymentMethod === "vipps" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10 bg-slate-50/50 rounded-3xl border border-slate-100">
              <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FaMobileAlt className="text-white text-3xl" />
              </div>
              <p className="text-slate-600 font-medium px-8 mb-6">Open the Vipps app on your phone to approve the payment safely.</p>
              <button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => alert("Sending to Vipps...")}
              >
                Pay with Vipps
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 pl-2">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="ml-3 text-sm text-slate-600 font-medium leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-bold underline decoration-blue-200 underline-offset-4">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-bold underline decoration-blue-200 underline-offset-4">
                Privacy Policy
              </Link>.
            </span>
          </label>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isProcessing}
          className={`w-full font-black text-lg py-4 rounded-2xl text-white shadow-xl transition-all ${isProcessing ? "bg-slate-400 cursor-wait opacity-80" : "bg-gradient-to-r from-green-400 to-green-600 hover:shadow-green-500/30"
            }`}
        >
          {isProcessing ? "Processing Securely..." : "Confirm & Pay Now"}
        </motion.button>
      </form>
    </motion.div>
  );
}
