import { WhatsAppIcon } from "./WhatsAppIcon";

interface FloatingWhatsAppProps {
  ariaLabel?: string;
  defaultMessage: string;
  number: string;
}

/**
 * Floating WhatsApp action button.
 */
export function FloatingWhatsApp({ ariaLabel = "Chat on WhatsApp", defaultMessage, number }: FloatingWhatsAppProps) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      aria-label={ariaLabel}
      className="site-whatsapp-badge site-whatsapp-float group fixed bottom-5 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full ring-2 ring-white/90 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:ring-white md:bottom-7 md:right-8 md:h-16 md:w-16"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={ariaLabel}
    >
      <span
        aria-hidden="true"
        className="site-whatsapp-ripple absolute inset-0 rounded-full"
      />
      <WhatsAppIcon className="relative z-10 h-7 w-7 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 md:h-8 md:w-8" />
    </a>
  );
}
