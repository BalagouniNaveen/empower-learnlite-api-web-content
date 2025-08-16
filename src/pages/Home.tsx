import React, { useEffect, useState } from "react";
import { listLessons } from "../lib/api";
import LessonCard from "../components/LessonCard";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [lessons, setLessons] = useState<Array<any>>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    listLessons(i18n.language).then(setLessons).catch(() => setLessons([]));
  }, [i18n.language]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lessons.map((l) => (
          <LessonCard key={l.slug + i18n.language} slug={l.slug} title={l.title} topic={l.topic} estMins={l.estMins} />
        ))}
      </div>
    </>
  );
}
