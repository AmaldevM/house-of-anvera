'use client';
import { useState } from 'react';
import { MessageCircle, X, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LuxuryFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="pointer-events-auto bg-[#1D1D1D] border border-[#C89B3C]/30 text-white p-6 w-80 shadow-2xl mb-4 relative"
            style={{ borderRadius: '2px' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="mb-4">
              <span className="font-poppins text-[9px] tracking-[4px] text-[#C89B3C] uppercase block mb-1">
                Anvera Concierge
              </span>
              <h4 className="font-cormorant text-2xl font-light leading-tight">
                How may we <br />
                <em className="not-italic text-[#DDB96A] font-semibold">assist you?</em>
              </h4>
            </div>

            {/* Badges / Trust Info */}
            <div className="space-y-2.5 mb-5 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2.5 text-xs text-white/70">
                <Award size={14} className="text-[#C89B3C]" />
                <span className="font-manrope">BIS Hallmarked 22KT / 18KT Gold</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-white/70">
                <ShieldCheck size={14} className="text-[#C89B3C]" />
                <span className="font-manrope">Secure Payment &amp; COD Available</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="space-y-2">
              <a
                href="https://wa.me/919999999999?text=Hi%20House%20of%20Anvera,%20I'd%20like%20to%20inquire%20about%20your%20jewelry%20designs."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between bg-[#25D366] hover:bg-[#20ba56] text-white font-poppins text-[10px] tracking-[2px] uppercase py-3 px-4 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                <span>Chat on WhatsApp</span>
                <MessageCircle size={14} />
              </a>

              <a
                href="https://www.instagram.com/houseofanvera?igsh=NTJ1NWY5dmc2OTBw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between border border-white/20 hover:border-[#C89B3C] hover:text-[#C89B3C] text-white/80 font-poppins text-[10px] tracking-[2px] uppercase py-3 px-4 transition-all duration-200"
                style={{ borderRadius: '2px' }}
              >
                <span>View Instagram Feed</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-dark border border-[#C89B3C]/50 hover:border-[#C89B3C] shadow-lg relative group transition-all duration-300 ml-auto"
        style={{ borderRadius: '50%' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing Gold Rings around button */}
        <span className="absolute inset-0 rounded-full border border-[#C89B3C]/40 animate-ping opacity-30 pointer-events-none" />
        <span className="absolute inset-1 rounded-full border border-[#C89B3C]/20 animate-ping opacity-15 pointer-events-none" style={{ animationDelay: '0.4s' }} />

        {isOpen ? (
          <X size={20} className="text-[#C89B3C] rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle size={20} className="text-[#C89B3C] group-hover:scale-115 transition-transform duration-300" />
        )}
      </motion.button>
    </div>
  );
}
