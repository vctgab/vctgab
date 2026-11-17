# Tag e Chip

## Spec

### Propósito

**Tag:** etiqueta estática de tecnologia ou categoria ("React", "Design system"). **Chip:** filtro alternável (liga e desliga). **Quando não usar:** Tag para ações (não é clicável); Chip para escolha única obrigatória (use `SegmentedControl` ou `RadioGroup`).

### Anatomia

- Tag: `<span>` (ou `<li>` com `as`), forma `pill` sm, preenchimento `surface-sunken`, contorno 1,5 px, texto mono 13 px.
- Chip: `<button aria-pressed>`, forma `pill` sm, ícone `check` quando selecionado, rótulo em DM Sans 15 px.

### Variantes e tamanhos

| Componente | Prop                         | Valores                                                                     |
| ---------- | ---------------------------- | --------------------------------------------------------------------------- |
| Tag        | `tone`                       | `neutral` (padrão), `primary`, `secondary-1`, `secondary-2` (fundos suaves) |
| Tag        | `as`                         | `span` (padrão), `li`                                                       |
| Chip       | `pressed` / `defaultPressed` | controlado ou não                                                           |

Tag tem 32 px de altura (não é interativa). Chip tem 44 px.

### Estados (Chip, copiado do Button)

| Estado           | Comportamento                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Padrão           | `surface-raised`, contorno `stroke`.                                                            |
| Hover            | `surface-hover`.                                                                                |
| Foco visível     | `outline` `focus-ring` seguindo o raio.                                                         |
| Ativo            | `surface-active`, desce 1 px.                                                                   |
| Selecionado      | `primary-soft`, ícone `check` (segundo indicador), contorno 2,5 px; hover `primary-soft-hover`. |
| Desabilitado     | Motivo obrigatório visível, `aria-disabled`, tracejado.                                         |
| Carregando, erro | Não se aplicam (o filtro age na lista, que mostra os próprios estados).                         |

### Teclado

| Tecla         | Ação    |
| ------------- | ------- |
| Tab           | Foca    |
| Enter, Espaço | Alterna |

### ARIA e nome acessível

Chip: `aria-pressed="true|false"`, nome = rótulo. Grupo de chips: `role="group"` com `aria-label` ("Filtrar projetos por tecnologia"). Tag: texto simples.

### Irregularidade

`pill` bucket `sm`, seed = rótulo. Sem rotação. Padding horizontal 12–14 px ≥ amplitude.

### Alto contraste e movimento

`forced-colors`: borda real; selecionado mostra o `check` (não depende de cor). Movimento reduzido: sem deslocamento ao pressionar.

### Ficha de Texto

1. Quem lê: visitantes filtrando projetos.
2. Grade de Tom: vazio por filtro, "Nenhum projeto para este filtro." com o botão "Limpar filtros" (na lista, não no chip).
3. Título do grupo: "Filtrar projetos por tecnologia".
4. Rótulos: nome da tecnologia ou categoria, nomes próprios com a grafia oficial.
5. Ajuda: não se aplica.
6. Termos: "projeto".
7. Estados: o grupo de chips não carrega dados próprios.
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: contagem opcional no rótulo por `formatNumber` ("React, 3").
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Tag não é focável e tem 32 px.
- [x] CA-2 Chip alterna `aria-pressed` com clique, Enter e Espaço.
- [x] CA-3 Selecionado mostra o ícone `check`.
- [x] CA-4 Chip desabilitado exige motivo (tipo) e não alterna.
- [x] CA-5 Altura mínima de 44 px no Chip.
- [x] CA-6 jest-axe sem violações.
- [ ] CA-7 (Home v2) `Tag` com `dot` mostra um ponto de status `aria-hidden` ao lado do texto (`success` ou `warning`); o texto continua sendo o portador do significado (VI-06).

## Plan

`src/components/ui/tag/*` (Server) e `src/components/ui/chip/*` (cliente).

### Home v2

- `Tag` ganha `dot?: "success" | "warning"`: um `blob` pequeno do motor, preenchido com `success-fill` ou `warning-fill` e contornado em `ink`, antes do texto. Usos: selo do hero ("aberto a vagas e projetos") e status das fichas de projeto ("no ar" com `success`, "em andamento" com `warning`). D-1210.

## Tarefas

- [x] Ficha
- [x] Componentes e testes
- [ ] Vitrine
