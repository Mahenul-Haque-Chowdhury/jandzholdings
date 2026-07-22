'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function RandomTextReveal({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll('.char');
      if (!chars?.length) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          chars,
          { opacity: 0.08 },
          {
            opacity: 1,
            duration: 1,
            stagger: {
              each: 0.03,
              from: 'random',
            },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 82%',
              once: true,
            },
          },
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(chars, { opacity: 1 });
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {text.split('').map((char, index) => (
        <span key={index} className="char" style={{ display: 'inline-block', opacity: 0.08 }}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </div>
  );
}
