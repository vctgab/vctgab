# Section e Container

## Spec

### Propósito

**Container:** limitar a largura do conteúdo (máx. 1200 px) com gutter de 16 px no mobile. **Section:** seção de página com cabeçalho padrão (eyebrow + título + introdução) e `aria-labelledby`. **Quando não usar:** para agrupar controles de formulário (use `fieldset`); para cartões (use `Ficha`).

### Anatomia

`<section aria-labelledby>` → `Container` → cabeçalho (`Eyebrow`, título `h2` por padrão, introdução em `p` com `max-w-measure`) → conteúdo.

### Variantes

| Prop        | Valores                                           |
| ----------- | ------------------------------------------------- |
| `titleAs`   | `h1`, `h2` (padrão), `h3`                         |
| `titleSize` | `display`, `h1`, `h2` (padrão), `h3`              |
| `spacing`   | `md` (padrão, 64/96 px), `lg` (96/128 px), `none` |
| `width`     | `page` (padrão), `measure`                        |

### Estados

Estrutural. Estados interativos não se aplicam.

### Teclado

Não recebe foco. O título pode ser alvo de âncora (`id`).

### ARIA e nome acessível

`aria-labelledby` aponta para o título (id gerado). Sem título, `aria-label` obrigatório pelo tipo.

### Irregularidade

Nenhuma: a estrutura é reta para o conteúdo ficar previsível; a irregularidade mora nos componentes dentro dela.

### Alto contraste e movimento

Sem efeito.

### Ficha de Texto

1. Quem lê: visitantes.
2. Grade de Tom: boas-vindas e seções, acolhedor com entusiasmo baixo.
3. Título e subtítulo: frase com primeira letra maiúscula ("O que eu faço no seu produto").
4. Ações: não se aplica.
5. Ajuda: introdução curta, até 2 frases.
6. Termos: conforme o glossário.
7. Estados: não exibe dados.
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 `section` nomeada pelo título.
- [x] CA-2 Sem título, o tipo exige `aria-label`.
- [x] CA-3 Container com `max-w-page` e gutter por token.
- [x] CA-4 jest-axe sem violações.

## Plan

`src/components/ui/section/*`. Server Component (`useId` é permitido no servidor).

## Tarefas

- [x] Ficha
- [x] Componentes e testes
- [ ] Vitrine
