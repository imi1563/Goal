import React, { useEffect, useRef } from 'react';

const FootballBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Football class
    class Football {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.bounceCount = 0;
        this.maxBounces = 3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Bounce off edges
        if (this.x <= 0 || this.x >= canvas.width) {
          this.speedX *= -1;
          this.bounceCount++;
        }
        if (this.y <= 0 || this.y >= canvas.height) {
          this.speedY *= -1;
          this.bounceCount++;
        }

        // Reset football if it bounces too many times
        if (this.bounceCount > this.maxBounces) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.bounceCount = 0;
          this.opacity = Math.random() * 0.5 + 0.3;
        }

        // Keep footballs in bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Draw football (soccer ball pattern)
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw football pattern lines
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        
        // Vertical line
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(0, this.size);
        ctx.stroke();
        
        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size, 0);
        ctx.stroke();

        // Diagonal lines
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.7, -this.size * 0.7);
        ctx.lineTo(this.size * 0.7, this.size * 0.7);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(this.size * 0.7, -this.size * 0.7);
        ctx.lineTo(-this.size * 0.7, this.size * 0.7);
        ctx.stroke();

        ctx.restore();
      }
    }

    // Particle class for sparkle effects
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;
        this.color = `hsl(${Math.random() * 60 + 30}, 70%, 60%)`; // Green to yellow
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        if (this.life <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = this.maxLife;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Create footballs and particles
    const footballs = Array.from({ length: 8 }, () => new Football());
    const particles = Array.from({ length: 50 }, () => new Particle());

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(30, 27, 58, 0.1)');
      gradient.addColorStop(0.5, 'rgba(79, 61, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(30, 27, 58, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw footballs
      footballs.forEach(football => {
        football.update();
        football.draw();
      });

      // Draw connecting lines between nearby footballs
      ctx.strokeStyle = 'rgba(79, 61, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < footballs.length; i++) {
        for (let j = i + 1; j < footballs.length; j++) {
          const dx = footballs[i].x - footballs[j].x;
          const dy = footballs[i].y - footballs[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.globalAlpha = (150 - distance) / 150 * 0.3;
            ctx.beginPath();
            ctx.moveTo(footballs[i].x, footballs[i].y);
            ctx.lineTo(footballs[j].x, footballs[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw subtle grid pattern
      ctx.strokeStyle = 'rgba(79, 61, 255, 0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 100;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
        mixBlendMode: 'multiply'
      }}
    />
  );
};

export default FootballBackground;
