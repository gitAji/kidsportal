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

    const script = document.createElement("script");
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

    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Try to hide the widget if it exists
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.hide();
      }
    };
  }, [isLearningZone]);

  return null;
};

export default Chat;

