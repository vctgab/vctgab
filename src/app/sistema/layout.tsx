import type { Metadata } from "next"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { ToastProvider } from "@/components/ui/toast"
import { SystemNav } from "./_showcase/system-nav"

export const metadata: Metadata = {
  title: { default: "Sistema", template: "%s · Sistema · Victor Gabriel" },
  description: "Vitrine do design system do portfólio de Victor Gabriel.",
  robots: { index: false, follow: false },
}

/** Vitrine: navegação lateral, tema fixo no topo e o conteúdo de cada seção. */
export default function SistemaLayout({ children }: LayoutProps<"/sistema">) {
  return (
    <div className="mx-auto grid w-full max-w-page gap-x-10 px-(--gutter) lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="pt-8 lg:sticky lg:top-0 lg:max-h-dvh lg:overflow-y-auto lg:pt-12 lg:pb-12">
        <SystemNav />
      </aside>
      <div className="min-w-0">
        <div className="z-(--z-sticky) mt-4 flex items-center gap-4 border-b-2 border-dashed border-border bg-surface-base py-2 lg:sticky lg:top-0 lg:mt-0">
          <p className="w-32 shrink-0 font-mono text-label text-ink-subtle">
            Tema da vitrine
          </p>
          <ThemeSwitcher layout="bar" className="min-w-0 flex-1 justify-end" />
        </div>
        {/* Só a vitrine usa toast: o provider fica fora das páginas públicas (D-1019). */}
        <ToastProvider>{children}</ToastProvider>
      </div>
    </div>
  )
}
