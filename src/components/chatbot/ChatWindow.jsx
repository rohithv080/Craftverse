import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaPaperPlane, FaRobot, FaStore, FaShoppingCart, FaHeart, FaStar, FaBolt } from "react-icons/fa";
import MessageBubble from "./MessageBubble.jsx";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";

export default function ChatWindow({ onClose }) {
  const { messages, sendMessage, loading } = useChatbot();
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  // Quick action suggestions
  const quickActions = [
    { text: "Show me pottery items", icon: "🏺" },
    { text: "What's trending?", icon: "🔥" },
    { text: "Best sellers", icon: "⭐" },
    { text: "Items under ₹500", icon: "💰" },
    { text: "New arrivals", icon: "✨" },
    { text: "Gift ideas", icon: "🎁" }
  ];

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

  const handleQuickAction = (actionText) => {
    setInput(actionText);
    sendMessage(actionText);
  };

  const isFirstVisit = messages.length <= 1;

  return (
    <div className="fixed bottom-20 right-4 w-[380px] max-h-[75vh] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-[9999]">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaRobot className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="font-semibold">Kaithiran Assistant</div>
            <div className="text-xs text-orange-100">Always here to help!</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>

      {/* Enhanced Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white min-h-[300px]"
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role}>
            {m.content}
          </MessageBubble>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-sm text-gray-500 px-4 py-3 bg-orange-50 rounded-lg mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <span>Searching our amazing products...</span>
          </div>
        )}

        {/* Quick Actions - Show only on first visit or when no recent messages */}
        {isFirstVisit && (
          <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <div className="text-sm font-medium text-orange-800 mb-2 flex items-center gap-2">
              <FaBolt className="text-orange-500" />
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(action.text)}
                  className="text-left p-2 bg-white rounded-md border hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 text-xs"
                >
                  <span className="mr-1">{action.icon}</span>
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input */}
      <form onSubmit={onSubmit} className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about our products..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 text-sm disabled:opacity-50 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
        
        {/* Typing indicator */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Type your message and press Enter</span>
          {input.length > 0 && (
            <span className="text-orange-500">{input.length}/200</span>
          )}
        </div>
      </form>
    </div>
  );
}
