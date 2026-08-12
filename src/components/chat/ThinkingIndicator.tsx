export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 w-fit rounded-2xl bg-gray-100 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
    </div>
  );
}
