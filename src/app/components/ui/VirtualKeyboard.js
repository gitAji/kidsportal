"use client";

import React, { useState } from 'react';

const englishLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

// Tamil has no 1:1 QWERTY mapping, so this lays out independent vowels
// (உயிர் எழுத்து), combining vowel signs that attach to the consonant typed
// just before them (உயிர்மெய் குறியீடுகள்), and consonants (மெய் எழுத்து) as
// their own rows — a student builds a syllable by tapping a consonant then,
// optionally, a vowel sign (e.g. க then ா to get கா).
const tamilLayout = [
  ['அ', 'ஆ', 'இ', 'ீ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
  ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம'],
  ['ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'],
  ['ா', 'ி', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்'],
];

const languages = {
  en: { label: 'English', layout: englishLayout },
  ta: { label: 'தமிழ்', layout: tamilLayout },
};

export default function VirtualKeyboard({ onKeyPress, defaultLanguage = 'en' }) {
  const [lang, setLang] = useState(languages[defaultLanguage] ? defaultLanguage : 'en');
  const keyboardLayout = languages[lang].layout;

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
      <div className="flex justify-center gap-2 mb-3">
        {Object.entries(languages).map(([code, { label }]) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              lang === code ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-blue-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2 flex-wrap">
          {row.map((key, keyIndex) => (
            <button
              key={keyIndex}
              onClick={() => onKeyPress(key)}
              className="m-1 p-3 rounded-md font-semibold text-lg transition-colors duration-150 bg-blue-200 hover:bg-blue-300 text-gray-800 w-10"
              style={{ minWidth: '40px' }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      <div className="flex justify-center mb-2">
        <button
          onClick={() => onKeyPress(' ')}
          className="m-1 p-3 rounded-md font-semibold text-lg transition-colors duration-150 bg-blue-400 hover:bg-blue-500 text-white flex-grow"
          style={{ minWidth: '100px' }}
        >
          Space
        </button>
        <button
          onClick={() => onKeyPress('Backspace')}
          className="m-1 p-3 rounded-md font-semibold text-lg transition-colors duration-150 bg-red-400 hover:bg-red-500 text-white w-24"
        >
          Backspace
        </button>
      </div>
    </div>
  );
}
