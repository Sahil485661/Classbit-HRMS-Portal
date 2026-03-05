import './style.css'

// Custom Cursor Trail / Antigravity effect
const follower = document.getElementById('cursor-follower');
const dot = document.getElementById('cursor-dot');

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;
let dotX = 0;
let dotY = 0;

// Lerp constants
const followerLerp = 0.1;
const dotLerp = 0.3;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  // Smoothly interpolate positions
  followerX += (mouseX - followerX) * followerLerp;
  followerY += (mouseY - followerY) * followerLerp;

  dotX += (mouseX - dotX) * dotLerp;
  dotY += (mouseY - dotY) * dotLerp;

  // Apply transformations
  if (follower) {
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
  }

  if (dot) {
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;
  }

  requestAnimationFrame(animate);
}

animate();

// Interaction effects
const interactiveElements = document.querySelectorAll('a, button, .feature-card');

interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    follower.style.width = '80px';
    follower.style.height = '80px';
    follower.style.background = 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)';
  });

  el.addEventListener('mouseleave', () => {
    follower.style.width = '40px';
    follower.style.height = '40px';
    follower.style.background = 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)';
  });
});

// Parallax effect for blobs based on mouse move
window.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  const blobs = document.querySelectorAll('.blob');
  blobs.forEach((blob, index) => {
    const speed = (index + 1) * 20;
    blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

console.log('Classbit Landing Page Initialized');
