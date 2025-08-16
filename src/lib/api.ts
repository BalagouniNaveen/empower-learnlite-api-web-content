const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function listLessons(locale = "en") {
  const res = await fetch(`${API}/api/lessons?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return (await res.json()) as Array<{ id: string; slug: string; title: string; topic: string; estMins?: number }>;
}

export async function getLesson(slug: string, locale = "en") {
  const res = await fetch(`${API}/api/lessons/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) throw new Error("Lesson not found");
  return (await res.json()) as { id: string; slug: string; title: string; body: string; topic: string; estMins?: number };
}

export async function getQuiz(slug: string, locale = "en") {
  const res = await fetch(`${API}/api/quiz/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) throw new Error("Quiz not found");
  return (await res.json()) as Array<{ prompt: string; options: string[] }>;
}

export async function grade(slug: string, answers: number[], userId?: string, locale = "en") {
  const res = await fetch(`${API}/api/quiz/${encodeURIComponent(slug)}/grade?locale=${encodeURIComponent(locale)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, userId }),
  });
  if (!res.ok) throw new Error("Grading failed");
  return (await res.json()) as { total: number; score: number };
}
