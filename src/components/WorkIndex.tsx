import type { Project } from '@/content/site'
import { MaskReveal } from './MaskReveal'
import { ArrowUpRight } from './Icons'

/** Numbered spec-sheet index. Each row is one link. */
export function WorkIndex({ projects }: { projects: Project[] }) {
  return (
    <ol className="px-4 pb-[24svh] md:px-6">
      {projects.map((p, i) => (
        <li key={p.id} className="border-t border-ink/15 last:border-b">
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[2.5rem_1fr_auto] gap-x-3 gap-y-4 py-8 md:grid-cols-[6rem_1fr_14rem_6rem_2rem] md:items-baseline md:py-12"
          >
            <span className="label text-mute">02.{i + 1}</span>

            <MaskReveal as="h3" className="text-[clamp(2rem,7vw,5.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em]">
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-2">{p.title}</span>
            </MaskReveal>

            <ArrowUpRight className="mt-2 h-3 w-3 justify-self-end transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:order-last md:mt-0" />

            <p className="col-start-2 col-end-4 max-w-[38ch] text-[14px] leading-snug text-ink/65 md:col-auto md:row-start-1 md:col-start-3 md:text-[13px]">
              {p.description}
            </p>

            <dl className="label col-start-2 col-end-4 flex flex-wrap gap-x-4 gap-y-1 text-mute md:col-auto md:row-start-1 md:col-start-4 md:block md:space-y-1">
              <div className="flex gap-2"><dt className="sr-only">Type</dt><dd>{p.kind}</dd></div>
              <div className="flex gap-2"><dt className="sr-only">Year</dt><dd>{p.year}</dd></div>
              <div className="flex gap-2"><dt className="sr-only">Stack</dt><dd>{p.stack.join(' · ')}</dd></div>
            </dl>
          </a>
        </li>
      ))}
    </ol>
  )
}
