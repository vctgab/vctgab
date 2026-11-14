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
