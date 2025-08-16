# empower-learnlite-api-web-content


# LearnLite: Offline‑First, Multilingual Micro‑Learning for Under‑Resourced Students

A complete, beginner‑friendly yet production‑grade project you can **build or pitch** in Empower Hacks 3.0.

**Why this fits the prompt**

* Works on **any Android phone or shared PC** with **very low bandwidth**.
* **Offline‑first PWA** so lessons/quiz work without internet once cached.
* **Multilingual** (English + your local language) with **text‑to‑speech** and **high-contrast** UI.
* **SMS/WhatsApp fallback** so learners without data can still get lessons and quizzes.
* **Teacher dashboard** to track progress in simple charts.

---

## What you’ll build (MVP scope)

1. **Web PWA** (React/Vite/TypeScript + Tailwind) — student app for lessons + bite-sized quizzes.
2. **API** (Node/Express + SQLite via Prisma) — serves content and stores progress.
3. **SMS bot** (simple state machine as an API webhook) — delivers lessons/quizzes over SMS; swap in Twilio/WhatsApp later.
4. **Content pack** (JSON) — lessons + quizzes in multiple languages.

> You can ship the PWA + API in a day. SMS bot is optional but included.

---

## Tech stack

* **Frontend**: React + Vite + TypeScript, Tailwind CSS, React Router, IndexedDB caching via Service Worker, i18next.
* **Backend**: Node.js + Express, Prisma ORM, SQLite DB (upgrade to Postgres later), Zod validation.
* **Bot/Webhooks**: Express route implementing a simple state machine; Twilio adapter (optional).

---

## Step‑by‑step project plan

### 0) Prereqs

* Node 18+, Git. Optional: VSCode.

### 1) Scaffold repository

```bash
mkdir empower-learnlite && cd empower-learnlite
mkdir -p api web content
```

### 2) File/folder structure (final result)

```
empower-learnlite/
├─ README.md
├─ content/
│  ├─ lessons.en.json
│  └─ lessons.te.json          # example: Telugu; add others as needed
├─ api/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ .env.example
│  ├─ prisma/
│  │  └─ schema.prisma
│  └─ src/
│     ├─ server.ts
│     ├─ db.ts
│     ├─ routes/
│     │  ├─ lessons.ts
│     │  ├─ quiz.ts
│     │  ├─ progress.ts
│     │  └─ sms.ts
│     └─ seed.ts
├─ web/
│  ├─ index.html
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ vite.config.ts
│  ├─ postcss.config.cjs
│  ├─ tailwind.config.cjs
│  ├─ public/
│  │  ├─ manifest.webmanifest
│  │  └─ sw.js
│  └─ src/
│     ├─ main.tsx
│     ├─ App.tsx
│     ├─ index.css
│     ├─ i18n.ts
│     ├─ lib/api.ts
│     ├─ components/
│     │  ├─ LessonCard.tsx
│     │  ├─ QuizView.tsx
│     │  ├─ LanguageSwitcher.tsx
│     │  └─ ProgressBar.tsx
│     └─ pages/
│        ├─ Home.tsx
│        ├─ Lesson.tsx
│        ├─ Quiz.tsx
│        └─ Dashboard.tsx
```

---

## Backend (api/)

### 3) Initialize API package

```bash
cd api
npm init -y
npm i express cors dotenv zod @prisma/client
npm i -D typescript ts-node-dev prisma @types/express @types/node
npx tsc --init
npx prisma init --datasource-provider sqlite
```

**`api/.env.example`**

```
DATABASE_URL="file:./dev.db"
PORT=4000
# Optional Twilio/WhatsApp (not required for local):
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM_NUMBER=+1xxxxxxxxxx
```

**`api/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id       String   @id @default(cuid())
  phone    String?  @unique
  name     String?
  locale   String   @default("en")
  progress Progress[]
  sessions Session[]
}

model Lesson {
  id       String    @id @default(cuid())
  slug     String    @unique
  topic    String
  locale   String    @default("en")
  title    String
  body     String
  estMins  Int       @default(3)
  questions Question[]
}

model Question {
  id        String  @id @default(cuid())
  lessonId  String
  lesson    Lesson  @relation(fields: [lessonId], references: [id])
  prompt    String
  optionA   String
  optionB   String
  optionC   String
  optionD   String
  correct   Int     // 0..3
}

model Progress {
  id       String  @id @default(cuid())
  userId   String
  user     User    @relation(fields: [userId], references: [id])
  lessonId String
  status   String  @default("started") // started|completed
  score    Int     @default(0)
  updatedAt DateTime @updatedAt
}

model Session { // for SMS state machine
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  state     String  @default("idle")
  payload   String  @default("") // JSON blob
  updatedAt DateTime @updatedAt
}
```

### 4) Database seed from `/content`

**`api/src/seed.ts`**

```ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function load(locale: string) {
  const raw = fs.readFileSync(path.join(__dirname, "../../content/lessons."+locale+".json"), "utf-8");
  const data = JSON.parse(raw) as Array<{slug:string,topic:string,title:string,body:string,estMins?:number,questions:{prompt:string,options:string[],answer:number}[]}>;
  for (const l of data) {
    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: { title: l.title, body: l.body, topic: l.topic, locale, estMins: l.estMins ?? 3 },
      create: { slug: l.slug, topic: l.topic, locale, title: l.title, body: l.body, estMins: l.estMins ?? 3 }
    });
    // replace questions
    await prisma.question.deleteMany({ where: { lessonId: lesson.id } });
    for (const q of l.questions) {
      await prisma.question.create({ data: {
        lessonId: lesson.id,
        prompt: q.prompt,
        optionA: q.options[0], optionB: q.options[1], optionC: q.options[2], optionD: q.options[3],
        correct: q.answer
      }});
    }
  }
}

async function main(){
  await load("en");
  try { await load("te"); } catch { console.log("No Telugu content yet; skipping"); }
}

main().then(()=>prisma.$disconnect());
```

### 5) API server & routes

**`api/src/db.ts`**

```ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

**`api/src/routes/lessons.ts`**

```ts
import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/", async (req, res) => {
  const { locale = "en", topic } = req.query as { locale?: string; topic?: string };
  const where: any = { locale };
  if (topic) where.topic = topic;
  const lessons = await prisma.lesson.findMany({ where, select: { id:true, slug:true, title:true, topic:true, estMins:true } });
  res.json(lessons);
});

r.get("/:slug", async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });
  if (!lesson) return res.status(404).json({ error: "Not found" });
  res.json(lesson);
});

export default r;
```

**`api/src/routes/quiz.ts`**

```ts
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
```

> **Note:** Add this unique composite in schema if using upsert above strictly:
>
> ```prisma
> @@unique([userId, lessonId], name: "userId_lessonId")
> ```

**`api/src/routes/progress.ts`**

```ts
import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/:userId", async (req, res) => {
  const rows = await prisma.progress.findMany({ where: { userId: req.params.userId } });
  res.json(rows);
});

export default r;
```

**`api/src/routes/sms.ts`** (simple in‑memory flow; swap with Twilio easily)

```ts
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
    return reply(`Topic: ${topic}. Let's begin quiz for '${lessons[0].title}'. Reply 1-4 to answer.`);
  }

  if (session.state === "in_quiz") {
    const s = payload as { lessonSlug: string; qIndex: number; score: number };
    const lesson = await prisma.lesson.findUnique({ where: { slug: s.lessonSlug } });
    const qs = await prisma.question.findMany({ where: { lessonId: lesson!.id } });

    // If expecting an answer
    if (text && /^[1-4]$/.test(text)) {
      const chosen = parseInt(text) - 1;
      const correct = qs[s.qIndex].correct;
      if (chosen === correct) s.score++;
      s.qIndex++;
      if (s.qIndex >= qs.length) {
        await prisma.session.update({ where: { id: session.id }, data: { state: "idle", payload: "" } });
        return reply(`Done! Score ${s.score}/${qs.length}. Send START to try another topic.`);
      }
      await prisma.session.update({ where: { id: session.id }, data: { payload: JSON.stringify(s) } });
    }

    const q = qs[s.qIndex];
    return reply(`Q${s.qIndex+1}: ${q.prompt}\n1) ${q.optionA}\n2) ${q.optionB}\n3) ${q.optionC}\n4) ${q.optionD}`);
  }

  return reply("Send START to begin.");
});

export default r;
```

**`api/src/server.ts`**

```ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import lessons from "./routes/lessons";
import quiz from "./routes/quiz";
import progress from "./routes/progress";
import sms from "./routes/sms";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/lessons", lessons);
app.use("/api/quiz", quiz);
app.use("/api/progress", progress);
app.use("/webhooks/sms", sms);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));
```

### 6) Add some content

**`content/lessons.en.json`** (short sample)

```json
[
  {
    "slug": "math-fractions-1",
    "topic": "Math Basics",
    "title": "Understanding Fractions",
    "body": "A fraction shows parts of a whole. 1/2 means two equal parts and we take one.",
    "estMins": 3,
    "questions": [
      { "prompt": "What does 1/2 mean?", "options": ["1 out of 3","1 out of 2","2 out of 1","none"], "answer": 1 },
      { "prompt": "Which is bigger?", "options": ["1/2","1/3","equal","can't say"], "answer": 0 }
    ]
  },
  {
    "slug": "eng-reading-1",
    "topic": "English",
    "title": "Reading Tip: Skim First",
    "body": "Skim the text to get the idea, then read slowly. This helps with understanding.",
    "questions": [
      { "prompt": "What should you do first?", "options": ["Read slowly","Memorize","Skim","Skip"], "answer": 2 }
    ]
  }
]
```

> Duplicate this file to `lessons.te.json` and translate for a local language (e.g., Telugu).

### 7) Run DB and seed

```bash
cd api
npx prisma migrate dev --name init
npx ts-node-dev src/seed.ts
npm run dev # (add script below)
```

**`api/package.json` scripts**

```json
{
  "name": "learnlite-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node-dev --respawn src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma": "prisma"
  }
}
```

---

## Frontend (web/)

### 8) Initialize web app

```bash
cd ../web
npm create vite@latest . -- --template react-ts
npm i react-router-dom i18next react-i18next
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**`web/tailwind.config.cjs`**

```js
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

**`web/postcss.config.cjs`** (generated)

```js
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

**`web/src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
html, body, #root { height: 100%; }
```

**`web/public/manifest.webmanifest`**

```json
{
  "name": "LearnLite",
  "short_name": "LearnLite",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "icons": []
}
```

**`web/public/sw.js`** (simple offline cache)

```js
const CACHE = "learnlite-v1";
const OFFLINE = ["/", "/index.html", "/manifest.webmanifest"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(OFFLINE)));
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return resp;
    }).catch(()=>caches.match("/index.html")))
  );
});
```

**`web/src/i18n.ts`**

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { startLearning: "Start Learning", continue: "Continue", quiz: "Quiz" } },
  te: { translation: { startLearning: "ప్రారంభించండి", continue: "కొనసాగించండి", quiz: "క్విజ్" } }
};

i18n.use(initReactI18next).init({ resources, lng: "en", interpolation: { escapeValue: false } });
export default i18n;
```

**`web/src/lib/api.ts`**

```ts
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
export async function listLessons(locale="en") {
  const r = await fetch(`${API}/api/lessons?locale=${locale}`);
  return r.json();
}
export async function getLesson(slug: string) {
  const r = await fetch(`${API}/api/lessons/${slug}`);
  return r.json();
}
export async function getQuiz(slug: string) {
  const r = await fetch(`${API}/api/quiz/${slug}`);
  return r.json();
}
export async function grade(slug: string, answers: number[], userId?: string) {
  const r = await fetch(`${API}/api/quiz/${slug}/grade`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ answers, userId }) });
  return r.json();
}
```

**`web/src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App'
import Home from './pages/Home'
import Lesson from './pages/Lesson'
import Quiz from './pages/Quiz'
import Dashboard from './pages/Dashboard'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'))
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />} />
          <Route path='lesson/:slug' element={<Lesson />} />
          <Route path='quiz/:slug' element={<Quiz />} />
          <Route path='dashboard' element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
```

**`web/src/App.tsx`**

```tsx
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <header className='p-4 shadow bg-white sticky top-0'>
        <div className='max-w-4xl mx-auto flex items-center justify-between'>
          <Link to='/' className='text-xl font-bold'>LearnLite</Link>
          <nav className='space-x-4 text-sm'>
            <Link to='/dashboard'>Dashboard</Link>
          </nav>
        </div>
      </header>
      <main className='max-w-4xl mx-auto p-4'>
        <Outlet />
      </main>
    </div>
  )
}
```

**`web/src/components/LessonCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
export default function LessonCard({ slug, title, topic, estMins }:{ slug:string; title:string; topic:string; estMins:number }){
  return (
    <Link to={`/lesson/${slug}`} className='block p-4 rounded-2xl shadow bg-white hover:shadow-md transition'>
      <div className='text-xs uppercase text-gray-500'>{topic}</div>
      <div className='text-lg font-semibold'>{title}</div>
      <div className='text-xs mt-1'>⏱ {estMins} min</div>
    </Link>
  )
}
```

**`web/src/pages/Home.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { listLessons } from '../lib/api'
import LessonCard from '../components/LessonCard'

export default function Home(){
  const [lessons, setLessons] = useState<any[]>([])
  useEffect(()=>{ listLessons('en').then(setLessons) },[])
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
      {lessons.map(l => <LessonCard key={l.slug} {...l} />)}
    </div>
  )
}
```

**`web/src/pages/Lesson.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLesson } from '../lib/api'

export default function Lesson(){
  const { slug } = useParams()
  const [lesson, setLesson] = useState<any>()
  useEffect(()=>{ if(slug) getLesson(slug).then(setLesson) },[slug])

  // Simple TTS
  const speak = () => {
    if (!('speechSynthesis' in window) || !lesson) return
    const u = new SpeechSynthesisUtterance(lesson.body)
    speechSynthesis.speak(u)
  }

  if(!lesson) return <div>Loading…</div>
  return (
    <article className='prose max-w-none'>
      <h1>{lesson.title}</h1>
      <p>{lesson.body}</p>
      <div className='flex gap-2 mt-4'>
        <button className='px-3 py-2 rounded-xl bg-black text-white' onClick={speak}>🔊 Listen</button>
        <Link className='px-3 py-2 rounded-xl bg-indigo-600 text-white' to={`/quiz/${slug}`}>Take Quiz</Link>
      </div>
    </article>
  )
}
```

**`web/src/components/ProgressBar.tsx`**

```tsx
export default function ProgressBar({ value, max }:{ value:number; max:number }){
  const pct = Math.round((value/max)*100)
  return (
    <div className='w-full bg-gray-200 rounded-xl overflow-hidden'>
      <div className='h-3 bg-green-500' style={{ width: pct+"%" }} />
    </div>
  )
}
```

**`web/src/components/QuizView.tsx`**

```tsx
export default function QuizView({ q, i, onAnswer }:{ q:{prompt:string; options:string[]}; i:number; onAnswer:(idx:number)=>void }){
  return (
    <div className='p-4 rounded-2xl shadow bg-white'>
      <div className='mb-3 font-medium'>Q{i+1}. {q.prompt}</div>
      <div className='grid gap-2'>
        {q.options.map((opt, idx) => (
          <button key={idx} onClick={()=>onAnswer(idx)} className='text-left p-3 rounded-xl border hover:bg-gray-50'>
            {idx+1}. {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**`web/src/pages/Quiz.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getQuiz, grade } from '../lib/api'
import QuizView from '../components/QuizView'

export default function Quiz(){
  const { slug } = useParams()
  const [qs, setQs] = useState<any[]>([])
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<any>(null)

  useEffect(()=>{ if(slug) getQuiz(slug).then(setQs) },[slug])

  const onAnswer = (idx:number) => {
    const next = [...answers, idx]
    setAnswers(next)
    if(i+1 >= qs.length && slug){
      grade(slug, next).then(setResult)
    } else setI(i+1)
  }

  if(result) return <div className='p-4 rounded-2xl bg-green-50 border'>Score: {result.score}/{result.total}</div>
  if(qs.length===0) return <div>Loading…</div>
  return <QuizView q={qs[i]} i={i} onAnswer={onAnswer} />
}
```

**`web/src/pages/Dashboard.tsx`** (placeholder that you can extend to show per‑topic progress from `/api/progress/:userId`)

```tsx
export default function Dashboard(){
  return (
    <div className='space-y-2'>
      <h2 className='text-xl font-bold'>Your Progress</h2>
      <div>Sign-in free MVP: we’ll show latest quiz score after grading. For full dashboard, call /api/progress/:userId.</div>
    </div>
  )
}
```

**`web/package.json` scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Run the web app**

```bash
npm run dev
# open http://localhost:5173 and set VITE_API_URL in .env if API is remote
```

---

## Connect the pieces

1. Start API: `cd api && npm run dev` (on port 4000).
2. Start Web: `cd web && npm run dev` (on 5173). The web app calls `http://localhost:4000` by default.
3. Try SMS webhook locally by POSTing JSON:

```bash
curl -X POST http://localhost:4000/webhooks/sms \
  -H 'Content-Type: application/json' \
  -d '{"from":"+919999999999","body":"START"}'
```

---

## Pitch points (for judges)

* **Impact**: Works without internet after first load; SMS channel for no‑data users; multilingual content; audio for non‑readers.
* **Feasibility**: All open‑source components; deployable on free tiers; simple JSON content model for volunteers to add lessons.
* **Scalability**: Content packs per language; add topics by dropping JSON; upgrade DB to Postgres when needed.
* **Measurement**: Track score and time per lesson; export progress CSV for schools/NGOs.

---

## Stretch goals (only if time permits)

* **Teacher mode** to create quizzes from a phone.
* **QR content transfer** (share packs via QR in offline rooms).
* **Voice IVR** using Twilio Programmable Voice.
* **WhatsApp bot** using the same webhook contract.

---

## README (copy to project root)

**`README.md`** (suggested)

````md
# LearnLite

Offline-first, multilingual micro-learning for low-bandwidth environments.

## Quick start
1. API
   ```bash
   cd api
   cp .env.example .env
   npm i
   npx prisma migrate dev --name init
   npx ts-node-dev src/seed.ts
   npm run dev
````

2. Web

   ```bash
   cd web
   npm i
   npm run dev
   ```
3. Visit [http://localhost:5173](http://localhost:5173)

## Environment

* API: PORT=4000, DATABASE\_URL (sqlite), optional Twilio keys.
* Web: VITE\_API\_URL=[http://localhost:4000](http://localhost:4000)

## Deploy (fast)

* API → Render/Railway/Fly.io (Docker or Node). Persist SQLite or switch to Postgres.
* Web → Netlify/Vercel/Cloudflare Pages. Ensure CORS enabled on API.

## Contributing content

Add/translate JSON files in /content and rerun `api/src/seed.ts`.

```

---

## What to submit (hackathon)
- **GitHub repo** with `/api`, `/web`, `/content` and a short `README.md`.
- **1–3 min demo video**: loading app, offline use, quiz, SMS curl demo.
- **Short write‑up**: how it improves accessibility (multilingual, offline, SMS).

---

## Notes & Explanations
- **Why PWA?** Reliable offline access via caching; installable on cheap Androids.
- **Why SQLite?** Zero‑ops DB for demo; Prisma makes swapping DB trivial later.
- **Why JSON content?** Lets volunteers add lessons without touching code.
- **Accessibility**: big tap targets, TTS, high contrast, low reading level copy.

> This kit balances *beginner friendliness* with *real‑world practices* (types, folders, envs, seed scripts) so you can both **build** and **pitch** confidently.

```
