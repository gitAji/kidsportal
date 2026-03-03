"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const Chat = () => {
  const pathname = usePathname();
  const isLearningZone = pathname?.startsWith("/learning-zone") || pathname?.startsWith("/child-login");

  useEffect(() => {
    // If we're in a child-centric area, don't load the chat
    if (isLearningZone) {
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.hide();
      }
      return;
    }

    // Check if the script already exists to prevent duplicate injection
    // which causes the "createRoot() already passed" warning during HMR
    const existingScript = document.getElementById("voiceflow-chat-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "voiceflow-chat-script";
      script.type = "text/javascript";
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      script.onload = function () {
        window.voiceflow.chat.load({
          verify: { projectID: '69a6d55f37b390cc0349c545' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          }
        });
      };
      document.body.appendChild(script);
    } else if (window.voiceflow?.chat) {
      // If the script is already loaded but we navigated back to a page where it should be visible
      window.voiceflow.chat.show();
    }

    // We do NOT remove the script on unmount anymore because the script 
    // holds global state. Instead, we just hide it when leaving.
    return () => {
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.hide();
      }
    };
  }, [isLearningZone]);

  return null;
};

export default Chat;

