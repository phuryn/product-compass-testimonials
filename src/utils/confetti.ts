import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  const defaults = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'] as Shape[],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  };

  confetti(defaults);
};

type Shape = 'square' | 'star' | 'circle';