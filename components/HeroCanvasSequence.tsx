"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { requestScrollRefresh } from "@/lib/scrollRefresh";

gsap.registerPlugin(ScrollTrigger);

// ---- Tunable constants -----------------------------------------------
const FRAME_COUNT = 96;
const FRAME_PATH = (index: number) =>
  `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;

// How much scroll distance (in viewport heights) the scrub covers.
const SCRUB_DISTANCE_VH = 300;
// GSAP ScrollTrigger `scrub` value: `true` = tied 1:1 to scroll,
// a number = seconds of smoothing lag.
const SCRUB_SMOOTHING: number | true = 0.4;
// -----------------------------------------------------------------------

export default function HeroCanvasSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef({ index: 0 });
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload all frames before enabling scroll interaction.
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount += 1;
        setLoaded(loadedCount);
        if (loadedCount === FRAME_COUNT) {
          setReady(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount += 1;
        setLoaded(loadedCount);
        if (loadedCount === FRAME_COUNT) {
          setReady(true);
        }
      };
      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw the current frame onto the canvas with "cover" scaling.
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !wrapper || !img || !img.complete || img.naturalWidth === 0) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = wrapper.clientWidth;
    const ch = wrapper.clientHeight;

    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = cw / ch;

    // Cover-fit: fills the box on the constraining axis and crops the
    // other. The source footage frames its subject with generous margin,
    // so this no longer cuts into the building.
    let drawWidth: number;
    let drawHeight: number;

    if (imgRatio > boxRatio) {
      drawHeight = ch;
      drawWidth = ch * imgRatio;
    } else {
      drawWidth = cw;
      drawHeight = cw / imgRatio;
    }

    const dx = (cw - drawWidth) / 2;
    const dy = (ch - drawHeight) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  };

  // Set up ScrollTrigger scrubbing once frames are ready.
  useEffect(() => {
    if (!ready) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    drawFrame(0);

    const obj = frameRef.current;
    obj.index = 0;

    const tween = gsap.to(obj, {
      index: FRAME_COUNT - 1,
      ease: "none",
      snap: "index",
      onUpdate: () => drawFrame(Math.round(obj.index)),
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: `+=${SCRUB_DISTANCE_VH}%`,
        scrub: SCRUB_SMOOTHING,
        pin: true,
        anticipatePin: 1,
      },
    });

    // The pin adds 300vh of scroll distance only once frames finish loading.
    // Every ScrollTrigger created before that (About, Projects, Beliefs, ...)
    // was measured against a shorter document, so their start/end points are
    // now wrong — request a refresh once the pin spacer exists. Coalesced
    // with Stats3D/Animations' own requests so only one refresh actually
    // runs, after every async layout change has landed.
    requestScrollRefresh();

    const handleResize = () => drawFrame(Math.round(obj.index));
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ready]);

  const progress = FRAME_COUNT > 0 ? Math.round((loaded / FRAME_COUNT) * 100) : 0;

  return (
    <section
      ref={wrapperRef}
      className="hero-canvas relative h-[100svh] w-full overflow-hidden bg-[#0a0d0f]"
      style={{ willChange: "transform" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {!ready ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#0a0d0f] text-white">
          <div className="text-xs uppercase tracking-[0.3em] text-white/60">
            Loading {progress}%
          </div>
          <div className="h-px w-40 bg-white/15">
            <div
              className="h-full bg-white transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
