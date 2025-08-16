import { Router } from "express";
import { prisma } from "../db";

const r = Router();

// Very simple keyword flow for demo: START -> pick topic -> get Q1..n -> score
r.post("/", async (req, res) => {
  const { from, body } = req.body as { from?: string; body?: string };
  const text = (body || "").trim().toLowerCase();
  const phone = from || "demo";

  let user = await prisma.user.findFirst({ where: { phone } });
  if (!user) user = await prisma.user.create({ data: { phone, locale: "en" } });

  // Session state
  let session = await prisma.session.findFirst({ where: { userId: user.id } });
  if (!session) session = await prisma.session.create({ data: { userId: user.id, state: "idle" } });
  const payload = session.payload ? JSON.parse(session.payload) : {};

  const reply = async (msg: string) => res.json({ reply: msg });

  if (text === "start" || session.state === "idle") {
    const topics = await prisma.lesson.findMany({ where: { locale: user.locale }, select: { topic: true }, distinct: ["topic"] });
    await prisma.session.update({ where: { id: session.id }, data: { state: "choose_topic" } });
    const list = topics.map((t, i) => `${i+1}. ${t.topic}`).join("\n");
    return reply(`Welcome to LearnLite! Reply with a number to choose a topic:\n${list}`);
  }

  if (session.state === "choose_topic") {
    const topics = await prisma.lesson.findMany({ where: { locale: user.locale }, select: { topic: true }, distinct: ["topic"] });
    const idx = parseInt(text) - 1;
    const topic = topics[idx]?.topic;
    if (!topic) return reply("Invalid choice. Send START to restart.");
    const lessons = await prisma.lesson.findMany({ where: { topic, locale: user.locale }, orderBy: { slug: "asc" } });
    await prisma.session.update({ where: { id: session.id }, data: { state: "in_quiz", payload: JSON.stringify({ lessonSlug: lessons[0].slug, qIndex: 0, score: 0 }) } });
    return reply(`Topic: ${topic}. Let's begin quiz for '${lessons[0].title}'. Reply 1-4 to a
