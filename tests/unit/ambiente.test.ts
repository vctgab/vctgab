import { readFileSync } from "node:fs"

describe("ambiente", () => {
  it("fixa a versão do Node no .nvmrc", () => {
    expect(readFileSync(".nvmrc", "utf8").trim()).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
