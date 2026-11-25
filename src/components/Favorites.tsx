import Image from 'next/image'
import type { Favorite, LinkItem } from '@/content/site'
import { isPending } from '@/content/site'
import type { Photo } from '@/lib/photos'
import { ArrowUpRight } from './Icons'

/** Catalogue grid of picks + storefront row + affiliate disclosure. */
export function Favorites({
  items,
  storefront,
  disclosure,
}: {
  items:      (Favorite & { photo: Photo | null })[]
  storefront: LinkItem | null
  disclosure: string
}) {
  return (
    <div className="px-4 pb-[24svh] md:px-6">
      {items.length > 0 && (
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-20">
          {items.map((item, i) => (
            <li key={item.id}>
              <a href={item.href || undefined} data-link-id={item.id} data-placement="favorites" target="_blank" rel="sponsored noopener noreferrer" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  {item.photo ? (
                    <Image
                      src={item.photo.src}
                      alt={item.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      placeholder="blur"
                      blurDataURL={item.photo.blurDataURL}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain p-6" />
                  )}
                  <span className="label absolute left-2 top-2 text-ink/50">04.{i + 1}</span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-medium uppercase tracking-[0.04em]">{item.name}</p>
                    {item.brand && <p className="label mt-0.5 text-mute">{item.brand}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {isPending(item) && <span className="todo-tag">todo</span>}
                    {item.price && <span className="label">{item.price}</span>}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}

      {storefront && (
        <a
          href={storefront.href || undefined}
          data-link-id={storefront.id}
          data-placement="favorites"
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-[14svh] flex max-w-5xl items-center justify-between border-y border-ink/15 py-6 md:py-8"
        >
          <span className="text-[clamp(1.25rem,4vw,2.5rem)] font-medium uppercase tracking-[-0.02em]">
            Shop everything on ShopMy
          </span>
          <span className="flex items-center gap-2">
            {isPending(storefront) && <span className="todo-tag">todo</span>}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
      )}

      <p className="label mx-auto mt-6 max-w-5xl text-mute">{disclosure}</p>
    </div>
  )
}
