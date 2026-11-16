import type { CSSProperties } from "react"
import { DEFAULT_SEASON, SEASONS } from "@/lib/theme/themes"
import { PausaForaDaTela } from "./pause-offscreen"
import { DEFAULT_SCENE, NIGHT_EXTRAS, SCENES, type SceneExtra } from "./scenes"
import {
  autumnTrees,
  ipe,
  ipeBlossoms,
  LEAF_PATH,
  moon,
  particles,
  planes,
  SCENE_H,
  SCENE_W,
  stars,
  sun,
} from "./trees"

const PLANE_FILL = [
  "fill-(--footer-tree-far)",
  "fill-(--footer-tree-mid)",
  "fill-(--footer-tree-near)",
] as const

/**
 * Regras que mostram só os extras da cena da estação ativa, mais a noite
 * (lua e estrelas) no modo escuro, e escondem o que é só de dia (o sol) à
 * noite. Geradas a partir das cenas: uma estação nova não pede CSS à mão. Sem
 * cor nenhuma aqui.
 */
function sceneVisibilityCss(): string {
  const rules = SEASONS.map(
    ({ id }) =>
      `[data-season="${id}"] [data-cena="${id}"]{display:inline}` +
      (id === DEFAULT_SEASON
        ? `:root:not([data-season]) [data-cena="${id}"]{display:inline}`
        : ""),
  )
  return (
    `[data-cena],[data-noite]{display:none}${rules.join("")}` +
    `[data-mode="escuro"] [data-noite]{display:inline}` +
    `[data-mode="escuro"] [data-dia]{display:none}`
  )
}

function Extras({ extras, seed }: { extras: readonly SceneExtra[]; seed: string }) {
  const has = (e: SceneExtra) => extras.includes(e)
  const leaves = has("folhas") ? particles(`${seed}:folhas`, 12) : []
  const flakes = has("flocos") ? particles(`${seed}:flocos`, 34) : []
  const ipeTree = has("ipe-florido") ? ipe(seed) : null
  const autumn = has("copas") ? autumnTrees(seed) : null
  return (
    <>
      {has("sol") ? <path data-dia="" d={sun()} className="fill-(--footer-sun)" /> : null}
      {has("lua") ? <path d={moon()} className="fill-(--footer-sky-accent)" /> : null}
      {has("estrelas") ? (
        <path d={stars(seed)} className="fill-(--footer-sky-accent) opacity-80" />
      ) : null}
      {autumn ? (
        <g>
          <path d={autumn.trunks} className="fill-(--footer-tree-near)" />
          <path d={autumn.crowns} className="fill-(--footer-accent)" />
        </g>
      ) : null}
      {ipeTree ? (
        <g>
          <path d={ipeTree.trunk} className="fill-(--footer-tree-mid)" />
          <path d={ipeTree.crown} className="fill-(--footer-accent)" />
          <path d={ipeBlossoms(seed)} className="fill-(--footer-sky-accent) opacity-90" />
        </g>
      ) : null}
      {leaves.map((leaf, i) => (
        <g
          key={`f${i}`}
          transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)})`}
        >
          <path
            d={LEAF_PATH}
            className="origin-center fill-(--footer-accent) [transform-box:fill-box] motion-safe:animate-cair"
            style={
              {
                animationDelay: `${leaf.delay.toFixed(2)}s`,
                animationDuration: `${leaf.duration.toFixed(2)}s`,
              } as CSSProperties
            }
          />
        </g>
      ))}
      {flakes.map((flake, i) => (
        <circle
          key={`n${i}`}
          cx={flake.x.toFixed(1)}
          cy={flake.y.toFixed(1)}
          r={(flake.r * 0.6).toFixed(1)}
          className="fill-(--footer-sky-accent) motion-safe:animate-nevar"
          style={{
            animationDelay: `${flake.delay.toFixed(2)}s`,
            animationDuration: `${flake.duration.toFixed(2)}s`,
          }}
        />
      ))}
    </>
  )
}

export interface FooterSceneProps {
  seed?: string
  className?: string
}

/**
 * Cena baixa de árvores no fim do rodapé: três planos (o do fundo mais
 * claro) e os extras da cena de cada estação; no modo escuro a mesma cena
 * vira noite (lua, estrelas, sem o sol). Decorativa (`aria-hidden`).
 * Ficha: docs/specs/hero-footer.md
 */
export function FooterScene({ seed = "rodape", className }: FooterSceneProps) {
  const geo = planes(seed)
  const [far, mid, near] = geo as [(typeof geo)[0], (typeof geo)[0], (typeof geo)[0]]
  const sceneIds = SEASONS.map((x) => x.id)

  return (
    <PausaForaDaTela className={className}>
      <style>{sceneVisibilityCss()}</style>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="block size-full forced-colors:hidden"
        data-cena-rodape=""
      >
        <g data-noite="">
          <Extras extras={NIGHT_EXTRAS} seed={seed} />
        </g>
        {sceneIds.map((id) => {
          const sky = (SCENES[id] ?? DEFAULT_SCENE).extras.filter((e) => e === "sol")
          return sky.length ? (
            <g key={`ceu-${id}`} data-cena={id}>
              <Extras extras={sky} seed={seed} />
            </g>
          ) : null
        })}
        <path d={far.pines} className={PLANE_FILL[0]} />
        <path d={mid.pines} className={PLANE_FILL[1]} />
        <g className="origin-bottom [transform-box:fill-box] motion-safe:animate-balanco">
          <path d={near.pines} className={PLANE_FILL[2]} />
        </g>
        {sceneIds.map((id) => {
          const scene = SCENES[id] ?? DEFAULT_SCENE
          const front = scene.extras.filter(
            (e) =>
              e === "neve" ||
              e === "folhas" ||
              e === "flocos" ||
              e === "ipe-florido" ||
              e === "copas",
          )
          return front.length ? (
            <g key={`frente-${id}`} data-cena={id}>
              {scene.extras.includes("neve") ? (
                <path d={mid.snow + near.snow} className="fill-(--footer-sky-accent)" />
              ) : null}
              <Extras
                extras={front.filter((e) => e !== "neve")}
                seed={id === "verao" ? `${seed}:verao` : seed}
              />
            </g>
          ) : null
        })}
      </svg>
    </PausaForaDaTela>
  )
}
