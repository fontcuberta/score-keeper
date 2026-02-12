/**
 * Theme switcher – persists choice in localStorage
 */
const THEME_STORAGE_KEY = "my-first-app-theme";
const VALID_THEMES = ["default", "warm", "ocean", "sunset"];

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored)) return stored;
  } catch (_) {}
  return "default";
}

function applyTheme(themeId) {
  const root = document.documentElement;
  if (themeId === "default") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", themeId);
  }
}

function setTheme(themeId) {
  if (!VALID_THEMES.includes(themeId)) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (_) {}
  applyTheme(themeId);
}

function initTheme() {
  applyTheme(getStoredTheme());
}

function initThemeSwitcher(container) {
  if (!container) return;

  const current = getStoredTheme();

  VALID_THEMES.forEach((id) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `theme-btn ${id === current ? "theme-btn--active" : ""}`;
    btn.setAttribute("data-theme", id);
    btn.setAttribute("aria-pressed", id === current ? "true" : "false");
    btn.setAttribute("aria-label", `Theme: ${id}`);
    btn.title = `Theme: ${id}`;
    container.appendChild(btn);

    btn.addEventListener("click", () => {
      setTheme(id);
      container.querySelectorAll(".theme-btn").forEach((b) => {
        const isActive = b.getAttribute("data-theme") === id;
        b.classList.toggle("theme-btn--active", isActive);
        b.setAttribute("aria-pressed", isActive);
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  const container = document.getElementById("themeSwitcher");
  initThemeSwitcher(container);
});
