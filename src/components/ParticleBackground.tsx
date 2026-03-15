import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const numParticles = 50; // Adjust density
      for (let i = 0; i < numParticles; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const particleColor = theme === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.5)";

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${p.size * 2}px ${particleColor}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

