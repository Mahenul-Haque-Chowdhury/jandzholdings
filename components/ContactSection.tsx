// components/ContactSection.tsx
import Image from "next/image";

export default function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#0b0f10]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-18 lg:px-8 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <div data-anim="element" className="mb-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
              <span className="h-px w-10 bg-white/30" />
              Contact
            </div>
            <h2 data-anim="split" className="font-serif text-white text-[clamp(2.7rem,12vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.005em] md:text-[clamp(3rem,7vw,7rem)]">
              Lets build a sustainable home together.
            </h2>
            <p data-anim="element" className="mt-6 max-w-xl text-sm leading-7 text-white/70 md:text-base md:leading-relaxed">
              Choose the path that fits you best. Whether you are searching for a residence or exploring a land
              partnership, our team will guide you with clarity and care.
            </p>

            <div data-anim="stagger-wrap" className="mt-10 grid gap-6">
              <div data-anim="stagger" className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-white/25 md:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif text-white">Clients</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">Inquiry</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Discover residences crafted for calm, comfort, and lasting value.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white">
                  Start a visit
                  <span className="text-lg">→</span>
                </div>
              </div>

              <div data-anim="stagger" className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-white/25 md:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif text-white">Landowners</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">Partnership</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Bring your land to life with a development partner focused on quality delivery.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white">
                  Share details
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative" data-anim="slideUp-once">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-white">Visit our office</h3>
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">Uttara</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                House # 15, Road # 15, Sector # 04, Uttara, Dhaka-1230
              </p>

              <div className="mt-8 grid gap-4 text-sm text-white/80">
                <div className="flex flex-col gap-1 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
                  <span>Email</span>
                  <span>info@jandzholdings.com</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
                  <span>Phone</span>
                  <span>+88 01897-666617</span>
                </div>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <span>Hours</span>
                  <span>Mon - Fri, 9am - 6:30pm</span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full border border-white/15 bg-white/10" />
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Front Desk</p>
              </div>

              <div className="relative mt-8 aspect-16/10 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/stock/contact-desk.jpg"
                  alt="Concierge desk"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
