"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Beliefs() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef);
      const chars = q(".belief-char");

      gsap.set(chars, { yPercent: 110 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q(".beliefs-hero"),
          start: "top 70%",
        },
      });

      tl.to(chars, {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.018,
        ease: "power3.out",
      })
        .fromTo(
          q(".belief-hero-img"),
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            scale: 1.1,
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            scale: 1,
            duration: 1.15,
            ease: "power3.out",
          },
          "<",
        );
    },
    { scope: containerRef },
  );

  const renderSplitText = (text: string, keyPrefix: string) =>
    text.split("").map((char, index) => (
      <span key={`${keyPrefix}-${index}`} className="inline-block align-top">
        <span className="inline-block overflow-hidden pb-2">
          <span className="belief-char inline-block" style={{ lineHeight: "1.2" }}>
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      </span>
    ));

  return (
    <section
      className="beliefs relative z-10 min-h-[95vh] overflow-hidden bg-[#0e1011]"
      ref={containerRef}
    >
      <div className="relative mx-auto w-full max-w-400 px-6 md:px-12">
        <div className="beliefs-hero relative py-24 md:py-52">
          <div className="pointer-events-none relative z-30 mb-6 w-full text-right md:absolute md:right-0 md:top-0 md:mb-0">
            <div className="text-white/75 text-sm md:text-base font-serif uppercase tracking-[0.3em]">
              (Our Beliefs)
            </div>
          </div>

          <div className="relative -mx-6 mb-10 h-[58svh] w-auto overflow-hidden rounded-2xl border border-white/10 md:absolute md:right-[-4vw] md:top-[12vh] md:mx-0 md:mb-0 md:h-[76vh] md:w-[56%] md:rounded-3xl">
            <Image
              src="/stock/beliefs-hero.jpg"
              alt="J&Z Holdings interior"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 62vw"
              data-anim="img-paralax"
              className="belief-hero-img object-cover"
            />
            <div data-anim="img-overlay-bottom" className="img-overlay absolute inset-0"></div>
          </div>

          <div className="relative z-20 flex w-full max-w-full flex-col justify-center md:max-w-[54%]">
            <div className="text-white/75 font-serif text-xl md:text-2xl tracking-wide">
              {renderSplitText("AT J&Z HOLDINGS", "belief-sub")}
            </div>
            <h1
              className="mt-4 font-serif !text-[clamp(2.35rem,11vw,3.7rem)] leading-[0.92] tracking-[-0.01em] text-white md:!text-[clamp(2.4rem,4.6vw,4.4rem)] md:leading-[0.95]"
            >
              <span className="block md:hidden whitespace-nowrap">
                {renderSplitText("EVERY DETAIL", "belief-m-l1")}
              </span>
              <span className="block md:hidden whitespace-nowrap">
                {renderSplitText("SERVES A LIFE", "belief-m-l2")}
              </span>
              <span className="block md:hidden whitespace-nowrap">
                {renderSplitText("WELL LIVED.", "belief-m-l3")}
              </span>
              <span className="hidden md:block">
                {renderSplitText("EVERY DETAIL", "belief-l1")}
              </span>
              <span className="hidden md:block">
                {renderSplitText("SERVES A LIFE", "belief-l2")}
              </span>
              <span className="hidden md:block">
                {renderSplitText("WELL LIVED.", "belief-l3")}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}