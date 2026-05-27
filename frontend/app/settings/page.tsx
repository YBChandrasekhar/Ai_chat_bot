"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPreferences, updatePreferences } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [chatbotName, setChatbotName] = useState("AI Assistant");
  const [category, setCategory] = useState("casual");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    getPreferences().then((res) => {
      const prefs = res.data.preferences || {};
      setTheme(prefs.theme || "dark");
      setChatbotName(prefs.chatbotName || "AI Assistant");
      setCategory(prefs.category || "casual");
    }).catch(() => router.push("/chat"));
  }, [token, router]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await updatePreferences({ theme, chatbotName, category });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Header */}
      <div className={`px-6 py-4 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b flex items-center gap-4`}>
        <button onClick={() => router.push("/chat")} className="text-blue-400 hover:underline text-sm">
          ← Back to Chat
        </button>
        <span className="font-semibold text-lg">⚙️ Settings</span>
      </div>

      <div className="max-w-lg mx-auto p-6 flex flex-col gap-6 mt-4">

        {/* Theme */}
        <div className={`p-5 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow"}`}>
          <h2 className="font-semibold mb-3">🎨 Theme</h2>
          <div className="flex gap-3">
            {["dark", "light"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-colors ${
                  theme === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300 border-gray-600"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                {t === "dark" ? "🌙 Dark" : "☀️ Light"}
              </button>
            ))}
          </div>
        </div>

        {/* Chatbot Name */}
        <div className={`p-5 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow"}`}>
          <h2 className="font-semibold mb-3">🤖 Chatbot Name</h2>
          <input
            type="text"
            value={chatbotName}
            onChange={(e) => setChatbotName(e.target.value)}
            maxLength={30}
            className={`w-full px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === "dark"
                ? "bg-gray-700 text-white border border-gray-600"
                : "bg-gray-100 text-gray-900 border border-gray-300"
            }`}
          />
        </div>

        {/* Chat Category */}
        <div className={`p-5 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-white shadow"}`}>
          <h2 className="font-semibold mb-3">💬 Chat Style</h2>
          <div className="flex flex-col gap-2">
            {[
              { value: "casual", label: "😊 Casual", desc: "Friendly and conversational" },
              { value: "professional", label: "💼 Professional", desc: "Formal and precise" },
              { value: "creative", label: "🎨 Creative", desc: "Imaginative and expressive" },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-colors ${
                  category === c.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <span className="font-medium">{c.label}</span>
                <span className="text-xs opacity-75">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        {success && (
          <p className="text-green-400 text-sm text-center">✅ Settings saved successfully!</p>
        )}
      </div>
    </div>
  );
}
