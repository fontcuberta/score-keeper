const STORAGE_KEYS = {
  scoreA: "score_teamA",
  scoreB: "score_teamB",
  teamAName: "score_teamAName",
  teamBName: "score_teamBName",
  increment: "score_increment",
};

const scoreState = {
  scoreA: 0,
  scoreB: 0,
  teamAName: "Team A",
  teamBName: "Team B",
  increment: 1,
};

const scoreADisplay = document.getElementById("scoreADisplay");
const scoreBDisplay = document.getElementById("scoreBDisplay");
const teamANameInput = document.getElementById("teamAName");
const teamBNameInput = document.getElementById("teamBName");
const customIncrementInput = document.getElementById("customIncrement");
const incrementBtns = document.querySelectorAll(".increment-btn");
const addAButton = document.getElementById("addAButton");
const addBButton = document.getElementById("addBButton");
const resetAButton = document.getElementById("resetAButton");
const resetBButton = document.getElementById("resetBButton");
const resetAllButton = document.getElementById("resetAllButton");

function loadFromStorage() {
  try {
    const storedA = localStorage.getItem(STORAGE_KEYS.scoreA);
    const storedB = localStorage.getItem(STORAGE_KEYS.scoreB);
    const storedAName = localStorage.getItem(STORAGE_KEYS.teamAName);
    const storedBName = localStorage.getItem(STORAGE_KEYS.teamBName);
    const storedIncrement = localStorage.getItem(STORAGE_KEYS.increment);

    if (storedA !== null) scoreState.scoreA = Math.max(0, parseInt(storedA, 10) || 0);
    if (storedB !== null) scoreState.scoreB = Math.max(0, parseInt(storedB, 10) || 0);
    if (storedAName !== null) scoreState.teamAName = storedAName;
    if (storedBName !== null) scoreState.teamBName = storedBName;
    if (storedIncrement !== null) {
      const inc = Math.max(1, Math.min(99, parseInt(storedIncrement, 10) || 1));
      scoreState.increment = inc;
    }
  } catch (_) {
    // Use defaults if localStorage fails
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.scoreA, String(scoreState.scoreA));
    localStorage.setItem(STORAGE_KEYS.scoreB, String(scoreState.scoreB));
    localStorage.setItem(STORAGE_KEYS.teamAName, scoreState.teamAName);
    localStorage.setItem(STORAGE_KEYS.teamBName, scoreState.teamBName);
    localStorage.setItem(STORAGE_KEYS.increment, String(scoreState.increment));
  } catch (_) {
    // Ignore storage errors
  }
}

function updateDisplay() {
  if (scoreADisplay) scoreADisplay.textContent = String(scoreState.scoreA);
  if (scoreBDisplay) scoreBDisplay.textContent = String(scoreState.scoreB);
  if (teamANameInput) teamANameInput.value = scoreState.teamAName;
  if (teamBNameInput) teamBNameInput.value = scoreState.teamBName;
  // Don't overwrite custom input while user is typing
  if (customIncrementInput && document.activeElement !== customIncrementInput) {
    customIncrementInput.value = String(scoreState.increment);
  }

  incrementBtns.forEach((btn) => {
    const val = parseInt(btn.getAttribute("data-increment"), 10);
    btn.classList.toggle("increment-btn--active", val === scoreState.increment);
  });
}

function getEffectiveIncrement() {
  if (customIncrementInput) {
    const parsed = parseInt(customIncrementInput.value, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 99) {
      return parsed;
    }
  }
  return scoreState.increment;
}

function setIncrement(value) {
  const inc = Math.max(1, Math.min(99, value));
  scoreState.increment = inc;
  saveToStorage();
  updateDisplay();
}

function addPoints(team) {
  const inc = getEffectiveIncrement();
  scoreState.increment = inc;
  if (team === "a") {
    scoreState.scoreA += inc;
  } else if (team === "b") {
    scoreState.scoreB += inc;
  }
  saveToStorage();
  updateDisplay();
}

function resetTeam(team) {
  if (team === "a") {
    scoreState.scoreA = 0;
  } else if (team === "b") {
    scoreState.scoreB = 0;
  }
  saveToStorage();
  updateDisplay();
}

function resetAll() {
  scoreState.scoreA = 0;
  scoreState.scoreB = 0;
  saveToStorage();
  updateDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  updateDisplay();

  addAButton?.addEventListener("click", () => addPoints("a"));
  addBButton?.addEventListener("click", () => addPoints("b"));
  resetAButton?.addEventListener("click", () => resetTeam("a"));
  resetBButton?.addEventListener("click", () => resetTeam("b"));
  resetAllButton?.addEventListener("click", resetAll);

  incrementBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.getAttribute("data-increment"), 10);
      if (!isNaN(val)) setIncrement(val);
    });
  });

  customIncrementInput?.addEventListener("input", () => {
    const val = parseInt(customIncrementInput.value, 10);
    if (!isNaN(val) && val >= 1 && val <= 99) {
      setIncrement(val);
    }
  });
  customIncrementInput?.addEventListener("blur", () => {
    const val = parseInt(customIncrementInput.value, 10);
    if (isNaN(val) || val < 1 || val > 99) {
      customIncrementInput.value = String(scoreState.increment);
    } else {
      setIncrement(val);
    }
  });

  teamANameInput?.addEventListener("blur", () => {
    const name = (teamANameInput.value || "").trim() || "Team A";
    scoreState.teamAName = name.slice(0, 24);
    teamANameInput.value = scoreState.teamAName;
    saveToStorage();
  });

  teamANameInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") teamANameInput.blur();
  });

  teamBNameInput?.addEventListener("blur", () => {
    const name = (teamBNameInput.value || "").trim() || "Team B";
    scoreState.teamBName = name.slice(0, 24);
    teamBNameInput.value = scoreState.teamBName;
    saveToStorage();
  });

  teamBNameInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") teamBNameInput.blur();
  });
});
