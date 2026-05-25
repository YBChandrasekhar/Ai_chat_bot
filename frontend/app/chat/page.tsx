"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import { sendMessage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);
    try {
      const res = await sendMessage(content, sessionId ?? undefined);
      setSessionId(res.data.sessionId);
      setMessages((prev) => [...prev, { role: "ai", content: res.data.aiMessage }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!token) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 text-white font-semibold text-lg shadow border-b border-gray-700 flex justify-between items-center">
        <span>🤖 AI Chatbot</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-20 text-sm">
            Start a conversation with AI!
          </p>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl rounded-bl-none text-sm">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}
