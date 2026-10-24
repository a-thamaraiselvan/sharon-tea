import React from 'react';
import { Link } from 'react-router-dom';
import { SharonLogo } from '@/components/ui/SharonLogo';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { getWhatsAppNumber } from '@/utils/whatsappLink';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock,
  Heart,
  ExternalLink,
  Bike,
} from 'lucide-react';
import { useDeliveryPartners } from '@/hooks/useDeliveryPartners';
import { FALLBACK_DELIVERY_PARTNERS, resolvePartnerUrl } from '@/services/deliveryPartnerService';
import { resolveImageUrl } from '@/utils/imageUrl';

export const Footer: React.FC = () => {
  const whatsappNumber = getWhatsAppNumber();
  const { data: partnersData } = useDeliveryPartners();
  const partners = partnersData && partnersData.length > 0 ? partnersData : FALLBACK_DELIVERY_PARTNERS;

  return (
    <footer className="bg-brand-black text-white border-t border-brand-grey/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Column 1: Sharon Logo, Tagline, Physical Address & Socials */}
          <div className="space-y-4">
            <SharonLogo variant="light" size="md" />
            <p className="text-brand-amber font-display italic text-sm">
              "Every Cup, A Moment to Savour."
            </p>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              Sharon Tea and Coffee serves authentic, hand-brewed Indian teas and South Indian filter coffee.
              Crafted from fine estate leaf blends and royal aromatic spices, beloved by over 8,000 patrons every single day.
            </p>

            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 pt-1">
              <MapPin className="w-4 h-4 text-brand-leaf-green flex-shrink-0 mt-0.5" />
              <span>#34, 2nd Main Road, 1st Stage, Indiranagar, Bangalore - 560038</span>
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-leaf-green mb-2.5">
                Follow Sharon
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E4405F] flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs"
                  aria-label="Sharon on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#119243] flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs"
                  aria-label="Sharon on WhatsApp"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-brand-cream border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link to="/" className="hover:text-brand-amber transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-brand-amber transition-colors">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-brand-amber transition-colors">
                  Beverage Menu
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-amber transition-colors">
                  Packaged Tea Products
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="hover:text-brand-amber transition-colors">
                  Franchise Opportunities
                </Link>
              </li>
              <li>
                <Link to="/visit-us" className="hover:text-brand-amber transition-colors">
                  Find Nearest Outlet
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Operating Hours */}
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-brand-cream border-b border-white/10 pb-2">
              Contact & Operating Hours
            </h4>
            <div className="space-y-3.5 text-sm text-white/80">
              <div className="p-3.5 rounded-xl bg-white/5 border border-brand-grey/20 space-y-1">
                <div className="flex items-center gap-2 text-brand-amber font-semibold text-xs tracking-wider uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Operating Hours</span>
                </div>
                <p className="text-white font-medium text-sm">
                  5:30 AM – 11:00 PM (Mon – Sat)
                </p>
                <p className="text-xs font-semibold text-brand-leaf-green">
                  6 Working Days • Sunday Holiday
                </p>
                <p className="text-xs text-white/60">
                  Serving piping hot brews from early morning till late night.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-amber flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-amber transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-leaf-green flex-shrink-0" />
                <a
                  href="mailto:contact@sharonteastall.com"
                  className="hover:text-brand-amber transition-colors"
                >
                  contact@sharonteastall.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partners Strip */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-brand-amber font-semibold text-xs tracking-wider uppercase mb-1.5">
                <Bike className="w-4 h-4 text-brand-leaf-green" />
                <span>Online Delivery Partners</span>
              </div>
              <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                Order Sharon Online to Your Doorstep
              </h4>
              <p className="text-xs text-white/70 mt-1 max-w-md">
                Craving our freshly brewed tea or filter coffee? Order directly from our verified delivery partners.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full sm:w-auto max-w-sm sm:max-w-none">
              {partners.map((partner) => {
                const logo = partner.logoUrl || partner.logo_url;
                const link = resolvePartnerUrl(partner);
                const badge = partner.badgeText || partner.badge_text;
                return (
                  <a
                    key={partner.id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-brand-amber/50 rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-4 sm:py-2.5 transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-white/10 overflow-hidden">
                      {logo ? (
                        <img
                          src={resolveImageUrl(logo)}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-bold text-neutral-900 text-[10px] sm:text-xs">{partner.name.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-brand-amber transition-colors truncate">
                          {partner.name}
                        </span>
                        <ExternalLink className="w-3 h-3 text-white/50 group-hover:text-brand-amber transition-opacity shrink-0" />
                      </div>
                      {badge ? (
                        <span className="text-[10px] sm:text-[11px] text-brand-leaf-green font-medium truncate block">
                          {badge}
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-[11px] text-white/60 font-medium truncate block">
                          Order Online
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-5 bg-brand-black/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/70 gap-3 text-center md:text-left">
          <p>© {new Date().getFullYear()} Sharon Tea and Coffee. All rights reserved.</p>
          <p className="flex items-center gap-1.5 justify-center">
            <span>Design &amp; Developed by</span>
            <a
              href="https://novacodex.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-amber hover:text-white font-semibold underline underline-offset-2 transition-colors"
            >
              Novacodex
            </a>
          </p>
          <p className="flex items-center gap-1.5 justify-center">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-brand-leaf-green fill-brand-leaf-green" />
            <span>for Tea Lovers</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
