import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import MessageBubble from "./MessageBubble.jsx";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";

export default function ChatWindow({ onClose }) {
  const chatbotContext = useChatbot();
  
  if (!chatbotContext) {
    return <div className="p-4 text-red-500">Error: Chatbot context not found</div>;
  }
  
  const { messages, sendMessage, loading } = chatbotContext;
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus input when chatbot opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const text = input.trim();
    if (!text) {
      return;
    }
    
    try {
      setInput("");
      await sendMessage(text);
    } catch (error) {
      setInput(text);
    }
  };

  const handleQuickAction = (actionText) => {
    setInput(actionText);
    sendMessage(actionText);
  };

  const isFirstVisit = messages.length <= 1;

  return (
    <div className="fixed bottom-20 right-4 w-[380px] max-h-[75vh] bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col z-[9999]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <FaRobot className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-base">Kaithiran Assistant</h3>
            <p className="text-xs opacity-90">🛍️ Ready to help you shop</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <FaTimes className="w-4 h-4" />
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

        {/* Quick Actions */}
        {isFirstVisit && (
          <div className="mt-4 p-3 bg-orange-50 border-orange-100 rounded-lg border">
            <div className="text-sm font-medium text-orange-800 mb-2">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.text)}
                  className="p-2 text-xs rounded-lg border bg-white border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:shadow-md text-left flex items-center gap-2"
                >
                  <span className="text-sm">{action.icon}</span>
                  <span className="flex-1">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Form */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}