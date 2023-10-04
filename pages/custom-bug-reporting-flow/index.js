const container = document.createElement("div");
container.style.width = "100vw";
container.style.height = "100vh";
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.flexDirection = "column";
container.style.gap = "1rem";

const button = document.createElement("button");
button.style.padding = "2rem";
button.style.fontSize = "2rem";
button.innerText = "Start recording ⏺";

const text = document.createElement("span");
text.style.fontSize = "1.5rem";

container.appendChild(text);

const reportLink = document.createElement("a");
reportLink.innerText = "View report";
reportLink.target = "_blank";
reportLink.style.fontSize = "1.5rem";

let isRecording = false;
let timePassedS = 0;
let interval;

const getCountdownText = (time) =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toString().padStart(2, "0")}`;

text.innerText = getCountdownText(timePassedS);

const startRecording = () => {
  if (container.contains(reportLink)) {
    container.removeChild(reportLink);
  }

  // Start screen recording
  window.Bugpilot?.saveReport?.();

  button.innerText = "Stop recording ■";
  timePassedS = 0;
  isRecording = true;

  interval = setInterval(() => {
    timePassedS += 1;
    text.innerText = getCountdownText(timePassedS);
  }, 1000);
};

const stopRecording = async () => {
  button.innerText = "Start recording ⏺";
  timePassedS = 0;
  text.innerText = getCountdownText(timePassedS);
  isRecording = false;

  if (interval) {
    clearInterval(interval);
  }

  const userProvidedDescription = prompt(
    "Please describe the issue you're having",
  );

  // Update report with user provided description
  window.Bugpilot?.saveReport?.({
    userProvidedDescription,
  });

  reportLink.href = `https://dash.bugpilot.io/lean-report/${window.Bugpilot.reportId}`;
  container.appendChild(reportLink);

  const response = await fetch("https://ipinfo.io", {
    headers: {
      Accept: "application/json",
    },
  });

  const { ip, country, city, loc } = await response.json();

  // Add additional data to report
  window.Bugpilot?.saveReport?.({ ip, country, city, loc });
};

button.addEventListener("click", async () => {
  if (isRecording) {
    await stopRecording();
    return;
  }

  startRecording();
});

container.appendChild(button);

document.body.appendChild(container);
