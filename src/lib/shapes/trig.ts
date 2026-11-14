/**
 * Seno e cosseno determinísticos. `Math.sin` e `Math.cos` podem diferir no
 * último bit entre motores (V8 no servidor, SpiderMonkey ou JavaScriptCore
 * no navegador), o que mudaria o caminho e quebraria a hidratação. Aqui só
 * há soma, subtração, multiplicação e divisão IEEE, idênticas em qualquer
 * motor. Erro máximo abaixo de 1e-9, muito além do necessário para formas.
 */

export const PI = 3.141592653589793
export const TAU = 6.283185307179586
const HALF_PI = 1.5707963267948966

/** Reduz para [−π, π]. */
function reduce(x: number): number {
  return x - TAU * Math.round(x / TAU)
}

/** Seno determinístico. */
export function dsin(angle: number): number {
  let x = reduce(angle)
  if (x > HALF_PI) x = PI - x
  else if (x < -HALF_PI) x = -PI - x
  const x2 = x * x
  // Taylor até x^15 em [−π/2, π/2], avaliado por Horner.
  return (
    x *
    (1 +
      x2 *
        (-1 / 6 +
          x2 *
            (1 / 120 +
              x2 *
                (-1 / 5040 +
                  x2 *
                    (1 / 362880 +
                      x2 *
                        (-1 / 39916800 +
                          x2 * (1 / 6227020800 + x2 * (-1 / 1307674368000))))))))
  )
}

/** Cosseno determinístico. */
export function dcos(angle: number): number {
  return dsin(angle + HALF_PI)
}
