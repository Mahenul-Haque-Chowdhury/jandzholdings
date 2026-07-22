"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";
import { isPreloaderReady, subscribePreloaderDone } from "@/lib/preloader";

gsap.registerPlugin(useGSAP);

const menu = [
  { label: "Home", href: "#", children: [] as string[] },
  { label: "About", href: "#", children: ["Our Story", "Leadership", "Why us?"] },
  { label: "Projects", href: "#", children: ["Ongoing", "Upcoming", "Handover"] },
  { label: "Landowners", href: "#", children: [] as string[] },
  { label: "Gallery", href: "#", children: [] as string[] },
  { label: "News", href: "#", children: [] as string[] },
  { label: "Career", href: "#", children: ["Job listing", "Apply page"] },
];

function getLenis() {
  return (window as Window & { __lenis?: Lenis }).__lenis;
}

export default function Navbar() {
  const containerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuTlRef = useRef<gsap.core.Timeline | null>(null);
  const [ready, setReady] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

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

  useEffect(() => {
    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      setIsScrolled(currentScrollY > 12);

      if (currentScrollY <= 12) {
        setIsHidden(false);
      } else if (delta > 8) {
        setIsHidden(true);
      } else if (delta < -8) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(updateScrollState);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Freeze page scroll while the overlay menu is open.
  useEffect(() => {
    const lenis = getLenis();

    if (isMenuOpen) {
      lenis?.stop();
      document.documentElement.classList.add("scroll-freeze");
    } else {
      lenis?.start();
      document.documentElement.classList.remove("scroll-freeze");
    }

    return () => {
      lenis?.start();
      document.documentElement.classList.remove("scroll-freeze");
    };
  }, [isMenuOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  // Header intro
  useGSAP(
    () => {
      if (!ready) return;
      const tl = gsap.timeline();

      tl.fromTo(
        ".nav",
        {
          yPercent: -100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        1.0,
      );

      tl.fromTo(
        ".nav-line",
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        1.6,
      );
    },
    { scope: containerRef, dependencies: [ready] },
  );

  // Overlay menu timeline — built once, played/reversed on toggle.
  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tl = gsap.timeline({ paused: true });

      if (reduceMotion) {
        tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
      } else {
        tl.fromTo(
          overlay,
          { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 1 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.85,
            ease: "power3.inOut",
          },
        )
          .fromTo(
            ".menu-row-inner",
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.07,
              ease: "power3.out",
            },
            0.3,
          )
          .fromTo(
            ".menu-meta",
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.55,
          );
      }

      menuTlRef.current = tl;

      return () => {
        menuTlRef.current = null;
      };
    },
    { scope: overlayRef },
  );

  useEffect(() => {
    const tl = menuTlRef.current;
    if (!tl) return;

    if (isMenuOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.6).reverse();
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  return (
    <>
    <header
      className={`header${isHidden && !isMenuOpen ? " is-hidden" : ""}${isScrolled ? " is-scrolled" : ""}`}
      ref={containerRef}
      style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none", zIndex: 110 }}
    >
      <div className="nav w-nav" role="banner" data-hero="nav">
        <div className="nav-overlay"></div>
        <div className="relative z-95 mx-auto flex w-full max-w-440 items-center justify-between px-5 py-4 md:px-12 md:py-5">
          <a
            href="#"
            aria-label="J&Z Holdings logo"
            className="inline-flex shrink-0 items-center"
          >
            <Image
              src="/jandz-logo.png"
              alt="J&Z Holdings"
              width={400}
              height={188}
              className="h-auto w-24 md:w-36"
              priority
            />
          </a>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="#book-a-visit"
              className="btn stroke-btn hidden items-center justify-center border border-white/80 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition-colors duration-300 hover:bg-white hover:text-black md:inline-flex"
            >
              Book a visit
            </a>
            <button
              type="button"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
              className="group inline-flex h-11 w-11 items-center justify-center transition-colors duration-300 hover:bg-white/10 md:h-12 md:w-12"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 top-0 block h-0.5 bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? "w-full translate-y-[5.5px] rotate-45" : "w-full group-hover:translate-y-[-1.5px]"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-0.5 bg-white transition-all duration-300 ease-out ${
                    isMenuOpen ? "w-full translate-y-[-5.5px] -rotate-45" : "w-2/3 group-hover:translate-y-[1.5px]"
                  }`}
                />
              </span>
            </button>
          </div>

          <div
            data-hero="line"
            className="nav-line absolute inset-x-5 bottom-0 z-0 h-px bg-white/25 md:inset-x-12"
            style={{ transformOrigin: "center" }}
          ></div>
        </div>
      </div>
    </header>

      {/* Full-screen overlay menu — sibling of the header: the header is
          CSS-transformed, which would trap position:fixed descendants. */}
      <div
        ref={overlayRef}
        aria-hidden={!isMenuOpen}
        className="fixed inset-0 z-90 invisible bg-[#0a0d0f]/97 backdrop-blur-xl"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pb-6 pt-24 md:px-12 md:pb-10 md:pt-28">
          <nav
            role="navigation"
            className="min-h-0 flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            <ul role="list">
              {menu.map((item, index) => (
                <li key={item.label}>
                  <div className="overflow-hidden">
                    <div className="menu-row-inner flex flex-col gap-1 py-3 md:flex-row md:items-baseline md:justify-between md:py-[1.4vh]">
                      <a
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="group inline-flex items-baseline gap-4 text-white md:gap-6"
                      >
                        <span className="text-[0.65rem] tracking-[0.3em] text-white/40">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-[clamp(1.6rem,5.2vh,2.9rem)] leading-none tracking-[-0.02em] transition-transform duration-300 ease-out group-hover:translate-x-3">
                          {item.label}
                        </span>
                      </a>
                      {item.children.length > 0 ? (
                        <div className="flex flex-wrap gap-x-5 gap-y-1 pl-9 md:justify-end md:pl-0">
                          {item.children.map((child) => (
                            <a
                              key={child}
                              href="#"
                              onClick={() => setIsMenuOpen(false)}
                              className="text-[0.68rem] uppercase tracking-[0.24em] text-white/50 transition-colors duration-300 hover:text-white"
                            >
                              {child}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-end md:justify-between">
            <div className="menu-meta text-[0.7rem] uppercase tracking-[0.24em] text-white/50">
              House 15, Road 15, Sector 4, Uttara, Dhaka-1230
              <br />
              info@jandzholdings.com
            </div>
            <a
              href="#book-a-visit"
              onClick={() => setIsMenuOpen(false)}
              className="menu-meta inline-flex items-center gap-3 rounded-full border border-white/30 px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Book a visit
              <span className="text-sm">→</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
