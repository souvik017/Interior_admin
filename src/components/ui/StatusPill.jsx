import { toneClasses } from './tokens'

export function StatusPill({ children, tone = 'primary' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] leading-none select-none ${toneClasses(
        tone,
        ['soft', 'text', 'border'],
      )}`}
    >
      {children}
    </span>
  )
}
