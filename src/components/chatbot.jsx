import { ChatbotProvider } from "../contexts/ChatbotContext.jsx";
import ChatLauncher from "./chatbot/ChatLauncher.jsx";

export default function Chatbot() {
  return (
    <ChatbotProvider>
      <ChatLauncher />
    </ChatbotProvider>
  );
}
