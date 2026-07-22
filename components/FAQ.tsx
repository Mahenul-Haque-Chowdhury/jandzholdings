'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const questions = [
  {
    q: "What types of homes are available?",
    a: "J&Z Holdings offers a range of residential and commercial units, from compact apartments to larger family residences, each designed to balance comfort, quality, and affordability."
  },
  {
    q: "What makes J&Z Holdings different?",
    a: "We combine trusted delivery with a focus on sustainability and affordability. Every project is planned around Rajuk-approved standards, modern amenities, and a genuine commitment to the communities we build in."
  },
  {
    q: "What amenities can residents expect?",
    a: "Depending on the project, residents can access rooftop gardens, gyms, prayer halls, children's play areas, banquet facilities, CCTV surveillance, and dedicated parking, all designed to support everyday comfort."
  },
  {
    q: "How is the construction quality and approval ensured?",
    a: "Our projects follow Rajuk-approved building plans and are constructed to meet structural and safety standards, with our team overseeing quality at every stage of delivery."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-32 w-full bg-zinc-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16">
        
        <div className="lg:w-1/3">
          <span className="text-xs tracking-[0.2em] uppercase text-white/50 mb-8 inline-block">(FAQ)</span>
          <h2 className="text-4xl sm:text-5xl font-serif">Your Questions, <br/><span className="font-light">Answered</span></h2>
        </div>

        <div className="lg:w-2/3 border-t border-white/10">
          {questions.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border-b border-white/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-8 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-8">
                    <span className="text-white/30 font-serif w-8 text-left">( {idx + 1} )</span>
                    <h3 className="text-xl md:text-2xl font-serif text-left group-hover:text-white/80 transition-colors">{faq.q}</h3>
                  </div>
                  <div className="text-white/50 transition-colors group-hover:text-white">
                    {isOpen ? <Minus className="w-5 h-5"/> : <Plus className="w-5 h-5"/>}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-[4.5rem] pr-8 text-white/60 font-light leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
