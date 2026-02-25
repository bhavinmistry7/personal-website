'use client'

import { useState } from 'react'
import { contact }  from '@/content/siteContent'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({
    name:    '',
    email:   '',
    subject: contact.subjects[0],
    message: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    // ── Replace this with your actual form handler (Resend, Formspree, etc.)
    await new Promise((res) => setTimeout(res, 1200))
    setStatus('sent')
  }

  const inputClass = `
    w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200
    border focus:border-gold
    bg-transparent
    placeholder:text-stone-500
  `

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          I&apos;m interested in
        </label>
        <select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className={inputClass}
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {contact.subjects.map((s) => (
            <option key={s} value={s} style={{ backgroundColor: 'var(--bg)' }}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project or what you'd like to discuss…"
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        {status === 'sent' ? (
          <div className="flex items-center gap-2 text-sm font-medium text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Message sent! I&apos;ll be in touch soon.
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Sending…
              </>
            ) : (
              <>
                Send message
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}
