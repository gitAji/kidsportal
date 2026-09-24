"use client";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle, FaCreditCard, FaCheckCircle,
  FaSpinner, FaShieldAlt, FaPaypal, FaLock,
  FaToggleOn, FaToggleOff, FaSave, FaExclamationTriangle,
} from "react-icons/fa";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";
import { CURRENCY_PRICES, NATIVE_CURRENCIES, countryToCurrency, checkoutCurrency } from "@/lib/pricingConfig";
import { resolveSubscription } from "@/lib/subscriptionStatus";

// ── Shared input style ─────────────────────────────────────────────
const inputCls = "w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block px-4 py-3 transition-all outline-none placeholder:text-slate-300";
const labelCls = "block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5";

// ── Helpers ────────────────────────────────────────────────────────
function getPlanInfo(plan) {
  switch (plan) {
    case "premium_monthly": return { label: "Premium Monthly", isPaid: true };
    case "premium_yearly": return { label: "Premium Yearly", isPaid: true };
    case "trial": return { label: "Free Trial", isPaid: false };
    default: return { label: "Free", isPaid: false };
  }
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// ── Tab button ─────────────────────────────────────────────────────
function TabBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${active
        ? "bg-white text-blue-600 shadow-sm border border-slate-100"
        : "text-slate-400 hover:text-slate-700"
        }`}
    >
      {icon} {label}
    </button>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [learningLanguage, setLearningLanguage] = useState("English");
  const [learningSubjects, setLearningSubjects] = useState(["English", "Math", "Science"]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);

  // Platform config from Super Admin
  const [platformLanguages, setPlatformLanguages] = useState(null);
  const [platformSubjects, setPlatformSubjects] = useState(null);

  // Profile save state
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState({ type: "", text: "" });

  // Billing
  const [sub, setSub] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentTab, setPaymentTab] = useState("stripe");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);

  // ── Auth + data fetch ──────────────────────────────────────────
  useEffect(() => {
    // Read tab from query string
    const t = searchParams?.get("tab");
    if (t === "billing") setActiveTab("billing");
  }, [searchParams]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      setDisplayName(u.displayName || "");
      setEmail(u.email || "");
      setIsGoogleSignIn(u.providerData.some(p => p.providerId === "google.com"));

      // Load Firestore profile
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          setFirstName(d.firstName || "");
          setLastName(d.lastName || "");
          setPhoneNumber(d.phoneNumber || "");
          setAddress(d.address || "");
          setCity(d.city || "");
          setStateProvince(d.stateProvince || "");
          setPostalCode(d.postalCode || "");
          setCountry(d.country || "");
          setLearningLanguage(d.learningLanguage || "English");
          setLearningSubjects(d.learningSubjects || ["English", "Math", "Science"]);
        }
      } catch (err) {
        console.error(err);
      }

      // Load platform config (admin-managed languages & subjects)
      try {
        const configSnap = await getDoc(doc(db, "settings", "platformConfig"));
        if (configSnap.exists()) {
          const cfg = configSnap.data();
          if (cfg.enabledLanguages) setPlatformLanguages(cfg.enabledLanguages);
          if (cfg.enabledSubjects) setPlatformSubjects(cfg.enabledSubjects);
        }
      } catch (err) {
        console.error("Error fetching platform config:", err);
      }

      // Live subscription listener
      const ref = doc(db, "users", u.uid);
      const unsubSnap = onSnapshot(ref, (snap) => {
        setSub(resolveSubscription(snap.data()));
      });

      setLoading(false);
      return () => unsubSnap();
    });
    return () => unsub();
  }, [router]);

  // ── Save profile ───────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveMsg({ type: "", text: "" });
    if (password && password !== confirmPassword) {
      setSaveMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user, { displayName });
      if (!isGoogleSignIn && email !== user.email) {
        await updateEmail(user, email);
        // The new address hasn't been verified yet — ask Firebase to email a link.
        try {
          await sendEmailVerification(user);
        } catch (verificationError) {
          console.error("Failed to send verification email", verificationError);
        }
      }
      if (!isGoogleSignIn && password) await updatePassword(user, password);
      await setDoc(doc(db, "users", user.uid), {
        firstName, lastName, phoneNumber,
        address, city, stateProvince, postalCode, country,
        learningLanguage, learningSubjects,
      }, { merge: true });
      setSaveMsg({ type: "success", text: "Profile saved successfully!" });
    } catch (err) {
      setSaveMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  // ── Stripe Checkout ────────────────────────────────────────────
  const handleStripeCheckout = async () => {
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ uid: user.uid, email: user.email, billingCycle, currency: checkoutCurrency(country) }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setCheckoutError(data.error || "Could not create checkout session.");
    } catch (err) {
      setCheckoutError("Network error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ── Stripe Portal ──────────────────────────────────────────────
  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ uid: user.uid }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  const planInfo = getPlanInfo(sub?.plan);
  const isPaid = planInfo.isPaid && sub?.status === "active";
  const isExpired = sub?.status === "expired";
  const cardBrand = sub?.card?.brand || sub?.cardBrand || null;
  const cardLast4 = sub?.card?.last4 || sub?.cardLast4 || null;

  // ── Prices display ─────────────────────────────────────────────
  const currencyCode = countryToCurrency(country);
  const currencyInfo = CURRENCY_PRICES[currencyCode] || CURRENCY_PRICES.USD;
  const displayPrice = billingCycle === "yearly" ? currencyInfo.yearly : currencyInfo.monthly;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Settings</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Manage your account and payment details</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8">

        {/* ── Tabs ── */}
        <div className="bg-slate-100/70 rounded-2xl p-1.5 inline-flex gap-1 mb-6">
          <TabBtn
            label="Profile"
            icon={<FaUserCircle className="text-xs" />}
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabBtn
            label="Billing & Payment"
            icon={<FaCreditCard className="text-xs" />}
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          />
        </div>

        <AnimatePresence mode="wait">

          {/* ════════════ PROFILE TAB ════════════ */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSaveProfile} className="space-y-5">

                {/* Save message */}
                {saveMsg.text && (
                  <div className={`flex items-center gap-2 p-3.5 rounded-xl text-sm font-bold border ${saveMsg.type === "error"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : "bg-green-50 text-green-600 border-green-100"
                    }`}>
                    {saveMsg.type === "error" ? <FaExclamationTriangle /> : <FaCheckCircle />}
                    {saveMsg.text}
                  </div>
                )}

                {/* Name */}
                <Card title="Personal Details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name">
                      <input className={inputCls} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" />
                    </Field>
                    <Field label="Last Name">
                      <input className={inputCls} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" />
                    </Field>
                    <Field label="Display Name">
                      <input className={inputCls} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="What should we call you?" />
                    </Field>
                    <Field label="Phone Number">
                      <input className={inputCls} type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+47 000 00 000" />
                    </Field>
                    <Field label="Learning Language">
                      <select className={inputCls} value={learningLanguage} onChange={e => setLearningLanguage(e.target.value)}>
                        {[
                          { value: "English", label: "🇬🇧 English" },
                          { value: "Tamil", label: "🇮🇳 Tamil (தமிழ்)" },
                          { value: "Norwegian", label: "🇳🇴 Norwegian (Norsk)" },
                          { value: "French", label: "🇫🇷 French (Français)" },
                          { value: "Spanish", label: "🇪🇸 Spanish (Español)" },
                          { value: "German", label: "🇩🇪 German (Deutsch)" },
                          { value: "Arabic", label: "🇸🇦 Arabic (العربية)" },
                          { value: "Mandarin", label: "🇨🇳 Mandarin (中文)" },
                          { value: "Hindi", label: "🇮🇳 Hindi (हिन्दी)" },
                          { value: "Sinhala", label: "🇱🇰 Sinhala (සිංහල)" },
                          { value: "Malay", label: "🇲🇾 Malay (Bahasa Melayu)" },
                          { value: "Swedish", label: "🇸🇪 Swedish (Svenska)" },
                          { value: "Danish", label: "🇩🇰 Danish (Dansk)" },
                          { value: "Finnish", label: "🇫🇮 Finnish (Suomi)" },
                          { value: "Portuguese", label: "🇵🇹 Portuguese (Português)" },
                          { value: "Japanese", label: "🇯🇵 Japanese (日本語)" },
                          { value: "Korean", label: "🇰🇷 Korean (한국어)" },
                        ]
                          .filter(lang => !platformLanguages || platformLanguages.includes(lang.value))
                          .map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                          ))}
                      </select>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">Controls the display language of the Learning Zone UI</p>
                    </Field>
                  </div>
                </Card>

                {/* Learning Subjects */}
                <Card title="Learning Subjects">
                  <p className="text-xs text-slate-500 font-medium mb-4">Choose which subjects your child will see in the Learning Zone. You can mix languages — for example, select Norwegian UI above and still include Tamil as a subject below.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "English", label: "🇬🇧 English", color: "blue" },
                      { id: "Tamil", label: "🇮🇳 Tamil", color: "orange" },
                      { id: "Math", label: "🔢 Math", color: "purple" },
                      { id: "Science", label: "🔬 Science", color: "green" },
                      { id: "Art", label: "🎨 Art", color: "pink" },
                      { id: "Music", label: "🎵 Music", color: "indigo" },
                      { id: "History", label: "📜 History", color: "amber" },
                      { id: "Geography", label: "🌍 Geography", color: "teal" },
                      { id: "Computer Science", label: "💻 Computer Science", color: "cyan" },
                      { id: "Coding", label: "⌨️ Coding", color: "violet" },
                      { id: "Physical Education", label: "⚽ Physical Education", color: "red" },
                      { id: "Norwegian", label: "🇳🇴 Norwegian", color: "blue" },
                      { id: "French", label: "🇫🇷 French", color: "blue" },
                      { id: "Spanish", label: "🇪🇸 Spanish", color: "yellow" },
                      { id: "German", label: "🇩🇪 German", color: "slate" },
                    ]
                      .filter(subj => !platformSubjects || platformSubjects.includes(subj.id))
                      .map(subj => {
                        const isSelected = learningSubjects.includes(subj.id);
                        return (
                          <button
                            type="button"
                            key={subj.id}
                            onClick={() => {
                              setLearningSubjects(prev =>
                                prev.includes(subj.id)
                                  ? prev.filter(s => s !== subj.id)
                                  : [...prev, subj.id]
                              );
                            }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${isSelected
                              ? `bg-${subj.color}-50 border-${subj.color}-400 text-${subj.color}-700 shadow-sm`
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                              }`}
                          >
                            <span className="text-base">{subj.label.split(" ")[0]}</span>
                            <span>{subj.label.split(" ").slice(1).join(" ")}</span>
                            {isSelected && <span className="ml-auto text-xs">✓</span>}
                          </button>
                        );
                      })}
                  </div>
                  {learningSubjects.length === 0 && (
                    <p className="text-xs text-red-500 font-bold mt-2">⚠️ Please select at least one subject</p>
                  )}
                </Card>

                {/* Account */}
                <Card title="Account">
                  <div className="space-y-4">
                    <Field label={
                      <span className="flex items-center gap-2">
                        Email Address
                        {isGoogleSignIn ? null : user?.emailVerified ? (
                          <span className="text-emerald-500 normal-case font-bold text-[10px]">✓ Verified</span>
                        ) : (
                          <span className="text-amber-500 normal-case font-bold text-[10px]">Not verified</span>
                        )}
                      </span>
                    }>
                      <input
                        className={`${inputCls} ${isGoogleSignIn ? "opacity-50 cursor-not-allowed" : ""}`}
                        type="email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={isGoogleSignIn}
                      />
                      {isGoogleSignIn && (
                        <p className="text-[10px] text-slate-400 font-bold mt-1 ml-1">Managed by Google Sign-In</p>
                      )}
                    </Field>

                    {!isGoogleSignIn && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                        <Field label="New Password">
                          <input className={inputCls} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" />
                        </Field>
                        <Field label="Confirm Password">
                          <input className={inputCls} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                        </Field>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Address */}
                <Card title="Address">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Street Address">
                        <input className={inputCls} value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Learning Lane" />
                      </Field>
                    </div>
                    <Field label="City">
                      <input className={inputCls} value={city} onChange={e => setCity(e.target.value)} placeholder="Oslo" />
                    </Field>
                    <Field label="State / Province">
                      <input className={inputCls} value={stateProvince} onChange={e => setStateProvince(e.target.value)} placeholder="Province" />
                    </Field>
                    <Field label="Postal Code">
                      <input className={inputCls} value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="0001" />
                    </Field>
                    <Field label="Country">
                      <select className={inputCls} value={country} onChange={e => setCountry(e.target.value)}>
                        <option value="">Select country</option>
                        {["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-black rounded-xl shadow-md shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-60"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ════════════ BILLING TAB ════════════ */}
          {activeTab === "billing" && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Current Plan Summary */}
              <div className="mb-6">
                <h2 className="text-lg font-black text-slate-800">Welcome to Billing</h2>
                <p className="text-xs text-slate-400 font-medium">Manage your subscription and payment methods here.</p>
              </div>
              <Card title="Current Plan">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-black text-slate-800">{planInfo.label}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {isPaid
                        ? `Renews ${formatDate(sub?.currentPeriodEnd)}`
                        : isExpired
                          ? "Plan has expired"
                          : `Trial ends ${formatDate(sub?.currentPeriodEnd)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${isPaid ? "bg-green-100 text-green-600" :
                      sub?.status === "active" ? "bg-amber-100 text-amber-600" :
                        "bg-red-100 text-red-500"
                      }`}>
                      {isExpired ? "Expired" : sub?.status === "active" ? "Active" : "—"}
                    </span>
                    {isPaid && (
                      <button
                        onClick={openPortal}
                        disabled={portalLoading}
                        className="text-xs font-bold text-blue-500 hover:text-blue-700 disabled:opacity-50"
                      >
                        {portalLoading ? "…" : "Manage →"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Card on file */}
                {cardLast4 && (
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-800 rounded flex items-end pb-1 px-1.5 flex-shrink-0">
                      <div className="flex gap-0.5">{[...Array(4)].map((_, i) => <div key={i} className="w-0.5 h-0.5 rounded-full bg-white/50" />)}</div>
                    </div>
                    <p className="text-sm font-black text-slate-700 capitalize flex-grow">
                      {cardBrand} •••• {cardLast4}
                    </p>
                    <button onClick={openPortal} className="text-xs font-bold text-slate-400 hover:text-blue-500">Update</button>
                  </div>
                )}
              </Card>

              {/* Only show upgrade section if not already on a paid plan */}
              {!isPaid && (
                <>
                  {/* Billing cycle toggle */}
                  <Card title="Choose Your Plan">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => setBillingCycle("monthly")}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${billingCycle === "monthly" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingCycle("yearly")}
                          className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${billingCycle === "yearly" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                        >
                          Yearly
                          <span className="ml-1.5 text-[9px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">Save 25%</span>
                        </button>
                      </div>
                      <p className="text-2xl font-black text-slate-800">
                        {displayPrice}
                        <span className="text-xs font-bold text-slate-400 ml-1">/{billingCycle === "yearly" ? "yr" : "mo"}</span>
                      </p>
                    </div>

                    {/* What's included */}
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {[
                        "Full access all grades",
                        "Up to 5 children accounts",
                        "Detailed analytics",
                        "Priority support",
                      ].map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                          <FaCheckCircle className="text-blue-400 flex-shrink-0 text-[10px]" /> {f}
                        </div>
                      ))}
                    </div>

                    {/* Payment method tabs */}
                    <div className="flex gap-2 mb-5">
                      {[
                        { id: "stripe", label: "Card", icon: <FaCreditCard /> },
                        { id: "paypal", label: "PayPal", icon: <FaPaypal /> },
                        { id: "vipps", label: "Vipps", icon: <span className="font-black text-[10px]">V</span> },
                      ].map(pm => (
                        <button
                          key={pm.id}
                          onClick={() => { setPaymentTab(pm.id); setCheckoutError(""); }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black border transition-all ${paymentTab === pm.id
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                            : "bg-white text-slate-500 border-slate-200 hover:border-blue-300"
                            }`}
                        >
                          {pm.icon} {pm.label}
                        </button>
                      ))}
                    </div>

                    {/* Stripe */}
                    {paymentTab === "stripe" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-600 font-bold">
                          <FaShieldAlt className="flex-shrink-0" />
                          Your card details are entered securely on Stripe's checkout page — we never store card numbers.
                        </div>
                        {checkoutError && (
                          <p className="text-xs text-red-500 font-bold bg-red-50 border border-red-100 p-3 rounded-xl">
                            {checkoutError}
                          </p>
                        )}
                        <button
                          onClick={handleStripeCheckout}
                          disabled={checkoutLoading}
                          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-black rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 shadow-lg shadow-blue-200"
                        >
                          {checkoutLoading
                            ? <><FaSpinner className="animate-spin" /> Redirecting to Stripe…</>
                            : <><FaCreditCard /> Subscribe with Card</>}
                        </button>
                      </div>
                    )}

                    {/* PayPal */}
                    {paymentTab === "paypal" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-600 font-bold">
                          <FaPaypal className="flex-shrink-0 text-[#003087]" />
                          You'll be redirected to PayPal to complete your recurring subscription.
                        </div>
                        <button
                          onClick={() => alert("PayPal integration: configure your PayPal subscription plan IDs in .env and wire the /api/paypal/create-subscription endpoint.")}
                          className="w-full py-3.5 bg-[#003087] text-white text-sm font-black rounded-xl hover:bg-[#002070] transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          <FaPaypal /> Pay with PayPal
                        </button>
                      </div>
                    )}

                    {/* Vipps */}
                    {paymentTab === "vipps" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3.5 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-600 font-bold">
                          <span className="font-black text-sm">V</span>
                          Available for Norwegian users. You'll be redirected to Vipps to complete your subscription.
                        </div>
                        <button
                          onClick={() => alert("Vipps integration: configure your Vipps merchant credentials in .env and wire the /api/vipps/create-subscription endpoint.")}
                          className="w-full py-3.5 text-white text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                          style={{ backgroundColor: "#FF5B24" }}
                        >
                          <span className="font-black">Vipps</span> — Pay with Vipps
                        </button>
                      </div>
                    )}
                  </Card>

                  {/* 1-month trial note */}
                  {sub?.plan === "trial" && sub?.status === "active" && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-black text-amber-700">You're on a free trial</p>
                        <p className="text-xs text-amber-600 font-medium mt-0.5">
                          Your trial includes a 1-month free period before any charge. Subscribing now won't charge you until your trial ends.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Already subscribed — manage in portal */}
              {isPaid && (
                <div className="space-y-3">
                  <button
                    onClick={openPortal}
                    disabled={portalLoading}
                    className="w-full py-3.5 bg-slate-800 text-white text-sm font-black rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {portalLoading ? <><FaSpinner className="animate-spin" /> Opening portal…</> : <><FaCreditCard /> Manage Billing on Stripe</>}
                  </button>
                  <div className="text-center">
                    <button
                      onClick={openPortal}
                      disabled={portalLoading}
                      className="text-[11px] text-slate-300 hover:text-red-400 transition-colors font-medium underline underline-offset-2 decoration-dashed"
                    >
                      Cancel membership
                    </button>
                  </div>
                </div>
              )}

              {/* Security footer */}
              <div className="flex items-center justify-center gap-2 text-slate-300 pt-2">
                <FaLock className="text-xs" />
                <p className="text-[10px] font-bold">256-bit SSL · Payments secured by Stripe</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Shared card wrapper ────────────────────────────────────────────
function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
