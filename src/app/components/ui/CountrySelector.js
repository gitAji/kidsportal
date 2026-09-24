"use client";
import { useState, useEffect, useRef } from "react";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

const COUNTRIES = [
  { code: "GLOBAL", name: "Global", currency: "USD", symbol: "$" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "C$" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "A$" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "LK", name: "Sri Lanka", currency: "INR", symbol: "₹" },
  { code: "AE", name: "UAE", currency: "AED", symbol: "د.إ" },
  
  // Scandinavia
  { code: "NO", name: "Norway", currency: "NOK", symbol: "kr" },
  { code: "SE", name: "Sweden", currency: "SEK", symbol: "kr" },
  { code: "DK", name: "Denmark", currency: "DKK", symbol: "kr" },
  { code: "FI", name: "Finland", currency: "EUR", symbol: "€" },
  { code: "IS", name: "Iceland", currency: "ISK", symbol: "kr" },
  
  // Europe
  { code: "FR", name: "France", currency: "EUR", symbol: "€" },
  { code: "DE", name: "Germany", currency: "EUR", symbol: "€" },
  { code: "IT", name: "Italy", currency: "EUR", symbol: "€" },
  { code: "ES", name: "Spain", currency: "EUR", symbol: "€" },
  { code: "NL", name: "Netherlands", currency: "EUR", symbol: "€" },
  { code: "BE", name: "Belgium", currency: "EUR", symbol: "€" },
  { code: "AT", name: "Austria", currency: "EUR", symbol: "€" },
  { code: "PT", name: "Portugal", currency: "EUR", symbol: "€" },
  { code: "GR", name: "Greece", currency: "EUR", symbol: "€" },
  { code: "IE", name: "Ireland", currency: "EUR", symbol: "€" },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "CHF" },
  { code: "PL", name: "Poland", currency: "PLN", symbol: "zł" },
];

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Global is default
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Auto-detect user country via IP
    const detectCountry = async () => {
      try {
        const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const data = await res.json();
        if (data.country_code) {
          const matchedCountry = COUNTRIES.find(c => c.code === data.country_code);
          if (matchedCountry) {
            setSelectedCountry(matchedCountry);
          } else {
             // Anything not in the list, keep as global
             setSelectedCountry(COUNTRIES.find(c => c.code === "GLOBAL"));
          }
        }
      } catch (err) {
        console.error("Could not auto-detect location", err);
      }
    };
    
    detectCountry();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    // TODO: In the future, this can update a global CurrencyContext 
    // or trigger a currency change in the pricing store.
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50"
      >
        <FaGlobe /> 
        {selectedCountry.name} ({selectedCountry.currency})
        <FaChevronDown className="text-[10px] ml-1 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 sm:left-0 sm:right-auto md:left-auto md:right-0 mb-2 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
          <ul className="max-h-48 overflow-y-auto py-1">
            {COUNTRIES.map((country) => (
              <li key={country.code}>
                <button
                  onClick={() => handleSelect(country)}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-700 transition-colors ${selectedCountry.code === country.code ? 'text-white font-bold bg-slate-700/50' : 'text-slate-400'}`}
                >
                  <span className="inline-block w-6 text-slate-500">{country.symbol}</span>
                  {country.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
