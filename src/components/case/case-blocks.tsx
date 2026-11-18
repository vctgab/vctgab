import type { ReactNode } from "react"
import { Callout } from "@/components/ui/callout"
import { CaseFigure, CaseFigureGroup } from "@/components/ui/case-figure"
import { CodeBlock } from "@/components/ui/code-block"
import { Achavel } from "@/components/ui/finds"
import { Chave } from "@/components/ui/finds/drawings"
import { ReviewMark } from "@/components/ui/review-mark"
import { Stat } from "@/components/ui/stat"
import { isReview } from "@/content/pending"
import type { CaseBlock, CaseFigureData, Content, Inline } from "@/content/projects/types"

/** Texto corrido: negrito, código, ênfase e trechos em revisão. */
export function renderInline(content: Content | readonly Inline[]): ReactNode {
  return content.map((part, i) => {
    if (typeof part === "string") return part
    if (isReview(part))
      return (
        <ReviewMark key={i} what={part.what}>
          {renderInline(part.content as readonly Inline[])}
        </ReviewMark>
      )
    if ("strong" in part)
      return (
        <strong key={i} className="font-semibold">
          {part.strong}
        </strong>
      )
    if ("code" in part)
      return (
        <code key={i} className="bg-surface-sunken px-1 font-mono text-sm">
          {part.code}
        </code>
      )
    return <em key={i}>{part.em}</em>
  })
}

function toItem(figure: CaseFigureData) {
  return {
    id: figure.id,
    variant: figure.variant,
    image: figure.image,
    priority: figure.priority,
  }
}

/** Largura da leitura (65ch) e largura de figuras e grupos (podem passar da medida). */
const MEASURE = "max-w-measure"
const WIDE = "max-w-4xl"

/** Um bloco do esquema de blocos (docs/specs/pages/case.md). */
export function CaseBlockView({
  block,
  seed,
}: {
  block: CaseBlock
  seed: string
}): ReactNode {
  switch (block.type) {
    case "text":
      return (
        <div className={`relative ${MEASURE}`}>
          <p className="text-body-lg text-ink">{renderInline(block.content)}</p>
          {block.find ? (
            <div className="absolute end-0 -bottom-9 lg:-end-14">
              <Achavel id={block.find.id} label={block.find.label}>
                <Chave className="rotate-12" />
              </Achavel>
            </div>
          ) : null}
        </div>
      )
    case "subtitle": {
      const Heading = block.level === 4 ? "h4" : "h3"
      return (
        <Heading
          className={`${MEASURE} font-soft ${block.level === 4 ? "text-body-lg" : "text-h3"} pt-4`}
        >
          {block.text}
        </Heading>
      )
    }
    case "code":
      return (
        <div className={MEASURE}>
          <CodeBlock
            code={block.code}
            language={block.language}
            caption={renderInline(block.caption)}
            seed={`${seed}:codigo`}
          />
        </div>
      )
    case "figure":
      return (
        <CaseFigure
          {...toItem(block.figure)}
          caption={block.figure.caption}
          className={WIDE}
        />
      )
    case "figure-group":
      return (
        <CaseFigureGroup
          figures={block.figures.map(toItem)}
          caption={block.caption}
          className={WIDE}
        />
      )
    case "stats":
      return (
        <ul className={`grid gap-x-10 gap-y-12 sm:grid-cols-2 ${WIDE}`}>
          {block.items.map((item) => (
            <li key={item.value + item.label}>
              <Stat
                size="md"
                value={item.value}
                label={item.label}
                method={item.method}
                methodKind={item.methodKind}
              />
            </li>
          ))}
        </ul>
      )
    case "callout":
      return (
        <div className={MEASURE}>
          <Callout label={block.label} seed={`${seed}:destaque`}>
            {renderInline(block.content)}
          </Callout>
        </div>
      )
    case "list": {
      const labelled = block.items.some((i) => i.label)
      if (labelled)
        return (
          <dl className={`flex flex-col gap-6 ${MEASURE}`}>
            {block.items.map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <dt className="font-mono text-label text-primary-text">{item.label}</dt>
                <dd className="text-body-lg text-ink">{renderInline(item.content)}</dd>
              </div>
            ))}
          </dl>
        )
      const List = block.ordered ? "ol" : "ul"
      return (
        <List
          className={`flex flex-col gap-2 ps-6 text-body-lg text-ink marker:text-primary-decor ${MEASURE} ${block.ordered ? "list-decimal" : "list-disc"}`}
        >
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item.content)}</li>
          ))}
        </List>
      )
    }
  }
}
