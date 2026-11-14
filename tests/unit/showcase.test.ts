import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { SECTIONS } from "@/app/sistema/_showcase/sections"
import sitemap from "@/app/sitemap"

describe("vitrine /sistema", () => {
  it("CA-1: toda seção da navegação tem página com h1", () => {
    for (const s of SECTIONS) {
      const file = join(process.cwd(), "src/app", s.href, "page.tsx")
      expect(existsSync(file)).toBe(true)
      const source = readFileSync(file, "utf8")
      // A página do hero usa o h1 do próprio Hero.
      expect(/<h1|<Hero /.test(source)).toBe(true)
    }
  })

  it("CA-1: noindex no layout e fora do sitemap", () => {
    const layout = readFileSync(join(process.cwd(), "src/app/sistema/layout.tsx"), "utf8")
    expect(layout).toMatch(/robots:\s*\{\s*index:\s*false/)
    expect(sitemap().some((entry) => entry.url.includes("/sistema"))).toBe(false)
  })
})
