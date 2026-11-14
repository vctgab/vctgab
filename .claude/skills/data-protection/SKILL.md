---
name: data-protection
description: Regras de dados do portfólio vctgab (repositório que pode ser público). Use sempre que a tarefa tocar dados de pessoas ou clientes, depoimentos, números de resultado, contato (e-mail, WhatsApp, LinkedIn), formulários, fixtures, testes, capturas, variáveis de ambiente ou qualquer coisa que possa expor informação real. Triggers on "depoimento", "cliente", "caso", "contato", "formulário", "fixture", "captura", "e-mail", "WhatsApp", ".env", "segredo", "token de API".
---

# Proteção de dados

O repositório pode ser público. Nada real que não tenha sido autorizado entra nele.

1. **Nunca dados reais de clientes** em fixtures, testes, vitrine ou capturas (DD-01). Use dados fictícios marcados ("Projeto fictício A", "Pessoa fictícia B", "nome@exemplo.com").
2. **Fato ausente** vira exatamente `[a confirmar: o que falta]` — nome de cliente, cargo, depoimento, número de resultado, domínio, e-mail, WhatsApp, LinkedIn, mês da agenda.
3. **Número de resultado** só com método (`Stat` exige `method`); sem método conhecido, `[a confirmar: método]`.
4. **Depoimento** só com autorização da pessoa; até lá, o estado "indisponível" do `Quote`.
5. **Material de outros projetos** (documentos de processo, regras, prints) serve só como modelo: não copiar nomes de pessoas, rotas, termos de negócio nem dados deles.
6. **Segredos** nunca no código nem em commit. Variáveis em `.env*` (ignorados pelo git); documentar a chave em `.env.example` com `[a confirmar: …]`.
7. **Referência local** (`reference/`) fica fora do git.
8. **Erro na tela** nunca mostra `error.message`, stack, código ou identificador técnico (ER-03).
9. **Formulário de contato**: o que a pessoa escreveu é mantido quando o envio falha, e a mensagem diz isso (MS-02).

Ao terminar, rode `pnpm test` (a varredura de `tests/unit/rules.test.ts` cobre parte destas regras) e revise as capturas antes de commitar.
