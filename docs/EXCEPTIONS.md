# Exceções

Exceções às regras de `docs/RULES.md`. Só valem com todos os campos preenchidos e aprovação de Victor. Passada a data limite, a exceção deixa de valer. ER-03, BT-05, AC-03, VI-05, MS-04 e VZ-05 não admitem exceção.

| ID  | Regra | Componente | Motivo | Aprovado por Victor | Data limite |
| --- | ----- | ---------- | ------ | ------------------- | ----------- |

Nenhuma exceção registrada.

## Divergências entre navegadores sem correção

Diferenças de motor que o código não consegue corrigir (etapa 0.3 da fase 2). Nenhuma quebra uma regra: o resultado continua legível e acessível, só menos refinado. Ficam aqui com data para reavaliar; passada a data, rodar de novo `tests/e2e/engines.spec.ts` e atualizar.

| ID    | Motor               | O que diverge                                                                                                                                               | Efeito e alternativa                                                                                                                                                                       | Aprovado por Victor | Data limite |
| ----- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ----------- |
| NV-01 | Firefox 159         | Sem `text-wrap: pretty` (`CSS.supports` falso).                                                                                                             | Parágrafos usam a quebra padrão: às vezes sobra uma palavra sozinha na última linha. Títulos usam `balance`, que o Firefox tem.                                                            | pendente            | 14/05/2027  |
| NV-02 | WebKit (Playwright) | Não hifeniza pt-BR (sem dicionário nesta build). O Safari no macOS e no iOS hifeniza.                                                                       | Palavras longas quebram sem hífen; `overflow-wrap: break-word` impede transbordo. Conferir num Safari real.                                                                                | pendente            | 14/05/2027  |
| NV-03 | WebKit / Safari     | Com a configuração padrão, o Tab pula links; só Option+Tab (ou "Pressionar Tab para realçar cada item") chega a eles. No WebKit do Playwright, nem Alt+Tab. | Comportamento do navegador, não do site. Os testes de teclado no WebKit focam o link diretamente e conferem visibilidade e destino; Chromium e Firefox percorrem a ordem completa com Tab. | pendente            | 14/05/2027  |
