# Vitrine `/sistema`

## Spec

### Propósito

Página do próprio app que prova o sistema funcionando: fundamentos, formas, componentes, temas e acessibilidade, com os quatro temas trocados ao vivo. `noindex` e fora do sitemap. **Quando não usar:** como documentação de uso por quem visita o portfólio (é ferramenta de quem desenvolve e de quem avalia o trabalho).

### Anatomia

- Layout `/sistema/*`: navegação lateral (desktop, `nav` "Seções do sistema") ou Drawer "Seções" (mobile); ThemeSwitcher compacto fixo no topo da coluna de conteúdo; o conteúdo da página.
- Páginas: Visão geral (`/sistema`), Cores (`/sistema/cores`), Tipografia (`/sistema/tipografia`), Espaço e movimento (`/sistema/espaco`), Formas (`/sistema/formas`), Componentes (`/sistema/componentes`), Conteúdo e movimento (`/sistema/conteudo`), Achados (`/sistema/achados`), Hero (`/sistema/hero`), Temas (`/sistema/temas`), Acessibilidade (`/sistema/acessibilidade`).
- Cores: escalas de 11 passos (nome, hex, percentual aplicado, contraste contra papel e tinta) lidas do `tokens.generated.json` (calculado em build), amostras pintadas pelos próprios tokens (mudam com o tema), neutros, mapeamento semântico e a matriz de contraste com aprovado ou reprovado.
- Tipografia: cada fonte e a escala inteira com texto real em português.
- Espaço e movimento: escala de 4 px, sombras duras, durações e easing com demonstração (parada com movimento reduzido), camadas nomeadas.
- Temas: os quatro lado a lado (`data-theme` local) com o mesmo conjunto de componentes.
- Acessibilidade: relatório de contraste por tema e as verificações de teclado.

### Variantes

Não se aplicam (páginas).

### Estados

A vitrine é estática (pré-renderizada). Componentes mostram os próprios estados nas seções. O hex de cada passo vem do build; a amostra usa o token ao vivo.

### Teclado

"Pular para o conteúdo" leva ao conteúdo da página; a navegação lateral é uma lista de links com `aria-current="page"`; o Drawer "Seções" no mobile fecha com Esc.

### ARIA e nome acessível

`nav` "Seções do sistema"; cada página com um `h1`; tabelas com `caption` e cabeçalhos `scope`.

### Irregularidade

A navegação lateral usa traço à mão na seção atual. Amostras de cor em `blob`.

### Alto contraste e movimento

Amostras ganham borda real; demonstrações de movimento param com movimento reduzido.

### Ficha de Texto

1. Quem lê: quem desenvolve as páginas e quem avalia o sistema.
2. Grade de Tom: vitrine, voz de sistema, objetiva.
3. Títulos: "Sistema", "Cores", "Tipografia", "Espaço e movimento", "Temas", "Acessibilidade".
4. Rótulos: "Seções do sistema", "Seções" (gatilho do Drawer).
5. Ajuda: uma frase por seção explicando o que se vê.
6. Termos: "vitrine", "tema", "token".
7. Estados: não carrega dados em tempo de execução.
8. Erros: não se aplica.
9. Sucesso: não se aplica.
10. Números: contrastes por `formatNumber` (duas casas, vírgula), percentuais por `formatPercent`.
11. Dados fictícios em todos os exemplos.
12. Nenhuma exceção.

### Critérios de aceite

- [x] CA-1 Todas as páginas existem, com `h1`, `noindex` e fora do sitemap.
- [x] CA-2 Navegação lateral com a página atual marcada; Drawer no mobile.
- [x] CA-3 Escalas e matriz de contraste vindas do build, com amostras pintadas pelos tokens.
- [x] CA-4 Os quatro temas lado a lado com o mesmo conjunto de componentes.
- [ ] CA-5 Playwright + axe sem violações em todas as páginas nos 4 temas (etapa 7).

## Plan

`src/app/sistema/layout.tsx` com `SystemNav` (cliente, `usePathname`), páginas novas e o `_showcase` com os blocos reutilizáveis. Risco: página de cores longa; dividida por escala com cabeçalhos claros.

## Tarefas

- [x] Ficha
- [x] Layout e navegação
- [x] Cores, tipografia, espaço e movimento
- [x] Temas e acessibilidade
- [x] Testes
