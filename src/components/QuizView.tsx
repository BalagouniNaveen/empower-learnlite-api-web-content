import React from "react";

export default function QuizView({
  q,
  i,
  onAnswer,
}: {
  q: { prompt: string; options: string[] };
  i: number;
  onAnswer: (idx: number) => void;
}) {
  return (
    <div className="p-4 rounded-2xl shadow bg-white">
      <div className="mb-3 font-medium">Q{i + 1}. {q.prompt}</div>
      <div className="grid gap-2">
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={() => onAnswer(idx)} className="text-left p-3 rounded-xl border hover:bg-gray-50">
            {idx + 1}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
