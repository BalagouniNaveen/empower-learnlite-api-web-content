import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/:slug", async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });
  if (!lesson) return res.status(404).json({ error: "No such lesson" });
  const q = await prisma.question.findMany({ where: { lessonId: lesson.id }, orderBy: { id: "asc" } });
  const quiz = q.map((x) => ({ prompt: x.prompt, options: [x.optionA,x.optionB,x.optionC,x.optionD] }));
  res.json(quiz);
});

r.post("/:slug/grade", async (req, res) => {
  const { answers, userId } = req.body as { answers: number[]; userId: string };
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });
  if (!lesson) return res.status(404).json({ error: "No such lesson" });
  const q = await prisma.question.findMany({ where: { lessonId: lesson.id }, orderBy: { id: "asc" } });
  let score = 0;
  q.forEach((x, i) => { if (answers[i] === x.correct) score++; });
  if (userId) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      create: { userId, lessonId: lesson.id, status: "completed", score },
      update: { status: "completed", score }
    } as any);
  }
  res.json({ total: q.length, score });
});

export default r;
