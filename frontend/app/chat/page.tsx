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
  const [error, setError] = useState("");
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
    setError("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);
    try {
      const res = await sendMessage(content, sessionId ?? undefined);
      setSessionId(res.data.sessionId);
      setMessages((prev) => [...prev, { role: "ai", content: res.data.aiMessage }]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setError("");
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
          <button
            onClick={handleNewChat}
            className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600"
          >
            + New Chat
          </button>
          <span className="text-sm text-gray-400">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-2 bg-red-900 border border-red-700 text-red-300 text-sm rounded-xl flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <span className="text-5xl">🤖</span>
            <p className="text-gray-400 text-lg font-medium">How can I help you today?</p>
            <p className="text-gray-600 text-sm">Type a message below to start chatting</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl rounded-bl-none text-sm flex items-center gap-2">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-100">●</span>
              <span className="animate-pulse delay-200">●</span>
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
