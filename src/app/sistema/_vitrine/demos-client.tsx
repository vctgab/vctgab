"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Quote, type QuoteItem, type QuoteStatus } from "@/components/ui/quote"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { TextField } from "@/components/ui/text-field"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"

/** Dispara os dois tons de aviso permitidos. */
export function ToastDemo() {
  const toast = useToast()
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="secondary"
        onClick={() => toast({ tone: "sucesso", title: "Código copiado." })}
      >
        Mostrar aviso de sucesso
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            tone: "informacao",
            title: "Tema salvo neste navegador.",
            description: "Ele volta na próxima visita.",
          })
        }
      >
        Mostrar aviso de informação
      </Button>
    </div>
  )
}

/**
 * Formulário fictício que provoca os erros previstos. Nada é enviado: o
 * envio simula a falha para mostrar o padrão MS-02 inline.
 */
export function FormDemo() {
  const [errors, setErrors] = useState<{ email?: string; mensagem?: string }>({})
  const [failure, setFailure] = useState(false)
  const [sending, setSending] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email") ?? "")
    const mensagem = String(data.get("mensagem") ?? "")
    const next = {
      email: email.includes("@") ? undefined : "Informe um e-mail com @.",
      mensagem:
        mensagem.trim().length >= 20
          ? undefined
          : "Escreva a mensagem com pelo menos 20 caracteres.",
    }
    setErrors(next)
    setFailure(false)
    if (next.email || next.mensagem) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setFailure(true)
    }, 600)
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex max-w-xl flex-col gap-6">
      <TextField
        label="E-mail"
        name="email"
        type="email"
        placeholder="nome@exemplo.com"
        error={errors.email}
      />
      <Textarea
        label="Mensagem"
        name="mensagem"
        maxLength={600}
        showCounter
        hint="Conte o que você precisa colocar no ar."
        error={errors.mensagem}
      />
      {failure ? (
        <div role="alert" className="flex flex-col gap-1 text-body text-danger-text">
          <p className="font-medium">Não foi possível enviar a mensagem.</p>
          <p className="text-ink">
            A conexão com o servidor de e-mail falhou (simulação da vitrine). O que você
            escreveu foi mantido. Tente de novo ou use o WhatsApp.
          </p>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          loading={sending}
          loadingLabel="Enviando mensagem"
          iconRight="seta"
        >
          Enviar mensagem
        </Button>
        {failure ? (
          <Button variant="secondary" type="submit">
            Tentar enviar de novo
          </Button>
        ) : null}
      </div>
    </form>
  )
}

const DEPOENTES: QuoteItem[] = [
  {
    id: "a",
    author: "Pessoa fictícia A",
    role: "[a confirmar: cargo e empresa]",
    text: "[a confirmar: texto do depoimento]",
  },
  {
    id: "b",
    author: "Pessoa fictícia B",
    role: "Cargo fictício, empresa fictícia",
    text: "Texto fictício: entregou a interface no prazo e deixou o time mais rápido.",
  },
  {
    id: "c",
    author: "Pessoa fictícia C",
    role: "Cargo fictício, empresa fictícia",
    text: "Texto fictício: o design system aguentou o crescimento do produto.",
  },
]

/** Quote com seletor de estado, para ver os cinco estados (MS-04). */
export function QuoteDemo() {
  const [status, setStatus] = useState<QuoteStatus>("pronto")
  return (
    <div className="flex flex-col gap-8">
      <SegmentedControl
        label="Estado do exemplo"
        value={status}
        onValueChange={(v) => setStatus(v as QuoteStatus)}
        options={[
          { value: "pronto", label: "Com dados" },
          { value: "carregando", label: "Carregando" },
          { value: "vazio", label: "Vazio" },
          { value: "erro", label: "Erro" },
        ]}
      />
      <Quote
        items={status === "pronto" || status === "carregando" ? DEPOENTES : []}
        status={status}
        autoAdvanceMs={8000}
        onRetry={() => setStatus("carregando")}
      />
      <Quote items={[]} status="indisponivel" />
    </div>
  )
}
