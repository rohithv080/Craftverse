import React, { useState, useEffect } from "react";
import { FaComments, FaTimes, FaBolt, FaRobot } from "react-icons/fa";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";
import ChatWindow from "./ChatWindow.jsx";

export default function ChatLauncher() {
  const { open, setOpen } = useChatbot();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  // Show welcome prompt after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [open]);

  // Hide prompt after 10 seconds
  useEffect(() => {
    if (showPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showPrompt]);

  const handleOpen = () => {
    setOpen(true);
    setShowPrompt(false);
    setHasNotification(false);
  };

  return (
    <>
      {/* Welcome Prompt */}
      {showPrompt && !open && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs z-[9998] animate-bounce">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <FaRobot className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">
                👋 Need help finding products?
              </div>
              <div className="text-xs text-gray-600">
                I can help you search, check prices, and find exactly what you're looking for!
              </div>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-3">
            <button
              onClick={handleOpen}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              <FaBolt className="inline w-3 h-3 mr-1" />
              Ask me anything!
            </button>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute bottom-0 right-6 transform translate-y-full">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Enhanced Floating Button */}
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={handleOpen}
          className="relative h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-2xl flex items-center justify-center hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 hover:shadow-3xl"
          aria-label="Open chat assistant"
        >
          <FaComments className="h-8 w-8" />
          
          {/* Notification Badge */}
          {hasNotification && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-orange-400 opacity-30 animate-ping"></div>
          
          {/* Subtle Ring Animation */}
          <div className="absolute inset-0 rounded-full border-4 border-orange-300 opacity-50 animate-pulse"></div>
        </button>

        {/* Quick Status Indicator */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}
