import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaPaperPlane, FaRobot, FaBolt, FaBrain } from "react-icons/fa";
import MessageBubble from "./MessageBubble.jsx";
import MLStatusIndicator from "./MLStatusIndicator.jsx";
import { useChatbot } from "../../contexts/ChatbotContext.jsx";

export default function ChatWindow({ onClose }) {
  const chatbotContext = useChatbot();
  console.log('ChatWindow - useChatbot context:', chatbotContext);
  
  if (!chatbotContext) {
    console.error('ChatbotContext is undefined! Check if ChatbotProvider is wrapping this component.');
    return <div className="p-4 text-red-500">Error: Chatbot context not found</div>;
  }
  
  const { messages, sendMessage, loading, isMLReady, isTraining } = chatbotContext;
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  console.log('ChatWindow state:', { messages: messages?.length, loading, isMLReady, isTraining });

  useEffect(() => {
    // Auto-focus input when chatbot opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // ML-Enhanced quick action suggestions
  const quickActions = [
    { text: "Show me AI-recommended pottery", icon: "🏺", mlEnhanced: true },
    { text: "What's trending with ML analysis?", icon: "🔥", mlEnhanced: true },
    { text: "AI best sellers", icon: "⭐", mlEnhanced: true },
    { text: "Smart budget finds under ₹500", icon: "💰", mlEnhanced: true },
    { text: "ML-curated new arrivals", icon: "✨", mlEnhanced: true },
    { text: "AI gift suggestions", icon: "🎁", mlEnhanced: true }
  ];

  // Fallback actions for non-ML mode
  const basicActions = [
    { text: "Show me pottery items", icon: "🏺" },
    { text: "What's trending?", icon: "🔥" },
    { text: "Best sellers", icon: "⭐" },
    { text: "Items under ₹500", icon: "💰" },
    { text: "New arrivals", icon: "✨" },
    { text: "Gift ideas", icon: "🎁" }
  ];

  const currentActions = isMLReady ? quickActions : basicActions;

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
    console.log('Form submitted, input value:', input);
    console.log('Event details:', e.type, e.target);
    
    const text = input.trim();
    if (!text) {
      console.log('Empty input, returning');
      return;
    }
    
    try {
      console.log('About to send message:', text);
      setInput("");
      await sendMessage(text);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore input if there was an error
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
      {/* ML-Enhanced Header */}
      <div className={`flex items-center justify-between px-4 py-3 ${isMLReady ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 ${isMLReady ? 'bg-purple-400' : 'bg-orange-400'} rounded-full flex items-center justify-center shadow-lg`}>
              {isMLReady ? (
                <FaBrain className="w-5 h-5 text-white" />
              ) : (
                <FaRobot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-base">
              {isMLReady ? "AI Shopping Assistant" : isTraining ? "AI Training Assistant" : "Kaithiran Assistant"}
            </h3>
            <p className="text-xs opacity-90">
              {isMLReady ? "🧠 ML-Enhanced • Smart & Personalized" : isTraining ? "🔄 Learning... • Getting Smarter" : "🛍️ Ready to help you shop"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* ML Status Indicator */}
      <div className="px-4 pt-3">
        <MLStatusIndicator detailed={true} />
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
          <div className={`flex items-center gap-3 text-sm text-gray-500 px-4 py-3 ${isMLReady ? 'bg-purple-50' : 'bg-orange-50'} rounded-lg mt-2`}>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 ${isMLReady ? 'bg-purple-400' : 'bg-orange-400'} rounded-full animate-bounce`}></div>
              <div className={`w-2 h-2 ${isMLReady ? 'bg-purple-400' : 'bg-orange-400'} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
              <div className={`w-2 h-2 ${isMLReady ? 'bg-purple-400' : 'bg-orange-400'} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
            </div>
            <span>{isMLReady ? "AI analyzing your request..." : "Searching our amazing products..."}</span>
          </div>
        )}

        {/* ML-Enhanced Quick Actions */}
        {isFirstVisit && (
          <div className={`mt-4 p-3 ${isMLReady ? 'bg-purple-50 border-purple-100' : 'bg-orange-50 border-orange-100'} rounded-lg border`}>
            <div className={`text-sm font-medium ${isMLReady ? 'text-purple-800' : 'text-orange-800'} mb-2 flex items-center gap-2`}>
              {isMLReady ? <FaBrain className="text-purple-500" /> : <FaBolt className="text-orange-500" />}
              {isMLReady ? "AI-Powered Quick Actions" : "Quick Actions"}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {currentActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.text)}
                  className={`p-2 text-xs rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isMLReady 
                      ? 'bg-white border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300' 
                      : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
                  } text-left flex items-center gap-2`}
                >
                  <span className="text-sm">{action.icon}</span>
                  <span className="flex-1">{action.text}</span>
                  {action.mlEnhanced && (
                    <FaBrain className="w-3 h-3 text-purple-400" />
                  )}
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
            onChange={(e) => {
              console.log('Input change:', e.target.value);
              setInput(e.target.value);
            }}
            onFocus={() => console.log('Input focused')}
            onBlur={() => console.log('Input blurred')}
            onClick={() => console.log('Input clicked')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('Enter key pressed, submitting...');
                onSubmit(e);
              }
            }}
            placeholder={isMLReady ? "Ask my AI brain anything..." : "Type your message..."}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !input.trim()}
            className={`px-4 py-3 ${isMLReady ? 'bg-purple-500 hover:bg-purple-600' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
          >
            <FaPaperPlane className="h-4 w-4" />
          </button>
        </div>
        
        {/* ML Confidence Indicator */}
        {isMLReady && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            🧠 AI-enhanced responses • Learning from every conversation
          </div>
        )}
        
        {isTraining && (
          <div className="mt-2 text-xs text-blue-600 text-center">
            🔄 AI training in progress • Responses getting smarter!
          </div>
        )}
      </div>
    </div>
  );
}