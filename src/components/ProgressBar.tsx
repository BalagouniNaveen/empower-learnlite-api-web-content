import React from "react";

export default function ProgressBar({ value = 0, max = 100 } : { value?: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-xl overflow-hidden my-3">
      <div className="h-3 bg-green-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
