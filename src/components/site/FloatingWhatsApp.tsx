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
      className="site-whatsapp-badge fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-white/90 transition-transform duration-200 hover:scale-105 md:bottom-7 md:right-8"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={ariaLabel}
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
