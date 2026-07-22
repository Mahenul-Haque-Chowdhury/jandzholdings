"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RandomTextReveal } from "@/components/ui/RandomTextReveal";
import { EASE, DUR } from "@/lib/motion";
import { onceLayoutSettled } from "@/lib/scrollRefresh";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projects = [
  {
    title: "SA Crown Palace",
    description:
      "A commercial-cum-residential landmark in Cumilla spanning 2,30,000 sft, combining retail galleria, business suites, and 80 refined apartments across two towers.",
    image: "/stock/project-crown-palace.jpg",
  },
  {
    title: "Farid Chairman River Valley",
    description:
      "A riverside residential development offering a wholesome blend of comfort and nature, crafted for quiet routines and restorative living.",
    image: "/stock/project-river-valley.jpg",
  },
  {
    title: "Srotadhara",
    description: "An upcoming residential project in Hajiganj, built for families seeking affordable, sustainable living.",
    image: "/stock/project-srotadhara.jpg",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const [layoutSettled, setLayoutSettled] = useState(false);

  // Hero's canvas sequence and Stats3D's 3D scene both add scroll distance
  // above this section once their async content loads. A ScrollTrigger
  // created before that (which useGSAP does, on mount) can end up with a
  // stale pin start that plain ScrollTrigger.refresh() does not correct in
  // place. Re-running this hook after layout settles reverts and recreates
  // the trigger from scratch, guaranteeing a correct measurement.
  useEffect(() => onceLayoutSettled(() => setLayoutSettled(true)), []);

  useGSAP(
    () => {
      const stage = containerRef.current?.querySelector<HTMLElement>(".projects-stage");
      if (!stage) return;

      // Explicitly kill any prior ScrollTrigger on this exact element. When
      // this hook re-runs after layoutSettled flips, gsap.matchMedia()'s own
      // cleanup lifecycle is not reliably torn down by useGSAP's automatic
      // scope revert, which previously left a stale, incorrectly-positioned
      // trigger running alongside the freshly created one.
      ScrollTrigger.getAll()
        .filter((t) => t.trigger === stage)
        .forEach((t) => t.kill());

      const slides = gsap.utils.toArray<HTMLElement>(".project-slide", stage);
      const counter = stage.querySelector<HTMLElement>(".project-counter");
      const progressFill = stage.querySelector<HTMLElement>(".project-progress-fill");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Copy and framed image of every slide after the first start hidden
        // (autoAlpha also disables pointer events, so buried CTAs can't
        // swallow clicks and stacked images can't bleed through on fast
        // or non-linear scrub).
        slides.forEach((slide, index) => {
          if (index === 0) return;
          gsap.set(slide.querySelectorAll("[data-slide-item]"), { autoAlpha: 0, y: 48 });
          const media = slide.querySelector<HTMLElement>(".project-media");
          if (media) gsap.set(media, { autoAlpha: 0 });
        });

        // First slide entrance (one-shot, before the pin engages). This hook
        // re-runs after layoutSettled flips (see comment below), which tears
        // down and recreates this ScrollTrigger. If the page has already
        // scrolled past "top 70%" by that second run, a fresh trigger is
        // created in an already-passed state and never fires, leaving the
        // text stuck at opacity 0. Checking the trigger's start position
        // against current scroll immediately after creation and jumping the
        // tween to completion covers that case.
        const firstItems = slides[0]?.querySelectorAll<HTMLElement>("[data-slide-item]");
        if (firstItems?.length) {
          const firstEntrance = gsap.fromTo(
            firstItems,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: DUR.base,
              stagger: 0.1,
              ease: EASE.out,
              scrollTrigger: {
                trigger: stage,
                start: "top 70%",
              },
            },
          );

          const st = firstEntrance.scrollTrigger;
          if (st && window.scrollY >= st.start) {
            firstEntrance.progress(1);
          }
        }

        // Pinned side-by-side sequence: copy and framed image swap in place,
        // so 4 projects cost ~2.4 screens of scroll.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (counter) {
                const index = Math.min(
                  projects.length - 1,
                  Math.round(self.progress * (projects.length - 1)),
                );
                counter.textContent = String(index + 1).padStart(2, "0");
              }
              if (progressFill) {
                gsap.set(progressFill, { scaleX: self.progress });
              }
            },
          },
        });

        slides.forEach((slide, index) => {
          if (index === 0) return;

          const media = slide.querySelector<HTMLElement>(".project-media");
          const img = slide.querySelector<HTMLElement>(".project-img");
          const items = slide.querySelectorAll<HTMLElement>("[data-slide-item]");
          const prev = slides[index - 1];
          const prevItems = prev.querySelectorAll<HTMLElement>("[data-slide-item]");
          const prevImg = prev.querySelector<HTMLElement>(".project-img");
          const prevMedia = prev.querySelector<HTMLElement>(".project-media");
          const at = index - 1;

          // Outgoing: copy lifts away, image sinks under the wipe.
          // Scale up alongside the shift so the frame edge never shows.
          tl.to(prevItems, { autoAlpha: 0, y: -32, duration: 0.35, stagger: 0.03 }, at);
          if (prevImg) {
            tl.to(prevImg, { yPercent: -5, scale: 1.12, duration: 1 }, at);
          }

          // Incoming: frame wipes up from the bottom while the image settles
          if (media) {
            tl.set(media, { autoAlpha: 1 }, at);
            tl.fromTo(
              media,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1 },
              at,
            );
          }
          if (img) {
            // Scale never animates down to exactly 1, object-cover needs a
            // small surplus at every point of the scrub, not just at the
            // resting frame, otherwise a mid-transition scroll position can
            // under-cover the container and reveal its background along an
            // edge (this showed up as a black gap on some aspect ratios).
            tl.fromTo(img, { scale: 1.18, yPercent: 4 }, { scale: 1.06, yPercent: 0, duration: 1 }, at);
          }
          // Once the incoming frame has fully wiped over, hide the previous
          // slide's media entirely so it can't bleed through on fast/non-
          // linear scrub (fast scroll, jump-scroll, or scrollbar drag).
          if (prevMedia) {
            tl.set(prevMedia, { autoAlpha: 0 }, at + 1);
          }
          tl.fromTo(
            items,
            { autoAlpha: 0, y: 48 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power1.out" },
            at + 0.55,
          );
        });

        // Hold the last project on screen for a beat before unpinning
        tl.to({}, { duration: 0.35 });
      });

      // Reduced motion: no pin, no wipes, plain stacked side-by-side blocks.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(stage, { height: "auto", clearProps: "transform" });
        slides.forEach((slide) => {
          gsap.set(slide, { position: "relative", inset: "auto" });
          const media = slide.querySelector<HTMLElement>(".project-media");
          if (media) gsap.set(media, { clipPath: "none" });
          gsap.set(slide.querySelectorAll("[data-slide-item]"), { autoAlpha: 1, y: 0 });
        });
        const rail = stage.querySelector<HTMLElement>(".project-progress");
        if (rail) gsap.set(rail, { display: "none" });
      });

      // gsap.matchMedia() manages its own cleanup lifecycle, separate from
      // useGSAP's scope-based revert. Without this, re-running the hook
      // (e.g. when layoutSettled flips) leaves the previous mm's triggers
      // alive alongside the newly created ones instead of replacing them.
      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [layoutSettled] },
  );

  return (
    <section className="projects" ref={containerRef}>
      <div className="container mx-auto px-6 pt-20 md:px-16 md:pt-32">
        <h1 className="font-serif text-white">
          <span className="block text-[clamp(2.8rem,12vw,4.6rem)] font-semibold leading-[0.92] tracking-[-0.005em] md:text-[clamp(3rem,7vw,7rem)]">
            <RandomTextReveal text="Our Ongoing" className="block" />
            <RandomTextReveal text="Projects" className="block" />
          </span>
        </h1>
      </div>

      <div className="projects-stage relative mt-10 h-svh w-full overflow-hidden bg-[#0e1011] md:mt-20">
        {projects.map((project, index) => (
          <article
            key={project.title}
            className="project-slide pointer-events-none absolute inset-0"
            style={{ zIndex: index + 1 }}
          >
            <div className="container mx-auto grid h-full grid-rows-[minmax(0,42svh)_minmax(0,1fr)] gap-6 px-6 pb-20 pt-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-rows-none md:items-stretch md:gap-16 md:px-16 md:pb-24 md:pt-10">
              {/* Copy */}
              <div className="pointer-events-auto order-2 flex flex-col justify-start text-white md:order-1 md:justify-center">
                <div
                  data-slide-item
                  className="flex items-baseline gap-4 text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/60 md:text-xs"
                >
                  <span className="font-serif text-base tracking-normal text-white md:text-lg">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-14 self-center bg-white/40 md:w-20" />
                  <span>Ongoing</span>
                </div>

                <h2
                  data-slide-item
                  className="mt-5 font-serif tracking-tight md:mt-8"
                  style={{
                    fontSize: "clamp(2.1rem, 8.5vw, 4rem)",
                    lineHeight: "1",
                  }}
                >
                  {project.title}
                </h2>

                <p
                  data-slide-item
                  className="mt-4 max-w-xl text-sm leading-6 text-white/80 md:mt-6 md:text-lg md:leading-relaxed"
                >
                  {project.description}
                </p>

                <div data-slide-item className="mt-6 md:mt-9">
                  <a
                    href="#"
                    className="btn stroke-btn inline-flex items-center justify-center border border-white/80 px-6 py-3 text-white transition-colors hover:bg-white hover:text-black md:px-8 md:py-3.5"
                  >
                    <div className="text-btn-01">LEARN MORE</div>
                  </a>
                </div>
              </div>

              {/* Framed image */}
              <div className="order-1 relative h-full min-h-0 md:order-2 md:h-full">
                <div
                  className="project-media absolute inset-0 overflow-hidden rounded-2xl will-change-transform md:rounded-3xl"
                  style={index > 0 ? { clipPath: "inset(100% 0% 0% 0%)" } : undefined}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="project-img img-full-cover object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute inset-0 rounded-2xl border border-white/10 md:rounded-3xl" />
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Index + progress rail */}
        <div className="project-progress absolute inset-x-6 bottom-7 z-20 flex items-center gap-4 text-white md:inset-x-16 md:bottom-10">
          <span className="project-counter font-serif text-sm md:text-base">01</span>
          <div className="relative h-px flex-1 overflow-hidden bg-white/20">
            <div
              className="project-progress-fill absolute inset-0 origin-left bg-white"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span className="font-serif text-sm text-white/50 md:text-base">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-6 py-14 md:px-16 md:py-20">
          <div className="flex items-center justify-center">
            <a
              href="#"
              style={{ color: "#0b0f10" }}
              className="group inline-flex items-center gap-4 rounded-full border-2 border-[#0b0f10] bg-white px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.24em] transition-all duration-300 hover:bg-[#0b0f10] hover:text-white! md:px-8 md:py-4 md:text-[11px] md:tracking-[0.26em]"
            >
              Explore All Projects
              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
