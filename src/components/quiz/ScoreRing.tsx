import { useEffect, useState } from 'react';

const SIZE = 148;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreRing({ percentage }: { percentage: number }) {
  // Start empty and fill on mount; the transition is disabled for reduced motion.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(percentage));
    return () => cancelAnimationFrame(id);
  }, [percentage]);

  return (
    <div className="relative grid size-[148px] shrink-0 place-items-center" role="img" aria-label={`Score: ${percentage} percent`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90" aria-hidden>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--surface-sunken)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shown / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span aria-hidden className="absolute font-mono text-3xl font-medium tracking-tight text-fg">
        {percentage}%
      </span>
    </div>
  );
}
