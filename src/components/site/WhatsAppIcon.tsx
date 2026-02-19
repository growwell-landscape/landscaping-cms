import { cn } from "@/lib/utils";

interface WhatsAppIconProps {
  className?: string;
}

/**
 * WhatsApp-style chat icon (message bubble with phone glyph).
 */
export function WhatsAppIcon({ className }: WhatsAppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 11.8a8 8 0 0 1-11.93 6.97L4 20l1.26-3.7A8 8 0 1 1 20 11.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.67 8.76c-.24-.56-.5-.57-.72-.58h-.61c-.21 0-.56.08-.85.4-.29.32-1.1 1.04-1.1 2.52 0 1.48 1.12 2.92 1.28 3.12.16.2 2.2 3.5 5.43 4.77 2.67 1.05 3.21.84 3.79.78.58-.06 1.86-.74 2.12-1.45.26-.7.26-1.3.18-1.43-.08-.13-.29-.2-.61-.36-.32-.16-1.86-.95-2.15-1.05-.29-.1-.5-.16-.71.16-.21.32-.82 1.05-1 1.27-.19.22-.37.24-.69.08-.32-.16-1.36-.52-2.59-1.67-.96-.9-1.61-2-1.8-2.34-.19-.34-.02-.53.14-.69.15-.15.32-.4.48-.6.16-.2.21-.34.32-.56.1-.22.05-.42-.03-.58-.08-.16-.71-1.8-1-2.43Z"
        fill="currentColor"
      />
    </svg>
  );
}
