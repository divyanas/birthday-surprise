// --- Personalization ---
const birthdayName = "RANJITH KUMAR";          // Change to recipient’s name
const birthdayDate = "2025-12-14";      // YYYY-MM-DD for countdown
const signatureText = "From DIVYAN";    // Footer signature
const customMessage = `In every chapter we've shared, your light made the margins glow.
Here’s to new pages, loud laughter, and gentle mornings. Happy Birthday!`;

// Optional: set a local mp3 file name (place it next to index.html)
// Example: const musicSrc = "happy-birthday.mp3";
const musicSrc = ""; // leave empty if you don’t have one

// --- DOM references ---
const nameEl = document.getElementById("name");
const countdownEl = document.getElementById("countdownText");
const revealBtn = document.getElementById("revealBtn");
const musicBtn = document.getElementById("musicBtn");
const messageSection = document.getElementById("messageSection");
const messageText = document.getElementById("messageText");
const signatureEl = document.getElementById("signature");
const wishBtn = document.getElementById("wishBtn");
const modal = document.getElementById("surpriseModal");
const closeModal = document.getElementById("closeModal");
const confettiBtn = document.getElementById("confettiBtn");
const confettiCanvas = document.getElementById("confetti");
const downloadCard = document.getElementById("downloadCard");
const bgMusic = document.getElementById("bgMusic");

// --- Initialize text ---
nameEl.textContent = birthdayName;
signatureEl.textContent = signatureText;
messageText.textContent = customMessage;
if (musicSrc) bgMusic.src = musicSrc;

// --- Countdown ---
function updateCountdown() {
  const target = new Date(`${birthdayDate}T00:00:00`);
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    countdownEl.textContent = "It’s today! Celebrate now 🎉";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// --- Reveal surprise ---
revealBtn.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", "false");
  launchConfetti(180);
});

// --- Close modal ---
closeModal.addEventListener("click", () => {
  modal.setAttribute("aria-hidden", "true");
});

// --- Wish trigger ---
wishBtn.addEventListener("click", () => {
  messageSection.setAttribute("aria-hidden", "false");
  launchConfetti(120);
  smoothScrollTo(messageSection);
});

// --- Music toggle ---
let musicOn = false;
musicBtn.addEventListener("click", () => {
  try {
    if (!bgMusic.src) {
      alert("Add an mp3 file and set musicSrc in script.js to enable music.");
      return;
    }
    if (!musicOn) { bgMusic.play(); musicBtn.textContent = "Pause music"; }
    else { bgMusic.pause(); musicBtn.textContent = "Play music"; }
    musicOn = !musicOn;
  } catch (e) { console.log(e); }
});

// --- Confetti & card ---
confettiBtn.addEventListener("click", () => launchConfetti(240));
downloadCard.addEventListener("click", () => {
  const dataUrl = generateCardImage(`${birthdayName} — Happy Birthday!`);
  downloadCard.href = dataUrl;
  downloadCard.setAttribute("download", "Birthday-Card.png");
});

// --- Smooth scroll ---
function smoothScrollTo(el) {
  const top = el.getBoundingClientRect().top + window.scrollY - 10;
  window.scrollTo({ top, behavior: "smooth" });
}

// --- Confetti animation (lightweight) ---
const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];
function launchConfetti(count = 120) {
  const colors = ["#ff7ac7", "#ffd166", "#95d5b2", "#a0c4ff", "#f4acb7"];
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * window.innerWidth,
      y: -20,
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.12,
    });
  }
}
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function animate() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > confettiCanvas.height + 30) p.y = -20;
    drawPiece(p);
  });
  requestAnimationFrame(animate);
}
function drawPiece(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
  ctx.restore();
}
animate();

// --- Generate a simple card image ---
function generateCardImage(text) {
  const c = document.createElement("canvas");
  c.width = 1200; c.height = 630;
  const cx = c.getContext("2d");

  // Background gradient
  const grad = cx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, "#171a2a"); grad.addColorStop(1, "#121527");
  cx.fillStyle = grad; cx.fillRect(0, 0, c.width, c.height);

  // Accent ring
  cx.strokeStyle = "#ff7ac7"; cx.lineWidth = 6;
  cx.beginPath(); cx.roundRect(40, 40, c.width - 80, c.height - 80, 28);
  cx.stroke();

  // Title
  cx.fillStyle = "#e8eaf6";
  cx.font = "bold 64px Playfair Display, serif";
  cx.fillText("Happy Birthday", 80, 200);

  // Subtext
  cx.font = "24px Poppins, sans-serif";
  wrapText(cx, text, 80, 270, c.width - 160, 34);

  // Signature
  cx.fillStyle = "#ffd166";
  cx.font = "600 22px Poppins, sans-serif";
  cx.fillText(signatureText, 80, c.height - 90);

  return c.toDataURL("image/png");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

