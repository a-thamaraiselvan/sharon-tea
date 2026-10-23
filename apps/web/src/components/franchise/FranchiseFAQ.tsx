import React, { useState } from 'react';
import { SectionContainer } from '@/components/ui/SectionContainer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'What is the total investment required to open a Sharon Tea and Coffee?',
    answer:
      'The initial investment ranges between ₹15 Lakhs to ₹30 Lakhs depending on the chosen store format (Sharon Cafe Model vs Master Franchise). This includes the franchise license fee, kitchen machinery, stainless steel counters, signage, initial raw material stock, and comprehensive team training.',
  },
  {
    question: 'How much commercial space is required?',
    answer:
      'We have flexible formats! A compact takeaway kiosk requires just 80 to 120 sq. ft. of space with high foot traffic. A semi-dine-in outlet requires 150 to 300 sq. ft. Good frontage, electrical connection, and running water are the primary site necessities.',
  },
  {
    question: 'Do I need prior culinary or restaurant experience?',
    answer:
      'Not at all. Our proprietary Sharon SOPs (Standard Operating Procedures), pre-portioned tea blends, and 7-day intensive hands-on staff training make operating the stall straightforward for entrepreneurs of all backgrounds.',
  },
  {
    question: 'How does raw material supply work?',
    answer:
      'Sharon HQ directly provides our proprietary tea leaf blends, special masala spice concoctions, cups, branded packaging, and uniform merchandise. Fresh milk and daily sundries are procured locally based on our verified quality suppliers.',
  },
  {
    question: 'What is the expected payback period and profit margin?',
    answer:
      'Most franchise partners recover their capital investment within 10 to 14 months. Due to high consumer volume and strong gross beverage margins, net monthly operational profits remain attractive.',
  },
  {
    question: 'Is geographic exclusivity provided?',
    answer:
      'Yes, each approved Sharon outlet is protected by a defined exclusivity radius to prevent territory overlap and ensure healthy customer catchment.',
  },
];

export const FranchiseFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionContainer background="cream" className="py-20 md:py-28">
      <div className="reveal-up">
        <SectionHeading
          badge="Clarifications"
          title="Frequently Asked Questions"
          subtitle="Clear answers to help you evaluate your partnership journey with Sharon Tea and Coffee."
        />
      </div>

      <div className="max-w-3xl mx-auto space-y-4 reveal-stagger">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden transition-all duration-200 hover-lift reveal-up"
              style={{ '--reveal-delay': `${(index % 4) * 50}ms` } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="font-display text-base sm:text-lg font-bold text-brand-black">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-brand-green flex-shrink-0 transition-transform duration-300',
                    isOpen && 'rotate-180 text-brand-burgundy'
                  )}
                />
              </button>

              <div
                className={cn(
                  'accordion-transition',
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                )}
              >
                <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
};

export default FranchiseFAQ;
