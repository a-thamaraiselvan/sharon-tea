import React, { useState } from 'react';
import { generateGeneralInquiryLink } from '@/utils/whatsappLink';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { X } from 'lucide-react';

export const WhatsAppFAB: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = generateGeneralInquiryLink(
    'Hello Sharon Tea and Coffee! 👋 I have an enquiry about your tea blends and franchise opportunities.'
  );

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 pointer-events-none">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white text-brand-black px-3.5 py-2 rounded-xl shadow-warm-lg border border-neutral-200 text-xs font-medium animate-fade-in">
          <span>Order on WhatsApp or ask us anything!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba5c] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 cursor-pointer"
        aria-label="Chat on WhatsApp with Sharon Tea and Coffee"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white relative z-10 shrink-0" />
      </a>
    </div>
  );
};

export default WhatsAppFAB;
