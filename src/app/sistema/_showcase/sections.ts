/** Seções da vitrine, na ordem da navegação lateral. */
export const SECTIONS = [
  { href: "/sistema", label: "Visão geral", group: "Início" },
  { href: "/sistema/cores", label: "Cores", group: "Fundamentos" },
  { href: "/sistema/tipografia", label: "Tipografia", group: "Fundamentos" },
  { href: "/sistema/espaco", label: "Espaço e movimento", group: "Fundamentos" },
  { href: "/sistema/formas", label: "Formas", group: "Formas" },
  { href: "/sistema/componentes", label: "Componentes", group: "Componentes" },
  { href: "/sistema/conteudo", label: "Conteúdo e movimento", group: "Componentes" },
  { href: "/sistema/caso", label: "Caso", group: "Componentes" },
  { href: "/sistema/achados", label: "Achados", group: "Componentes" },
  { href: "/sistema/hero", label: "Hero e rodapé", group: "Composições" },
  { href: "/sistema/temas", label: "Temas", group: "Composições" },
  { href: "/sistema/acessibilidade", label: "Acessibilidade", group: "Qualidade" },
] as const

export const SECTION_GROUPS = [...new Set(SECTIONS.map((s) => s.group))]
