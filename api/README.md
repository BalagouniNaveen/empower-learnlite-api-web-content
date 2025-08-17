**api/src/env.example**

**Environment (.env)**


# Example .env (create at api/.env) - each line below is what to add in that file:
# DATABASE_URL="file:./dev.db"         # tells Prisma to use a local file named dev.db
# PORT=4000                            # server will run on port 4000
# TWILIO_ACCOUNT_SID=your_sid          # optional: Twilio ID for SMS/WhatsApp
# TWILIO_AUTH_TOKEN=your_token         # optional: Twilio auth token (keep private)
# TWILIO_FROM_NUMBER=+1xxxxxxxxxx      # optional: number Twilio uses to send messages
.
# switch to the api folder where backend code lives
cd api                                 # go into the api directory

# create package.json quickly with defaults
npm init -y                            # make a default package.json (yes to all prompts)

# install runtime packages the server needs
npm i express cors dotenv zod @prisma/client
                                        # express = web server
                                        # cors = allow browser apps to call the API
                                        # dotenv = load .env variables
                                        # zod = validate request bodies
                                        # @prisma/client = runtime DB client from Prisma

# install development tools as devDependencies
npm i -D typescript ts-node-dev prisma @types/express @types/node
                                        # typescript = TypeScript compiler
                                        # ts-node-dev = run ts files with restart during dev
                                        # prisma = Prisma CLI for DB schema/tools
                                        # @types/* = TypeScript types for Express & Node

# create a TypeScript config file (tsconfig.json)
npx tsc --init                          # generate tsconfig.json with sensible defaults

# initialize Prisma and set it up to use SQLite by default
npx prisma init --datasource-provider sqlite
                                        # creates prisma/schema.prisma and a .env DATABASE_URL
                                        # sets datasource provider to sqlite (local file DB)

**api/package.json** 

{
  "name": "learnlite-api",        // project name
  "version": "1.0.0",             // project version
  "type": "module",               // use modern ES module syntax (import/export)

  "scripts": {                    // shortcut commands you can run with npm
    "dev": "ts-node-dev --respawn src/server.ts", // run server.ts in dev mode with auto-restart
    "build": "tsc",               // compile TypeScript files to plain JavaScript in dist/
    "start": "node dist/server.js", // run the built server (for production)
    "prisma": "prisma"            // shortcut to run Prisma CLI commands (e.g. migrate, db push)
  },

  "dependencies": {               // packages needed when the app runs
    "@prisma/client": "^5.16.1",  // Prisma DB client (talks to database)
    "cors": "^2.8.5",             // lets web browser apps call this API
    "dotenv": "^16.4.5",          // loads variables from .env file
    "express": "^4.19.2",         // web server framework
    "zod": "^3.23.8"              // validate data (like request bodies or params)
  },

  "devDependencies": {            // tools only needed during development
    "@types/express": "^4.17.21", // TypeScript type info for Express
    "@types/node": "^20.12.12",   // TypeScript type info for Node.js
    "prisma": "^5.16.1",          // Prisma CLI (schema, migrate, generate client)
    "ts-node-dev": "^2.0.0",      // run TS files directly + auto-restart on save
    "typescript": "^5.4.5"        // TypeScript compiler
  }
}

* **scripts** = shortcuts
* **dependencies** = things needed when app is running
* **devDependencies** = things only developers need (compiler, type helpers, etc.)

  

**api/tsconfig.json**

jsonc
{
  "compilerOptions": {
    "target": "ES2020",             // output JavaScript will use modern ES2020 features
    "module": "ESNext",             // use modern ES module system (import/export)
    "moduleResolution": "NodeNext", // how TypeScript finds modules (like Node does with ESNext)
    "outDir": "dist",               // put compiled JavaScript files into the "dist" folder
    "rootDir": "src",               // source TypeScript files are in the "src" folder
    "strict": true,                 // enable strict type checking (helps catch errors early)
    "esModuleInterop": true,        // allows easy import of CommonJS modules (like `import express from "express"`)
    "skipLibCheck": true,           // skip type checking of library files (faster compile)
    "resolveJsonModule": true       // lets you import .json files directly in code
  },
  "include": ["src/**/*"],          // compile all .ts files inside the src folder
  "exclude": ["node_modules"]       // do not compile files in node_modules
}

* **`rootDir`** = where your code starts
* **`outDir`** = where compiled JS ends up
* **strict & helpers** = make TypeScript safer and easier


**api/prisma/schema.prisma**


```prisma
generator client {
  provider = "prisma-client-js"   // tell Prisma to generate a JS/TS client for database queries
}

datasource db {
  provider = "sqlite"             // use SQLite as the database
  url      = env("DATABASE_URL")  // DB location comes from .env file (e.g. file:./dev.db)
}

model User {
  id       String   @id @default(cuid())  // unique id, auto-generated cuid
  phone    String?  @unique               // optional phone number, must be unique if present
  name     String?                        // optional user name
  locale   String   @default("en")        // preferred language (default English)
  progress Progress[]                     // link to many Progress records (1 user → many progress entries)
  sessions Session[]                      // link to many Session records (for SMS/chat state)
}

model Lesson {
  id       String    @id @default(cuid()) // unique id for lesson
  slug     String    @unique              // short unique text (like "math-1")
  topic    String                           // category/topic of lesson
  locale   String    @default("en")       // language (default English)
  title    String                           // lesson title
  body     String                           // lesson text/content
  estMins  Int       @default(3)          // estimated minutes to complete
  questions Question[]                    // one lesson → many questions
}

model Question {
  id        String  @id @default(cuid())   // unique id
  lessonId  String                          // foreign key pointing to Lesson
  lesson    Lesson  @relation(fields: [lessonId], references: [id]) // relation: belongs to Lesson
  prompt    String                          // question text
  optionA   String                          // answer choice A
  optionB   String                          // answer choice B
  optionC   String                          // answer choice C
  optionD   String                          // answer choice D
  correct   Int     // 0..3                 // index of correct option (0 = A, 1 = B, etc.)
}

model Progress {
  id        String   @id @default(cuid())  // unique id
  userId    String                          // foreign key to User
  user      User     @relation(fields: [userId], references: [id]) // relation: belongs to User
  lessonId  String                          // which lesson this progress is for
  status    String   @default("started")   // track status: "started" or "completed"
  score     Int      @default(0)           // quiz score
  updatedAt DateTime @updatedAt            // auto-update timestamp whenever record changes
}

model Session { // used for SMS/WhatsApp bot state machine
  id        String   @id @default(cuid())  // unique id
  userId    String                           // foreign key to User
  user      User     @relation(fields: [userId], references: [id]) // relation: belongs to User
  state     String   @default("idle")      // current state (e.g. idle, in_lesson, awaiting_answer)
  payload   String   @default("")          // store extra data (JSON text for context)
  updatedAt DateTime @updatedAt            // auto-update timestamp
}
```


* **User** = student/learner (with phone, language).
* **Lesson** = learning content.
* **Question** = quiz question tied to a lesson.
* **Progress** = user’s status + score for a lesson.
* **Session** = keeps track of SMS/WhatsApp conversation state.

**api/src**

**api/src/db.ts**

// Import the PrismaClient class from the Prisma library
import { PrismaClient } from "@prisma/client";

// Create a new Prisma client object we can use to talk to the database
export const prisma = new PrismaClient();

**api/src/seed.ts**

import { PrismaClient } from "@prisma/client";  
// Import Prisma to talk to the database

import fs from "fs";  
// Import fs to read files

import path from "path";  
// Import path to handle file paths

const prisma = new PrismaClient();  
// Create a new Prisma client (database connection)

async function load(locale: string) {
  // Function to load lessons for a given language (locale)

  const raw = fs.readFileSync(path.join(__dirname, "../../content/lessons."+locale+".json"), "utf-8");
  // Read lessons JSON file for that language

  const data = JSON.parse(raw) as Array<{slug:string,topic:string,title:string,body:string,estMins?:number,questions:{prompt:string,options:string[],answer:number}[]}>;
  // Convert JSON text into an array of lesson objects

  for (const l of data) {
    // Go through each lesson in the file

    const lesson = await prisma.lesson.upsert({
      where: { slug: l.slug },
      update: { title: l.title, body: l.body, topic: l.topic, locale, estMins: l.estMins ?? 3 },
      create: { slug: l.slug, topic: l.topic, locale, title: l.title, body: l.body, estMins: l.estMins ?? 3 }
    });
    // Insert lesson if it doesn’t exist, or update it if it does

    await prisma.question.deleteMany({ where: { lessonId: lesson.id } });
    // Delete old questions for this lesson

    for (const q of l.questions) {
      // Go through each question in the lesson

      await prisma.question.create({ data: {
        lessonId: lesson.id,
        prompt: q.prompt,
        optionA: q.options[0], optionB: q.options[1], optionC: q.options[2], optionD: q.options[3],
        correct: q.answer
      }});
      // Add the new question with its options and correct answer
    }
  }
}

async function main(){
  // Main function to load lessons

  await load("en");
  // Load English lessons

  try { await load("te"); } catch { console.log("No Telugu content yet; skipping"); }
  // Try loading Telugu lessons, but skip if file doesn’t exist
}

main().then(()=>prisma.$disconnect());  
// Run main and close database connection after finishing


**api/src/server.ts**

// Import the Express framework to create the server
import express from "express";

// Import CORS so frontend (different domain) can call this API
import cors from "cors";

// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";
dotenv.config(); // Load those variables into process.env

// Import route handlers for lessons, quiz, progress, and sms
import lessons from "./routes/lessons.js";
import quiz from "./routes/quiz.js";
import progress from "./routes/progress.js";
import sms from "./routes/sms.js";

// Create an Express app
const app = express();

// Allow cross-origin requests (frontend → backend)
app.use(cors());

// Let the app understand JSON in request bodies
app.use(express.json());

// Simple health check endpoint → returns { ok: true }
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Use the lessons routes for anything starting with /api/lessons
app.use("/api/lessons", lessons);

// Use the quiz routes for /api/quiz
app.use("/api/quiz", quiz);

// Use the progress routes for /api/progress
app.use("/api/progress", progress);

// Use the sms routes for /webhooks/sms
app.use("/webhooks/sms", sms);

// Choose port from .env (PORT) or default 4000
const PORT = process.env.PORT || 4000;

// Start the server and log message
app.listen(PORT, () => console.log(`API listening on :${PORT}`));


**api/src/routes**

**api/src/routes/lessons.ts**

// Import Router tool from Express to create routes
import { Router } from "express";

// Import Prisma client we made earlier to talk to database
import { prisma } from "../db";

// Create a new router instance
const r = Router();

// Route: GET / → return list of lessons (with optional filters)
r.get("/", async (req, res) => {
  // Take locale (default "en") and topic from query string
  const { locale = "en", topic } = req.query as { locale?: string; topic?: string };

  // Build filter object for database query
  const where: any = { locale };
  if (topic) where.topic = topic; // If topic is given, add it to filter

  // Get all lessons from database that match filter, but only return certain fields
  const lessons = await prisma.lesson.findMany({
    where,
    select: { id: true, slug: true, title: true, topic: true, estMins: true }
  });

  // Send the list of lessons back as JSON
  res.json(lessons);
});

// Route: GET /:slug → return single lesson details by slug
r.get("/:slug", async (req, res) => {
  // Find lesson in database by slug value from URL
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });

  // If not found, send 404 error
  if (!lesson) return res.status(404).json({ error: "Not found" });

  // If found, send lesson details back as JSON
  res.json(lesson);
});

// Export this router so it can be used in the main app
export default r;
```

* First route (`/`) → gives list of lessons (can filter by `locale` & `topic`).
* Second route (`/:slug`) → gives details of a single lesson by its `slug`.


********************************************api/src/routes/progress.ts************************************************************
import { Router } from "express";  
// Import Router from Express to create API routes.

import { prisma } from "../db";  
// Import Prisma client (for talking to the database).

const r = Router();  
// Make a new router object to hold API routes.

r.get("/:userId", async (req, res) => {  
  // When someone makes a GET request like /123, run this code.
  
  const rows = await prisma.progress.findMany({ where: { userId: req.params.userId } });  
  // Get all "progress" records from the database where userId = given id in URL.

  res.json(rows);  
  // Send back those records as JSON to the client.
});

export default r;  
// Export this router so it can be used in the main app.

**************************************api/src/routes/quiz.ts**********************************************
import { Router } from "express";  // Import Express Router to handle routes
import { prisma } from "../db";    // Import database client (Prisma)

const r = Router();  // Create a new router

// GET request → fetch quiz questions for a lesson by its slug
r.get("/:slug", async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });  // Find lesson by slug
  if (!lesson) return res.status(404).json({ error: "No such lesson" });  // If lesson not found → send error
  const q = await prisma.question.findMany({ where: { lessonId: lesson.id }, orderBy: { id: "asc" } });  // Get all questions for lesson
  const quiz = q.map((x) => ({ prompt: x.prompt, options: [x.optionA,x.optionB,x.optionC,x.optionD] })); // Format questions with options
  res.json(quiz);  // Send quiz questions as response
});

// POST request → check answers and save progress
r.post("/:slug/grade", async (req, res) => {
  const { answers, userId } = req.body as { answers: number[]; userId: string };  // Get answers + userId from request
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } }); // Find lesson by slug
  if (!lesson) return res.status(404).json({ error: "No such lesson" }); // If lesson not found → send error
  const q = await prisma.question.findMany({ where: { lessonId: lesson.id }, orderBy: { id: "asc" } }); // Get lesson questions
  let score = 0;  // Start score at 0
  q.forEach((x, i) => { if (answers[i] === x.correct) score++; }); // Compare each answer → add to score if correct
  if (userId) {
    await prisma.progress.upsert({  // Save or update user progress
      where: { userId_lessonId: { userId, lessonId: lesson.id } }, // Unique key (user + lesson)
      create: { userId, lessonId: lesson.id, status: "completed", score }, // If not exists → create
      update: { status: "completed", score } // If exists → update
    } as any);
  }
  res.json({ total: q.length, score }); // Send back total questions + score
});

export default r; // Export the router so it can be used in app

**********************************api/src/routes/sms.ts**********************************************

import { Router } from "express";
// Import Router from Express to make a mini route handler

import { prisma } from "../db";
// Import the Prisma client to talk to the database

const r = Router();
// Create a new router object

// Very simple keyword flow for demo: START -> pick topic -> get Q1..n -> score
r.post("/", async (req, res) => {
  // Handle POST requests to "/" (like incoming SMS messages)

  const { from, body } = req.body as { from?: string; body?: string };
  // Get "from" (phone number) and "body" (message text) from the request

  const text = (body || "").trim().toLowerCase();
  // Clean the message text: remove spaces, make lowercase

  const phone = from || "demo";
  // Use the phone number if given, otherwise default to "demo"

  let user = await prisma.user.findFirst({ where: { phone } });
  // Look up user in the database by phone number

  if (!user) user = await prisma.user.create({ data: { phone, locale: "en" } });
  // If no user found, create a new one with default language English

  // Session state
  let session = await prisma.session.findFirst({ where: { userId: user.id } });
  // Look up the user’s quiz session

  if (!session) session = await prisma.session.create({ data: { userId: user.id, state: "idle" } });
  // If no session exists, create one starting in "idle" state

  const payload = session.payload ? JSON.parse(session.payload) : {};
  // Load extra session data (lesson progress) from JSON string

  const reply = async (msg: string) => res.json({ reply: msg });
  // Helper function to send back a reply message as JSON

  if (text === "start" || session.state === "idle") {
    // If the user sent "start" or their session is idle:

    const topics = await prisma.lesson.findMany({ where: { locale: user.locale }, select: { topic: true }, distinct: ["topic"] });
    // Get all unique topics available in their language

    await prisma.session.update({ where: { id: session.id }, data: { state: "choose_topic" } });
    // Update session state to "choose_topic"

    const list = topics.map((t, i) => `${i+1}. ${t.topic}`).join("\n");
    // Make a numbered list of topics (1. Math, 2. Science, etc.)

    return reply(`Welcome to LearnLite! Reply with a number to choose a topic:\n${list}`);
    // Send back the welcome message with the list of topics
  }

  if (session.state === "choose_topic") {
    // If the user is choosing a topic:

    const topics = await prisma.lesson.findMany({ where: { locale: user.locale }, select: { topic: true }, distinct: ["topic"] });
    // Get all unique topics again

    const idx = parseInt(text) - 1;
    // Convert user’s reply ("1", "2", etc.) into a number index

    const topic = topics[idx]?.topic;
    // Get the chosen topic

    if (!topic) return reply("Invalid choice. Send START to restart.");
    // If invalid choice, tell user to restart

    const lessons = await prisma.lesson.findMany({ where: { topic, locale: user.locale }, orderBy: { slug: "asc" } });
    // Get all lessons in the chosen topic, sorted

    await prisma.session.update({
      where: { id: session.id },
      data: {
        state: "in_quiz",
        payload: JSON.stringify({ lessonSlug: lessons[0].slug, qIndex: 0, score: 0 })
      }
    });
    // Update session: now in a quiz, starting with first lesson, question index 0, score 0

    return reply(`Topic: ${topic}. Let's begin quiz for '${lessons[0].title}'. Reply 1-4 to answer questions.`);
    // Send quiz start message to user
  }
});



