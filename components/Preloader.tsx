'use client';
import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add('preloader-active');
    (window as Window & { __preloaderActive?: boolean; __preloaderDone?: boolean }).__preloaderActive = true;
    (window as Window & { __preloaderActive?: boolean; __preloaderDone?: boolean }).__preloaderDone = false;
    return () => {
      root.classList.remove('preloader-active');
      (window as Window & { __preloaderActive?: boolean; __preloaderDone?: boolean }).__preloaderActive = false;
    };
  }, []);

  useGSAP(() => {
    gsap.set(markRef.current, { yPercent: 12, opacity: 0, scale: 0.94 });
    gsap.set(lineRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove('preloader-active');
        (window as Window & { __preloaderActive?: boolean; __preloaderDone?: boolean }).__preloaderActive = false;
        (window as Window & { __preloaderActive?: boolean; __preloaderDone?: boolean }).__preloaderDone = true;
        window.dispatchEvent(new CustomEvent('preloader:done'));
        setComplete(true);
      },
    });

    // Logo settles in with a soft rise and scale, reading as a single
    // confident reveal rather than assembled pieces.
    tl.to(markRef.current, {
      yPercent: 0,
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
    }, 0.15);

    tl.to(lineRef.current, {
      scaleX: 1,
      duration: 0.6,
      ease: 'power3.out',
    }, 0.65);

    // Hold the assembled mark on screen briefly before exit.
    tl.to({}, { duration: 0.6 });

    // Exit: the mark punches forward and fades while the whole panel wipes
    // up, so the reveal feels like one continuous motion rather than two.
    tl.to(markRef.current, {
      scale: 1.06,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, '+=0');

    tl.to(lineRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    }, '<');

    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.1,
      ease: 'power4.inOut',
    }, '-=0.15');

  }, { scope: containerRef });

  if (complete) return null;

  const wrapperStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#121717',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.1rem',
  };

  return (
    <div ref={containerRef} style={wrapperStyle}>
      <div ref={markRef} style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/jandz-logo.png"
          alt="J&Z Holdings"
          width={400}
          height={188}
          priority
          style={{ width: 'clamp(180px, 24vw, 320px)', height: 'auto' }}
        />
      </div>

      <div
        ref={lineRef}
        style={{
          width: 'clamp(120px, 16vw, 220px)',
          height: '1px',
          background: 'rgba(230, 234, 237, 0.4)',
          transformOrigin: '50% 50%',
        }}
      />
    </div>
  );
}
