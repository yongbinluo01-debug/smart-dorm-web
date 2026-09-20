import { RISK_META } from '@/data/mockData'
import type { RiskLevel } from '@/types'
import { twMerge } from './twMerge'

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md'
  className?: string
}

/** 统一风险等级标签 */
export default function RiskBadge({ level, size = 'sm', className }: RiskBadgeProps) {
  const meta = RISK_META[level]
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        meta.badgeClass,
        className,
      )}
    >
      <span className={twMerge('h-1.5 w-1.5 rounded-full', meta.dotClass)} />
      {meta.label}
    </span>
  )
}
