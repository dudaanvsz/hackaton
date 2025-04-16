// Troca de abas
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach(section => {
      section.classList.add("hidden");
    });
    document.getElementById(tab).classList.remove("hidden");
  });
});

// Formatador
function formatFullTime(t) {
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// CRONÔMETRO
let stopwatchTime = 0;
let stopwatchInterval = null;
const stopwatchDisplay = document.getElementById("stopwatch");

document.getElementById("startStopwatch").addEventListener("click", () => {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    stopwatchDisplay.textContent = formatFullTime(stopwatchTime);
    if (stopwatchTime === 10) {
      document.getElementById("alarm-sound").play();
      stopwatchDisplay.classList.add("alarm-visual");
      document.body.classList.add("alarm-screen");
      setTimeout(() => {
        stopwatchDisplay.classList.remove("alarm-visual");
        document.body.classList.remove("alarm-screen");
      }, 5000);
    }
  }, 1000);
});

document.getElementById("pauseStopwatch").addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
});

document.getElementById("resetStopwatch").addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchTime = 0;
  stopwatchDisplay.textContent = "00:00:00";
});

// CONTAGEM REGRESSIVA
let countdownTime = 0;
let countdownInterval = null;
const countdownDisplay = document.getElementById("countdownDisplay");

document.getElementById("startCountdown").addEventListener("click", () => {
  if (countdownInterval) return;
  if (countdownTime === 0) {
    const h = parseInt(document.getElementById("revHours").value) || 0;
    const m = parseInt(document.getElementById("revMinutes").value) || 0;
    const s = parseInt(document.getElementById("revSeconds").value) || 0;
    countdownTime = h * 3600 + m * 60 + s;
  }

  countdownInterval = setInterval(() => {
    if (countdownTime > 0) {
      countdownTime--;
      countdownDisplay.textContent = formatFullTime(countdownTime);
    } else {
      clearInterval(countdownInterval);
      countdownInterval = null;
      countdownDisplay.textContent = "00:00:00";
      document.getElementById("alarm-sound").play();
      countdownDisplay.classList.add("alarm-visual");
      document.body.classList.add("alarm-screen");
      setTimeout(() => {
        countdownDisplay.classList.remove("alarm-visual");
        document.body.classList.remove("alarm-screen");
      }, 5000);
    }
  }, 1000);
});

document.getElementById("pauseCountdown").addEventListener("click", () => {
  clearInterval(countdownInterval);
  countdownInterval = null;
});

document.getElementById("resetCountdown").addEventListener("click", () => {
  clearInterval(countdownInterval);
  countdownInterval = null;
  countdownTime = 0;
  countdownDisplay.textContent = "00:00:00";
});

// TIMERS MÚLTIPLOS
const timersList = document.getElementById("timersList");
document.getElementById("addTimer").addEventListener("click", () => {
  const name = document.getElementById("activityName").value.trim();
  const h = parseInt(document.getElementById("hours").value) || 0;
  const m = parseInt(document.getElementById("minutes").value) || 0;
  const s = parseInt(document.getElementById("seconds").value) || 0;
  const totalSeconds = h * 3600 + m * 60 + s;

  if (!name || totalSeconds <= 0) {
    alert("Preencha um nome e um tempo válido.");
    return;
  }

  const timerBox = document.createElement("div");
  timerBox.classList.add("timerBox");

  const label = document.createElement("div");
  label.classList.add("label");
  label.textContent = name;

  const timeDisplay = document.createElement("div");
  timeDisplay.classList.add("time");
  timeDisplay.textContent = formatFullTime(totalSeconds);

  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "&times;";
  removeBtn.addEventListener("click", () => {
    clearInterval(interval);
    timerBox.remove();
  });

  timerBox.appendChild(label);
  timerBox.appendChild(timeDisplay);
  timerBox.appendChild(removeBtn);
  timersList.appendChild(timerBox);

  let remaining = totalSeconds;
  const interval = setInterval(() => {
    remaining--;
    timeDisplay.textContent = formatFullTime(remaining);

    if (remaining <= 0) {
      clearInterval(interval);
      timeDisplay.textContent = "00:00:00";
      document.getElementById("alarm-sound").play();
      timerBox.classList.add("alarm-visual");
      document.body.classList.add("alarm-screen");
      setTimeout(() => {
        timerBox.classList.remove("alarm-visual");
        document.body.classList.remove("alarm-screen");
      }, 5000);
    }
  }, 1000);

  // Limpar inputs
  document.getElementById("activityName").value = "";
  document.getElementById("hours").value = "";
  document.getElementById("minutes").value = "";
  document.getElementById("seconds").value = "";
});

// MODO POMODORO
let pomodoroTime = 25 * 60;
let pomodoroInterval = null;
let pomodoroPhase = "foco";
let pomodoroCycle = 0;

const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroStatus = document.getElementById("pomodoroStatus");

function updatePomodoroDisplay() {
  const m = Math.floor(pomodoroTime / 60);
  const s = pomodoroTime % 60;
  pomodoroDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startPomodoro() {
  if (pomodoroInterval) return;
  pomodoroInterval = setInterval(() => {
    if (pomodoroTime > 0) {
      pomodoroTime--;
      updatePomodoroDisplay();
    } else {
      document.getElementById("alarm-sound").play();
      clearInterval(pomodoroInterval);
      pomodoroInterval = null;

      if (pomodoroPhase === "foco") {
        pomodoroCycle++;
        if (pomodoroCycle % 4 === 0) {
          pomodoroPhase = "pausa-longa";
          pomodoroTime = 15 * 60;
        } else {
          pomodoroPhase = "pausa-curta";
          pomodoroTime = 5 * 60;
        }
      } else {
        pomodoroPhase = "foco";
        pomodoroTime = 25 * 60;
      }

      pomodoroStatus.textContent = pomodoroPhase.replace("-", " ").toUpperCase();
      updatePomodoroDisplay();
      startPomodoro();
    }
  }, 1000);
}

document.getElementById("startPomodoro").addEventListener("click", startPomodoro);
document.getElementById("pausePomodoro").addEventListener("click", () => {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
});
document.getElementById("resetPomodoro").addEventListener("click", () => {
  clearInterval(pomodoroInterval);
  pomodoroInterval = null;
  pomodoroPhase = "foco";
  pomodoroTime = 25 * 60;
  pomodoroCycle = 0;
  pomodoroStatus.textContent = "FOCO";
  updatePomodoroDisplay();
});

updatePomodoroDisplay();
