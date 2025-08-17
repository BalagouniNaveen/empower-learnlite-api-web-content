# empower-learnlite-api-web-content


# LearnLite: Offline‑First, Multilingual Micro‑Learning for Under‑Resourced Students

A complete, beginner‑friendly yet production‑grade project you can **build or pitch** in Empower Hacks 3.0.


# LearnLite Project — Complete Step-by-Step Explanation

---

## 1. Project Overview

**LearnLite** is a **small, offline-first learning app** for under-resourced students.
It allows learners to access **lessons and quizzes** on phones or computers with **low or no internet**.

**Key Features:**

* Offline-first Progressive Web App (PWA)
* Multilingual support (English + local language)
* Text-to-speech for lessons
* Optional SMS/WhatsApp lessons
* Teacher dashboard for progress tracking

---

## 2. Goals

* Make learning **accessible without reliable internet**
* Allow teachers to **track student progress**
* Provide a **prototype that can scale to production**
* Include **SMS/WhatsApp fallback** for students without data

---

## 3. Benefits

* Students can **learn anytime, anywhere**
* Multilingual support **removes language barriers**
* Teachers can **monitor progress easily**
* Offline-first design **works in low-connectivity areas**
* Lightweight and **easy to deploy**

---

## 4. Advantages

* Works on **low-end devices**
* Easy to **add more lessons or languages**
* Offline mode ensures **continuous learning**
* SMS/WhatsApp mode for **students without smartphones**

---

## 5. Disadvantages / Limitations

* Prototype, **not full production ready**
* SQLite suitable only for **small projects**
* No **user authentication** yet
* Limited **analytics and reporting**

---

## 6. Key Requirements

**Hardware/Software:**

* Computer or Android phone
* Node.js + npm
* Modern web browser
* Optional: Twilio account for SMS

**Content Requirements:**

* Lessons and quizzes in **JSON format**
* Multiple language packs (English, Telugu, etc.)

---

## 7. Tools & Technologies

**Frontend (Web / PWA):**

* React + Vite + TypeScript
* Tailwind CSS
* React Router
* IndexedDB caching via Service Worker
* i18next for translations

**Backend (API):**

* Node.js + Express
* Prisma ORM
* SQLite database
* Zod for validation

**Optional Bot/Webhooks:**

* Twilio for SMS/WhatsApp
* Express route for state machine

**Development Tools:**

* TypeScript, ts-node-dev
* VS Code or any code editor

---

## 8. Step-by-Step Project Completion

### Backend Setup

1. Go to backend folder: `cd api`
2. Copy environment file: `cp .env.example .env`
3. Install packages: `npm install`
4. Setup Prisma:
   `npx prisma generate`
   `npx prisma migrate dev --name init`
5. Seed lessons: `npx ts-node-dev src/seed.ts`
6. Start backend: `npm run dev` (port 4000)

### Frontend Setup

1. Go to frontend folder: `cd web`
2. Install packages: `npm install`
3. Start frontend: `npm run dev` (port 5173)

### Demo Workflow

1. Open backend health check: `http://localhost:4000/api/health`
2. Show lessons list: `http://localhost:4000/api/lessons?locale=en`
3. Open PWA: `http://localhost:5173`
4. Switch language, read lessons, take quizzes
5. (Optional) Show SMS/WhatsApp bot

---

## 9. Uses

* Remote learning in low-internet regions
* Teacher dashboards for tracking progress
* Prototype for educational tools
* Can integrate with larger education platforms

---

## 10. Future Enhancements

* Add **user authentication**
* Switch to **PostgreSQL** for production
* Cloud deployment (AWS, Vercel)
* Add more **languages and lessons**
* Full-featured **teacher dashboard**
* Advanced **analytics**

---

## 11. Summary

* **LearnLite** is a lightweight, offline-first learning app for under-resourced students
* Works **offline**, supports **multiple languages**, and runs on **low-end devices**
* Backend: Node + Express + SQLite + Prisma
* Frontend: React + PWA + Tailwind + i18next
* Optional: SMS/WhatsApp lessons for no-internet users
* Prototype can be **scaled to production**

---

## 12. MVP Scope

* **Web PWA**: Lessons + quizzes
* **API**: Serves content, stores progress
* **SMS bot**: Lessons/quizzes over SMS (optional)
* **Content pack**: JSON lessons and quizzes in multiple languages

---

## 13. Tech Stack

* **Frontend**: React, Vite, TypeScript, Tailwind, React Router, IndexedDB, i18next
* **Backend**: Node.js, Express, Prisma, SQLite, Zod
* **Bot/Webhooks**: Express + Twilio (optional)

---

## 14. Step-by-Step Project Plan

1. **Prerequisites**: Node 18+, Git, VS Code (optional)
2. **Create folders**: `empower-learnlite/api`, `web`, `content`
3. **Setup backend**: Initialize npm, install dependencies, setup Prisma, seed data
4. **Setup frontend**: Initialize npm, install dependencies, configure PWA
5. **Test workflow**: Start backend + frontend, open PWA, switch languages, take quizzes
6. **Optional**: Configure SMS/WhatsApp bot for offline messaging

---


### 2) File/folder structure (final result)
empower-learnlite/                  # Root folder of the LearnLite project
├─ README.md                         # Project documentation and instructions
├─ content/                          # Folder containing lesson and quiz content
│  ├─ lessons.en.json                # English lessons and quizzes in JSON format
│  └─ lessons.te.json                # Telugu lessons and quizzes (can add more languages)
├─ api/                              # Backend folder (Node + Express + Prisma)
│  ├─ package.json                   # Backend dependencies, scripts, and project metadata
│  ├─ tsconfig.json                  # TypeScript configuration for backend
│  ├─ .env.example                   # Sample environment variables (DB, Port, Twilio keys)
│  ├─ prisma/                        # Prisma folder for database schema and migrations
│  │  └─ schema.prisma               # Database structure (tables for lessons, quizzes, users)
│  └─ src/                           # Backend source code
│     ├─ server.ts                   # Main API server entry point
│     ├─ db.ts                       # Database connection setup using Prisma
│     ├─ routes/                     # API route handlers
│     │  ├─ lessons.ts               # Routes to fetch and manage lessons
│     │  ├─ quiz.ts                  # Routes to fetch and manage quizzes
│     │  ├─ progress.ts              # Routes to save and get user progress
│     │  └─ sms.ts                   # Routes for SMS/WhatsApp webhook (optional)
│     └─ seed.ts                     # Script to populate database with initial content
├─ web/                              # Frontend folder (React PWA)
│  ├─ index.html                     # Main HTML file for the PWA
│  ├─ package.json                   # Frontend dependencies, scripts, and metadata
│  ├─ tsconfig.json                  # TypeScript configuration for frontend
│  ├─ vite.config.ts                 # Vite configuration for building the frontend
│  ├─ postcss.config.cjs             # PostCSS configuration for Tailwind CSS
│  ├─ tailwind.config.cjs            # Tailwind CSS configuration
│  ├─ public/                        # Public folder for static assets
│  │  ├─ manifest.webmanifest        # PWA manifest for offline installation
│  │  └─ sw.js                       # Service worker for caching and offline support
│  └─ src/                           # Frontend source code
│     ├─ main.tsx                    # Frontend entry point
│     ├─ App.tsx                     # Main React component containing routes
│     ├─ index.css                    # Global CSS for styling
│     ├─ i18n.ts                     # Internationalization setup (language switching)
│     ├─ lib/api.ts                  # API helper functions to call backend endpoints
│     ├─ components/                 # Reusable React components
│     │  ├─ LessonCard.tsx           # UI card component for a lesson
│     │  ├─ QuizView.tsx             # Component to display quiz questions and answers
│     │  ├─ LanguageSwitcher.tsx     # Component to switch app language
│     │  └─ ProgressBar.tsx          # Component to show quiz/lesson progress
│     └─ pages/                      # Page-level React components (views)
│        ├─ Home.tsx                 # Homepage showing list of lessons
│        ├─ Lesson.tsx               # Page to view a single lesson
│        ├─ Quiz.tsx                 # Page to take a quiz
│        └─ Dashboard.tsx            # Teacher dashboard for tracking student progress


# LearnLite API — File-by-File Guide



### Folder: `api/`

├─ api/                              # Backend folder (Node + Express + Prisma)
│  ├─ package.json                   # Backend dependencies, scripts, and project metadata
│  ├─ tsconfig.json                  # TypeScript configuration for backend
│  ├─ .env.example                   # Sample environment variables (DB, Port, Twilio keys)
│  ├─ prisma/                        # Prisma folder for database schema and migrations
│  │  └─ schema.prisma               # Database structure (tables for lessons, quizzes, users)
│  └─ src/                           # Backend source code
│     ├─ server.ts                   # Main API server entry point
│     ├─ db.ts                       # Database connection setup using Prisma
│     ├─ routes/                     # API route handlers
│     │  ├─ lessons.ts               # Routes to fetch and manage lessons
│     │  ├─ quiz.ts                  # Routes to fetch and manage quizzes
│     │  ├─ progress.ts              # Routes to save and get user progress
│     │  └─ sms.ts                   # Routes for SMS/WhatsApp webhook (optional)
│     └─ seed.ts                     # Script to populate database with initial content

---

## 1. `.env.example`

```env
DATABASE_URL="file:./dev.db"  # Prisma local database file
PORT=4000                     # Backend server port
TWILIO_ACCOUNT_SID=your_sid   # Optional: Twilio account ID
TWILIO_AUTH_TOKEN=your_token  # Optional: Twilio auth token
TWILIO_FROM_NUMBER=+1xxxxxxx  # Optional: Twilio sender number
```

---

## 2. `package.json`

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
  },
  "dependencies": {
    "@prisma/client": "^5.16.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.12",
    "prisma": "^5.16.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5"
  }
}
```

---

## 3. `tsconfig.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 4. `prisma/schema.prisma`

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
  correct   Int
}

model Progress {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  lessonId  String
  status    String   @default("started")
  score     Int      @default(0)
  updatedAt DateTime @updatedAt
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  state     String   @default("idle")
  payload   String   @default("")
  updatedAt DateTime @updatedAt
}
```

---

## 5. `src/db.ts`

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

---

## 6. `src/seed.ts`

```ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function load(locale: string) {
  const raw = fs.readFileSync(path.join(__dirname, "../../content/lessons."+locale+".json"), "utf-8");
  const data = JSON.parse(raw) as Array<{
    slug:string, topic:string, title:string, body:string, estMins?:number,
    questions:{prompt:string, options:string[], answer:number}[]
  }>;

  for (const l of data) {
    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: { title: l.title, body: l.body, topic: l.topic, locale, estMins: l.estMins ?? 3 },
      create: { slug: l.slug, topic: l.topic, locale, title: l.title, body: l.body, estMins: l.estMins ?? 3 }
    });

    await prisma.question.deleteMany({ where: { lessonId: lesson.id } });

    for (const q of l.questions) {
      await prisma.question.create({ data: {
        lessonId: lesson.id,
        prompt: q.prompt,
        optionA: q.options[0], optionB: q.options[1],
        optionC: q.options[2], optionD: q.options[3],
        correct: q.answer
      }});
    }
  }
}

async function main() {
  await load("en");
  try { await load("te"); } catch { console.log("No Telugu content; skipping"); }
}

main().then(()=>prisma.$disconnect());
```

---

## 7. `src/server.ts`

```ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv"; dotenv.config();

import lessons from "./routes/lessons.js";
import quiz from "./routes/quiz.js";
import progress from "./routes/progress.js";
import sms from "./routes/sms.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req,res)=>res.json({ok:true}));

app.use("/api/lessons", lessons);
app.use("/api/quiz", quiz);
app.use("/api/progress", progress);
app.use("/webhooks/sms", sms);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`API listening on :${PORT}`));
```

---

## 8. `src/routes/lessons.ts`

```ts
import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/", async (req,res)=>{
  const { locale="en", topic } = req.query as { locale?:string, topic?:string };
  const where:any = { locale }; if(topic) where.topic = topic;
  const lessons = await prisma.lesson.findMany({ where, select: { id:true, slug:true, title:true, topic:true, estMins:true }});
  res.json(lessons);
});

r.get("/:slug", async (req,res)=>{
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug }});
  if(!lesson) return res.status(404).json({ error:"Not found" });
  res.json(lesson);
});

export default r;
```

---

## 9. `src/routes/progress.ts`

```ts
import { Router } from "express";
import { prisma } from "../db";
const r = Router();

r.get("/:userId", async (req,res)=>{
  const rows = await prisma.progress.findMany({ where:{ userId:req.params.userId } });
  res.json(rows);
});

export default r;
```

---

## 10. `src/routes/quiz.ts`

```ts
import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.get("/:slug", async (req,res)=>{
  const lesson = await prisma.lesson.findUnique({ where:{slug:req.params.slug}});
  if(!lesson) return res.status(404).json({error:"No such lesson"});
  const q = await prisma.question.findMany({ where:{lessonId:lesson.id}, orderBy:{id:"asc"}});
  const quiz = q.map(x=>({prompt:x.prompt, options:[x.optionA,x.optionB,x.optionC,x.optionD]}));
  res.json(quiz);
});

r.post("/:slug/grade", async (req,res)=>{
  const {answers,userId} = req.body as { answers:number[], userId:string };
  const lesson = await prisma.lesson.findUnique({ where:{slug:req.params.slug}});
  if(!lesson) return res.status(404).json({error:"No such lesson"});
  const q = await prisma.question.findMany({ where:{lessonId:lesson.id}, orderBy:{id:"asc"}});
  let score = 0; q.forEach((x,i)=>{ if(answers[i]===x.correct) score++; });
  if(userId){
    await prisma.progress.upsert({
      where:{userId_lessonId:{userId, lessonId:lesson.id}},
      create:{userId, lessonId:lesson.id, status:"completed", score},
      update:{status:"completed", score}
    } as any);
  }
  res.json({ total:q.length, score });
});

export default r;
```

---

## 11. `src/routes/sms.ts`

```ts
import { Router } from "express";
import { prisma } from "../db";

const r = Router();

r.post("/", async (req,res)=>{
  const { from, body } = req.body as { from?:string, body?:string };
  const text = (body||"").trim().toLowerCase();
  const phone = from||"demo";

  let user = await prisma.user.findFirst({ where:{ phone }});
  if(!user) user = await prisma.user.create({ data:{ phone, locale:"en" }});

  let session = await prisma.session.findFirst({ where:{ userId:user.id }});
  if(!session) session = await prisma.session.create({ data:{ userId:user.id, state:"idle" }});
  const payload = session.payload ? JSON.parse(session.payload) : {};
  const reply = async (msg:string)=>res.json({ reply:msg });

  if(text==="start"||session.state==="idle"){
    const topics = await prisma.lesson.findMany({ where:{ locale:user.locale }, select:{ topic:true }, distinct:["topic"] });
    await prisma.session.update({ where:{id:session.id}, data:{ state:"choose_topic" }});
    const list = topics.map((t,i)=>`${i+1}. ${t.topic}`).join("\n");
    return reply(`Welcome! Reply with number:\n${list}`);
  }

  if(session.state==="choose_topic"){
    const topics = await prisma.lesson.findMany({ where:{ locale:user.locale }, select:{ topic:true }, distinct:["topic"] });
    const idx = parseInt(text)-1; const topic = topics[idx]?.topic;
    if(!topic) return reply("Invalid choice. Send START to restart.");
    const lessons = await prisma.lesson.findMany({ where:{ topic, locale:user.locale }, orderBy:{ slug:"asc" }});
    await prisma.session.update({ where:{id:session.id}, data:{ state:"in_quiz", payload:JSON.stringify({ lessonSlug:lessons[0].slug, qIndex:0, score:0 })}});
    return reply(`Topic: ${topic}. Quiz: '${lessons[0].title}'. Reply 1-4 to answer.`);
  }
});

export default r;
```

## `content
├─ content/                          # Folder containing lesson and quiz content
│  ├─ lessons.en.json                # English lessons and quizzes in JSON format
│  └─ lessons.te.json                # Telugu lessons and quizzes (can add more languages)

## `content/lessons.en.json`

```json
[
  {
    "slug": "math-fractions-1",
    "topic": "Math Basics",
    "title": "Understanding Fractions",
    "body": "A fraction shows parts of a whole. 1/2 means the whole is split into two equal parts and we take one.",
    "estMins": 3,
    "questions": [
      {
        "prompt": "What does 1/2 mean?",
        "options": ["1 out of 3", "1 out of 2", "2 out of 1", "None"],
        "answer": 1
      },
      {
        "prompt": "Which is bigger?",
        "options": ["1/2", "1/3", "Equal", "Can't say"],
        "answer": 0
      }
    ]
  },
  {
    "slug": "eng-reading-1",
    "topic": "English",
    "title": "Reading Tip: Skim First",
    "body": "Skim the text to get the main idea, then read slowly. This improves understanding.",
    "estMins": 2,
    "questions": [
      {
        "prompt": "What should you do first?",
        "options": ["Read slowly", "Memorize", "Skim", "Skip"],
        "answer": 2
      }
    ]
  },
  {
    "slug": "science-plants-1",
    "topic": "Science",
    "title": "Plants Need Light",
    "body": "Plants use sunlight to make food through photosynthesis. Light is essential for growth.",
    "estMins": 2,
    "questions": [
      {
        "prompt": "What do plants use to make food?",
        "options": ["Soil", "Sunlight", "Water only", "Air only"],
        "answer": 1
      }
    ]
  }
]
```

---

## `content/lessons.te.json`

```json
[
  {
    "slug": "math-fractions-1",
    "topic": "గణితం",
    "title": "భాగాలు (Fractions) అర్థం",
    "body": "భాగం ఒక పూర్తిలోని సమాన భాగాలను చూపిస్తుంది. 1/2 అంటే రెండు సమాన భాగాల్లో ఒకటి.",
    "estMins": 3,
    "questions": [
      {
        "prompt": "1/2 అంటే ఏమిటి?",
        "options": ["3 లో 1", "2 లో 1", "1 లో 2", "ఏదీ కాదు"],
        "answer": 1
      },
      {
        "prompt": "ఏది పెద్దది?",
        "options": ["1/2", "1/3", "సమానం", "చెప్పలేం"],
        "answer": 0
      }
    ]
  },
  {
    "slug": "eng-reading-1",
    "topic": "ఇంగ్లీష్",
    "title": "ముందు స్కిమ్ చేయండి",
    "body": "మొదట టెక్స్ట్‌ను త్వరగా చూసి ప్రధాన భావాన్ని అర్థం చేసుకోండి, ఆపై నెమ్మదిగా చదవండి.",
    "estMins": 2,
    "questions": [
      {
        "prompt": "ముందుగా ఏం చేయాలి?",
        "options": ["నెమ్మదిగా చదవాలి", "స్మరణలో ఉంచు", "స్కిమ్ చేయండి", "దాటేసి పెట్టండి"],
        "answer": 2
      }
    ]
  },
  {
    "slug": "science-plants-1",
    "topic": "విజ్ఞానం",
    "title": "ఆకులు కోసం వెలుతురు అవసరం",
    "body": "ఆకులు చలనశక్తికి సూర్యరశ్మి ఉపయోగిస్తాయి. పెరుగుదలకు వెలుతురు చాలా ముఖ్యం.",
    "estMins": 2,
    "questions": [
      {
        "prompt": "ఆకులు ఆహారం తయారుచేసుకోవడానికి ఏని ఉపయోగిస్తాయి?",
        "options": ["మట్టిని", "సూర్య ప్రకాశాన్ని", "కేవలం నీటిని", "కేవలం గాలిని"],
        "answer": 1
      }
    ]
  }
]
```

---

## 1. `src/App.tsx`

│  └─ src/                           # Frontend source code
│     ├─ main.tsx                    # Frontend entry point
│     ├─ App.tsx                     # Main React component containing routes
│     ├─ index.css                    # Global CSS for styling
│     ├─ i18n.ts                     # Internationalization setup (language switching)
│     ├─ lib/api.ts                  # API helper functions to call backend endpoints
│     ├─ components/                 # Reusable React components
│     │  ├─ LessonCard.tsx           # UI card component for a lesson
│     │  ├─ QuizView.tsx             # Component to display quiz questions and answers
│     │  ├─ LanguageSwitcher.tsx     # Component to switch app language
│     │  └─ ProgressBar.tsx          # Component to show quiz/lesson progress
│     └─ pages/                      # Page-level React components (views)
│        ├─ Home.tsx                 # Homepage showing list of lessons
│        ├─ Lesson.tsx               # Page to view a single lesson
│        ├─ Quiz.tsx                 # Page to take a quiz
│        └─ Dashboard.tsx            # Teacher dashboard for tracking student progress

## 1. `src/App.tsx`

```tsx
import React from "react"; // Import React
import { Outlet, Link } from "react-router-dom"; // For routing
import LanguageSwitcher from "./components/LanguageSwitcher"; // Language switcher component

export default function App() {
  return (
    <div className="h-screen bg-gray-50 text-gray-900">
      <header className="flex justify-between items-center p-4 bg-white shadow sticky top-0">
        <Link to="/" className="font-bold text-lg">LearnLite</Link>
        <div className="flex gap-4 items-center">
          <Link to="/dashboard">Dashboard</Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <Outlet /> {/* Child pages */}
      </main>
    </div>
  );
}
```

---

## 2. `src/i18n.ts`

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const saved = localStorage.getItem("learnlite.lang");
const browser = navigator.language?.slice(0, 2) || "en";

const resources = {
  en: {
    translation: {
      startLearning: "Start Learning",
      continue: "Continue",
      quiz: "Quiz",
      language: "Language",
      listen: "Listen",
    },
  },
  te: {
    translation: {
      startLearning: "ప్రారంభించండి",
      continue: "కొనసాగించండి",
      quiz: "క్విజ్",
      language: "భాష",
      listen: "చెప్పండి",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: saved || (["en", "te"].includes(browser) ? browser : "en"),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
```

---

## 3. `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 4. `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./i18n";
import App from "./App";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="lesson/:slug" element={<Lesson />} />
          <Route path="quiz/:slug" element={<Quiz />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 5. `src/components/LanguageSwitcher.tsx`

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const setLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("learnlite.lang", lng);
  };

  return (
    <label className="flex gap-2 items-center">
      {t("language")}
      <select
        className="border rounded-xl px-2 py-1"
        value={i18n.language}
        onChange={(e) => setLang(e.target.value)}
      >
        <option value="en">English</option>
        <option value="te">తెలుగు</option>
      </select>
    </label>
  );
}
```

---

## 6. `src/components/LessonCard.tsx`

```tsx
import React from "react";
import { Link } from "react-router-dom";

export default function LessonCard({ slug, title, topic, estMins } : { slug: string; title: string; topic: string; estMins?: number; }) {
  return (
    <Link to={`/lesson/${encodeURIComponent(slug)}`} className="block p-4 rounded-2xl shadow bg-white hover:shadow-md transition">
      <div className="text-xs uppercase text-gray-500">{topic}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-xs mt-1">⏱ {estMins ?? 3} min</div>
    </Link>
  );
}
```

---

## 7. `src/components/ProgressBar.tsx`

```tsx
import React from "react";

export default function ProgressBar({ value = 0, max = 100 } : { value?: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-xl overflow-hidden my-3">
      <div className="h-3 bg-green-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
```

---

## 8. `src/components/QuizView.tsx`

```tsx
import React from "react";

export default function QuizView({ q, i, onAnswer }: { q: { prompt: string; options: string[] }; i: number; onAnswer: (idx: number) => void }) {
  return (
    <div>
      <div className="mb-3 font-medium">Q{i + 1}. {q.prompt}</div>
      <div className="grid gap-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(idx)}
            className="text-left p-3 rounded-xl border hover:bg-gray-50"
          >
            {idx + 1}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 9. `src/lib/api.ts`

```ts
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
```

---

## 10. `src/pages/Home.tsx`

```tsx
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
```

---



# LearnLite — Frontend (Web) Folder

## Folder Structure

```

├─ web/                              # Frontend folder (React PWA)
│  ├─ index.html                     # Main HTML file for the PWA
│  ├─ package.json                   # Frontend dependencies, scripts, and metadata
│  ├─ tsconfig.json                  # TypeScript configuration for frontend
│  ├─ vite.config.ts                 # Vite configuration for building the frontend
│  ├─ postcss.config.cjs             # PostCSS configuration for Tailwind CSS
│  ├─ tailwind.config.cjs            # Tailwind CSS configuration
│  ├─ public/                        # Public folder for static assets
│  │  ├─ manifest.webmanifest        # PWA manifest for offline installation
│  │  └─ sw.js                       # Service worker for caching and offline support
```

---

## 1. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Set character encoding to UTF-8 -->

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- Make page responsive -->

  <title>LearnLite</title>
  <!-- Page title -->

  <link rel="manifest" href="/manifest.webmanifest" />
  <!-- Link PWA manifest -->

  <meta name="theme-color" content="#2563eb" />
  <!-- Set browser toolbar color -->
</head>
<body>
  <div id="root"></div>
  <!-- React renders the app here -->

  <script type="module" src="/src/main.tsx"></script>
  <!-- Main React entry point -->
</body>
</html>
```

---

## 2. `package.json`

```json
{
  "name": "learnlite-web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "i18next": "^23.10.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^13.5.0",
    "react-router-dom": "^6.26.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.2",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.10.0",
    "eslint-plugin-react": "^7.35.0",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.6.2",
    "vite": "^5.4.8"
  }
}
```

---

## 3. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

---

## 4. `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

---

## 5. `postcss.config.cjs`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

## 6. `tailwind.config.cjs`

```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}
```

---

## 7. `public/manifest.webmanifest`

```json
{
  "name": "LearnLite",
  "short_name": "LearnLite",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 8. `public/sw.js` (Service Worker)

```js
// Cache files during install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("learnlite-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.webmanifest"
      ]);
    })
  );
});

// Serve cached files on fetch or fallback to offline message
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => 
        new Response("You are offline", { status: 503 })
      );
    })
  );
});
```









