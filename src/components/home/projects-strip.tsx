import { Ficha } from "@/components/ui/card"
import { Fact } from "@/components/ui/fact"
import { LinkText } from "@/components/ui/link-text"
import { Marquee } from "@/components/ui/marquee"
import { Container } from "@/components/ui/section"
import { HOME } from "@/content/home"
import type { Maybe } from "@/content/pending"
import { PROJECTS, projectHref, type Project } from "@/content/projects"

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { labels } = HOME.projects
  const rows: [string, Maybe<string>][] = []
  if (project.role) rows.push([labels.role, project.role])
  rows.push([labels.type, project.type])
  if (project.delivery) rows.push([labels.delivery, project.delivery])

  return (
    <Ficha
      title={project.name}
      // A página do projeto ainda não existe: sem pré-busca, sem 404 no console.
      href={projectHref(project)}
      prefetch={false}
      eyebrow={
        <>
          <span aria-hidden="true">{project.marker}</span>
          {project.client ? (
            <span>
              <span aria-hidden="true"> · </span>
              {labels.client} {project.client}
            </span>
          ) : null}
        </>
      }
      tape={index % 2 === 0 ? "left" : "right"}
      seed={`home:projeto:${project.slug}`}
      className="w-72 shrink-0 md:w-80"
    >
      <dl className="mt-2 flex flex-col gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5">
            <dt className="font-mono text-label text-ink-subtle">{label}</dt>
            <dd className="text-ink">
              <Fact value={value} />
            </dd>
          </div>
        ))}
      </dl>
    </Ficha>
  )
}

/** C. Faixa de projetos com marcos 01 a 04. Ficha: docs/specs/pages/home.md */
export function ProjectsStrip() {
  const { title, allLabel, allHref } = HOME.projects
  return (
    <section aria-labelledby="home-projetos" className="py-8 md:py-12">
      <h2 id="home-projetos" className="sr-only">
        {title}
      </h2>
      <Marquee label={title}>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </Marquee>
      <Container>
        <LinkText href={allHref} size="marker">
          {allLabel}
        </LinkText>
      </Container>
    </section>
  )
}
