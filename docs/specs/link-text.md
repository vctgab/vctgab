# LinkText

## Spec

### Propósito

Link de navegação com sublinhado de pincel. **Quando não usar:** ações que não navegam (use `Button`); ação principal com cara de botão (use `Button asChild`).

### Anatomia

1. `<a>` (interno via `next/link`, externo nativo).
2. Rótulo.
3. Sublinhado: `Shape` `handLine` com `pathLength=1`, sempre visível (segundo indicador além da cor, VI-06).
4. Externo: ícone `externo` decorativo + texto oculto " (abre em nova aba)".

### Variantes

| Variante              | Uso                                                            | Sublinhado                                                                      |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `standalone` (padrão) | Link isolado ("Ver todos os projetos", "Ler o caso Nexuscoop") | Traço à mão em SVG que se redesenha no hover e no foco                          |
| `inline`              | Link dentro de parágrafo                                       | Sublinhado nativo de 2 px em `primary-decor`, que acompanha as quebras de linha |

Tamanho: herda o texto ao redor; `standalone` aceita `size` `body` ou `marker` (Patrick Hand, como "Ver todos os projetos" no layout).

### Estados

| Estado                                      | Comportamento                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Padrão                                      | Texto `primary-text`, sublinhado em `primary-decor`.                                                               |
| Hover                                       | Texto `primary-text-hover`; o traço se redesenha da esquerda para a direita (`stroke-dashoffset` 1 → 0) em 200 ms. |
| Foco visível                                | `outline` 2,5 px `focus-ring` + o mesmo redesenho.                                                                 |
| Ativo                                       | Texto `primary-text-hover`, traço mais grosso (3 px).                                                              |
| Visitado                                    | Igual ao padrão (portfólio curto; diferenciar não ajuda).                                                          |
| Desabilitado, carregando, erro, selecionado | Não se aplicam a links. Um destino indisponível não vira link: vira texto com `[a confirmar: …]`.                  |

### Teclado

| Tecla | Ação   |
| ----- | ------ |
| Tab   | Foca   |
| Enter | Navega |

### ARIA e nome acessível

Nome vem do rótulo, que precisa se entender fora do contexto (BT-04). Externo: `target="_blank"`, `rel="noopener noreferrer"` e " (abre em nova aba)" no nome acessível.

### Irregularidade

`handLine` bucket `sm`, seed = `seed` ou o `href` + rótulo. Sem rotação.

### Alto contraste e movimento

`forced-colors`: o traço SVG some e entra `text-decoration: underline` nativo em `LinkText`. Movimento reduzido: o traço fica parado (sem redesenho), a cor ainda muda.

### Ficha de Texto

1. Quem lê: visitantes navegando entre páginas.
2. Grade de Tom: navegação, voz de sistema, objetiva.
3. Título: não se aplica.
4. Rótulos: verbo + destino ("Ver todos os projetos", "Ler o caso Nexuscoop", "Abrir o GitHub de Victor"). Nunca "Clique aqui" ou "Saiba mais".
5. Ajuda: " (abre em nova aba)" nos externos.
6. Termos: "caso" conforme o glossário.
7. Estados: não exibe dados.
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Sem dados reais nos testes (URLs de exemplo).
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Interno renderiza `<a href>` com o sublinhado SVG `pathLength=1`.
- [x] CA-2 Externo tem `target="_blank"`, `rel="noopener noreferrer"`, ícone decorativo e nome acessível terminado em "(abre em nova aba)".
- [x] CA-3 `inline` não usa SVG e mantém sublinhado nativo.
- [x] CA-4 O redesenho só roda com movimento permitido (`motion-safe:`).
- [x] CA-5 jest-axe sem violações.

## Plan

`src/components/ui/link-text/*`. Redesenho por `@keyframes redesenhar` (dashoffset 1 → 0) aplicado em `group-hover`/`group-focus-visible`.

## Tarefas

- [x] Ficha
- [x] Componente
- [x] Testes
- [ ] Vitrine
