"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isPreloaderReady, subscribePreloaderDone } from "@/lib/preloader";
import { onceLayoutSettled } from "@/lib/scrollRefresh";
import { EASE, DUR, STAGGER } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Animations() {
  const [ready, setReady] = useState(false);
  const [layoutSettled, setLayoutSettled] = useState(false);

  useEffect(() => {
    if (ready) {
      return;
    }

    if (isPreloaderReady()) {
      const frameId = window.requestAnimationFrame(() => setReady(true));
      return () => window.cancelAnimationFrame(frameId);
    }

    return subscribePreloaderDone(() => setReady(true));
  }, [ready]);

  // Hero's canvas sequence and Stats3D's 3D scene both add scroll distance
  // above every section here once their async content loads. Entrance
  // triggers created before that (fonts loaded but Hero/Stats3D still
  // pending) can end up with stale start positions that a plain
  // ScrollTrigger.refresh() does not reliably correct in place — leaving
  // elements permanently at opacity:0 because their trigger fires at the
  // wrong scroll offset. Re-run this hook once layout is confirmed settled
  // so every trigger here is created fresh against final positions.
  useEffect(() => onceLayoutSettled(() => setLayoutSettled(true)), []);

  useGSAP(() => {
    if (!ready || !layoutSettled) return;

    // This hook re-runs once layoutSettled flips from false to true. Kill
    // any triggers this same hook created on its first (pre-settle) run —
    // matchMedia manages its own cleanup lifecycle separate from useGSAP's
    // automatic scope revert, so without this, stale triggers from the
    // first run would keep firing alongside the freshly created ones.
    // Scoped to elements this file targets so Hero/Stats3D/Projects'
    // triggers are left untouched.
    ScrollTrigger.getAll()
      .filter((t) => {
        const el = t.trigger as HTMLElement | null;
        return (
          el?.hasAttribute?.("data-anim") ||
          el?.hasAttribute?.("data-number") ||
          el?.hasAttribute?.("data-footer") ||
          el?.querySelector?.('[data-anim="stagger"]') ||
          el?.classList?.contains("footer")
        );
      })
      .forEach((t) => t.kill());

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        '[data-anim="element"], [data-anim="stagger"], [data-anim="slideUp-once"], [data-footer="step-1/2/3"]',
        { opacity: 1, y: 0 },
      );
      gsap.set('[data-anim="img-overlay"], [data-anim="img-overlay-bottom"]', {
        scaleX: 0,
        scaleY: 0,
      });
      gsap.set('[data-footer="line"]', { scaleX: 1 });
      document.querySelectorAll("[data-number]").forEach((el) => {
        el.textContent = el.getAttribute("data-number");
      });
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // General elements - fade in
      gsap.utils.toArray('[data-anim="element"]').forEach((el: any) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          },
        );
      });

      // Stagger groups - cascade fade
      gsap.utils.toArray('[data-anim="stagger-wrap"]').forEach((wrap: any) => {
        const items = wrap.querySelectorAll('[data-anim="stagger"]');
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              stagger: STAGGER.items,
              ease: EASE.out,
              scrollTrigger: {
                trigger: wrap,
                start: "top 85%",
              },
            },
          );
        }
      });

      // Image overlay - wipe reveal from left
      gsap.utils.toArray('[data-anim="img-overlay"]').forEach((overlay: any) => {
        gsap.fromTo(
          overlay,
          { scaleX: 1 },
          {
            scaleX: 0,
            ease: "none",
            transformOrigin: "right",
            scrollTrigger: {
              trigger: overlay.parentElement,
              start: "top 80%",
              end: "top 30%",
              scrub: 0.8,
            },
          },
        );
      });

      // Image overlay - wipe reveal from bottom
      gsap.utils.toArray('[data-anim="img-overlay-bottom"]').forEach((overlay: any) => {
        gsap.fromTo(
          overlay,
          { scaleY: 1 },
          {
            scaleY: 0,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: overlay.parentElement,
              start: "top 80%",
              end: "top 30%",
              scrub: 0.8,
            },
          },
        );
      });

      // Stat counters
      gsap.utils.toArray("[data-number]").forEach((el: any) => {
        const targetNumber = parseFloat(el.getAttribute("data-number"));
        gsap.fromTo(
          el,
          { textContent: "0" },
          {
            textContent: targetNumber,
            duration: 1.8,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      // Custom simple split text for headings - word by word mask reveal
      gsap.utils.toArray<HTMLElement>('[data-anim="split"]').forEach((el) => {
        // Basic text splitting per word
        if (el.children.length > 0) {
          return;
        }
        const text = el.innerText;
        if (!el.hasAttribute("data-split-done") && text.trim().length > 0) {
          el.setAttribute("data-split-done", "true");
          el.innerHTML = "";
          const words = text.split(" ");
          words.forEach((word: string, i: number) => {
            const wrapper = document.createElement("span");
            wrapper.style.display = "inline-block";
            wrapper.style.overflow = "hidden";
            // preserve vertical alignment
            wrapper.style.verticalAlign = "top";

            const inner = document.createElement("span");
            inner.style.display = "inline-block";
            inner.style.transform = "translateY(100%)";
            inner.className = "split-word";
            inner.innerHTML = word + (i < words.length - 1 ? "&nbsp;" : "");

            wrapper.appendChild(inner);
            el.appendChild(wrapper);
          });
        }

        const wordsToAnimate = el.querySelectorAll(".split-word");
        if (wordsToAnimate.length > 0) {
          gsap.to(wordsToAnimate, {
            y: "0%",
            duration: 1.1,
            ease: EASE.expo,
            stagger: STAGGER.words,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
            },
          });
        }
      });

      // slideUp-once
      gsap.utils.toArray('[data-anim="slideUp-once"]').forEach((el: any) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DUR.base,
            ease: EASE.out,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          },
        );
      });

      // Section images parallax
      gsap.utils.toArray('[data-anim="img-paralax"]').forEach((img: any) => {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.12 },
          {
            yPercent: 8,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });

      // Footer lines stagger
      const footer = document.querySelector(".footer");
      if (footer) {
        const footerLines = footer.querySelectorAll('[data-footer="line"]');
        if (footerLines.length > 0) {
          gsap.fromTo(
            footerLines,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: DUR.slow,
              ease: EASE.expo,
              transformOrigin: "left center",
              scrollTrigger: {
                trigger: footer,
                start: "top 80%",
              },
            },
          );
        }

        const footerSteps = footer.querySelectorAll('[data-footer="step-1/2/3"]');
        if (footerSteps.length > 0) {
          gsap.fromTo(
            footerSteps,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: DUR.base,
              ease: EASE.out,
              scrollTrigger: {
                trigger: footer,
                start: "top 80%",
              },
            },
          );
        }
      }
    });

    return () => mm.revert();
  }, { dependencies: [ready, layoutSettled] });

  return null;
}
