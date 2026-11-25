type P = { className?: string }

export function ArrowUpRight({ className }: P) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true" className={className}>
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  )
}

export function ArrowDown({ className }: P) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true" className={className}>
      <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" />
    </svg>
  )
}

export function Play({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  )
}
