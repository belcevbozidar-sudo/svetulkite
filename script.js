// ===== Светулките — interactions =====

document.getElementById('year').textContent = new Date().getFullYear();

// header scroll state
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// mobile nav
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

// reveal-on-scroll for sections
const revealTargets = document.querySelectorAll('.story-text, .story-media, .room-card, .stat-pill, .amenities-content, .amenities-media, .region-media, .region-text, .price-card, .contact-card');
revealTargets.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
});
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ===== Firefly canvas =====
const canvas = document.getElementById('firefly-canvas');
const ctx = canvas.getContext('2d');
let w, h, fireflies = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const FIREFLY_COUNT = window.innerWidth < 700 ? 16 : 30;

function makeFirefly() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 1,
    baseAlpha: Math.random() * 0.5 + 0.4,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.4 + 0.15,
    drift: Math.random() * Math.PI * 2,
    driftSpeed: (Math.random() - 0.5) * 0.015,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  };
}
for (let i = 0; i < FIREFLY_COUNT; i++) fireflies.push(makeFirefly());

let t = 0;
function animate() {
  t += 1;
  ctx.clearRect(0, 0, w, h);
  fireflies.forEach(f => {
    f.drift += f.driftSpeed;
    f.x += f.vx + Math.sin(f.drift) * 0.2;
    f.y += f.vy + Math.cos(f.drift) * 0.15;

    if (f.x < -10) f.x = w + 10;
    if (f.x > w + 10) f.x = -10;
    if (f.y < -10) f.y = h + 10;
    if (f.y > h + 10) f.y = -10;

    const flicker = Math.sin(t * f.speed * 0.05 + f.phase) * 0.5 + 0.5;
    const alpha = f.baseAlpha * flicker;

    const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 6);
    grad.addColorStop(0, `rgba(255,225,138,${alpha})`);
    grad.addColorStop(0.4, `rgba(255,210,100,${alpha * 0.4})`);
    grad.addColorStop(1, 'rgba(255,210,100,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255,245,200,${Math.min(alpha + 0.3, 1)})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
