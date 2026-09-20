import { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from './twMerge'

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  hud?: boolean
}

/** 玻璃拟态面板（统一容器） */
export default function GlassPanel({
  children,
  className,
  hover = false,
  hud = false,
  ...rest
}: GlassPanelProps) {
  return (
    <div
      className={twMerge(
        'glass-panel',
        hover && 'glass-panel-hover',
        hud && 'hud-corner',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
