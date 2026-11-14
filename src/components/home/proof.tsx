import { Section } from "@/components/ui/section"
import { Stat } from "@/components/ui/stat"
import { VideoClip } from "@/components/ui/video-clip"
import { HOME } from "@/content/home"
import { formatPercent } from "@/lib/format"

/** F. Prova: resultado com método e vídeo do produto. Ficha: docs/specs/pages/home.md */
export function Proof() {
  const { eyebrow, title, stat, video } = HOME.proof
  return (
    <Section id="prova" eyebrow={eyebrow} title={title}>
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <Stat
          from={formatPercent(stat.from)}
          value={formatPercent(stat.to)}
          method={stat.method}
        />
        <VideoClip
          title={video.title}
          src={video.src}
          captions={video.captions}
          poster={video.poster}
          description={video.description}
          seed="nexuscoop"
        />
      </div>
    </Section>
  )
}
