"use client"

import { Accordion as RadixAccordion } from "radix-ui"
import type { ReactNode } from "react"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/cn"

export interface AccordionItem {
  value: string
  title: ReactNode
  content: ReactNode
}

export interface AccordionProps {
  items: readonly AccordionItem[]
  type?: "single" | "multiple"
  /** Nível do cabeçalho de cada gatilho. */
  headingLevel?: 3 | 4
  className?: string
}

/** Perguntas e detalhes que se expandem. Ficha: docs/specs/accordion-terminal.md */
export function Accordion({
  items,
  type = "single",
  headingLevel = 3,
  className,
}: AccordionProps) {
  const Heading = headingLevel === 3 ? "h3" : "h4"
  const content = items.map((item, i) => (
    <RadixAccordion.Item key={item.value} value={item.value} className="flex flex-col">
      <RadixAccordion.Header asChild>
        <Heading className="font-sans text-body font-medium">
          <RadixAccordion.Trigger
            className={cn(
              "group/acc flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 px-2 py-2 text-left text-body-lg text-ink",
              "hover:bg-surface-hover active:bg-surface-active",
            )}
          >
            {item.title}
            <Icon
              name="mais"
              decorative
              className="shrink-0 group-data-[state=open]/acc:hidden"
            />
            <Icon
              name="menos"
              decorative
              className="hidden shrink-0 group-data-[state=open]/acc:block"
            />
          </RadixAccordion.Trigger>
        </Heading>
      </RadixAccordion.Header>
      <RadixAccordion.Content className="px-2 pb-5 text-body text-ink-muted data-[state=open]:motion-safe:animate-esmaecer">
        {item.content}
      </RadixAccordion.Content>
      {i < items.length - 1 ? (
        <Divider seed={`acordeao:${item.value}`} className="my-1" />
      ) : null}
    </RadixAccordion.Item>
  ))

  return type === "single" ? (
    <RadixAccordion.Root
      type="single"
      collapsible
      className={cn("flex flex-col", className)}
    >
      {content}
    </RadixAccordion.Root>
  ) : (
    <RadixAccordion.Root type="multiple" className={cn("flex flex-col", className)}>
      {content}
    </RadixAccordion.Root>
  )
}
