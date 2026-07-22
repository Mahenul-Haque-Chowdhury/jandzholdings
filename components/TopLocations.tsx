"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const locations = [
  {
    title: "Uttara",
    subtitle: "Our corporate office and planned residential access",
    className: "left-[49.5%] top-[32.8%]",
  },
  {
    title: "Cumilla",
    subtitle: "Home to Crown Palace and our regional office",
    className: "left-[44.7%] top-[27.4%]",
  },
  {
    title: "Hajiganj",
    subtitle: "Upcoming Srotadhara residential project",
    className: "left-[57.1%] top-[22.6%]",
  },
  {
    title: "Dharmapur",
    subtitle: "Riverside setting for Farid Chairman River Valley",
    className: "left-[50.3%] top-[27.8%]",
  },
  {
    title: "Dhaka",
    subtitle: "Future-facing growth with family-focused planning",
    className: "left-[68.4%] top-[30.2%]",
  },
];

export default function TopLocations() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(sectionRef);

      gsap.set(q(".locations-copy, .locations-pin"), {
        opacity: 0,
        y: 36,
      });
      gsap.set(
        q(".locations-word"),
        reduceMotion
          ? { opacity: 0 }
          : { yPercent: 115, rotateX: -75, opacity: 0, filter: "blur(10px)" },
      );

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      reveal
        .to(q(".locations-word"), reduceMotion
          ? { opacity: 1, duration: 0.6, stagger: 0.04, ease: "power1.out" }
          : {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              stagger: 0.07,
              ease: "power3.out",
            })
        .to(
          q(".locations-copy"),
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          },
          "<0.15",
        )
        .to(
          q(".locations-pin"),
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "<0.08",
        );

      if (!reduceMotion) {
        q(".locations-pin").forEach((pin, index) => {
          gsap.to(pin, {
            yPercent: index % 2 === 0 ? -6 : 6,
            duration: 3.4 + index * 0.22,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });

        q(".locations-node").forEach((node, index) => {
          gsap.to(node, {
            scale: 1.18,
            opacity: 1,
            duration: 1.1 + index * 0.12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      }
    },
    { scope: sectionRef },
  );

  const toggleLocation = (title: string) => {
    setActiveLocation((current) => (current === title ? null : title));
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white text-[#0b0f10]"
    >
      <div className="relative mx-auto grid max-w-425 lg:grid-cols-[minmax(320px,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">
          <div className="max-w-xl lg:sticky lg:top-28">
            <div className="locations-copy inline-flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.42em] text-[#0b0f10]/45">
              <span className="h-px w-10 bg-[#0b0f10]/20" />
              Top Locations
            </div>

            <h2
              className="locations-heading mt-8 font-serif text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1.08] tracking-[-0.005em] text-[#0b0f10]"
              style={{ perspective: "600px" }}
            >
              {["Chosen for the way", "Bangladesh", "actually grows."].map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line.split(" ").map((word, wordIndex) => (
                    <span
                      key={`${line}-${word}-${wordIndex}`}
                      className="mr-[0.28em] inline-block overflow-hidden pb-1 align-top last:mr-0"
                      style={{ perspective: "600px" }}
                    >
                      <span
                        className="locations-word inline-block"
                        style={{ transformOrigin: "50% 100%" }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <p className="locations-copy mt-8 max-w-md text-sm leading-7 text-[#0b0f10]/70 md:text-[1.02rem] md:leading-8">
              We do not just evaluate land parcels. We study the cadence around them: school runs,
              workday commutes, retail access, green pockets, and the kind of neighborhood energy that
              keeps a home desirable long after launch.
            </p>
          </div>
        </div>

        <div className="relative ml-auto aspect-square w-full max-w-2xl self-start overflow-hidden rounded-2xl border border-[#0b0f10]/10 lg:sticky lg:top-28 lg:rounded-3xl">
          <iframe
            title="Dhaka top locations map"
            src="https://www.google.com/maps?q=23.7986,90.4215&z=13&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.1),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.22))]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white/70 to-transparent" />

          {locations.map((location) => (
            <article key={location.title} className={`locations-pin absolute ${location.className} z-10`}>
              <div className="relative -translate-x-1/2 -translate-y-full">
                {activeLocation === location.title ? (
                  <div className="mb-3 w-48 rounded-2xl bg-[#111517]/92 px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.34)] backdrop-blur-md md:w-52">
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#ff6b6b]">
                      Top Location
                    </div>
                    <h3 className="mt-2 font-serif text-[1.3rem] leading-none tracking-[-0.005em] text-white md:text-[1.45rem]">
                      {location.title}
                    </h3>
                    <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-white/58 md:text-[0.74rem]">
                      {location.subtitle}
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  aria-label={`Show details for ${location.title}`}
                  aria-pressed={activeLocation === location.title}
                  onClick={() => toggleLocation(location.title)}
                  className="group relative block"
                >
                  <span className="absolute left-1/2 top-[48%] h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ea4335]/22 blur-md transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative block h-11 w-8 rounded-full rounded-b-[1.6rem] bg-[#ea4335] shadow-[0_12px_28px_rgba(234,67,53,0.42)] [clip-path:path('M16_0C9.4_0_4_5.4_4_12c0_8.9_9.1_18.5_10.1_19.6a2.6_2.6_0_0_0_3.8_0C18.9_30.5_28_20.9_28_12C28_5.4_22.6_0_16_0Z')]">
                    <span className="absolute left-1/2 top-[0.7rem] h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(234,67,53,0.16)]" />
                  </span>
                </button>

                <div className="locations-node absolute left-1/2 top-[calc(100%+0.3rem)] h-3 w-3 -translate-x-1/2 rounded-full bg-[#0b0f10]/70" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}