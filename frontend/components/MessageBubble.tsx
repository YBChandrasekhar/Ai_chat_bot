"use client";

import { useState } from "react";
import { rateMessage } from "@/services/api";

type Props = {
  role: "user" | "ai";
  content: string;
  messageId?: string;
};

export default function MessageBubble({ role, content, messageId }: Props) {
  const isUser = role === "user";
  const [rating, setRating] = useState<"like" | "dislike" | null>(null);
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleRating = async (value: "like" | "dislike") => {
    if (rating || !messageId) return;
    setRating(value);
    try {
      await rateMessage(messageId, value);
    } catch {
      setRating(null);
    }
  };

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4`}>
      <span className="text-xs text-gray-500 mb-1 px-1">
        {isUser ? "You" : "🤖 AI"} · {time}
      </span>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-700 text-gray-100 rounded-bl-none"
        }`}
      >
        {content}
      </div>
      {/* Rating for AI messages only */}
      {!isUser && messageId && (
        <div className="flex gap-2 mt-1 px-1">
          <button
            onClick={() => handleRating("like")}
            disabled={!!rating}
            className={`text-sm transition-transform hover:scale-110 ${rating === "like" ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
          >
            👍
          </button>
          <button
            onClick={() => handleRating("dislike")}
            disabled={!!rating}
            className={`text-sm transition-transform hover:scale-110 ${rating === "dislike" ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
          >
            👎
          </button>
        </div>
      )}
    </div>
  );
}
