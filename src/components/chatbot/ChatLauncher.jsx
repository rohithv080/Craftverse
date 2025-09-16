import React from "react";
import { FaComments } from "react-icons/fa";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";
import ChatWindow from "./ChatWindow.jsx";

export default function ChatLauncher() {
  const { open, setOpen } = useChatbot();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-orange-500 text-white shadow-xl flex items-center justify-center hover:bg-orange-600 z-[9999] transition-colors"
        aria-label="Open chat"
      >
        <FaComments className="h-7 w-7" />
      </button>

      {/* Chat Window */}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}
