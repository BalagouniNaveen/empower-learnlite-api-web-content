**********************************src**********************************************

**src/App.tsx**

import React from "react"; // Import React so we can use JSX (HTML-like code in JS)
import { Outlet, Link } from "react-router-dom"; // Import navigation tools (Link for navigation, Outlet to show child pages)
import LanguageSwitcher from "./components/LanguageSwitcher"; // Import our custom LanguageSwitcher component

export default function App() { // Define the main App component
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900"> {/* Full screen height with light gray background and dark text */}
      <header className="p-4 shadow bg-white sticky top-0 z-10"> {/* Top header bar, white background, stays fixed on top */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3"> {/* Center content with max width and flex layout */}
          <Link to="/" className="text-xl font-bold text-indigo-600"> {/* Logo text that links to homepage */}
            LearnLite
          </Link>
          <div className="flex items-center gap-4 text-sm"> {/* Row layout for right-side items (Dashboard + Language switch) */}
            <Link to="/dashboard" className="hover:underline"> {/* Link to dashboard page */}
              Dashboard
            </Link>
            <LanguageSwitcher /> {/* Button/component to switch languages */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4"> {/* Main page content area with padding and centered */}
        <Outlet /> {/* This is where child routes (pages) will show */}
      </main>
    </div>
  );
}


**********src/i18n.ts**************

import i18n from "i18next";  
import { initReactI18next } from "react-i18next";  

// Get saved language from browser local storage (if user selected before)
const saved = localStorage.getItem("learnlite.lang");  

// Detect browser language (first 2 letters, e.g., "en"), fallback to "en"
const browser = navigator.language?.slice(0, 2) || "en";  

// Define words in different languages (English and Telugu here)
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

// Initialize i18n with chosen language and fallback to English if not found
i18n.use(initReactI18next).init({  
  resources,  
  lng: saved || (["en", "te"].includes(browser) ? browser : "en"), // Use saved language, else browser language, else "en"  
  fallbackLng: "en", // If chosen language missing, use English  
  interpolation: { escapeValue: false }, // Allow plain text without escaping  
});  

export default i18n; // Export for use in app


**src/index.css**

@tailwind base;        /* Loads Tailwind's default reset styles */
@tailwind components;  /* Loads reusable UI components from Tailwind */
@tailwind utilities;   /* Loads Tailwind's helper classes (like flex, p-4, etc.) */

html, body, #root {
  height: 100%;        /* Make the page take full height of the screen */
}

body {
  -webkit-font-smoothing: antialiased;   /* Makes text smoother on Chrome/Safari */
  -moz-osx-font-smoothing: grayscale;    /* Makes text smoother on Firefox (Mac) */
}


**src/main.tsx**

import React from "react"; // Import React to build UI
import ReactDOM from "react-dom/client"; // Import ReactDOM to show app in browser
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import routing tools for page navigation
import "./index.css"; // Import global CSS styles
import "./i18n"; // Import translations setup (internationalization)
import App from "./App"; // Import main App layout
import Home from "./pages/Home"; // Import Home page
import Lesson from "./pages/Lesson"; // Import Lesson page
import Quiz from "./pages/Quiz"; // Import Quiz page
import Dashboard from "./pages/Dashboard"; // Import Dashboard page

// Register a service worker for offline support (only if supported by browser)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ignore service worker errors for local dev */
    });
  });
}

// Render React app inside the HTML element with id="root"
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode> 
    {/* StrictMode helps catch errors in development */}
    <BrowserRouter> 
      {/* BrowserRouter enables navigation without page reload */}
      <Routes> 
        {/* Routes define which page to show based on URL */}
        <Route path="/" element={<App />}>
          {/* App is the main layout for all routes */}
          <Route index element={<Home />} /> {/* Show Home at "/" */}
          <Route path="lesson/:slug" element={<Lesson />} /> {/* Show Lesson page with topic id */}
          <Route path="quiz/:slug" element={<Quiz />} /> {/* Show Quiz page with topic id */}
          <Route path="dashboard" element={<Dashboard />} /> {/* Show Dashboard at "/dashboard" */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


**************************src/components**********************************************************

******src/components/LanguageSwitcher.tsx******

import React from "react";
// Import a hook to handle translations
import { useTranslation } from "react-i18next";

// A small React component to switch between languages
export default function LanguageSwitcher() {
  // Get translation functions (t = translate text, i18n = language control)
  const { i18n, t } = useTranslation();

  // Function to change language and save choice in browser storage
  const setLang = (lng: string) => {
    i18n.changeLanguage(lng); // change the app’s language
    localStorage.setItem("learnlite.lang", lng); // remember choice in localStorage
  };

  return (
    // A label that holds the dropdown
    <label className="inline-flex items-center gap-2">
      {/* Show text like "Language" (translated) */}
      <span className="text-gray-600 text-sm">{t("language")}</span>

      {/* Dropdown menu to choose language */}
      <select
        className="border rounded-xl px-2 py-1"
        value={i18n.language} // show current selected language
        onChange={(e) => setLang(e.target.value)} // when user picks, change language
      >
        {/* English option */}
        <option value="en">English</option>

        {/* Telugu option */}
        <option value="te">తెలుగు</option>
      </select>
    </label>
  );
}


******src/components/LessonCard.tsx******

import React from "react";  
// Import React to create components

import { Link } from "react-router-dom";  
// Import Link to navigate between pages without reloading

export default function LessonCard({ slug, title, topic, estMins } : {
  slug: string;
  title: string;
  topic: string;
  estMins?: number;
}) {
  // LessonCard component shows a single lesson preview
  // Props: slug = lesson URL, title = lesson title, topic = category, estMins = estimated minutes

  return (
    <Link to={`/lesson/${encodeURIComponent(slug)}`} 
          className="block p-4 rounded-2xl shadow bg-white hover:shadow-md transition">
      {/* Clicking this card goes to /lesson/slug; card has padding, rounded corners, shadow, hover effect */}

      <div className="text-xs uppercase text-gray-500">{topic}</div>
      {/* Show the lesson topic in small, gray, uppercase text */}

      <div className="text-lg font-semibold">{title}</div>
      {/* Show the lesson title in larger bold text */}

      <div className="text-xs mt-1">⏱ {estMins ?? 3} min</div>
      {/* Show estimated time in minutes; default 3 if estMins not provided */}
    </Link>
  );
}


**src/components/ProgressBar.tsx**

Sure! Here’s your React `ProgressBar` component with **simple one-line English comments** explaining each part:

```ts
import React from "react";  
// Import React to use JSX and create components

// Define a functional component called ProgressBar
// It accepts props: value (current progress) and max (maximum value)
export default function ProgressBar({ value = 0, max = 100 } : { value?: number; max?: number }) {
  
  const pct = Math.round((value / max) * 100);  
  // Calculate progress as a percentage and round to nearest whole number

  return (
    <div className="w-full bg-gray-200 rounded-xl overflow-hidden my-3">
      {/* Outer bar: full width, gray background, rounded corners, margin */}

      <div className="h-3 bg-green-500" style={{ width: `${pct}%` }} />
      {/* Inner bar: height 3px, green color, width = percentage of progress */}
    </div>
  );
}
```

* The **outer div** is the track/background of the progress bar.
* The **inner div** fills the bar proportionally to `value / max`.
* `pct` converts progress into a 0–100% width for the green bar.
  

**src/components/QuizView.tsx**

import React from "react";  
// Import React library to use JSX and components

export default function QuizView({
  q,
  i,
  onAnswer,
}: {
  q: { prompt: string; options: string[] }; // q = the question object with text and options
  i: number;                                // i = index of the question in the quiz
  onAnswer: (idx: number) => void;         // onAnswer = function to call when user clicks an option
}) {
  return (
    <div className="p-4 rounded-2xl shadow bg-white">
      {/* Container with padding, rounded corners, shadow, white background */}

      <div className="mb-3 font-medium">
        Q{i + 1}. {q.prompt}  
        {/* Show question number and question text */}
      </div>

      <div className="grid gap-2">
        {/* Grid layout with spacing for the answer buttons */}

        {q.options.map((opt, idx) => (
          <button
            key={idx}  
            // unique key for React to track list items

            onClick={() => onAnswer(idx)}  
            // call onAnswer function with the index of clicked option

            className="text-left p-3 rounded-xl border hover:bg-gray-50"
            // button styling: left-aligned text, padding, rounded corners, border, hover effect
          >
            {idx + 1}. {opt}  
            {/* show option number and option text */}
          </button>
        ))}
      </div>
    </div>
  );
}


******************************src/lib******************************************************

**src/lib/api.ts**


const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
// Set the base API URL from environment, fallback to localhost if not set

export async function listLessons(locale = "en") {
  // Fetch all lessons for a given language (default English)
  const res = await fetch(`${API}/api/lessons?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  // If the server returns error, throw an error

  return (await res.json()) as Array<{ id: string; slug: string; title: string; topic: string; estMins?: number }>;
  // Return the JSON data as an array of lesson objects
}

export async function getLesson(slug: string, locale = "en") {
  // Fetch a single lesson by its slug and locale
  const res = await fetch(`${API}/api/lessons/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) throw new Error("Lesson not found");
  // Throw error if lesson not found

  return (await res.json()) as { id: string; slug: string; title: string; body: string; topic: string; estMins?: number };
  // Return the lesson details (title, body, topic, etc.)
}

export async function getQuiz(slug: string, locale = "en") {
  // Fetch quiz questions for a lesson
  const res = await fetch(`${API}/api/quiz/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) throw new Error("Quiz not found");
  // Throw error if quiz not found

  return (await res.json()) as Array<{ prompt: string; options: string[] }>;
  // Return an array of questions with prompt text and options
}

export async function grade(slug: string, answers: number[], userId?: string, locale = "en") {
  // Send user's answers to the server to get the score
  const res = await fetch(`${API}/api/quiz/${encodeURIComponent(slug)}/grade?locale=${encodeURIComponent(locale)}`, {
    method: "POST",                             // use POST to send data
    headers: { "Content-Type": "application/json" }, // tell server it's JSON
    body: JSON.stringify({ answers, userId }),  // send answers and optional userId
  });

  if (!res.ok) throw new Error("Grading failed");
  // Throw error if server could not grade

  return (await res.json()) as { total: number; score: number };
  // Return the total questions and the user's score
}
```

* `listLessons` → get all lessons for a language
* `getLesson` → get one lesson by slug
* `getQuiz` → get quiz questions for a lesson
* `grade` → send answers and get back the score



**********************src/pages**********************

******************src/pages/Dashboard.tsx**************


import React from "react";  
// Import React library to create components

export default function Dashboard() {  
  // Define a functional component named Dashboard and export it as default

  return (
    <div className="space-y-2">  
      {/* Outer container with vertical spacing between children */}
      
      <h2 className="text-xl font-bold">Your Progress</h2>  
      {/* Heading with larger text and bold font */}

      <div>
        {/* Placeholder text for the dashboard */}
        This is a simple demo dashboard. To show real per-user progress, integrate the backend `/api/progress/:userId` endpoint
        and render scores with charts (e.g., Chart.js or Recharts).
      </div>
    </div>
  );
}


**************src/pages/Home.tsx******************


import React, { useEffect, useState } from "react";  
// Import React and hooks: useState (for state) and useEffect (for side effects)

import { listLessons } from "../lib/api";  
// Import function to fetch lessons from backend API

import LessonCard from "../components/LessonCard";  
// Import a card component to display each lesson

import { useTranslation } from "react-i18next";  
// Import hook to handle multi-language translations

export default function Home() {
  const [lessons, setLessons] = useState<Array<any>>([]);  
  // Store fetched lessons in state (initially empty array)

  const { i18n } = useTranslation();  
  // Get i18n object to know current language

  useEffect(() => {
    listLessons(i18n.language).then(setLessons).catch(() => setLessons([]));  
    // When language changes, fetch lessons for that language and save them to state
    // If fetching fails, just set lessons to empty array
  }, [i18n.language]);  
  // Only run this effect when the language changes

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>  
      {/* Page heading */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">  
        {/* Layout lessons in 1 column on mobile, 2 columns on small+ screens, with spacing */}

        {lessons.map((l) => (
          <LessonCard 
            key={l.slug + i18n.language}  
            // Unique key for React list (lesson slug + language)
            slug={l.slug} 
            title={l.title} 
            topic={l.topic} 
            estMins={l.estMins} 
            // Pass lesson data as props to LessonCard
          />
        ))}
      </div>
    </>
  );
}
```

* **State** = keeps the list of lessons
* **Effect** = fetch lessons whenever language changes
* **Render** = show heading + grid of `LessonCard`s


**src/pages/Lesson.tsx******

import React, { useEffect, useState } from "react";  
// Import React and hooks for state and lifecycle

import { useParams, Link } from "react-router-dom";  
// Import hooks to read URL params and create links

import { getLesson } from "../lib/api";  
// Function to fetch a lesson from the backend API

import { useTranslation } from "react-i18next";  
// Hook to support multiple languages (i18n)

export default function Lesson() {
  const { slug } = useParams<{ slug: string }>();  
  // Get the "slug" from the URL (like /lesson/math-1)

  const [lesson, setLesson] = useState<any | null>(null);  
  // State to store the lesson data (null initially)

  const { i18n, t } = useTranslation();  
  // i18n = current language, t() = translate text

  useEffect(() => {
    if (!slug) return;  
    // If slug is missing, do nothing

    getLesson(decodeURIComponent(slug), i18n.language)
      .then(setLesson)   // fetch lesson and save in state
      .catch(() => setLesson(null));  
      // if error, set lesson to null
  }, [slug, i18n.language]);  
  // Run this effect whenever slug or language changes

  const speak = () => {
    if (!lesson || !("speechSynthesis" in window)) return;  
    // Do nothing if lesson not loaded or browser can't speak

    const u = new SpeechSynthesisUtterance(lesson.body);  
    // Create a text-to-speech object with lesson content

    speechSynthesis.speak(u);  
    // Speak the lesson out loud
  };

  if (lesson === null) return <div>Loading…</div>;  
  // Show loading message while lesson is being fetched

  return (
    <article className="prose max-w-none">
      <h1>{lesson.title}</h1>  
      // Display lesson title

      <p>{lesson.body}</p>  
      // Display lesson content

      <div className="flex gap-2 mt-4">
        <button className="px-3 py-2 rounded-xl bg-black text-white" onClick={speak}>
          🔊 {t("listen")}  
          // Button to read lesson aloud (text-to-speech)
        </button>

        <Link className="px-3 py-2 rounded-xl bg-indigo-600 text-white" to={`/quiz/${encodeURIComponent(lesson.slug)}`}>
          {t("quiz")}  
          // Link to go to the quiz for this lesson
        </Link>
      </div>
    </article>
  );
}


**src/pages/Quiz.tsx**

import React, { useEffect, useState } from "react";  
// Import React and hooks for state and side-effects

import { useParams } from "react-router-dom";  
// Import hook to get URL parameters (like lesson/quiz slug)

import { getQuiz, grade } from "../lib/api";  
// Import functions to fetch quiz data and grade answers

import QuizView from "../components/QuizView";  
// Import component that shows a single question and options

import { useTranslation } from "react-i18next";  
// Import hook for multi-language support

export default function Quiz() {
  const { slug } = useParams<{ slug: string }>();  
  // Get the quiz slug from the URL

  const [qs, setQs] = useState<Array<{ prompt: string; options: string[] }>>([]);  
  // State to hold the list of questions

  const [i, setI] = useState(0);  
  // State to track the current question index

  const [answers, setAnswers] = useState<number[]>([]);  
  // State to store the selected answer indices

  const [result, setResult] = useState<{ total: number; score: number } | null>(null);  
  // State to store quiz result after grading

  const { i18n } = useTranslation();  
  // Get current language

  useEffect(() => {
    if (!slug) return;  
    // Do nothing if no slug

    getQuiz(decodeURIComponent(slug), i18n.language).then(setQs).catch(() => setQs([]));  
    // Fetch quiz questions from API based on slug and language, store in qs, or empty array on error
  }, [slug, i18n.language]);  
  // Run this effect whenever slug or language changes

  const onAnswer = (idx: number) => {
    const next = [...answers, idx];  
    // Add current answer to answers array

    setAnswers(next);  
    // Save updated answers

    if (i + 1 >= qs.length && slug) {
      // If this was the last question, submit answers to grade

      grade(decodeURIComponent(slug), next, undefined, i18n.language)
        .then(setResult)
        .catch(() => null);  
      // Call API to grade quiz and save result, ignore errors
    } else {
      setI(i + 1);  
      // Move to next question
    }
  };

  if (result) return <div className="p-4 rounded-2xl bg-green-50 border">Score: {result.score}/{result.total}</div>;  
  // If quiz is finished, show the score

  if (qs.length === 0) return <div>Loading…</div>;  
  // If questions not loaded yet, show loading message

  return <QuizView q={qs[i]} i={i} onAnswer={onAnswer} />;  
  // Show current question using QuizView component
}



