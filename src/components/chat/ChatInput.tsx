export default function ChatInput({
  input,
  onChange,
  onSubmit,
  isStreaming,
  onStop,
}: {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isStreaming: boolean;
  onStop: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 p-3 border-t bg-white sticky bottom-0"
    >
      <input
        value={input}
        onChange={onChange}
        placeholder="Type your message..."
        disabled={isStreaming}
        className="flex-1 rounded-full border px-4 py-2 text-sm outline-none disabled:opacity-50"
      />

      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          className="rounded-full bg-red-500 text-white px-4 py-2 text-sm shrink-0"
        >
          Stop
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-full bg-black text-white px-4 py-2 text-sm shrink-0 disabled:opacity-40"
        >
          Send
        </button>
      )}
    </form>
  );
}
