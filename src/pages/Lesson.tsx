import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getLesson } from "../lib/api";
import { useTranslation } from "react-i18next";

export default function Lesson() {
  const { slug } = useParams<{ slug: string }>();
  const [lesson, setLesson] = useState<any | null>(null);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (!slug) return;
    getLesson(decodeURIComponent(slug), i18n.language).then(setLesson).catch(() => setLesson(null));
  }, [slug, i18n.language]);

  const speak = () => {
    if (!lesson || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(lesson.body);
    speechSynthesis.speak(u);
  };

  if (lesson === null) return <div>Loading…</div>;

  return (
    <article className="prose max-w-none">
      <h1>{lesson.title}</h1>
      <p>{lesson.body}</p>
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={speak}>
          🔊 {t("listen")}
        </button>
        <Link className="px-3 py-2 rounded-xl bg-indigo-600 text-white" to={`/quiz/${encodeURIComponent(lesson.slug)}`}>
          {t("quiz")}
        </Link>
      </div>
    </article>
  );
}
