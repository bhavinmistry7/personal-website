import { links, visible, isPending, type LinkItem } from '@/content/site'
import { ArrowUpRight } from './Icons'

function rel(link: LinkItem) {
  return link.sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer'
}

/** The first-screen link stack. Plain anchors: tappable before any JS loads. */
export function LinkList() {
  const items = visible(links)

  return (
    <ol className="w-full">
      {items.map((link, i) => {
        const n = String(i + 1).padStart(2, '0')
        const pending = isPending(link)

        if (link.featured) {
          return (
            <li key={link.id} className="py-1.5">
              <a
                href={link.href || undefined}
                data-link-id={link.id}
                data-placement="hero"
                target="_blank"
                rel={rel(link)}
                className="chrome-fill group flex h-12 items-center justify-between rounded-[3px] px-3.5 text-ink transition-transform duration-300 ease-out active:scale-[0.985]"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-micro text-ink/50">{n}</span>
                  <span className="text-[12px] font-medium uppercase tracking-[0.06em]">{link.label}</span>
                  {pending && <span className="todo-tag">todo</span>}
                </span>
                <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-ink/60">
                  {link.handle}
                  <ArrowUpRight className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          )
        }

        return (
          <li key={link.id} className="border-t border-white/15 last:border-b">
            <a
              href={link.href || undefined}
              data-link-id={link.id}
              data-placement="hero"
              target="_blank"
              rel={rel(link)}
              className="group -mx-2 flex h-12 items-center justify-between px-2 transition-colors duration-200 hover:bg-white/[0.06] active:bg-white/10"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-micro text-white/40">{n}</span>
                <span className="text-[12px] font-medium uppercase tracking-[0.06em]">{link.label}</span>
                {pending && <span className="todo-tag">todo</span>}
              </span>
              <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-white/50 transition-colors group-hover:text-white">
                {link.handle}
                <ArrowUpRight className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        )
      })}
    </ol>
  )
}
