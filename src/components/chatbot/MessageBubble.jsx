import React from "react";
import { FaRobot, FaUser } from "react-icons/fa";

export default function MessageBubble({ role, children }) {
  const isUser = role === "user";

  // Format message content to handle markdown-like syntax
  const formatMessage = (text) => {
    if (typeof text !== 'string') return text;
    
    // Convert **bold** to actual bold
    return text.split('**').map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-semibold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div
      className={`w-full flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <FaRobot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm relative
          ${
            isUser
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
              : "bg-white border border-gray-200 text-gray-800 shadow-md"
          }`}
      >
        {/* Message tail */}
        {!isUser && (
          <div className="absolute left-0 top-4 transform -translate-x-2">
            <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white"></div>
          </div>
        )}
        
        {isUser && (
          <div className="absolute right-0 top-4 transform translate-x-2">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-orange-500"></div>
          </div>
        )}

        <div className={`${isUser ? 'text-white' : 'text-gray-800'}`}>
          {formatMessage(children)}
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-1 ${isUser ? 'text-orange-100' : 'text-gray-500'}`}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
            <FaUser className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
