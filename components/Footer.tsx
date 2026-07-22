import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer w-full bg-[#0e1011] text-white pt-6 pb-20 md:pt-8 md:pb-28 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo + Description */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" aria-current="page" className="inline-block mb-6">
                <Image
                  src="/jandz-logo.png"
                  alt="J&Z Holdings"
                  width={400}
                  height={188}
                  className="h-auto w-28"
                />
              </Link>

              <p className="max-w-md text-white/60 mt-4 font-sans text-sm md:text-base leading-relaxed">
                To build a sustainable & affordable world, for the people
                with satisfaction, through trusted delivery and quality
                development.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <h3 className="font-serif text-lg mb-6 text-white/50 tracking-wide">
              (Location)
            </h3>

            <p className="font-sans text-base leading-relaxed text-white/90">
              House # 15, Road # 15, Sector # 04
              <br />
              Uttara, Dhaka-1230
              <br />
              Bangladesh
            </p>
          </div>

          {/* Contact - Fixed Alignment */}
          <div className="flex flex-col items-start">
            <h3 className="ml-9 font-serif text-lg mb-6 text-white/50 tracking-wide">
              (Contact)
            </h3>

            <ul className="m-0 flex flex-col items-start space-y-3 p-0 font-sans text-base">
              <li>
                <a
                  href="mailto:info@jandzholdings.com"
                  className="text-white/90 hover:text-white transition-colors duration-300"
                >
                  info@jandzholdings.com
                </a>
              </li>

              <li>
                <a
                  href="tel:+8801897666617"
                  className="text-white/90 hover:text-white transition-colors duration-300"
                >
                  +88 01897-666617
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center pt-8 border-t border-white/10 font-sans text-sm text-white/50">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} J&Z Holdings Ltd. All rights reserved. Designed by {" "}
            <a
              href="https://grayvally.tech"
              target="_blank"
              rel="noreferrer"
              className="text-white/45 underline decoration-white/25 underline-offset-4 transition-colors duration-300 hover:text-white/80 hover:decoration-white/50"
            >
              GrayVally
            </a>
          </p>

          <div className="flex flex-col items-center gap-3 text-center md:mt-0 md:flex-row md:space-x-6 md:gap-0 md:text-left">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Manage Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}