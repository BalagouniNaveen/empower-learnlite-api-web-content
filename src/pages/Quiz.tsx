import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuiz, grade } from "../lib/api";
import QuizView from "../components/QuizView";
import { useTranslation } from "react-i18next";

export default function Quiz() {
  const { slug } = useParams<{ slug: string }>();
  const [qs, setQs] = useState<Array<{ prompt: string; options: string[] }>>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ total: number; score: number } | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!slug) return;
    getQuiz(decodeURIComponent(slug), i18n.language).then(setQs).catch(() => setQs([]));
  }, [slug, i18n.language]);

  const onAnswer = (idx: number) => {
    const next = [...answers, idx];
    setAnswers(next);
    if (i + 1 >= qs.length && slug) {
      grade(decodeURIComponent(slug), next, undefined, i18n.language).then(setResult).catch(() => null);
    } else {
      setI(i + 1);
    }
  };

  if (result) return <div className="p-4 rounded-2xl bg-green-50 border">Score: {result.score}/{result.total}</div>;
  if (qs.length === 0) return <div>Loading…</div>;
  return <QuizView q={qs[i]} i={i} onAnswer={onAnswer} />;
}
