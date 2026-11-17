import type { Metadata } from "next"
import { Button, ButtonLink } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Chip } from "@/components/ui/chip"
import { Dialog, DialogClose, Drawer } from "@/components/ui/dialog"
import { ACAO_ICONE, Icon } from "@/components/ui/icon"
import { Popover } from "@/components/ui/popover"
import { RadioGroup } from "@/components/ui/radio-group"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { Tooltip } from "@/components/ui/tooltip"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Ficha } from "@/components/ui/card"
import { LinkText } from "@/components/ui/link-text"
import { Spinner } from "@/components/ui/spinner"
import { Tag } from "@/components/ui/tag"
import { Demo, Row } from "../_showcase/demo"
import { FormDemo, ToastDemo } from "../_showcase/demos-client"

export const metadata: Metadata = { title: "Componentes" }

export default function ComponentesPage() {
  return (
    <main id="conteudo">
      <div className="py-12">
        <Eyebrow>Vitrine</Eyebrow>
        <h1 className="mt-4 text-h1">Componentes</h1>
        <p className="mt-4 max-w-measure text-body-lg text-ink-muted">
          Cada componente com variantes, tamanhos e estados. Os dados são fictícios.
        </p>

        <Demo
          id="button"
          title="Button"
          description="Padrão de estados do sistema: hover um passo mais escuro, ativo dois, foco desenhado, desabilitado com motivo."
        >
          <Row label="Variantes">
            <Button iconRight="seta">Vamos conversar</Button>
            <Button variant="secondary">Mais sobre mim</Button>
            <Button variant="ghost" iconLeft="terminal">
              Abrir o terminal
            </Button>
            <Button variant="link">Limpar filtros</Button>
          </Row>
          <Row label="ButtonLink (navegação, renderizado no servidor)">
            <ButtonLink
              href="/sistema/componentes#button"
              iconRight="seta"
              prefetch={false}
            >
              Ir para o exemplo
            </ButtonLink>
            <ButtonLink
              href="/sistema/componentes#button"
              variant="secondary"
              prefetch={false}
              seed="vitrine:button-link:secundario"
            >
              Ir para o exemplo
            </ButtonLink>
          </Row>
          <Row label="Tamanhos">
            <Button size="sm">Enviar mensagem</Button>
            <Button size="md">Enviar mensagem</Button>
            <Button size="lg">Enviar mensagem</Button>
          </Row>
          <Row label="Só ícone">
            <Button
              iconOnly="menu"
              aria-label="Abrir menu"
              variant="secondary"
              size="sm"
            />
            <Button iconOnly="fechar" aria-label="Fechar" variant="ghost" />
            <Button iconOnly="seta" aria-label="Avançar" size="lg" />
          </Row>
          <Row label="Estados">
            <Button loading loadingLabel="Enviando mensagem">
              Enviar mensagem
            </Button>
            <Button disabled disabledReason="Preencha nome e e-mail para enviar.">
              Enviar mensagem
            </Button>
            <Button
              variant="secondary"
              disabled
              disabledReason="Escolha um projeto para comparar."
            >
              Comparar projetos
            </Button>
          </Row>
          <Row label="Como link (asChild)">
            <Button asChild iconRight="seta">
              <a href="#button">Solicitar orçamento</a>
            </Button>
          </Row>
        </Demo>

        <Demo
          id="link-text"
          title="LinkText"
          description="Sublinhado de pincel que se redesenha no hover e no foco."
        >
          <Row label="Isolado">
            <LinkText href="/sistema">Voltar para a vitrine</LinkText>
            <LinkText href="/sistema/formas" size="marker">
              Ver o playground de formas
            </LinkText>
            <LinkText href="https://exemplo.com">Abrir o site de exemplo</LinkText>
          </Row>
          <Row label="Dentro do texto">
            <p className="max-w-measure">
              Trabalho com produto digital desde 2021 e{" "}
              <LinkText href="/sistema" variant="inline">
                documento o sistema que uso em cada projeto
              </LinkText>
              , do token ao componente.
            </p>
          </Row>
        </Demo>

        <Demo id="eyebrow" title="Eyebrow">
          <Row label="Tons">
            <Eyebrow>Serviços</Eyebrow>
            <Eyebrow tone="muted">Depoimento</Eyebrow>
          </Row>
        </Demo>

        <Demo id="tag-chip" title="Tag e Chip">
          <Row label="Tag">
            <Tag>React</Tag>
            <Tag>Next.js</Tag>
            <Tag tone="primary">Design system</Tag>
            <Tag tone="secondary-1">QA visual</Tag>
            <Tag tone="secondary-2">Handoff</Tag>
          </Row>
          <Row label="Tag com ponto de status (o texto sempre presente)">
            <Tag dot="success">no ar</Tag>
            <Tag dot="warning">em andamento</Tag>
          </Row>
          <div role="group" aria-label="Filtrar projetos por tecnologia (exemplo)">
            <Row label="Chip">
              <Chip defaultPressed>React</Chip>
              <Chip>Next.js</Chip>
              <Chip>TypeScript</Chip>
              <Chip disabled disabledReason="Nenhum projeto usa esta tecnologia.">
                Vue
              </Chip>
            </Row>
          </div>
        </Demo>

        <Demo id="ficha" title="Ficha" className="gap-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <Ficha
              title="Projeto fictício A"
              eyebrow="01"
              href="/sistema/componentes#ficha"
              tape="left"
            >
              Projeto para [a confirmar: cliente]
            </Ficha>
            <Ficha title="Projeto fictício B" eyebrow="02" tape="right" edge="torn">
              Produto próprio, como fundador
            </Ficha>
            <Ficha
              title="Design que o código aguenta: ação, ênfase e coração"
              eyebrow="03"
              holes
              footer={<LinkText href="/sistema">Ler o caso fictício</LinkText>}
            >
              Do protótipo ao componente, com tokens, biblioteca de componentes, handoff e
              QA visual.
            </Ficha>
          </div>
        </Demo>

        <Demo
          id="campos"
          title="Campos"
          description="Rótulo sempre visível, ajuda, erro que diz o que informar e contador. Envie vazio para ver os erros e depois um envio válido para ver a falha simulada."
        >
          <FormDemo />
          <div className="grid max-w-xl gap-6">
            <Select
              label="Tipo de projeto"
              name="tipo"
              options={[
                { value: "site", label: "Site institucional" },
                { value: "produto", label: "Produto digital" },
                { value: "ds", label: "Design system" },
              ]}
            />
            <Select label="Prazo" name="prazo" options={[]} loading />
            <TextField
              label="Empresa"
              name="empresa"
              optional
              placeholder="Nome fictício Ltda."
            />
            <TextField
              label="Telefone"
              name="telefone"
              disabled
              disabledReason="O contato por telefone abre depois que o e-mail for confirmado."
            />
          </div>
        </Demo>

        <Demo id="controles" title="Controles">
          <Row label="Checkbox">
            <div className="flex flex-col">
              <Checkbox
                label="Receber resposta por WhatsApp"
                description="Uso o número só para este projeto."
              />
              <Checkbox label="Todas as tecnologias" checked="indeterminate" />
              <Checkbox
                label="Assinar novidades"
                disabled
                disabledReason="As novidades começam junto com as páginas reais."
              />
            </div>
          </Row>
          <Row label="RadioGroup">
            <RadioGroup
              legend="Tipo de projeto"
              name="tipo-radio"
              defaultValue="produto"
              options={[
                { value: "site", label: "Site institucional" },
                {
                  value: "produto",
                  label: "Produto digital",
                  description: "Interface com login e dados.",
                },
                { value: "ds", label: "Design system" },
              ]}
            />
          </Row>
          <Row label="Switch">
            <div className="flex w-full max-w-sm flex-col">
              <Switch label="Animações do hero" defaultChecked showState />
              <Switch
                label="Som do terminal"
                disabled
                disabledReason="O site não tem som nesta versão."
              />
            </div>
          </Row>
          <Row label="SegmentedControl">
            <SegmentedControl
              label="Visualização dos projetos"
              options={[
                { value: "lista", label: "Lista" },
                { value: "grade", label: "Grade" },
                { value: "linha", label: "Linha do tempo" },
              ]}
            />
          </Row>
        </Demo>

        <Demo
          id="sobreposicoes"
          title="Sobreposições"
          description="Toast só para sucesso e informação. Erro é sempre inline."
        >
          <Row label="Dialog e Drawer">
            <Dialog
              title="Descartar rascunho"
              description="A mensagem que você escreveu será apagada deste navegador."
              size="sm"
              trigger={<Button variant="secondary">Abrir confirmação</Button>}
              footer={
                <>
                  <DialogClose asChild>
                    <Button variant="secondary">Continuar editando</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>Descartar rascunho</Button>
                  </DialogClose>
                </>
              }
            />
            <Drawer
              title="Menu de exemplo"
              trigger={<Button variant="secondary">Abrir painel lateral</Button>}
            >
              <p>Conteúdo do painel.</p>
            </Drawer>
          </Row>
          <Row label="Tooltip e Popover">
            <Tooltip content="Abrir o terminal">
              <Button
                iconOnly="terminal"
                aria-label="Abrir o terminal"
                variant="secondary"
              />
            </Tooltip>
            <Popover
              title="primary-fill"
              trigger={<Button variant="ghost">Ver o token primary-fill</Button>}
            >
              Passo 600 da primária no modo claro; 400 no escuro. Texto branco por cima a
              5,10:1.
            </Popover>
          </Row>
          <Row label="Toast">
            <ToastDemo />
          </Row>
        </Demo>

        <Demo id="tema" title="ThemeSwitcher">
          <ThemeSwitcher layout="grid" />
        </Demo>

        <Demo
          id="icones"
          title="Ícones"
          description="Um significado, um ícone. Decorativos ficam ocultos; os demais têm nome em português."
        >
          <table className="w-full max-w-2xl border-collapse text-left">
            <caption className="sr-only">Quadro ação e ícone</caption>
            <thead>
              <tr className="border-b-2 border-border font-mono text-label text-ink-subtle">
                <th scope="col" className="py-2">
                  Ação ou significado
                </th>
                <th scope="col" className="py-2">
                  Ícone
                </th>
                <th scope="col" className="py-2">
                  Nome
                </th>
              </tr>
            </thead>
            <tbody>
              {ACAO_ICONE.map(({ acao, icone }) => (
                <tr key={icone} className="border-b border-border">
                  <td className="py-2.5">{acao}</td>
                  <td className="py-2.5">
                    <Icon name={icone} size={24} decorative />
                  </td>
                  <td className="py-2.5 font-mono text-sm text-ink-muted">{icone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Demo>

        <Demo id="spinner" title="Spinner">
          <Row label="Tamanhos e rótulo">
            <Spinner size={16} />
            <Spinner />
            <Spinner size={24} label="Carregando projetos" />
          </Row>
        </Demo>
      </div>
    </main>
  )
}
