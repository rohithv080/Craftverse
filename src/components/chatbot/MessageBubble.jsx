import React from "react";

export default function MessageBubble({ role, children }) {
  const isUser = role === "user";

  return (
    <div
      className={`w-full flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 shadow-sm text-sm
          ${
            isUser
              ? "bg-orange-500 text-white"
              : "bg-white border border-gray-200 text-gray-800"
          }`}
      >
        {children}
      </div>
    </div>
  );
}
