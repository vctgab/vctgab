import type { ReactNode } from "react"
import { ReviewMark } from "@/components/ui/review-mark"
import { Shape, shapeHostProps } from "@/components/ui/shape"
import { isReview, unreview, type Reviewable } from "@/content/pending"
import { cn } from "@/lib/cn"
import { CopyButton } from "./copy-button"
import { highlight, LANGUAGE_LABEL, type CodeLanguage } from "./highlight"

export interface CodeBlockProps {
  /** Código, ou um `review(...)`: com `withhold`, o código não é renderizado. */
  code: Reviewable<string>
  language?: CodeLanguage
  caption: ReactNode
  seed?: string
  className?: string
}

export interface CodeBlockViewProps {
  /** HTML realçado (do `highlight`). Ausente quando o código está retido. */
  html?: string
  /** Texto puro, para o botão de copiar. */
  source?: string
  language: CodeLanguage
  caption: ReactNode
  /** O que validar: mostra a marca de revisão. */
  review?: string
  seed: string
  className?: string
}

/** Moldura, legenda e botão; sem estado e sem realce (testável sem servidor). */
export function CodeBlockView({
  html,
  source,
  language,
  caption,
  review,
  seed,
  className,
}: CodeBlockViewProps) {
  const host = shapeHostProps({ seed, kind: "wobblyRect", bucket: "md" })
  const held = html === undefined
  return (
    <figure
      {...host}
      data-code-block=""
      data-held={held ? "" : undefined}
      className={cn(
        "relative isolate flex flex-col text-ink forced-colors:border forced-colors:border-solid",
        className,
      )}
    >
      <Shape
        seed={seed}
        bucket="md"
        fill="surface-raised"
        stroke="stroke"
        strokeWidth={1.5}
        shadow="sm"
        shadowColor="shadow-soft"
      />
      {held ? null : (
        <div className="flex items-center justify-between gap-3 px-4 pt-4 md:px-5">
          <span className="font-mono text-label text-ink-subtle">
            {LANGUAGE_LABEL[language]}
          </span>
          <CopyButton code={source ?? ""} />
        </div>
      )}
      {held ? null : (
        <div
          className="code-block px-1 pb-1 md:px-2 [&_pre]:overflow-x-auto [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:focus-visible:outline-[2.5px] [&_pre]:focus-visible:outline-offset-2 [&_pre]:focus-visible:outline-focus-ring [&_pre]:focus-visible:outline-solid"
          // HTML gerado pelo shiki a partir do conteúdo do próprio site.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {review ? (
        <div className={cn("px-4 md:px-5", held ? "pt-4" : "pb-2")}>
          <ReviewMark what={review} as="div" />
        </div>
      ) : null}
      <figcaption className="px-4 pt-1 pb-4 text-body text-ink-muted md:px-5">
        {caption}
      </figcaption>
    </figure>
  )
}

/**
 * Trecho de código com realce no servidor, legenda e botão de copiar. Com
 * `review(..., { withhold: true })` mostra só a legenda e a marca de revisão
 * (código de cliente sem permissão). Ficha: docs/specs/code-block.md
 */
export async function CodeBlock({
  code,
  language = "ts",
  caption,
  seed = "codigo",
  className,
}: CodeBlockProps) {
  if (isReview(code) && code.withhold) {
    return (
      <CodeBlockView
        language={language}
        caption={caption}
        review={code.what}
        seed={seed}
        className={className}
      />
    )
  }
  const source = unreview(code)
  const html = await highlight(source, language)
  return (
    <CodeBlockView
      html={html}
      source={source}
      language={language}
      caption={caption}
      review={isReview(code) ? code.what : undefined}
      seed={seed}
      className={className}
    />
  )
}
