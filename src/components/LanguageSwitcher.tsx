import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const setLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("learnlite.lang", lng);
  };

  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-gray-600 text-sm">{t("language")}</span>
      <select className="border rounded-xl px-2 py-1" value={i18n.language} onChange={(e) => setLang(e.target.value)}>
        <option value="en">English</option>
        <option value="te">తెలుగు</option>
      </select>
    </label>
  );
}
