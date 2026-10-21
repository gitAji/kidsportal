import Link from "next/link";
import { FaShieldAlt, FaHeart, FaChalkboardTeacher, FaTwitter, FaFacebookF, FaInstagram, FaStar } from "react-icons/fa";
import CountrySelector from "../../ui/CountrySelector";

const LINKS = {
  Product: [
    { href: "/learning", label: "Curriculum" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/help", label: "Help Centre" },
  ],
  Trust: [
    { href: "/safety", label: "Child Safety" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact Us" },
  ],
};

const TRUST_BADGES = [
  { icon: "🔒", label: "Safe & Secure" },
  { icon: "🚫", label: "Zero Ads" },
  { icon: "🏅", label: "10K+ Families" },
  { icon: "⭐", label: "4.9 / 5 Stars" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-slate-400">

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 py-12 px-4">
        <div className="container mx-auto text-center">
          <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">Ready to get started?</p>
          <h2 className="text-white text-3xl sm:text-4xl font-black mb-6">
            Give your child the gift of <span className="text-yellow-300">learning</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 font-black text-sm px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Start Free Today →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/15 text-white font-bold text-sm px-8 py-4 rounded-2xl border border-white/20 hover:bg-white/25 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>

      {/* Trust badges strip */}
      <div className="border-b border-slate-800/60 py-6 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 bg-slate-800/40 rounded-2xl px-4 py-3">
                <span className="text-xl">{icon}</span>
                <span className="text-slate-300 text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎓</span>
              <span className="text-white font-black text-xl tracking-tight">KidsPortal</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              A safe, engaging, and ad-free learning platform built for kids aged 5–16.
              Trusted by 10,000+ families worldwide to make education fun.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[FaTwitter, FaFacebookF, FaInstagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-slate-400 text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60 py-5 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>© {year} KidsPortal. All rights reserved.</span>
            <span className="hidden sm:flex items-center gap-1.5">
              Made with <FaHeart className="text-rose-400 text-[10px]" /> for curious minds
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <CountrySelector />
            <Link href="/teacher-admin/login" className="group flex items-center gap-1.5 hover:text-slate-300 transition-colors" title="Teacher Portal">
              <FaChalkboardTeacher className="text-sm group-hover:scale-110 transition-transform" /> Teacher Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
