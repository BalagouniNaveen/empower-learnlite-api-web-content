import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Your Progress</h2>
      <div>
        This is a simple demo dashboard. To show real per-user progress, integrate the backend `/api/progress/:userId` endpoint
        and render scores with charts (e.g., Chart.js or Recharts).
      </div>
    </div>
  );
}
