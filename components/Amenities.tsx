"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Amenities() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Hide all slides initially except the first one
      const bigImages = gsap.utils.toArray<HTMLElement>(
        '[data-amenities-anim="big-image"]',
      );
      const smallImages = gsap.utils.toArray<HTMLElement>(
        '[data-amenities-anim="small-image"]',
      );
      const titles = gsap.utils.toArray<HTMLElement>(
        '[data-amenities-anim="title"]',
      );
      const texts = gsap.utils.toArray<HTMLElement>(
        '[data-amenities-anim="text"]',
      );
      const triggers = gsap.utils.toArray<HTMLElement>(
        '[data-amenities-anim="trigger"]',
      );
      const sticky = document.querySelector(
        '[data-amenities-anim="sticky"]',
      ) as HTMLElement;

      if (!sticky || bigImages.length === 0) return;

      gsap.set(bigImages, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(smallImages, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(titles, { yPercent: 50, opacity: 0 });
      gsap.set(texts, { yPercent: 50, opacity: 0 });
      gsap.set(bigImages[0], { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(smallImages[0], { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(titles[0], { yPercent: 0, opacity: 1 });
      gsap.set(texts[0], { yPercent: 0, opacity: 1 });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: ".anim-track",
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: '[data-amenities-anim="sticky"]',
          anticipatePin: 1,
        },
      });

      const totalSlides = bigImages.length;
      for (let i = 0; i < totalSlides - 1; i += 1) {
        const nextIndex = i + 1;
        const position = i * 1;

        master
          .to(titles[i], { yPercent: -50, opacity: 0, duration: 0.8 }, position)
          .to(texts[i], { yPercent: -50, opacity: 0, duration: 0.8 }, position)
          .to(
            bigImages[nextIndex],
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
            position,
          )
          .to(
            smallImages[nextIndex],
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
            position + 0.1,
          )
          .to(
            titles[nextIndex],
            { yPercent: 0, opacity: 1, duration: 0.8 },
            position + 0.05,
          )
          .to(
            texts[nextIndex],
            { yPercent: 0, opacity: 1, duration: 0.8 },
            position + 0.05,
          );
      }
    },
    { scope: containerRef },
  );

  return (
    <section className="amenities bg-[#0e1011]" ref={containerRef}>
      <style>{`
        .anim-track {
          position: relative;
          height: 300vh;
        }
        .amenities-sticky {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
      <div className="anim-track">
        <div data-amenities-anim="sticky" className="amenities-sticky w-full flex items-center relative">

          <div className="container mx-auto px-5 sm:px-6 max-w-7xl h-full flex items-center relative z-20 pointer-events-none">
            {/* Left side: Texts (mobile: top ~44% of the pinned viewport) */}
            <div className="absolute top-0 left-0 w-full h-[44%] pt-6 flex flex-col justify-center px-5 sm:px-6 md:static md:h-full md:w-[45%] lg:w-[40%] md:justify-center md:px-0">
              <div className="relative border-l border-white/50 pl-5 sm:pl-8 md:pl-12 py-4 sm:py-8 md:py-12 h-full md:h-100">

                {/* Slide 1 Text */}
                <div className="absolute top-1/2 left-5 sm:left-8 md:left-12 -translate-y-1/2 w-full pr-4">
                  <div data-amenities-anim="title" className="mb-2 sm:mb-4 md:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-5xl lg:text-[4rem] font-serif uppercase leading-[1.15] md:leading-[1.1] text-white">
                      Wellness-<br className="hidden sm:block"/> Centered<br/>Amenities
                    </h2>
                  </div>
                  <div data-amenities-anim="text" className="text-white/80 text-xs sm:text-sm md:text-lg max-w-sm">
                    <p className="line-clamp-2 sm:line-clamp-none">
                      From private fitness studios to guided meditation sessions, our amenities are designed to enhance your well-being and foster a sense of harmony.
                    </p>
                  </div>
                </div>

                {/* Slide 2 Text */}
                <div className="absolute top-1/2 left-5 sm:left-8 md:left-12 -translate-y-1/2 w-full pr-4 opacity-0">
                  <div data-amenities-anim="title" className="mb-2 sm:mb-4 md:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-5xl lg:text-[4rem] font-serif uppercase leading-[1.15] md:leading-[1.1] text-white">
                      Nature-<br className="hidden sm:block"/> Infused<br/>Retreats
                    </h2>
                  </div>
                  <div data-amenities-anim="text" className="text-white/80 text-xs sm:text-sm md:text-lg max-w-sm">
                    <p className="line-clamp-2 sm:line-clamp-none">
                      Garden pathways, quiet courtyards, and softly landscaped outdoor rooms provide moments of calm and the restorative beauty of nature.
                    </p>
                  </div>
                </div>

                {/* Slide 3 Text */}
                <div className="absolute top-1/2 left-5 sm:left-8 md:left-12 -translate-y-1/2 w-full pr-4 opacity-0">
                  <div data-amenities-anim="title" className="mb-2 sm:mb-4 md:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-5xl lg:text-[4rem] font-serif uppercase leading-[1.15] md:leading-[1.1] text-white">
                      Art<br className="hidden sm:block"/> Inspired<br/>Spaces
                    </h2>
                  </div>
                  <div data-amenities-anim="text" className="text-white/80 text-xs sm:text-sm md:text-lg max-w-sm">
                    <p className="line-clamp-2 sm:line-clamp-none">
                      From artful communal lounges to thoughtfully curated design details, every environment celebrates a rich sense of place.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side anchor for spacing (desktop only) */}
            <div className="hidden md:block w-[55%] lg:w-[60%]"></div>
          </div>

          {/* Images: mobile bottom ~52% of the pinned viewport, desktop right 65% */}
          <div className="absolute right-0 bottom-0 w-full h-[52%] px-5 sm:px-6 pb-4 pointer-events-none z-10 flex items-center md:top-0 md:h-full md:w-[65%] md:px-0 md:pb-0">
            <div className="relative w-full h-full md:h-[85%] pr-0 md:pr-[10%] pt-0">

              {/* Slide 1 Images */}
              <div className="absolute inset-0 md:right-[5%] md:left-auto md:top-0 md:h-full md:w-[85%] overflow-hidden rounded-2xl border border-white/10 md:rounded-3xl">
                <Image
                  data-amenities-anim="big-image"
                  className="object-cover"
                  src="/stock/amenity-lobby-big.jpg"
                  alt="Wellness Amenities"
                  fill
                  sizes="(max-width: 768px) 90vw, 55vw"
                />
              </div>
              <div className="hidden md:block absolute right-[60%] lg:right-[65%] top-[15%] w-[45%] h-[70%] max-h-125 overflow-hidden rounded-2xl border border-white/10 shadow-2xl z-10 md:w-[50%]">
                <Image
                  data-amenities-anim="small-image"
                  src="/stock/amenity-lobby-small.jpg"
                  alt=""
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>

              {/* Slide 2 Images */}
              <div className="absolute inset-0 md:right-[5%] md:left-auto md:top-0 md:h-full md:w-[85%] overflow-hidden rounded-2xl border border-white/10 z-5 md:rounded-3xl">
                <Image
                  data-amenities-anim="big-image"
                  className="object-cover"
                  src="/stock/amenity-lounge-big.jpg"
                  alt="Nature retreats"
                  fill
                  sizes="(max-width: 768px) 90vw, 55vw"
                />
              </div>
              <div className="hidden md:block absolute right-[60%] lg:right-[65%] top-[15%] w-[45%] h-[70%] max-h-125 overflow-hidden rounded-2xl border border-white/10 shadow-2xl z-15 md:w-[50%]">
                <Image
                  data-amenities-anim="small-image"
                  src="/stock/amenity-lounge-small.jpg"
                  alt=""
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>

              {/* Slide 3 Images */}
              <div className="absolute inset-0 md:right-[5%] md:left-auto md:top-0 md:h-full md:w-[85%] overflow-hidden rounded-2xl border border-white/10 z-5 md:rounded-3xl">
                <Image
                  data-amenities-anim="big-image"
                  className="object-cover"
                  src="/stock/amenity-pool-big.jpg"
                  alt="Art inspired spaces"
                  fill
                  sizes="(max-width: 768px) 90vw, 55vw"
                />
              </div>
              <div className="hidden md:block absolute right-[60%] lg:right-[65%] top-[15%] w-[45%] h-[70%] max-h-125 overflow-hidden rounded-2xl border border-white/10 shadow-2xl z-15 md:w-[50%]">
                <Image
                  data-amenities-anim="small-image"
                  src="/stock/amenity-pool-small.jpg"
                  alt=""
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>

            </div>
          </div>
        </div>

        <div
          data-amenities-anim="triggers"
          className="absolute top-0 left-0 right-0 h-[300vh] pointer-events-none"
        >
          <div data-amenities-anim="trigger" className="h-screen"></div>
          <div data-amenities-anim="trigger" className="h-screen"></div>
          <div className="h-screen is-last"></div>
        </div>
      </div>
    </section>
  );
}

