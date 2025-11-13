"use client";

import { useEffect } from "react";

export const Confetti = () => {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#28a745", "#800000", "#ffc107", "#007bff", "#dc3545"];

    const frame = () => {
      if (Date.now() > end) return;

      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-10px";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "9999";
      confetti.style.opacity = "0.8";

      document.body.appendChild(confetti);

      const animation = confetti.animate(
        [
          {
            transform: `translateY(0) rotate(0deg)`,
            opacity: 1,
          },
          {
            transform: `translateY(${window.innerHeight + 100}px) rotate(${
              Math.random() * 360
            }deg)`,
            opacity: 0,
          },
        ],
        {
          duration: Math.random() * 2000 + 2000,
          easing: "cubic-bezier(0.5, 0, 0.5, 1)",
        }
      );

      animation.onfinish = () => confetti.remove();

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return null;
};
