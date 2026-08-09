import { useState, useCallback } from 'react';
import './AdazahiEasterEgg.css';

export function AdazahiEasterEgg() {
  const [hearts, setHearts] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = {
      id: Date.now() + Math.random(),
      x: x !== undefined && !isNaN(x) ? x : rect.width / 2,
      y: y !== undefined && !isNaN(y) ? y : 0,
      randomOffset: (Math.random() - 0.5) * 20, // subtle horizontal drift
    };

    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  }, []);

  return (
    <div
      className="adazahi-easter-egg"
      data-testid="adazahi-easter-egg"
      onClick={handleClick}
      title="Click me! ❤️"
      role="button"
      tabIndex={0}
    >
      <img
        src="/backgrounds/easteregg-adazahi.webp"
        alt="Adazahi Easter Egg"
        className="adazahi-avatar"
      />

      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            '--drift': `${heart.randomOffset}px`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
