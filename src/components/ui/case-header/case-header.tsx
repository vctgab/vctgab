import type { ReactNode } from "react"
import { Ficha } from "@/components/ui/card"
import { Fact } from "@/components/ui/fact"
import { ReviewMark } from "@/components/ui/review-mark"
import { Tag } from "@/components/ui/tag"
import { isPending, isReview, type Maybe, type Reviewable } from "@/content/pending"

/** Valor de um campo da ficha: texto, pendência ou item em revisão. */
export type CaseFactValue = Maybe<Reviewable<string>>

export interface CaseHeaderProps {
  name: string
  /** Áreas do trabalho ("código", "liderança"). */
  areas: readonly string[]
  /** "O que é". */
  about: string
  facts: {
    project: CaseFactValue
    role: CaseFactValue
    company: CaseFactValue
    period: CaseFactValue
    team: CaseFactValue
    status: "em andamento" | "no ar"
    stack: readonly string[]
  }
  /** Seed das formas (padrão: o nome). */
  seed?: string
}

const STATUS_DOT = { "em andamento": "warning", "no ar": "success" } as const

function Value({ value }: { value: CaseFactValue }): ReactNode {
  if (isPending(value)) return <Fact value={value} />
  if (isReview(value)) return <ReviewMark what={value.what}>{value.content}</ReviewMark>
  return value
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-mono text-label text-ink-subtle">{label}</dt>
      <dd className="text-body text-ink">{children}</dd>
    </div>
  )
}

/**
 * Abre um caso: áreas, título (`h1`), "o que é" e a ficha técnica numa `Ficha`
 * com fita. Ficha: docs/specs/case-header.md
 */
export function CaseHeader({ name, areas, about, facts, seed }: CaseHeaderProps) {
  const base = seed ?? `caso:${name}`
  return (
    <header className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
      <div className="flex flex-col gap-6">
        <ul aria-label="Áreas" className="flex flex-wrap gap-2">
          {areas.map((area) => (
            <Tag as="li" key={area} tone="primary" seed={`${base}:area:${area}`}>
              {area}
            </Tag>
          ))}
        </ul>
        <h1 className="text-display">{name}</h1>
        <p className="max-w-measure text-body-lg text-ink-muted">{about}</p>
      </div>
      <Ficha title="Ficha técnica" titleAs="h2" tape="left" seed={`${base}:ficha`}>
        <dl className="mt-2 flex flex-col divide-y divide-border">
          <Row label="Projeto">
            <Value value={facts.project} />
          </Row>
          <Row label="Meu papel">
            <Value value={facts.role} />
          </Row>
          <Row label="Empresa">
            <Value value={facts.company} />
          </Row>
          <Row label="Período">
            <Value value={facts.period} />
          </Row>
          <Row label="Time">
            <Value value={facts.team} />
          </Row>
          <Row label="Status">
            <Tag dot={STATUS_DOT[facts.status]} seed={`${base}:status`}>
              {facts.status}
            </Tag>
          </Row>
          <Row label="Stack">
            <ul aria-label="Stack" className="flex flex-wrap gap-2">
              {facts.stack.map((item) => {
                // "Supabase (PostgreSQL, Auth, …)": a ferramenta vira chip e o detalhe fica ao lado.
                const [, name = item, detail] = /^(.+?) \((.+)\)$/.exec(item) ?? []
                return (
                  <li key={item} className="flex flex-wrap items-center gap-2">
                    <Tag seed={`${base}:stack:${name}`}>{name}</Tag>
                    {detail ? (
                      <>
                        {" "}
                        <span className="text-sm text-ink-muted">({detail})</span>
                      </>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </Row>
        </dl>
      </Ficha>
    </header>
  )
}
