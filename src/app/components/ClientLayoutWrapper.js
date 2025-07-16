// app/components/ClientLayoutWrapper.jsx
"use client";

import { useState } from "react";
import FloatingChatButton from "./ui/FloatingChatButton";
import Chat from "./ui/Chat";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";

export default function ClientLayoutWrapper({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Header />
      {children}
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <Footer />
    </>
  );
}
