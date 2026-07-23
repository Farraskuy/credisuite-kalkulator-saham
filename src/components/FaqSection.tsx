'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

interface FaqSectionProps {
  faqs: FaqItemData[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs.length > 0 ? faqs[0].id : null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="space-y-6 scroll-mt-20">
      <div className="pb-2 text-center max-w-3xl mx-auto space-y-2">
        <div className="text-xs font-bold text-acc-blue uppercase tracking-wider flex items-center justify-center gap-1.5">
          <HelpCircle size={16} /> FAQ
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-xs sm:text-sm text-muted">
          Pertanyaan umum seputar fitur kalkulator saham, aturan BEI, serta strategi trading.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-card border border-border-custom rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-main hover:text-acc-blue transition-colors cursor-pointer gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base flex items-start gap-3">
                  <span className="text-acc-blue text-xs font-extrabold bg-sub-blue px-2.5 py-1 rounded-lg shrink-0 mt-0.5">
                    #{index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center bg-sub-slate shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-sub-blue text-acc-blue' : 'text-muted'
                  }`}
                >
                  <ChevronDown size={18} />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-sub leading-relaxed border-t border-border-custom/50 animate-fade-in whitespace-pre-line">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
