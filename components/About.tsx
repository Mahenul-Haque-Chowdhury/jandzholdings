"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onceLayoutSettled } from "@/lib/scrollRefresh";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const headingLines = ["THE STORY", "BEHIND", "SUSTAINABLE", "LIVING"];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [layoutSettled, setLayoutSettled] = useState(false);

  // Hero's canvas sequence and Stats3D's 3D scene both add scroll distance
  // above this section once their async content loads. A ScrollTrigger
  // created before that ends up with a stale start position, waiting for
  // layout to settle before creating this section's trigger avoids that.
  useEffect(() => onceLayoutSettled(() => setLayoutSettled(true)), []);

  useGSAP(
    () => {
      if (!layoutSettled) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const chars = gsap.utils.toArray<HTMLElement>(".about-char");
        const image = ".about-img-inner";
        const captionEl = ".about-caption";
        const paragraphs = gsap.utils.toArray<HTMLElement>(".about-paragraph");

        gsap.set(chars, { opacity: 0.08 });
        gsap.set(image, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(captionEl, { opacity: 0, y: 16 });
        gsap.set(paragraphs, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 95%",
            end: "top -40%",
            scrub: 0.6,
          },
        });

        // Heading reveals first, image wipes in next, caption + copy last,
        // all driven directly by scroll position, not a timed autoplay.
        tl.to(chars, { opacity: 1, stagger: { each: 0.015, from: "start" }, ease: "none" }, 0)
          .to(image, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0.35)
          .to(captionEl, { opacity: 1, y: 0, ease: "none" }, 0.7)
          .to(paragraphs, { opacity: 1, y: 0, stagger: 0.08, ease: "none" }, 0.78);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".about-char", { opacity: 1 });
        gsap.set(".about-img-inner", { clipPath: "none" });
        gsap.set(".about-caption, .about-paragraph", { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [layoutSettled] },
  );

  return (
    <section className="about py-20 md:py-32" ref={sectionRef}>
      <div className="page-padding">
        <div className="container mx-auto max-w-7xl px-6 md:px-12">
          <div className="wrap about-wrap">
            <div className="about-info grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-28">
              <div className="about-left flex flex-col gap-12">
                <div className="about-text-box mt-10 md:mt-0" style={{ marginTop: "3rem" }}>
                  <h2
                    className="h5-glare mob-h7 mt-0 text-[clamp(2rem,9vw,3rem)] leading-[0.95] md:text-[clamp(1.6rem,2.1vw,2.25rem)]"
                    style={{
                      marginTop: "0",
                      lineHeight: "0.95",
                      fontFamily: '"Inter", sans-serif',
                      fontStyle: "normal",
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {headingLines.map((line, lineIndex) => (
                      <span key={line} className="inline-flex whitespace-nowrap md:whitespace-normal md:inline-block">
                        {line.split("").map((char, charIndex) => (
                          <span
                            key={`${line}-${charIndex}`}
                            className="about-char"
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? " " : char}
                          </span>
                        ))}
                        {lineIndex < headingLines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h2>
                </div>
                <div className="about-heading mt-0" style={{ marginTop: "0" }}>
                  <div className="about-caption caption">
                    <div
                      className="h6 mob-h8"
                      style={{
                        fontFamily: '"Inter", sans-serif',
                        fontStyle: "normal",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                      }}
                    >
                      (Our Story)
                    </div>
                  </div>
                  <div className="about-text-box mt-2" style={{ marginTop: "0.5rem" }}>
                    <p className="about-paragraph b1 text-base leading-7 md:text-inherit md:leading-inherit">
                      At J&amp;Z Holdings, we believe finding a home is more than a transaction, it is about
                      discovering a place where life's most meaningful moments happen.
                    </p>
                    <p className="about-paragraph b1 mt-5 text-base leading-7 md:text-inherit md:leading-inherit">
                      Since 2021, our mission has stayed the same: to build a sustainable and affordable world,
                      for the people, with satisfaction, connecting families to spaces that resonate with their dreams.
                    </p>
                  </div>
                </div>
              </div>
              <div className="about-img mx-auto w-full overflow-hidden rounded-2xl border border-white/10 md:mx-0 md:rounded-3xl">
                <div className="about-img-inner relative aspect-4/5">
                  <Image
                    src="/stock/about-lobby-portrait.jpg"
                    alt="J&Z Holdings interior living space"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    data-anim="img-paralax"
                    className="img-full-cover object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
