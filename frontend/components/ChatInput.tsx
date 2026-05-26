"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onSend: (message: string) => void;
  loading: boolean;
};

export default function ChatInput({ onSend, loading }: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-gray-700 bg-gray-800">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        placeholder={loading ? "Waiting for response..." : "Type a message..."}
        disabled={loading}
        maxLength={2000}
        className="flex-1 px-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-full outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-60"
      />
      <button
        onClick={handleSend}
        disabled={loading || !input.trim()}
        className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-full text-sm disabled:opacity-50 hover:bg-gray-200 transition-colors"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
