'use client';

interface CharStaggerProps {
  children: string;
  className?: string;
}

export default function CharStagger({ children, className }: CharStaggerProps) {
  return (
    <span className={`char-stagger-wrap${className ? ` ${className}` : ''}`}>
      {[...children].map((ch, i) => (
        <span
          key={i}
          style={{
            transitionDelay: `${i * 0.015}s`,
            ...(ch === ' ' ? { whiteSpace: 'pre' } : {}),
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
