# Button

> Componente-padrão de estados. Todo componente interativo novo copia daqui: hover um passo mais escuro, ativo dois passos, foco desenhado a 3:1, desabilitado com motivo, pressionar com feedback físico.

## Spec

### Propósito

Disparar uma ação ou, com `asChild`, navegar com a aparência de botão (ex.: "Vamos conversar" apontando para o contato). **Quando não usar:** navegação dentro de texto (use `LinkText`); filtros alternáveis (use `Chip`); escolha entre opções (use `SegmentedControl`).

### Anatomia

1. Hospedeiro `<button>` (ou o filho via `Slot` com `asChild`), retangular, com `border-radius` do motor.
2. Camadas `Shape` `wobblyRect` (bucket `sm`): sombra dura, preenchimento desalinhado, contorno.
3. Ícone à esquerda e/ou à direita (`Icon` decorativo).
4. Rótulo em Patrick Hand.
5. Spinner no lugar do ícone esquerdo quando `loading`.
6. Motivo de desabilitado: texto visível abaixo, ligado por `aria-describedby`.

### Variantes e tamanhos

| Variante    | Preenchimento                                                    | Texto                                      | Contorno | Sombra          | Uso                                           |
| ----------- | ---------------------------------------------------------------- | ------------------------------------------ | -------- | --------------- | --------------------------------------------- |
| `primary`   | `primary-fill` (passo 600; hover 700; ativo 800)                 | `on-primary`                               | `stroke` | `shadow-ink` md | Uma ação principal por área                   |
| `secondary` | `surface-raised` (hover `surface-hover`; ativo `surface-active`) | `ink`                                      | `stroke` | `shadow-ink` md | Ações secundárias                             |
| `ghost`     | nenhum (hover `surface-hover`; ativo `surface-active`)           | `ink`                                      | nenhum   | nenhuma         | Ações discretas em barras e diálogos          |
| `link`      | nenhum                                                           | `primary-text` com traço à mão sob o texto | nenhum   | nenhuma         | Ação com cara de link (ex.: "Limpar filtros") |

| Tamanho | Altura mínima | Rótulo | Padding horizontal |
| ------- | ------------- | ------ | ------------------ |
| `sm`    | 44 px         | 18 px  | 16 px              |
| `md`    | 48 px         | 20 px  | 20 px              |
| `lg`    | 56 px         | 22 px  | 28 px              |

Só ícone: quadrado de 44, 48 ou 56 px, `aria-label` obrigatório pelo tipo.

### Estados

| Estado       | Comportamento                                                                                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Padrão       | Conforme a variante.                                                                                                                                                                                                                   |
| Hover        | Preenchimento um passo mais escuro (`--shape-fill`), 120 ms.                                                                                                                                                                           |
| Foco visível | `outline` 2,5 px em `focus-ring` (3:1), deslocado 3 px, seguindo o `border-radius` do motor.                                                                                                                                           |
| Ativo        | Preenchimento dois passos mais escuro; o botão desce 2 px e a sombra dura colapsa; solta com `ease-hand` (leve overshoot).                                                                                                             |
| Desabilitado | `aria-disabled="true"` (continua focável para ler o motivo), cliques ignorados, preenchimento `surface-sunken`, texto `ink-disabled` (3:1) e contorno tracejado como segundo indicador; motivo visível obrigatório (`disabledReason`). |
| Carregando   | `aria-busy="true"`, cliques ignorados, Spinner no lugar do ícone, rótulo troca para `loadingLabel` (padrão: o próprio rótulo). Largura não muda.                                                                                       |
| Erro         | Não se aplica: o erro aparece inline no lugar onde ocorreu (MS-03), nunca no botão.                                                                                                                                                    |
| Selecionado  | Não se aplica (use `Chip` ou `SegmentedControl`).                                                                                                                                                                                      |

### Teclado

| Tecla         | Ação                                             |
| ------------- | ------------------------------------------------ |
| Tab           | Foca (inclusive desabilitado, para ler o motivo) |
| Enter, Espaço | Aciona (exceto desabilitado ou carregando)       |

### ARIA e nome acessível

`<button type="button">` por padrão. Nome vem do rótulo; só ícone exige `aria-label`. Desabilitado: `aria-disabled` + `aria-describedby` apontando para o motivo. Carregando: `aria-busy`.

### Irregularidade

`wobblyRect` bucket `sm`, seed = `seed` ou o rótulo (string) com a variante, ou `useId`. Contorno 2 px, desalinhamento do preenchimento de 1 a 2 px × energia. Sem rotação (controle interativo). Padding horizontal ≥ 16 px e vertical ≥ 6 px, acima da amplitude máxima do bucket (2,8 px) + traço.

### Alto contraste e movimento

`forced-colors`: camadas somem, borda real `ButtonText` com o mesmo raio; foco em `Highlight` (padrão do sistema). Movimento reduzido: sem deslocamento ao pressionar, sem transição; a mudança de cor continua (não é movimento).

### Ficha de Texto

1. Quem lê: quem visita o portfólio (fundadores, equipes) e quem usa teclado ou leitor de tela.
2. Grade de Tom: contato, objetivo e motivador ("Vamos conversar"); ações de sistema, voz de sistema.
3. Título: não se aplica.
4. Ações: verbo + objeto ("Enviar mensagem", "Abrir WhatsApp", "Copiar código de uso", "Limpar filtros"). Exceção de produto: "Vamos conversar" (convite, aprovado no layout da home; tem verbo).
5. Ajuda: o motivo de desabilitado diz o que falta ("Preencha nome e e-mail para enviar.").
6. Termos: nenhum novo.
7. Estados: carregando ("Enviando mensagem"); desabilitado com motivo.
8. Erros: não exibe erro.
9. Sucesso: não exibe sucesso (fica no componente que agiu).
10. Números: não se aplica.
11. Sem dados reais.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Quatro variantes e três tamanhos renderizam com altura mínima de 44 px.
- [x] CA-2 Só ícone sem `aria-label` não compila; com ele, o nome acessível é o rótulo.
- [x] CA-3 Desabilitado sem `disabledReason` não compila; com ele, o motivo é visível, ligado por `aria-describedby`, e o clique não dispara.
- [x] CA-4 Carregando expõe `aria-busy`, mostra o Spinner e não dispara o clique.
- [x] CA-5 `asChild` renderiza um link com as camadas de forma e sem `<button>` aninhado.
- [x] CA-6 Mesma seed, mesmo contorno; rótulos diferentes, contornos diferentes.
- [x] CA-7 Enter e Espaço acionam; Tab foca o botão desabilitado.
- [x] CA-8 Contraste dos estados (`on-primary` sobre `primary-fill`, `-hover`, `-active`; `ink` sobre `surface-hover`, `surface-active`) aprovado em `tokens:build`.
- [x] CA-9 jest-axe sem violações em todas as variantes.
- [x] CA-10 Capturas em 390 e 1280 px nos 4 temas e recorte 2x da borda sem serrilhado (etapa 7).

## Plan

`src/components/ui/button/{button.tsx,button.variants.ts,button.test.tsx,index.ts}`. Estados de cor por variáveis `--shape-fill` trocadas em `hover:`/`active:` (Tailwind com propriedade arbitrária, sem valor solto de espaçamento nem cor). Risco: Patrick Hand tem métrica alta; o alinhamento ótico pede ajuste de 1 px no topo (verificar na captura).

## Tarefas

- [x] Ficha
- [x] Variantes (`button.variants.ts`)
- [x] Componente
- [x] Testes CA-1 a CA-9
- [ ] Seção na vitrine e capturas
