import Link from "next/link"

export default function SistemaPage() {
  return (
    <main className="mx-auto max-w-page px-(--gutter) py-16">
      <h1 className="text-h1">Sistema</h1>
      <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
        Vitrine do design system. As seções completas entram na etapa 6.
      </p>
      <p className="mt-6">
        <Link
          className="text-primary-text underline underline-offset-4"
          href="/sistema/formas"
        >
          Abrir o playground de formas
        </Link>
      </p>
    </main>
  )
}
