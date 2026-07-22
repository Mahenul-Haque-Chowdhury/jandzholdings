Plan: Mobile Responsiveness Refinement
The mobile breakage is coming from a few systemic problems, not just one component: the global font-sizing strategy in globals.css, desktop-only transforms and spacing in Hero.tsx and Navbar.tsx, and sections like Beliefs.tsx, Amenities.tsx, and Stats3D.tsx that rely on off-canvas positioning, sticky scroll behavior, or heavy motion that does not translate to phones. The recommended approach is to fix the responsive foundation first, then repair the above-the-fold experience, then give the motion-heavy sections explicit mobile variants.

Steps

Stabilize the responsive foundation in globals.css. Replace the current dynamic root REM scaling with a stable base, define one consistent breakpoint strategy for phones and tablets, reduce global heading clamps for narrow widths, and replace brittle 100vh assumptions with 100svh or min-height patterns where needed. This step blocks most of the rest.
Normalize the shared wrappers used across page.tsx and the Webflow-derived layout classes they depend on. Reuse what already works, but document and override the classes that currently behave as desktop-first shells.
Repair the navbar and hero first in Navbar.tsx and Hero.tsx. Resize the logo responsively, make the mobile menu touch-safe, remove mobile-breaking transforms and fixed spacing, reduce hero text density, and make the preloader/animation handoff safe on mobile. Reuse the readiness pattern already in preloader.ts.
Rework About.tsx into a true single-column mobile flow. Remove fixed inline margins and oversized inline typography so the heading, image, and copy can stack cleanly.
Rework Beliefs.tsx with a mobile-first image/text stack. On phones, the image should return to normal flow instead of living off-canvas with fixed viewport height; the editorial desktop composition can stay from md upward.
Simplify motion-heavy sections for mobile. In Stats3D.tsx, add a deliberate mobile or low-power fallback instead of forcing the full 3D scene everywhere. In Animations.tsx, gate or reduce expensive scroll-triggered effects on narrow viewports.
Rebuild the highest-risk desktop-first sections into mobile-safe variants. Prioritize Amenities.tsx first because its sticky 300vh treatment is most likely to break mobile scrolling, then address Projects.tsx and CTA.tsx or ContactSection.tsx if they inherit similar spacing and width assumptions.
Do a final usability cleanup in Footer.tsx and any remaining sections: touch interactions, hover-only affordances, internal navigation behavior, and high-impact image sizing issues that still affect responsive layout.
Validate the full page in page.tsx at 360, 375, 390, 430, 768, and 1024 widths, then rerun npm run lint and npm run build.
Relevant files

globals.css — global type scale, overflow, viewport sizing, shared classes
page.tsx — page order and full mobile validation surface
Navbar.tsx — logo scale, mobile menu, touch behavior
Hero.tsx — heading layout, transforms, preloader/animation timing
preloader.ts — animation readiness control point
About.tsx — fixed margins and mobile stacking
Beliefs.tsx — off-canvas image and height assumptions
Animations.tsx — global GSAP behavior on mobile
Stats3D.tsx — mobile fallback for heavy 3D
Amenities.tsx — sticky scroll section needing a mobile variant
Projects.tsx — oversized cards and section height
CTA.tsx — responsive form layout
ContactSection.tsx — downstream spacing and form validation
Footer.tsx — final mobile nav/footer cleanup
Verification

Test section-by-section at 360, 375, 390, 430, 768, and 1024 widths.
Confirm there is no horizontal scroll anywhere on the page.
Confirm navbar/menu/CTA interactions are usable on touch devices.
Confirm preloader and motion do not create clipped text, dead zones, or stalled sections on mobile.
Run npm run lint and npm run build after the responsive pass.
Decisions

Mobile is allowed to simplify desktop interactions when needed.
First pass should cover phones and tablets, 360-1024px.
Desktop visual direction stays intact; this is not a full redesign.
Highest priority is foundation plus above-the-fold, then the sticky/3D sections.
I’ve saved this plan to /memories/session/plan.md. If you approve it, the next agent can execute it section by section.