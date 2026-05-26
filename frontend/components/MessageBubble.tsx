"use client";

type Props = {
  role: "user" | "ai";
  content: string;
};

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
    </div>
  );
}
