"use client"

import { useSearchParams } from "next/navigation"
import { useId } from "react"
import { LinkedInChannel, Channel } from "@/components/home/contact"
import { Achavel } from "@/components/ui/finds"
import { Mesa } from "@/components/ui/finds/drawings"
import { LinkText } from "@/components/ui/link-text"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { SITE } from "@/content/site"
import { CONTACT_PAGE, isContactTab } from "@/content/contact"
import type { ContactTab } from "@/content/home"
import { cn } from "@/lib/cn"
import { mailtoHref } from "@/lib/contact"

const OPTIONS = CONTACT_PAGE.tabs.map((t) => ({ value: t.value, label: t.label }))

/**
 * Controle e painel de uma aba. Sem `onChange`, é o HTML estático do
 * fallback (aba padrão), com a mesma altura da versão interativa.
 */
export function ContactTabsView({
  tab,
  onChange,
}: {
  tab: ContactTab
  onChange?: (tab: ContactTab) => void
}) {
  const id = useId()
  const content =
    CONTACT_PAGE.tabs.find((t) => t.value === tab) ?? (CONTACT_PAGE.tabs[0] as never)
  const { labels } = CONTACT_PAGE
  return (
    <div className="flex flex-col gap-10">
      <SegmentedControl
        label={CONTACT_PAGE.tabsLabel}
        options={OPTIONS}
        value={tab}
        onValueChange={(v) => {
          if (isContactTab(v)) onChange?.(v)
        }}
        seed="contato:abas"
        className="self-start"
      />
      <section
        aria-labelledby={`${id}-titulo`}
        aria-live="polite"
        className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex max-w-measure flex-col gap-4">
          {/* Os textos das duas abas ocupam a mesma célula e só o da aba atual
              aparece: a altura é a do maior, e a troca na hidratação (fallback
              "vaga" → aba da URL) não move nada (CLS 0). */}
          <div className="grid">
            {CONTACT_PAGE.tabs.map((t) => {
              const active = t.value === content.value
              return (
                <div
                  key={t.value}
                  aria-hidden={active ? undefined : true}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col gap-4",
                    !active && "invisible",
                  )}
                >
                  <h2 id={active ? `${id}-titulo` : undefined} className="text-h2">
                    {t.title}
                  </h2>
                  <p className="text-body-lg text-ink-muted">{t.text}</p>
                </div>
              )
            })}
          </div>
          <ul className="mt-2 flex flex-col gap-3">
            <Channel icon="mail" label={labels.email}>
              <LinkText href={mailtoHref(content.subject)}>{SITE.email}</LinkText>
            </Channel>
            <LinkedInChannel label={labels.linkedin} />
          </ul>
        </div>
        <Achavel id="mesa" label={CONTACT_PAGE.finds.label} className="self-end">
          <Mesa className="rotate-3" />
        </Achavel>
      </section>
    </div>
  )
}

/**
 * Abas "vaga" e "projeto" que leem e escrevem `?aba=` (D-1212). A troca usa o
 * `history.replaceState` nativo, que o Next integra ao `useSearchParams`: sem
 * nova entrada no histórico, sem rolar e sem ida ao servidor.
 * Ficha: docs/specs/pages/contact.md
 */
export function ContactTabs() {
  const params = useSearchParams()
  const raw = params.get("aba")
  const tab = isContactTab(raw) ? raw : CONTACT_PAGE.defaultTab
  return (
    <ContactTabsView
      tab={tab}
      onChange={(next) => {
        const url = new URL(window.location.href)
        url.searchParams.set("aba", next)
        window.history.replaceState(null, "", url)
      }}
    />
  )
}
