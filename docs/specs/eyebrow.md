# Eyebrow

## Spec

### Propósito

Rótulo mono curto que antecede títulos ("Serviços", "Depoimento", "Sobre"). **Quando não usar:** como título (não substitui o `h2`), para frases longas ou para status.

### Anatomia

Traço à mão curto (24 px, `primary-decor`, decorativo) + texto em JetBrains Mono `text-label` (12 px), cor `primary-text`.

### Variantes

| Prop   | Valores                                    |
| ------ | ------------------------------------------ |
| `as`   | `p` (padrão), `span`, `div`                |
| `tone` | `primary` (padrão), `muted` (`ink-subtle`) |

### Estados

Estático. Não se aplicam hover, foco, ativo, desabilitado, carregando, erro, selecionado.

### Teclado

Não recebe foco.

### ARIA e nome acessível

Texto comum; o traço é `aria-hidden`. Se a eyebrow nomeia a seção, o `Section` usa o título (não a eyebrow) em `aria-labelledby`.

### Irregularidade

Traço `handLine` com seed = texto, levemente inclinado pela própria geometria.

### Alto contraste e movimento

Texto em cor do sistema; traço some (decorativo). Sem movimento.

### Ficha de Texto

1. Quem lê: visitantes escaneando a página.
2. Grade de Tom: rótulo, voz de sistema, uma ou duas palavras.
3. Título: não se aplica.
4. Rótulos: substantivo da seção, primeira letra maiúscula ("Serviços", "Depoimento"). Nunca caixa-alta (TL-11).
5. Ajuda: não se aplica.
6. Termos: conforme o glossário.
7. Estados: não exibe dados.
8. a 10. Não se aplicam.
9. Sem dados reais.
10. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Renderiza o texto em mono com o traço decorativo `aria-hidden`.
- [x] CA-2 Sem `uppercase` nas classes.
- [x] CA-3 jest-axe sem violações.

## Plan

`src/components/ui/eyebrow/*`. Server Component.

## Tarefas

- [x] Ficha
- [x] Componente e testes
- [ ] Vitrine
