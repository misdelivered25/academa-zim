import { useEffect, useState } from "react";

interface CosmicBackgroundProps {
  showStars?: boolean;
  showShootingStars?: boolean;
  overlayOpacity?: number;
  className?: string;
}

const CosmicBackground = ({
  showStars = true,
  showShootingStars = true,
  overlayOpacity = 60,
  className = "",
}: CosmicBackgroundProps) => {
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; top: string; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    if (showShootingStars) {
      setShootingStars([
        { id: 1, top: "10%", left: "15%", delay: "0s", duration: "3.5s" },
        { id: 2, top: "35%", left: "65%", delay: "1.5s", duration: "4s" },
        { id: 3, top: "65%", left: "25%", delay: "3s", duration: "3s" },
      ]);
    }
  }, [showShootingStars]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {/* Base cosmic gradient */}
      <div className="absolute inset-0 bg-[hsl(270_84%_4%)]" />
      
      {/* Nebula gradients */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse at 15% 20%, hsl(280 84% 35% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, hsl(260 84% 55% / 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, hsl(290 70% 50% / 0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 30%, hsl(270 84% 60% / 0.35) 0%, transparent 45%),
            radial-gradient(circle at 30% 70%, hsl(300 70% 40% / 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 10%, hsl(250 84% 60% / 0.3) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, hsl(280 84% 55% / 0.35) 0%, transparent 45%)
          `,
        }}
      />

      {/* Stars */}
      {showStars && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 70%, white, transparent),
              radial-gradient(1.5px 1.5px at 50% 50%, white, transparent),
              radial-gradient(1px 1px at 80% 10%, white, transparent),
              radial-gradient(2px 2px at 90% 60%, white, transparent),
              radial-gradient(1px 1px at 33% 85%, white, transparent),
              radial-gradient(1.5px 1.5px at 15% 55%, white, transparent),
              radial-gradient(1px 1px at 45% 25%, white, transparent),
              radial-gradient(2px 2px at 75% 45%, white, transparent),
              radial-gradient(1px 1px at 25% 65%, white, transparent)
            `,
            backgroundSize: "250% 250%",
            backgroundPosition: "50% 50%",
          }}
        />
      )}

      {/* Gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `hsl(var(--background) / ${overlayOpacity / 100})`,
        }}
      />

      {/* Shooting stars */}
      {showShootingStars &&
        shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
    </div>
  );
};

export default CosmicBackground;
