import type { UIMessage } from "ai";

export default function MessageBubble({
  role,
  parts,
}: {
  role: string;
  parts: UIMessage["parts"];
}) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
          isUser
            ? "bg-black text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        {parts.map((part, i) =>
          part.type === "text" ? <span key={i}>{part.text}</span> : null,
        )}
      </div>
    </div>
  );
}
