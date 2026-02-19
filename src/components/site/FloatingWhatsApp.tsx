import { WhatsAppIcon } from "./WhatsAppIcon";

interface FloatingWhatsAppProps {
  defaultMessage: string;
  number: string;
}

/**
 * Floating WhatsApp action button.
 */
export function FloatingWhatsApp({ defaultMessage, number }: FloatingWhatsAppProps) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-200 hover:scale-105 md:bottom-7 md:right-8"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
