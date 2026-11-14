import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import jsxA11y from "eslint-plugin-jsx-a11y"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // O plugin jsx-a11y já é registrado pelo eslint-config-next; aqui só
  // elevamos o conjunto recomendado a erro.
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Regiões com rolagem precisam de foco pelo teclado (role="region").
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { roles: ["tabpanel", "region"], tags: [] },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message:
            "Use o PRNG com seed de @/lib/shapes (regra SH-01). Math.random quebra a hidratação.",
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/format/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name=/^toLocale(Date|Time)?String$/]",
          message: "Formate por @/lib/format (regra NU-12).",
        },
        {
          selector: "NewExpression[callee.object.name='Intl']",
          message: "Formate por @/lib/format (regra NU-12).",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "reference/**",
    "playwright-report/**",
    "test-results/**",
    "docs/screenshots/**",
  ]),
])

export default eslintConfig
