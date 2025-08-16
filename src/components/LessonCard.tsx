import React from "react";
import { Link } from "react-router-dom";

export default function LessonCard({ slug, title, topic, estMins } : {
  slug: string;
  title: string;
  topic: string;
  estMins?: number;
}) {
  return (
    <Link to={`/lesson/${encodeURIComponent(slug)}`} className="block p-4 rounded-2xl shadow bg-white hover:shadow-md transition">
      <div className="text-xs uppercase text-gray-500">{topic}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-xs mt-1">⏱ {estMins ?? 3} min</div>
    </Link>
  );
}
