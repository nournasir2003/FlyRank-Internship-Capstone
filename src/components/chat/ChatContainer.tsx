"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");

  const isThinking = status === "submitted";
  const isStreaming = status === "streaming";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsPinned(distanceFromBottom < 80);
  };

  useEffect(() => {
    if (isPinned && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPinned]);

  const jumpToLatest = () => {
    setIsPinned(true);
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3 sm:px-4"
      >
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} parts={m.parts} />
        ))}

        {isThinking && <ThinkingIndicator />}
      </div>

      {!isPinned && (
        <button
          onClick={jumpToLatest}
          className="self-center mb-2 text-xs px-3 py-1 rounded-full bg-gray-800 text-white"
        >
          ↓ الانتقال لآخر رسالة
        </button>
      )}

      <ChatInput
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isStreaming={isStreaming}
        onStop={stop}
      />
    </div>
  );
}
