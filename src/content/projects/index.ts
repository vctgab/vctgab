import { NEXUSCOOP } from "./nexuscoop.ts"
import type { ProjectCase } from "./types.ts"

export * from "./list.ts"
export * from "./types.ts"
export { NEXUSCOOP }

/** Casos publicados, por slug. Um caso novo entra aqui e em `src/app/projetos/<slug>/`. */
export const CASES: Readonly<Record<string, ProjectCase>> = { nexuscoop: NEXUSCOOP }
