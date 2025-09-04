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
              ? "bg-sky-600 text-white"
              : "bg-white/95 border border-slate-200 text-slate-800"
          }`}
      >
        {children}
      </div>
    </div>
  );
}
