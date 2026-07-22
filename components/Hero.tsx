"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isPreloaderReady, subscribePreloaderDone } from "@/lib/preloader";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  useEffect(() => {
    if (ready && canPlayVideo) {
      return;
    }

    if (isPreloaderReady()) {
      const frameId = window.requestAnimationFrame(() => {
        setReady(true);
        setCanPlayVideo(true);
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    return subscribePreloaderDone(() => {
      setReady(true);
      setCanPlayVideo(true);
    });
  }, [canPlayVideo, ready]);

  useGSAP(
    () => {
      if (!ready) return;
      const hero = containerRef.current;
      if (!hero) return;
      const tl = gsap.timeline();

      // 1. Title characters - slide up
      tl.fromTo(
        ".hero-char",
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          duration: 1.6,
          stagger: 0.055,
          ease: "expo.out",
        },
        0,
      );

      // 2. Subtitle words - fade + rotate in
      tl.fromTo(
        ".hero-word",
        {
          opacity: 0,
          y: 30,
          rotationX: -45,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.9,
          stagger: 0.03,
          ease: "power3.out",
        },
        0.35,
      );

      // 3. Description paragraph - fade up
      tl.fromTo(
        '[data-hero="subtitle"]',
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        0.6,
      );

      // 4. Scroll indicator - fade up
      tl.fromTo(
        '[data-hero="scroll"]',
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.9,
      );

      // Scroll Parallax (GSAP + SCROLLTRIGGER)
      const heroImg = hero.querySelector<HTMLElement>(".hero-img");
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: 30,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      const heroTitle = hero.querySelector<HTMLElement>(".hero-title");
      if (heroTitle) {
        gsap.to(heroTitle, {
          yPercent: -50,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      const heroRight = hero.querySelector<HTMLElement>(".hero-right");
      if (heroRight) {
        gsap.to(heroRight, {
          yPercent: -30,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

    },
    { scope: containerRef, dependencies: [ready] },
  );

  const renderSplitText = (text: string, keyPrefix: string) => {
    return text.split("").map((char, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        style={{
          display: "inline-block",
          overflow: "hidden",
          padding: "0.3em 0.1em",
          margin: "-0.3em -0.1em",
        }}
      >
        <span
          className="hero-char"
          style={{
            display: "inline-block",
            lineHeight: "1.2", // Give space for descenders/ascenders
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));
  };

  // Split string into words wrapper
  const wrapWords = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span
        key={i}
        className="hero-word"
        style={{ display: "inline-block", marginRight: "0.25em" }}
      >
        {word}
      </span>
    ));
  };

  return (
    <section className="hero" ref={containerRef}>
      <div className="page-padding">
        <div className="container">
          <div className="wrap hero-wrap">
            <div className="heading hero-heading">
              <h1
                data-hero="title"
                className="h1 hero-title"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                  opacity: ready ? 1 : 0,
                }}
              >
                <span style={{ fontSize: "1.08em", lineHeight: "0.8" }}>
                  {renderSplitText("RETURN", "l1")}
                </span>
                <span style={{ fontSize: "0.66em", lineHeight: "1.05", marginTop: "-0.05em" }}>
                  {renderSplitText("TO YOURSELF", "l2")}
                </span>
              </h1>
              <div
                data-hero="content"
                className="hero-right"
                style={{ marginTop: "21vh", opacity: ready ? 1 : 0 }}
              >
                <div
                  className="hero-right-heading"
                  style={{ perspective: "400px" }}
                >
                  <div
                    data-hero="title-min"
                    className="h6 mob-h7"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      fontFamily: '"Inter", sans-serif',
                      fontStyle: "normal",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {wrapWords("trusted real estate")}
                    <span
                      className="span-inline-block hero-word"
                      style={{ display: "inline-block", marginRight: "0.25em" }}
                    >
                      expert in
                    </span>
                    {wrapWords("bangladesh")}
                  </div>
                  <p data-hero="subtitle" className="b3">
                    Welcome to J&amp;Z Holdings Ltd. We build a sustainable
                    and affordable world, delivering residential and
                    commercial spaces with satisfaction at every step.
                  </p>
                </div>
                <div data-hero="scroll" className="text-btn-01">
                  SCROLL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-hero="bg" className="full-bg-wrap">
        <div data-hero="img" className="full-bg-inner hero-img">
            <div
              data-poster-url="/poster2.png"
              data-video-urls="/video2_1_1.mp4"
            data-autoplay="true"
            data-loop="false"
            data-wf-ignore="true"
            className="video w-background-video w-background-video-atom"
          >
            {!canPlayVideo ? (
              <div
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: "100%",
                     backgroundImage: 'url("/poster2.png")',
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            ) : (
              <video
                id="b7729ca5-13f1-6b61-c831-1c4b79735cb2-video"
                autoPlay
                   poster="/poster2.png"
                style={{
                     backgroundImage: 'url("/poster2.png")',
                }}
                muted
                playsInline
                data-wf-ignore="true"
                data-object-fit="cover"
              >
                <source
                  src="/video2_1_1.mp4"
                  type="video/mp4"
                  data-wf-ignore="true"
                />
              </video>
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.38)",
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}
