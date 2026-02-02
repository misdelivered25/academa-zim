import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
  duration: number;
  shape: "square" | "circle" | "triangle";
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  onComplete?: () => void;
  className?: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(45, 93%, 58%)", // Gold
  "hsl(142, 76%, 42%)", // Green
  "hsl(217, 91%, 60%)", // Blue
  "hsl(346, 77%, 55%)", // Rose
  "hsl(25, 95%, 53%)", // Orange
  "hsl(280, 84%, 60%)", // Purple
];

const SHAPES = ["square", "circle", "triangle"] as const;

const generateConfetti = (count: number): ConfettiPiece[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
  }));
};

const ConfettiPieceComponent = ({ piece }: { piece: ConfettiPiece }) => {
  const shapeStyles = {
    square: "rounded-sm",
    circle: "rounded-full",
    triangle: "clip-triangle",
  };

  return (
    <div
      className={cn(
        "absolute w-3 h-3 pointer-events-none animate-confetti-fall",
        shapeStyles[piece.shape]
      )}
      style={{
        left: `${piece.x}%`,
        top: `${piece.y}%`,
        backgroundColor: piece.color,
        transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
        animationDelay: `${piece.delay}s`,
        animationDuration: `${piece.duration}s`,
        opacity: 0,
      }}
    />
  );
};

export const Confetti = ({
  isActive,
  duration = 4000,
  particleCount = 100,
  onComplete,
  className,
}: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const triggerConfetti = useCallback(() => {
    setPieces(generateConfetti(particleCount));
    setIsVisible(true);

    // Clean up after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      setPieces([]);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, particleCount, onComplete]);

  useEffect(() => {
    if (isActive) {
      return triggerConfetti();
    }
  }, [isActive, triggerConfetti]);

  if (!isVisible || pieces.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-[100] overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <ConfettiPieceComponent key={piece.id} piece={piece} />
      ))}
    </div>
  );
};

// Hook for triggering confetti imperatively
export const useConfetti = () => {
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback(() => {
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
  }, []);

  return { isActive, trigger, reset };
};

export default Confetti;
