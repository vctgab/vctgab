# Accordion e TerminalShell

## Spec

### Propósito

- **Accordion:** perguntas e respostas ou detalhes que se expandem.
- **TerminalShell:** só a moldura visual do terminal `cmd` (saída e linha de prompt). A lógica de comandos fica para depois.

**Quando não usar:** Accordion para o conteúdo principal de uma página (esconde informação); TerminalShell como única forma de chegar a algo (o terminal é camada de mistério; tudo tem caminho normal).

### Anatomia

- Accordion: itens com gatilho (`h3` > `button`), ícone `mais`/`menos`, painel. Divisor tracejado entre itens.
- TerminalShell: janela escura `wobblyRect` lg (`footer-bg`, texto `footer-ink`), barra de título com o nome, área de saída (mono 14,5 px), linha de prompt com `>_` e um campo de texto. Entra num Dialog aberto pelo botão `cmd` do Header.

### Variantes

| Componente    | Props                                                                |
| ------------- | -------------------------------------------------------------------- |
| Accordion     | `items` (`value`, `title`, `content`), `type` (`single`, `multiple`) |
| TerminalShell | `lines` (saída inicial), `placeholder`                               |

### Estados

Accordion: fechado, aberto (ícone `menos`, o painel aparece), hover no gatilho (`surface-hover`), foco do padrão; desabilitado com motivo no item. TerminalShell: pronto (prompt), digitando; os comandos ainda não respondem: ao enviar, a linha volta como eco e aparece a mensagem de mistério "Este terminal ainda está aprendendo comandos. Volte em breve.".

### Teclado

Accordion: Tab entre gatilhos, Enter/Espaço alternam, setas (Radix). TerminalShell: foco vai para o campo ao abrir; Enter envia; Esc fecha o Dialog.

### ARIA e nome acessível

Accordion: botões com `aria-expanded` e `aria-controls` (Radix). TerminalShell: região `log` com `aria-live="polite"` para a saída; campo com rótulo oculto "Comando".

### Irregularidade

Accordion: divisores `handLine`. TerminalShell: forma `wobblyRect` lg com preenchimento `footer-bg`, contorno `footer-ink` e sombra `shadow-ink`.

### Alto contraste e movimento

Accordion sem animação de altura com movimento reduzido. Terminal com borda real.

### Ficha de Texto

1. Quem lê: curiosos (terminal) e visitantes (accordion).
2. Grade de Tom: terminal é camada de mistério, humor leve permitido; accordion, voz de sistema.
3. Títulos: "Terminal".
4. Rótulos: "Comando" (oculto), "Fechar o terminal".
5. Placeholder: "digite ajuda".
6. Termos: "terminal".
7. Estados: pronto.
8. Erros: não há erro técnico; comando desconhecido recebe a mensagem de mistério.
9. Sucesso: não se aplica.
10. Números: não se aplica.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Accordion alterna com teclado e expõe `aria-expanded`.
- [x] CA-2 TerminalShell foca o campo, ecoa o comando e responde com a mensagem de mistério.
- [x] CA-3 Saída em região `log`.
- [x] CA-4 O botão `cmd` do Header abre o terminal num Dialog.
- [x] CA-5 jest-axe sem violações.

## Plan

`src/components/ui/{accordion,terminal-shell}/*` e `src/components/layout/terminal/*` (Dialog + Header).

## Tarefas

- [x] Ficha
- [x] Componentes
- [x] Testes
- [x] Vitrine
