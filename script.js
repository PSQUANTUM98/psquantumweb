// Safe update: fixes EmailJS only, keeps all existing visuals/behavior unchanged.

// ===== HEADER SCROLL EFFECT =====
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== PARTICLE BACKGROUND (FIXED) =====
const canvas = document.getElementById("bgCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2;
    }

    move() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00c6ff";
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 120; i++) particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,198,255,0.08)";
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.move();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  initParticles();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });
}

// ===== EMAILJS FIX ONLY =====
document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs === "undefined") return;

  emailjs.init("gxipXwENeTcnBbhmC");

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    emailjs.send("service_6zq3jtd", "template_7wxz5ab", {
      from_name: name,

      // IMPORTANT: send email under multiple names so template always receives it
      reply_to: email,
      from_email: email,
      user_email: email,
      email: email,

      message: message,

      // recipient email
      to_email: "psquantum@proton.me"
    })
    .then(function(){
      alert("Message sent successfully!");
      form.reset();
    })
    .catch(function(error){
      console.error("EmailJS Error:", error);
      alert("Failed to send message.");
    });
  });
});
