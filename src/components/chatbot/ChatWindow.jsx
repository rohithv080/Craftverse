import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import MessageBubble from "./MessageBubble.jsx";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";

export default function ChatWindow({ onClose }) {
  const { messages, sendMessage, loading } = useChatbot();
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  const onSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMessage(text);
  };

  return (
    <div className="fixed bottom-20 right-4 w-[360px] max-h-[70vh] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-[9999]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-orange-500 text-white">
        <div className="flex items-center gap-2">
          <FaRobot className="h-5 w-5" />
          <div className="font-semibold">Kaithiran Assistant</div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 bg-gray-50"
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role}>
            {m.content}
          </MessageBubble>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 px-2 py-1">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
            Searching products...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="p-3 bg-white border-t">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, prices, or availability..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-lg bg-orange-500 text-white px-3 py-2 text-sm disabled:opacity-50 hover:bg-orange-600 transition-colors"
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
