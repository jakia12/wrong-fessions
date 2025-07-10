export default function Comments({ replies = [] }) {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-bold [color:var(--color-secondary)]">
        Comments ({replies.length})
      </h4>
      <div className="space-y-2">
        {replies.map((reply, index) => (
          <div
            key={index}
            className="bg-[#00000080] border border-[color:var(--color-secondary)] rounded p-3"
          >
            <div className="text-sm [color:var(--color-primary)] whitespace-pre-line">
              {reply.content}
            </div>
            <div className="text-xs text-[#aaa] mt-1">
              {new Date(reply.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
