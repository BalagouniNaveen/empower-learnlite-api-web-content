Awesome — I’ll give you a complete, **step-by-step build & run guide**, **detailed code explanations** for every major file/folder, the **expected outputs** (API responses + UI behavior), the full **file structure**, plus the **download link** to the tested project bundle I already prepared for you. You can run everything locally and demo it for Empower Hacks 3.0.

Download (copy-paste ready)

* [Download LearnLite ZIP (complete project)](sandbox:/mnt/data/learnlite.zip)

---

# 1) Quick summary — what you'll get

* A full working project that implements **LearnLite**:

  * API: Node + Express + Prisma + SQLite (serves lessons, quizzes, progress, SMS webhook).
  * Web: React + Vite + TypeScript + Tailwind, PWA service worker, i18n (English + Telugu), TTS, offline caching.
  * Content: `content/lessons.en.json` and `content/lessons.te.json`.
  * Seed script that loads JSON content into SQLite via Prisma.
* Ready for demo: view lessons, listen to TTS, take quizzes, grade, and test SMS webhook with `curl`.

---

# 2) Full file / folder structure

```
empower-learnlite/
├─ README.md
├─ content/
│  ├─ lessons.en.json
│  └─ lessons.te.json
├─ api/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ .env.example
│  ├─ prisma/
│  │  └─ schema.prisma
│  └─ src/
│     ├─ server.ts
│     ├─ db.ts
│     ├─ seed.ts
│     └─ routes/
│        ├─ lessons.ts
│        ├─ quiz.ts
│        ├─ progress.ts
│        └─ sms.ts
└─ web/
   ├─ index.html
   ├─ package.json
   ├─ tsconfig.json
   ├─ vite.config.ts
   ├─ postcss.config.cjs
   ├─ tailwind.config.cjs
   ├─ public/
   │  ├─ manifest.webmanifest
   │  └─ sw.js
   └─ src/
      ├─ main.tsx
      ├─ App.tsx
      ├─ index.css
      ├─ i18n.ts
      ├─ lib/api.ts
      ├─ components/
      │  ├─ LessonCard.tsx
      │  ├─ QuizView.tsx
      │  ├─ LanguageSwitcher.tsx
      │  └─ ProgressBar.tsx
      └─ pages/
         ├─ Home.tsx
         ├─ Lesson.tsx
         ├─ Quiz.tsx
         └─ Dashboard.tsx
```

---

# 3) How to run (exact commands, copy/paste)

> Use **Node 18+**. Open two terminals: one for the API, one for the web.

Unzip and open project:

```bash
unzip learnlite.zip -d learnlite
cd learnlite
```

## Start API

```bash
cd api
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
# seed DB (reads `content/*.json` and populates DB)
npx ts-node-dev src/seed.ts
# start dev server
npm run dev
```

Expected logs (excerpt):

```
Prisma schema loaded...
Applying migration ...
API listening on :4000
```

Confirm health:

```bash
curl http://localhost:4000/api/health
# => {"ok":true}
```

List lessons (English):

```bash
curl "http://localhost:4000/api/lessons?locale=en" | jq
# Example output:
# [
#   { "id": "ck...", "slug":"math-fractions-1","title":"Understanding Fractions","topic":"Math Basics","estMins":3 },
#   ...
# ]
```

Get one lesson:

```bash
curl "http://localhost:4000/api/lessons/math-fractions-1?locale=en" | jq
# => { "id":"...", "slug":"math-fractions-1", "title":"Understanding Fractions", "body":"A fraction shows..." }
```

Get quiz:

```bash
curl "http://localhost:4000/api/quiz/math-fractions-1?locale=en" | jq
# => [{ "prompt":"What does 1/2 mean?","options":["1 out of 3","1 out of 2","2 out of 1","None"] }, ...]
```

Grade quiz (example):

```bash
curl -X POST "http://localhost:4000/api/quiz/math-fractions-1/grade?locale=en" \
  -H 'Content-Type: application/json' \
  -d '{"answers":[1,0]}'
# => {"total":2,"score":2}
```

Test SMS webhook (local demo):

```bash
curl -X POST http://localhost:4000/webhooks/sms \
  -H 'Content-Type: application/json' \
  -d '{"from":"+919999999999","body":"START"}'
# => {"reply":"Welcome to LearnLite! Reply with a number to choose a topic:\n1. Math Basics\n2. English\n..."}
```

## Start Web

Open a second terminal:

```bash
cd web
npm install
# optional: set VITE_API_URL in web/.env to http://localhost:4000 if needed
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

---

# 4) What the UI does (expected behavior / outputs)

* Home:

  * Fetches `/api/lessons?locale=<lang>` and shows cards (title, topic, est time).
  * Language switcher toggles `en` / `te` (Telugu) and re-fetches content.
* Lesson page:

  * Fetch `/api/lessons/:slug?locale=<lang>`, show title & body.
  * "🔊 Listen" starts browser TTS (SpeechSynthesis) readout.
  * "Take Quiz" navigates to quiz page.
* Quiz page:

  * Fetch `/api/quiz/:slug?locale=<lang>`; shows one question at a time using `QuizView` component.
  * On final answer, calls `POST /api/quiz/:slug/grade` and shows `{score}/{total}` result.
* Offline:

  * Service worker (`public/sw.js`) caches app shell; after first load, pages load offline from cache for demo.
* SMS webhook:

  * Simulated state machine via `/webhooks/sms` — `START` → pick topic → answer 1..4, receive JSON `reply` messages (good demo for judges: show `curl` interaction).

---

# 5) Detailed file-by-file explanations (main files)

### `api/prisma/schema.prisma`

* Models: `User`, `Lesson`, `Question`, `Progress`, `Session`.
* `@@unique([slug, locale])`: enables same slug across languages.
* `Session` stores SMS bot state (simple state machine).

### `api/src/seed.ts`

* Loads `content/lessons.en.json` and `lessons.te.json`.
* Uses `prisma.lesson.upsert` with composite `slug_locale`.
* Replaces questions each seed run: safe to re-run.

### `api/src/routes/lessons.ts`

* `GET /api/lessons?locale=en` ⇒ list lessons (id, slug, title, topic, estMins).
* `GET /api/lessons/:slug?locale=en` ⇒ full lesson object (body included).

### `api/src/routes/quiz.ts`

* `GET /api/quiz/:slug?locale=en` ⇒ returns array of questions `{ prompt, options }`.
* `POST /api/quiz/:slug/grade` ⇒ body `{ answers: number[], userId? }` → returns `{ total, score }` and upserts `Progress` when `userId` provided.

### `api/src/routes/sms.ts`

* Simple flow:

  * `START` → reply with numbered topic list.
  * User replies with a number → bot sends first question.
  * User replies 1–4 for answers → bot advances, tracks score in session payload, and finally returns score.
* Designed so it’s easy to swap in Twilio SDK in future.

### `api/src/server.ts`

* Registers routes:

  * `/api/lessons`, `/api/quiz`, `/api/progress`, `/webhooks/sms` and `/api/health`.
* Uses `express.json()` + `cors()`.

### `web/src/lib/api.ts`

* Small fetch wrappers that include `locale` parameter.
* Defaults to `VITE_API_URL` or `http://localhost:4000`.

### `web/src/i18n.ts`

* i18next configured with English + Telugu strings used by UI.
* Saves chosen language to `localStorage` so users keep preference.

### `web/src/components/*`

* `LessonCard.tsx` — presentational card for lessons (link to lesson).
* `QuizView.tsx` — shows a question and options, calls `onAnswer(idx)`.
* `LanguageSwitcher.tsx` — dropdown to change app language.
* `ProgressBar.tsx` — simple visual bar (used on dashboard/presumed progress).

### `web/src/pages/*`

* `Home.tsx` fetches lessons for current language.
* `Lesson.tsx` loads lesson by slug, plays TTS on button click.
* `Quiz.tsx` renders `QuizView` and grades answers.
* `Dashboard.tsx` placeholder for teacher/progress view (extend for real data).

---

# 6) Example full API responses (exact samples)

**`GET /api/lessons?locale=en`**

```json
[
  {
    "id": "ckxyz...",
    "slug": "math-fractions-1",
    "title": "Understanding Fractions",
    "topic": "Math Basics",
    "estMins": 3
  },
  {
    "id": "ckabc...",
    "slug": "eng-reading-1",
    "title": "Reading Tip: Skim First",
    "topic": "English",
    "estMins": 2
  }
]
```

**`GET /api/lessons/math-fractions-1?locale=en`**

```json
{
  "id": "ckxyz...",
  "slug": "math-fractions-1",
  "title": "Understanding Fractions",
  "body": "A fraction shows parts of a whole. 1/2 means the whole is split into two equal parts and we take one.",
  "topic": "Math Basics",
  "estMins": 3
}
```

**`GET /api/quiz/math-fractions-1?locale=en`**

```json
[
  {
    "prompt": "What does 1/2 mean?",
    "options": ["1 out of 3","1 out of 2","2 out of 1","None"]
  },
  {
    "prompt": "Which is bigger?",
    "options": ["1/2","1/3","Equal","Can't say"]
  }
]
```

**`POST /api/quiz/math-fractions-1/grade`** request body:

```json
{"answers":[1,0]}
```

Response:

```json
{"total":2,"score":2}
```

**SMS webhook `POST /webhooks/sms`** (sample):
Request:

```json
{"from":"+919999999999","body":"START"}
```

Response:

```json
{"reply":"Welcome to LearnLite! Reply with a number to choose a topic:\n1. Math Basics\n2. English"}
```

---

# 7) Demo script to show judges (2–3 minute flow)

1. Start API and Web locally (commands above).
2. Open web UI (`http://localhost:5173`). Show `Home` with lesson cards.
3. Switch language to Telugu — show content in Telugu.
4. Open lesson → click 🔊 Listen (plays TTS).
5. Take the quiz → answer questions → show score result.
6. Turn off network (simulate offline) and reload — demonstrate offline cached pages.
7. Terminal: run SMS webhook `curl` and demonstrate reply flow (copy output JSON to show SMS bot works without real Twilio).
8. Mention backend is small and easy to scale (SQLite → Postgres, Twilio hook → production SMS).

---

# 8) Troubleshooting / common fixes

* **If API fails at `prisma migrate`**: run `npx prisma generate` then `npx prisma migrate dev --name init`. Make sure `.env` has correct `DATABASE_URL="file:./dev.db"`.
* **If web cannot fetch API**: set `web/.env` with `VITE_API_URL=http://localhost:4000` and restart dev server.
* **Node import errors**: ensure Node >=18 and `api/package.json` uses `"type":"module"`. If ts-node-dev complains, run `npm run dev` again.
* **Service worker not updating**: unregister old SW in browser devtools > Application > Service Workers.

---

# 9) Next options I can do for you right now

Pick one and I’ll do it immediately in this chat:

* A) Walk through the exact terminal output you should see (copy/paste of logs) while running API + seed + web.
* B) Wire in **real Twilio** (show exactly where to paste `TWILIO_*` keys and how to test using ngrok).
* C) Create a **GitHub repo** with these files and show exact `git` commands to push.
* D) Expand content: add 10 more lessons across topics and languages (I can generate JSON).
* E) Provide a concise 1–page hackathon submission write-up + 3 slide demo script suited to Empower Hacks judging criteria.

Tell me which option (A–E) you want and I’ll perform it right away.
