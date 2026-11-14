import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge precisa conhecer a escala tipográfica própria; sem isso,
 * `text-marker` seria lido como cor e apagaria `text-on-primary`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "h1",
        "h2",
        "h3",
        "body-lg",
        "body",
        "sm",
        "label",
        "hand",
        "marker-sm",
        "marker",
        "marker-lg",
      ],
    },
  },
})

/** Junta classes condicionais e resolve conflitos de utilitários do Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
