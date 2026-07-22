function initHeroAnimation() {
  const titleSplit = new SplitText('[data-hero="title"]', { type: 'chars', charsClass: 'char', mask: "chars" });
  const subtitleSplit = new SplitText('[data-hero="title-min"]', { type: 'words', wordsClass: 'word' });

  gsap.set(titleSplit.chars, { yPercent: 100 });
  gsap.set(subtitleSplit.words, { opacity: 0, y: 30, rotationX: -45 });
  gsap.set('[data-hero="subtitle"]', { opacity: 0, y: 40 });
  gsap.set('[data-hero="scroll"]', { opacity: 0, y: 20 });
  gsap.set('[data-hero="nav"]', { opacity: 0, yPercent: -100 });
  gsap.set('[data-hero="line"]', { opacity: 0, scaleX: 0 });

  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to(titleSplit.chars, { yPercent: 0, duration: 2, stagger: { each: 0.1 } }, 0.8)
    .to(subtitleSplit.words, { opacity: 1, y: 0, rotationX: 0, duration: 1.2, stagger: 0.04 }, 1.6)
    .to('[data-hero="subtitle"]', { opacity: 1, y: 0, duration: 1.5 }, 2)
    .to('[data-hero="scroll"]', { opacity: 1, y: 0, duration: 1 }, 2.8)
    .to('[data-hero="nav"]', { opacity: 1, yPercent: 0, duration: 1 }, 2.8)
    .to('[data-hero="line"]', { opacity: 1, scaleX: 1, duration: 1 }, 4);

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.to('[data-hero="img"]', { yPercent: progress * 30, scale: 1 + progress * 0.1, ease: 'none', duration: 0 });
      gsap.to('[data-hero="title"]', { yPercent: progress * -50, opacity: 1 - progress, ease: 'none', duration: 0 });
      gsap.to('[data-hero="content"]', { yPercent: progress * -30, opacity: 1 - progress * 1.5, ease: 'none', duration: 0 });
    }
  });
}

function initNumberAnim() {
  ScrollTrigger.create({
    trigger: '[data-number]',
    start: '50% bottom',
    once: true,
    onEnter: () => {
      const numberElements = document.querySelectorAll('[data-number]');
      numberElements.forEach(el => {
        const target = parseInt(el.textContent);
        el.textContent = '0';
        gsap.to(el, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            el.textContent = Math.ceil(this.targets()[0].textContent);
          }
        });
      });
    }
  });
}

function simpleFadeIn() {
  let targets = gsap.utils.toArray('[data-fadeIn], [data-anim="element"]');
  targets.forEach((item) => {
    let delayAnim = parseFloat(item.getAttribute('data-anim-delay')) || 0;
    gsap.fromTo(item, { opacity: 0, y: 30 }, {
      scrollTrigger: { trigger: item, start: 'top 95%' },
      opacity: 1,
      y: 0,
      duration: 1,
      delay: delayAnim,
      ease: 'power3.out'
    });
  });
}

function staggerFadeIn() {
  const sections = document.querySelectorAll('[data-stagger-wrap], [data-anim="stagger-wrap"]');
  sections.forEach((section) => {
    const cards = section.querySelectorAll('[data-stagger], [data-anim="stagger"]');
    if (cards.length === 0) return;
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      scrollTrigger: { trigger: section, start: 'top 85%' },
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap !== 'undefined' && typeof SplitText !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initHeroAnimation();
    initNumberAnim();
    simpleFadeIn();
    staggerFadeIn();
    
    gsap.utils.toArray('[data-anim="img-paralax"]').forEach((element) => {
      gsap.to(element, {
        yPercent: 15,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top 45%',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  }
});
