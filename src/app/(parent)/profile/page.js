"use client";
import { useEffect, useState, Suspense } from "react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, app } from "@/firebase/config";
import { useRouter } from "next/navigation";

import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import { FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = () => {
      if (user) {
        const requiredFields = [
          firstName,
          lastName,
          address,
          country,
          phoneNumber,
        ];
        const complete = requiredFields.every(
          (field) => field && field.trim() !== ""
        );
        setIsProfileComplete(complete);
      }
    };
    checkProfileCompletion();
  }, [user, firstName, lastName, address, country, phoneNumber]);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setIsPremiumUser(userDocSnap.data().isPremium || false);
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }
    };
    checkSubscriptionStatus();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");

        const isGoogle = currentUser.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setIsGoogleSignIn(isGoogle);

        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setPhoneNumber(userData.phoneNumber || "");
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setAddress(userData.address || "");
            setCity(userData.city || "");
            setStateProvince(userData.stateProvince || "");
            setPostalCode(userData.postalCode || "");
            setCountry(userData.country || "");
            setHasPaymentMethod(userData.hasPaymentMethod || false);
            setIsPremiumUser(userData.isPremium || false);
          }
        } catch (error) {
          console.error("Error fetching phone number:", error);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const requiredFields = [
      { value: firstName, name: "First Name" },
      { value: lastName, name: "Last Name" },
      { value: address, name: "Address" },
      { value: city, name: "City" },
      { value: stateProvince, name: "State/Province" },
      { value: postalCode, name: "Postal Code" },
      { value: country, name: "Country" },
      { value: phoneNumber, name: "Phone Number" },
    ];

    for (const field of requiredFields) {
      if (!field.value || field.value.trim() === "") {
        setMessage(`Please fill in the ${field.name} field.`);
        return;
      }
    }

    try {
      if (user) {
        await updateProfile(user, {
          displayName: displayName,
        });

        if (email !== user.email && !isGoogleSignIn) {
          await updateEmail(user, email);
        }

        if (password && !isGoogleSignIn) {
          await updatePassword(user, password);
        }

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          {
            phoneNumber: phoneNumber,
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            stateProvince: stateProvince,
            postalCode: postalCode,
            country: country,
            hasPaymentMethod: hasPaymentMethod,
          },
          { merge: true }
        );

        setMessage("Profile updated successfully!");
        // Re-fetch the user to ensure the latest data is reflected
        await user.reload();
        setUser(auth.currentUser);
      }
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
      console.error("Error updating profile:", error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (paymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv || !cardHolderName) {
        setMessage("Please fill in all card details.");
        return;
      }
      // Basic card validation (add more robust validation as needed)
      if (!/^[0-9]{16}$/.test(cardNumber)) {
        setMessage("Card number must be 16 digits.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
        setMessage("Expiry date must be in MM/YY format.");
        return;
      }
      if (!/^[0-9]{3,4}$/.test(cvv)) {
        setMessage("CVV must be 3 or 4 digits.");
        return;
      }
    } else if (paymentMethod === "paypal") {
      // No specific form fields for PayPal, just proceed
    } else if (paymentMethod === "vipps") {
      // No specific form fields for Vipps, just proceed
    }

    if (!termsAccepted) {
      setMessage("You must agree to the Terms and Conditions.");
      return;
    }

    // Simulate payment processing
    try {
      // In a real application, you would integrate with a payment gateway here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network request

      const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (paymentSuccess) {
        // Update user's premium status and hasPaymentMethod in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(
          userDocRef,
          { isPremium: true, hasPaymentMethod: true },
          { merge: true }
        );
        setMessage("Payment successful! You are now a Premium user.");
        setIsPremiumUser(true);
        setHasPaymentMethod(true);
      } else {
        throw new Error("Payment failed. Please check your details.");
      }
    } catch (error) {
      setMessage(`Payment failed: ${error.message}. Please try again.`);
      console.error("Payment error:", error);
    }
  };

  if (!user) {
    return null;
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <main className="flex-grow p-4 flex items-center justify-center">
        <Suspense fallback={<SkeletonLoader />}>
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="page-heading mb-6 text-center">
              User Profile
            </h1>

            {!isProfileComplete && (
              <div
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
                role="alert"
              >
                <p className="font-bold">Profile Incomplete!</p>
                <p>
                  Please complete your profile details to unlock all features.
                </p>
              </div>
            )}

            {!isPremiumUser && (
              <div
                className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
                role="alert"
              >
                <p className="font-bold">Upgrade to Premium!</p>
                <p>
                  Enjoy exclusive content and features.{" "}
                  <a href="/pricing" className="font-semibold underline">
                    Learn More
                  </a>
                </p>
              </div>
            )}

            <div className="flex justify-center mb-6">
              <button
                className={`py-2 px-4 rounded-l-lg text-lg font-semibold transition-colors duration-200 ${
                  activeTab === "profile"
                    ? "bg-[var(--primary-blue)] text-white"
                    : "bg-gray-200 text-[var(--foreground)] hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              <button
                className={`py-2 px-4 rounded-r-lg text-lg font-semibold transition-colors duration-200 ${
                  activeTab === "payment"
                    ? "bg-[var(--primary-blue)] text-white"
                    : "bg-gray-200 text-[var(--foreground)] hover:bg-gray-300"
                }`}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {message && (
                    <div
                      className={`p-3 mb-4 rounded text-center text-lg ${
                        message.includes("Error") || message.includes("match")
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        First Name:
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Last Name:
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Display Name:
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] ${
                          isGoogleSignIn ? "bg-gray-200" : ""
                        }`}
                        disabled={isGoogleSignIn}
                      />
                    </div>
                    {!isGoogleSignIn && (
                      <>
                        <div className="mb-4">
                          <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                            Password (leave blank to keep current):
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                            placeholder="********"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                            Confirm Password:
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                            placeholder="********"
                          />
                        </div>
                      </>
                    )}
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Address:
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        placeholder="Enter your address line 1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        City:
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        placeholder="Enter your city"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        State/Province:
                      </label>
                      <input
                        type="text"
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        placeholder="Enter your state or province"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Postal Code:
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        placeholder="Enter your postal code"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Country:
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        required
                      >
                        <option value="">Select your country</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Finland">Finland</option>
                        <option value="Iceland">Iceland</option>
                        <option value="Norway">Norway</option>
                        <option value="Sweden">Sweden</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Phone Number:
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-4">
                    Upgrade to Premium
                  </h2>
                  <p className="mb-4 text-gray-700">
                    Enter your payment details to subscribe to our Premium plan.
                  </p>
                  {message && (
                    <div
                      className={`p-3 mb-4 rounded text-center text-lg ${
                        message.includes("Error") || message.includes("match")
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select Payment Method:
                      </label>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 rounded-md text-lg font-semibold ${
                            paymentMethod === "card"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          Card
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 rounded-md text-lg font-semibold ${
                            paymentMethod === "paypal"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                          onClick={() => setPaymentMethod("paypal")}
                        >
                          PayPal
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 px-4 rounded-md text-lg font-semibold ${
                            paymentMethod === "vipps"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700"
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
                          <label
                            htmlFor="cardNumber"
                            className="block text-left text-gray-700 text-sm font-bold mb-2"
                          >
                            Card Number:
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) =>
                              setCardNumber(
                                e.target.value.replace(/[^0-9]/g, "")
                              )
                            }
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="**** **** **** ****"
                            maxLength="16"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cardHolderName"
                            className="block text-left text-gray-700 text-sm font-bold mb-2"
                          >
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
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                          <div className="w-full sm:w-1/2">
                            <label
                              htmlFor="expiryDate"
                              className="block text-left text-gray-700 text-sm font-bold mb-2"
                            >
                              Expiry Date (MM/YY):
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              value={expiryDate}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                if (value.length > 2) {
                                  setExpiryDate(
                                    `${value.slice(0, 2)}/${value.slice(2, 4)}`
                                  );
                                } else {
                                  setExpiryDate(value);
                                }
                              }}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="MM/YY"
                              maxLength="5"
                              required
                            />
                          </div>
                          <div className="w-full sm:w-1/2">
                            <label
                              htmlFor="cvv"
                              className="block text-left text-gray-700 text-sm font-bold mb-2"
                            >
                              CVV:
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              value={cvv}
                              onChange={(e) =>
                                setCvv(e.target.value.replace(/[^0-9]/g, ""))
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="123"
                              maxLength="4"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="text-center py-8">
                        <FaPaypal className="text-blue-700 text-6xl mx-auto mb-4" />
                        <p className="text-gray-700 text-lg">
                          You will be redirected to PayPal to complete your
                          purchase.
                        </p>
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
                        <Image
                          src="/images/vipps-logo.png"
                          alt="Vipps Logo"
                          width={100}
                          height={100}
                          className="mx-auto mb-4"
                        />
                        <p className="text-gray-700 text-lg">
                          You will be redirected to Vipps to complete your
                          purchase.
                        </p>
                        <button
                          type="button"
                          className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
                          onClick={() => alert("Redirecting to Vipps...")}
                        >
                          Continue with Vipps
                        </button>
                      </div>
                    )}

                    <div className="mb-4 flex items-center">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mr-2"
                        required
                      />
                      <label
                        htmlFor="termsAccepted"
                        className="text-[var(--foreground)] text-base font-semibold"
                      >
                        I agree to the{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
                    >
                      Upgrade and Pay
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Suspense>
      </main>
    </div>
  );
}
