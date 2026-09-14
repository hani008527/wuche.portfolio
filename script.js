const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = innerWidth / 2, mouseY = innerHeight / 2, ringX = mouseX, ringY = mouseY;

addEventListener('mousemove', (event) => {
  mouseX = event.clientX; mouseY = event.clientY;
  dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
});

document.querySelectorAll('a, .project').forEach((item) => {
  item.addEventListener('mouseenter', () => ring.classList.add('active'));
  item.addEventListener('mouseleave', () => ring.classList.remove('active'));
});

function animateCursor() {
  ringX += (mouseX - ringX) * .14; ringY += (mouseY - ringY) * .14;
  ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
setTimeout(() => document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible')), 120);

const canvas = document.querySelector('#particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resize() {
  canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(innerWidth / 13)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
    r: Math.random() * 1.5 + .4
  }));
}
function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = '#111'; ctx.fill();
    particles.slice(i + 1).forEach(q => {
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 100) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(17,17,17,${(1-d/100)*.12})`; ctx.stroke(); }
    });
  });
  requestAnimationFrame(draw);
}
addEventListener('resize', resize); resize(); draw();

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.15}px, ${(e.clientY-r.top-r.height/2)*.15}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

document.querySelectorAll('.project-visual').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    el.style.transform = `perspective(900px) rotateY(${x*3}deg) rotateX(${-y*3}deg)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});
