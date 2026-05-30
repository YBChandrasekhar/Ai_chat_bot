"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import MessageBubble from "@/components/MessageBubble";
import ChatInput from "@/components/ChatInput";
import { useAuth } from "@/context/AuthContext";

type Message = {
  role: "user" | "ai";
  content: string;
  messageId?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push("/login"); return; }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("userMessage", ({ sessionId: sid }) => {
      setSessionId(sid);
    });

    socket.on("aiTyping", (isTyping: boolean) => {
      setLoading(isTyping);
    });

    socket.on("aiMessage", ({ content, messageId }: { content: string; messageId: string }) => {
      setMessages((prev) => [...prev, { role: "ai", content, messageId }]);
      setLoading(false);
    });

    socket.on("error", ({ message }: { message: string }) => {
      setError(message);
      setLoading(false);
    });

    return () => { socket.disconnect(); };
  }, [token, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (content: string) => {
    if (!socketRef.current || loading) return;
    setError("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    socketRef.current.emit("sendMessage", { content, sessionId });
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setError("");
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    logout();
    router.push("/login");
  };

  if (!token) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 text-white font-semibold text-lg shadow border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>🤖 AI Chatbot</span>
          <button onClick={() => router.push("/settings")} className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600">⚙️</button>
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewChat}
            className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600"
          >
            + New Chat
          </button>
          <span className="text-sm text-gray-400">Hi, {user?.name}</span>
          {user?.role === "admin" && (
            <button onClick={() => router.push("/admin")} className="text-sm px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded-lg">
              🛡️ Admin
            </button>
          )}
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
          <MessageBubble key={i} role={msg.role} content={msg.content} messageId={msg.messageId} />
        ))}
        {loading && (
          <div className="flex flex-col items-start mb-4">
            <span className="text-xs text-gray-500 mb-1 px-1">🤖 AI · typing</span>
            <div className="bg-gray-700 text-gray-300 px-4 py-3 rounded-2xl rounded-bl-none text-sm flex items-center gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
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
