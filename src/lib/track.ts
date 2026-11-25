/**
 * Umami click tracking via plain HTML attributes: no JS on the link itself.
 * Spread onto any <a>: <a {...trackClick('instagram', 'hero')} …>
 * Shows up in Umami as event "Link Click" with properties id + placement.
 */
export function trackClick(id: string, placement: string) {
  return {
    'data-umami-event':           'Link Click',
    'data-umami-event-id':        id,
    'data-umami-event-placement': placement,
  } as const
}
