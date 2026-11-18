# CaseFooter

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas. Decisão: D-1314.

## Spec

### Propósito

Fecha um caso: leva ao próximo projeto e repete os dois CTAs ("tenho uma vaga", "tenho um projeto"). **Quando não usar:** rodapé do site (`Footer`).

### Anatomia e slots

`<footer>` do conteúdo: (1) `nav` "Próximo projeto" com o rótulo "Próximo projeto:" e um `LinkText` com o nome do projeto seguido de seta; (2) os dois CTAs como `ButtonLink` para `/contato?aba=vaga` e `/contato?aba=projeto`. Props: `next: { name: string; href: string }`, `ctas` (vêm do conteúdo da Home: mesmos rótulos e destinos).

### Variantes e tamanhos

| Variante | Uso                                                                            |
| -------- | ------------------------------------------------------------------------------ |
| padrão   | próximo projeto à esquerda e CTAs à direita a partir de `md`; empilhados antes |

### Estados

Links e botões seguem o padrão do sistema (hover, foco, ativo). Desabilitado não se aplica. Indisponível: se a rota do próximo projeto ainda não existe, o link segue (sem pré-busca, para não gerar 404 no console) e o `release:check` acusa.

### Teclado

Tab percorre "Kasb Health", "tenho uma vaga", "tenho um projeto"; Enter segue o link.

### ARIA e nome acessível

`<footer>` dentro de `main` (não é landmark `contentinfo`). `nav` com nome "Próximo projeto". O link tem o nome do projeto; a seta é decorativa. Os CTAs têm o nome do rótulo.

### Irregularidade

`Divider` desenhado no topo; os botões e o `LinkText` já trazem as formas do sistema. Sem camada nova.

### Alto contraste e movimento

Herdados dos componentes usados.

### Ficha de Texto

1. Quem lê: quem terminou o caso.
2. Linha da Grade de Tom: rodapé do caso, voz de sistema.
3. Título e subtítulo: "Próximo projeto:".
4. Ações e rótulos: "Kasb Health", "tenho uma vaga", "tenho um projeto".
5. Ajuda e placeholders: não há.
6. Termos novos ou dúvidas de glossário: nenhum.
7. Estados: ver acima.
8. Erros previstos: nenhum.
9. Confirmações e sucesso: nenhuma.
10. Números e datas: não há.
11. Apoio de IA e dados reais evitados: não há.
12. Exceções pedidas: nenhuma.

### Critérios de aceite

- [ ] CA-1 Mostra "Próximo projeto:" e o link para `next.href` com o nome do projeto (componente).
- [ ] CA-2 Os CTAs levam a `/contato?aba=vaga` e `/contato?aba=projeto` (componente e e2e).
- [ ] CA-3 O link do próximo projeto não pré-busca a rota (componente).
- [ ] CA-4 jest-axe sem violações; axe nas 8 combinações (e2e do caso).
- [ ] CA-5 `pnpm release:check` acusa `/projetos/kasb-health` enquanto a rota não existir (script).

## Plan

`src/components/ui/case-footer/case-footer.tsx` (servidor), `index.ts`, teste. Usa `Divider`, `LinkText`, `ButtonLink`, `Icon`. Risco: nenhum além da rota inexistente, que é registrada de propósito.

## Tarefas

- [x] Ficha
- [ ] Implementação
- [ ] Testes (um por critério)
- [ ] Seção na vitrine
