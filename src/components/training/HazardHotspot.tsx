import { AnimatePresence, motion } from 'framer-motion'
import { Check, Search } from 'lucide-react'
import { useTrainingStore } from '@/store/trainingStore'
import type { Hazard } from '@/types'
import { twMerge } from '@/components/ui/twMerge'

interface HazardHotspotProps {
  hazard: Hazard
}

/** 宿舍场景中的可点击隐患热点 */
export default function HazardHotspot({ hazard }: HazardHotspotProps) {
  const mode = useTrainingStore((s) => s.mode)
  const found = useTrainingStore((s) => Boolean(s.foundHazards[hazard.id]))
  const selected = useTrainingStore((s) => s.selectedHazardId === hazard.id)
  const selectHazard = useTrainingStore((s) => s.selectHazard)

  const teaching = mode === 'Teaching'

  return (
    <button
      type="button"
      onClick={() => selectHazard(hazard.id)}
      aria-label={found ? `已发现隐患：${hazard.name}` : '可疑隐患点'}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hazard.position.x}%`, top: `${hazard.position.y}%` }}
    >
      {/* 教学模式：未发现热点持续脉冲；考核模式仅微弱提示 */}
      {!found && teaching && (
        <span className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring rounded-full border-2 border-fire-400 bg-fire-500/10" />
      )}
      {!found && !teaching && (
        <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fire-500/30 bg-fire-500/5" />
      )}

      <motion.span
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        className={twMerge(
          'relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors',
          found
            ? 'border-safe-500 bg-safe-500/20 text-safe-400'
            : teaching
              ? 'border-fire-400 bg-base-900/90 text-fire-300 shadow-glow-fire'
              : 'h-6 w-6 border-fire-500/40 bg-base-900/80 text-[10px] text-fire-300/80',
          selected && 'ring-2 ring-white/60 ring-offset-2 ring-offset-base-900',
        )}
      >
        <AnimatePresence mode="wait">
          {found ? (
            <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check className="h-4 w-4" />
            </motion.span>
          ) : teaching ? (
            <motion.span key="num" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              {hazard.index}
            </motion.span>
          ) : (
            <motion.span key="search" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Search className="h-3 w-3" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  )
}
