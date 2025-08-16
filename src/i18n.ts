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
