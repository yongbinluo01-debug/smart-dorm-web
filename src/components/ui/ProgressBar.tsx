import { motion } from 'framer-motion'
import { twMerge } from './twMerge'

interface ProgressBarProps {
  value: number
  full: number
  color?: 'tech' | 'fire' | 'danger' | 'safe'
  height?: number
  showLabel?: boolean
  /** 维度名称（如：隐患识别） */
  label?: string
  className?: string
}

const COLOR_MAP = {
  tech: 'from-tech-500 to-tech-300',
  fire: 'from-fire-500 to-fire-300',
  danger: 'from-danger-600 to-danger-400',
  safe: 'from-safe-500 to-safe-400',
}

/** 线性进度条 */
export default function ProgressBar({
  value,
  full,
  color = 'tech',
  height = 8,
  showLabel = true,
  label,
  className,
}: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (value / full) * 100))
  return (
    <div className={twMerge('w-full', className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
          <span className="text-sm text-slate-300">{label}</span>
          <span className="tabular">
            <span className="text-base font-semibold text-white">{value}</span>
            <span className="text-slate-500"> / {full}</span>
            <span className="ml-2 text-slate-500">{Math.round(percent)}%</span>
          </span>
        </div>
      )}
      <div
        className="w-full overflow-hidden rounded-full bg-white/[0.06]"
        style={{ height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={full}
        aria-label={label}
      >
        <motion.div
          className={twMerge('h-full rounded-full bg-gradient-to-r', COLOR_MAP[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
