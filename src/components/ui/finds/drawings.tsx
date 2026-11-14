/** Desenhos dos achados (decorativos; o nome acessível vem do Achavel). */

export function Pinha({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="44"
      viewBox="0 0 40 44"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M20 4c7 3 12 11 12 20 0 9-5 16-12 16S8 33 8 24C8 15 13 7 20 4Z"
        className="fill-secondary-2-soft stroke-ink"
        strokeWidth={2}
      />
      <path
        d="M11 18c5 2 13 2 18 0M10 25c6 2 14 2 20 0M12 32c5 1.6 11 1.6 16 0M20 6v34"
        fill="none"
        className="stroke-ink"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Coruja({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="44"
      viewBox="0 0 40 44"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M10.5 9.5 9 4.2l6.4 3.6c3-1 6.4-1 9.3 0L31 4l-1.4 5.6c2.4 2.9 3.7 6.9 3.6 11.6-.2 10-5.7 18.3-13.2 18.3S6.5 31.3 6.7 21.1c.1-4.5 1.4-8.6 3.8-11.6Z"
        className="fill-secondary-1-soft stroke-ink"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d="M14.2 12.4c2.6-.1 4.6 2 4.5 4.5 0 2.5-2.1 4.4-4.6 4.4-2.4-.1-4.3-2-4.3-4.5.1-2.4 2-4.4 4.4-4.4ZM25.9 12.5c2.5 0 4.4 2 4.4 4.5-.1 2.4-2 4.4-4.5 4.3-2.5 0-4.4-2-4.4-4.4.1-2.5 2-4.4 4.5-4.4Z"
        className="fill-surface-raised stroke-ink"
        strokeWidth={1.6}
      />
      <path
        d="M14.4 16.9h.1M25.8 16.9h.1"
        className="stroke-ink"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <path
        d="M18.6 21.8 20 24.6l1.5-2.8M13.4 29.6c2 1 4.4 1.4 6.7 1.3 2.3 0 4.6-.5 6.5-1.4M15.2 34c1.6.7 3.2 1 5 1 1.7 0 3.3-.3 4.8-1"
        fill="none"
        className="stroke-ink"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
