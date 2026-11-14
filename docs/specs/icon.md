# Icon

## Spec

### Propósito

Conjunto de ícones desenhados à mão em grade 24, traço 1,75 e pontas arredondadas, com leve irregularidade nas linhas. **Quando não usar:** como único portador de significado (AC-03), como ilustração (use cenas e formas) ou para marcar status sem texto.

### Anatomia

`<svg viewBox="0 0 24 24">` com `stroke="currentColor"`, `fill="none"`, traço 1,75, `stroke-linecap="round"`, `stroke-linejoin="round"`. A cor herda do texto.

### Variantes e tamanhos

| Prop   | Valores                                                                                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | `seta`, `seta-diagonal`, `externo`, `fechar`, `menu`, `check`, `mais`, `menos`, `sol`, `lua`, `mail`, `github`, `linkedin`, `whatsapp`, `terminal`, `busca`, `alerta`, `info`, `seletor` |
| `size` | 16, 20 (padrão), 24                                                                                                                                                                      |

### Estados

Não interativo. Herda cor e estados do controle que o contém.

### Teclado

Não recebe foco (`focusable="false"`).

### ARIA e nome acessível

O tipo exige uma de duas formas: `decorative` (vira `aria-hidden="true"`) ou `label` (vira `role="img"` com `aria-label` em português). Sem uma delas, não compila.

### Irregularidade

Desenhados à mão: retas com leve curvatura e pontas que não se fecham com perfeição. Sem motor de formas (ícones precisam ser estáveis e reconhecíveis). Sem filtro.

### Alto contraste e movimento

`currentColor` vira a cor do sistema em `forced-colors`. Sem movimento.

### Quadro ação → ícone (CR-03)

Um significado, um ícone. O mapa `ACAO_ICONE` em `icon.tsx` é a fonte e a vitrine o exibe.

| Ação ou significado                   | Ícone           |
| ------------------------------------- | --------------- |
| Avançar, ir para                      | `seta`          |
| Ler um caso, abrir página relacionada | `seta-diagonal` |
| Abrir em nova aba                     | `externo`       |
| Fechar                                | `fechar`        |
| Abrir menu                            | `menu`          |
| Concluído, selecionado                | `check`         |
| Expandir, adicionar                   | `mais`          |
| Recolher, remover                     | `menos`         |
| Tema claro                            | `sol`           |
| Tema escuro                           | `lua`           |
| E-mail                                | `mail`          |
| GitHub                                | `github`        |
| LinkedIn                              | `linkedin`      |
| WhatsApp                              | `whatsapp`      |
| Terminal                              | `terminal`      |
| Buscar                                | `busca`         |
| Erro, atenção                         | `alerta`        |
| Informação                            | `info`          |
| Abrir lista de opções                 | `seletor`       |

### Ficha de Texto

1. Quem lê: pessoas com leitor de tela, quando o ícone tem significado.
2. Grade de Tom: rótulo de interface, voz de sistema, objetiva.
3. Título: não se aplica.
4. Rótulos dos ícones com significado: os textos da coluna "Ação" acima, no infinitivo ou substantivo ("Fechar", "Abrir menu").
5. Ajuda: não se aplica.
6. Termos: nenhum novo.
7. Estados: não exibe dados.
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Cada ícone renderiza em grade 24 com traço 1,75 e pontas arredondadas.
- [x] CA-2 `decorative` gera `aria-hidden="true"`; `label` gera `role="img"` e `aria-label`.
- [x] CA-3 Sem `decorative` nem `label` o TypeScript reprova (teste de tipo).
- [x] CA-4 Cada nome aparece uma única vez no `ACAO_ICONE`.
- [x] CA-5 jest-axe sem violações.

## Plan

`src/components/ui/icon/{icon.tsx,icon.paths.tsx,icon.test.tsx,index.ts}`. Risco: ícones de marca (GitHub, LinkedIn, WhatsApp) ficam simplificados à mão, sem copiar o desenho oficial.

## Tarefas

- [x] Ficha
- [x] Desenhar os 19 ícones
- [x] Componente e tipos
- [x] Testes
- [ ] Quadro na vitrine
