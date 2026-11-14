# VideoClip

> Ficha de Componente. Escrita antes do código. Seções na ordem: Spec, Plan, Tarefas.

## Spec

### Propósito

Mostrar um vídeo curto de produto (até 30 s), sem som, com legenda e controles, como prova de produto em uso. Enquanto o vídeo não existir, mostra uma `Ficha` marcada como pendência, nunca um player vazio. **Quando não usar:** vídeo com fala (precisa de transcrição e áudio, outro componente); decoração de fundo.

### Anatomia e slots

- Moldura: `Ficha` (sem link) com título e, quando houver, descrição.
- Mídia: `<video>` com `controls`, `muted`, `playsInline`, `preload="metadata"`, `poster` e `<track kind="captions" srclang="pt-BR" default>`.
- Estado: texto abaixo da mídia (carregando, erro) ligado por `aria-describedby`.

Props: `title`, `src: Maybe<string> | null`, `captions: Maybe<string>`, `poster?: Maybe<string>`, `description?: Maybe<string>`, `seed`.

### Variantes e tamanhos

| Variante | Uso                                            |
| -------- | ---------------------------------------------- |
| padrão   | Largura do contêiner, proporção 16:9 reservada |

### Estados

| Estado       | Comportamento                                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Indisponível | `src` pendente: `Ficha` com o título e `[a confirmar: …]` do vídeo; sem `<video>`.                                                                                               |
| Vazio        | `src` igual a `null` (projeto sem vídeo): "Este projeto ainda não tem vídeo."                                                                                                    |
| Carregando   | Até o primeiro quadro: área 16:9 reservada (capa, se houver) e "Carregando vídeo" com `Spinner`.                                                                                 |
| Erro         | Falha no arquivo: "Não foi possível carregar o vídeo. Verifique a conexão e recarregue a página. Nada do que você fez nesta página se perdeu." (`role="alert"`, ícone `alerta`). |
| Com dados    | Vídeo com controles e legenda. Reprodução automática em laço só com movimento permitido; com `prefers-reduced-motion`, começa parado.                                            |

Hover, foco, ativo e desabilitado são os dos controles nativos do navegador.

### Teclado

Controles nativos do `<video>` (Tab chega ao player; espaço reproduz e pausa).

### ARIA e nome acessível

`<video aria-label={title}>`; `aria-describedby` aponta para a descrição. Legenda obrigatória quando há vídeo.

### Irregularidade

A moldura é a `Ficha` (forma do motor, seed `video:<seed>`). O vídeo fica em fluxo normal, dentro do padding de segurança.

### Alto contraste e movimento

`forced-colors`: a `Ficha` vira borda real. Movimento: sem reprodução automática com `prefers-reduced-motion`; os controles continuam.

### Ficha de Texto

1. Quem lê: cliente avaliando prova de produto.
2. Grade de Tom: carregando (sistema) "Carregando vídeo"; erro (sistema) frase acima; vazio (sistema) "Este projeto ainda não tem vídeo."; indisponível (sistema) `[a confirmar: …]`.
3. Título: vem do conteúdo ("Nexuscoop em 30 segundos").
4. Ações: nenhuma própria (controles nativos).
5. Ajuda: não se aplica.
6. Termos: "projeto".
7. Estados: ver tabela.
8. Erros previstos: arquivo indisponível ou formato sem suporte.
9. Confirmações: não se aplica.
10. Números e datas: nenhum.
11. Dados reais evitados: sem vídeo inventado; pendência explícita.
12. Exceções: nenhuma.

### Critérios de aceite

- [ ] CA-1 Pendente: Ficha com a marca `[a confirmar: …]` e nenhum `<video>`.
- [ ] CA-2 Vazio: "Este projeto ainda não tem vídeo."
- [ ] CA-3 Carregando: área reservada e "Carregando vídeo" até `loadeddata`.
- [ ] CA-4 Erro: mensagem com o prefixo "Não foi possível" em `role="alert"`.
- [ ] CA-5 Com dados: `<video>` com `controls`, `muted`, `playsInline`, legenda `pt-BR` e nome acessível.
- [ ] CA-6 Com movimento reduzido, não chama `play()`; com movimento permitido, chama.
- [ ] CA-7 Sem violação no jest-axe nos estados.

## Plan

`src/components/ui/video-clip/video-clip.tsx` (Client Component: precisa de `matchMedia` e dos eventos do vídeo), `index.ts`, `video-clip.test.tsx`. Usa `Ficha`, `Spinner`, `Icon`, `Fact`. Vitrine em `/sistema/conteudo` com indisponível, vazio e erro (sem arquivo de vídeo real no repositório; "com dados" fica coberto pelo teste).

## Tarefas

- [x] Ficha
- [x] Implementação
- [x] Testes (um por critério)
- [x] Seção na vitrine
