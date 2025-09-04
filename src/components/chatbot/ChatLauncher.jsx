import React from "react";
import { MessageCircle } from "lucide-react";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";
import ChatWindow from "./ChatWindow.jsx";

export default function ChatLauncher() {
  const { open, setOpen } = useChatbot();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-sky-600 text-white shadow-xl flex items-center justify-center hover:bg-sky-700 z-[9999]"
        aria-label="Open chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {/* Chat Window */}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}
