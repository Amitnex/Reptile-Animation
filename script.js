const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let gameStarted = false;

const reptile = {
  head: { x: width / 2, y: height / 2 },
  segments: [],
  numSegments: 45,
  segmentLength: 16
};

for (let i = 0; i < reptile.numSegments; i++) {
  reptile.segments.push({ x: reptile.head.x, y: reptile.head.y });
}

const mouse = { x: width / 2, y: height / 2 };
window.addEventListener("mousemove", (e) => {
  if (gameStarted) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
});

window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

document.getElementById("playBtn").addEventListener("click", () => {
  gameStarted = true;
  document.getElementById("playBtn").style.display = "none";
});

function drawArrowPointer() {
  const size = 15;
  const angle = Math.atan2(mouse.y - reptile.head.y, mouse.x - reptile.head.x);

  ctx.save();
  ctx.translate(mouse.x, mouse.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-size, size / 2);
  ctx.lineTo(-size, -size / 2);
  ctx.closePath();

  // Glow
  ctx.shadowColor = '#4FDF4F';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#6FFF6F';
  ctx.fill();
  ctx.restore();
}

function drawReptile() {
  ctx.clearRect(0, 0, width, height);

  // 🐌 Slower tracking (from 0.25 ➜ 0.05)
  reptile.head.x += (mouse.x - reptile.head.x) * 0.05;
  reptile.head.y += (mouse.y - reptile.head.y) * 0.05;

  reptile.segments[0].x = reptile.head.x;
  reptile.segments[0].y = reptile.head.y;

  for (let i = 1; i < reptile.numSegments; i++) {
    const prev = reptile.segments[i - 1];
    const curr = reptile.segments[i];

    const dx = prev.x - curr.x;
    const dy = prev.y - curr.y;
    const angle = Math.atan2(dy, dx);

    // Remove wobble for smooth stalking
    curr.x = prev.x - Math.cos(angle) * reptile.segmentLength;
    curr.y = prev.y - Math.sin(angle) * reptile.segmentLength;
  }

  // Body
  ctx.beginPath();
  ctx.moveTo(reptile.head.x, reptile.head.y);
  for (let i = 1; i < reptile.segments.length; i++) {
    ctx.lineTo(reptile.segments[i].x, reptile.segments[i].y);
  }
  ctx.strokeStyle = "#3FBF3F";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.stroke();

  // Spine
  ctx.beginPath();
  ctx.moveTo(reptile.head.x, reptile.head.y);
  for (let i = 1; i < reptile.segments.length; i += 2) {
    ctx.lineTo(reptile.segments[i].x, reptile.segments[i].y);
  }
  ctx.strokeStyle = "#1F7F1F";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Legs
  for (let i = 5; i < reptile.segments.length; i += 5) {
    const seg = reptile.segments[i];
    const next = reptile.segments[i - 1];
    const dx = next.x - seg.x;
    const dy = next.y - seg.y;
    const angle = Math.atan2(dy, dx);

    drawLeg(seg.x, seg.y, angle + Math.PI / 2);
    drawLeg(seg.x, seg.y, angle - Math.PI / 2);
  }

  // Head
  ctx.beginPath();
  ctx.arc(reptile.head.x, reptile.head.y, 15, 0, Math.PI * 2);
  ctx.fillStyle = "#4FDF4F";
  ctx.fill();

  // Eye — very subtle tracking
  const eyeOffsetX = (mouse.x - reptile.head.x) * 0.015;
  const eyeOffsetY = (mouse.y - reptile.head.y) * 0.015;

  ctx.beginPath();
  ctx.arc(reptile.head.x + 6 + eyeOffsetX, reptile.head.y - 5 + eyeOffsetY, 3, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  // Draw pointer last
  drawArrowPointer();
}

function drawLeg(x, y, angle) {
  const legLength = 15;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * legLength, y + Math.sin(angle) * legLength);
  ctx.strokeStyle = "#3FBF3F";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function animate() {
  if (gameStarted) {
    drawReptile();
  } else {
    ctx.clearRect(0, 0, width, height);
  }
  requestAnimationFrame(animate);
}

animate();
