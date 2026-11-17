import { Ficha } from "@/components/ui/card"
import { Fact } from "@/components/ui/fact"
import { ImageFrame } from "@/components/ui/image-frame"
import { LinkText } from "@/components/ui/link-text"
import { Section } from "@/components/ui/section"
import { Tag } from "@/components/ui/tag"
import { HOME } from "@/content/home"
import { isPending } from "@/content/pending"
import { PROJECTS, projectHref, type Project } from "@/content/projects"

const STATUS_DOT = { "em andamento": "warning", "no ar": "success" } as const

function ProjectCard({ project }: { project: Project }) {
  const seed = `home:projeto:${project.slug}`
  return (
    <Ficha
      title={project.name}
      // A página do projeto ainda não existe: sem pré-busca, sem 404 no console.
      href={projectHref(project)}
      prefetch={false}
      seed={seed}
      media={
        isPending(project.image) ? (
          <ImageFrame ratio="wide" placeholder={<Fact value={project.image} />} />
        ) : (
          <ImageFrame ratio="wide" src={project.image.src} alt={project.image.alt} />
        )
      }
      eyebrow={
        <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span>{project.meta}</span>
          <Tag dot={STATUS_DOT[project.status]} seed={`${seed}:status`}>
            {project.status}
          </Tag>
        </span>
      }
      className="h-full"
    >
      <p>{project.description}</p>
    </Ficha>
  )
}

/** C. Projetos em destaque: quatro fichas em grade. Ficha: docs/specs/pages/home.md */
export function Projects() {
  const { title, allLabel, allHref } = HOME.projects
  return (
    <Section id="projetos" title={title}>
      <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2">
        {PROJECTS.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <LinkText href={allHref} size="marker">
          {allLabel}
        </LinkText>
      </p>
    </Section>
  )
}
