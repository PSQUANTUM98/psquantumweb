// Safe update: fixes EmailJS only, keeps all existing visuals/behavior unchanged.

// ===== HEADER SCROLL EFFECT =====
window.addEventListener("scroll", () => {
const header = document.getElementById("header");
if (header) header.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById("bgCanvas");
if (canvas) {
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];
class Particle {
constructor(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.vx=(Math.random()-0.5)*0.6;this.vy=(Math.random()-0.5)*0.6;this.radius=Math.random()*2;}
move(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>canvas.width)this.vx*=-1;if(this.y<0||this.y>canvas.height)this.vy*=-1;}
draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fillStyle="#00c6ff";ctx.fill();}
}
function initParticles(){particles=[];for(let i=0;i<120;i++)particles.push(new Particle());}
function connectParticles(){for(let i=0;i<particles.length;i++){for(let j=i;j<particles.length;j++){let dx=particles[i].x-particles[j].x;let dy=particles[i].y-particles[j].y;let dist=Math.sqrt(dx*dx+dy*dy);if(dist<120){ctx.beginPath();ctx.strokeStyle="rgba(0,198,255,0.08)";ctx.lineWidth=1;ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}}}}
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.move();p.draw();});connectParticles();requestAnimationFrame(animate);}
initParticles();animate();
window.addEventListener("resize",()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;initParticles();});
}

// ===== EMAILJS FIX ONLY =====
document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs === "undefined") return;

  emailjs.init("76Jx2uRdBIqWvu8gY");

  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const toEmail = form.to ? form.to.value.trim() : "psquantum@proton.me";

    emailjs.send("service_6a7invr", "template_7wyxz5ab", {
      from_name: form.name.value.trim(),
      reply_to: form.email.value.trim(),
      message: form.message.value.trim(),

      // Send both versions so EmailJS template will always match
      to: toEmail,
      to_email: toEmail
    })
    .then(function(){
      alert("Message sent successfully!");
      form.reset();
    })
    .catch(function(error){
      console.error(error);
      alert("Failed to send message.");
    });
  });
});
