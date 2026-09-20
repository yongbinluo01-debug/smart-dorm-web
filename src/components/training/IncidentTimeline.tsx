import { AnimatePresence, motion } from 'framer-motion'
import { History, Radio } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTrainingStore } from '@/store/trainingStore'
import type { TimelineEvent } from '@/types'
import { formatClock } from '@/utils/format'
import GlassPanel from '@/components/ui/GlassPanel'
import { twMerge } from '@/components/ui/twMerge'

const DOT_STYLE: Record<TimelineEvent['type'], string> = {
  info: 'bg-tech-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]',
  warning: 'bg-fire-400 shadow-[0_0_8px_rgba(251,146,60,0.7)]',
  danger: 'bg-danger-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]',
  success: 'bg-safe-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]',
  action: 'bg-slate-300 shadow-[0_0_8px_rgba(203,213,225,0.6)]',
}

/** 事故事件时间线 */
export default function IncidentTimeline() {
  const timeline = useTrainingStore((s) => s.timeline)
  const simRunning = useTrainingStore((s) => s.simRunning)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [timeline])

  return (
    <GlassPanel className="flex h-full min-h-[420px] flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <History className="h-4 w-4 text-tech-400" />
          事故事件时间线
        </p>
        {simRunning && (
          <span className="flex items-center gap-1.5 text-[11px] text-fire-300">
            <Radio className="h-3 w-3 animate-blink-dot" />
            记录中
          </span>
        )}
      </div>

      {timeline.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-white/15 text-slate-600">
            <History className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm text-slate-500">训练尚未开始</p>
          <p className="mt-1 text-xs text-slate-600">点击“开始事故模拟”后，事件将按时间动态记录</p>
        </div>
      ) : (
        <div ref={scrollRef} className="relative flex-1 space-y-0 overflow-y-auto pr-1" style={{ maxHeight: 460 }}>
          {/* 竖线 */}
          <div className="absolute bottom-2 left-[65px] top-2 w-px bg-white/10" />
          <AnimatePresence initial={false}>
            {timeline.map((evt) => (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex items-start gap-3 py-2.5"
              >
                <span className="w-12 shrink-0 pt-0.5 text-right font-mono text-xs text-slate-500 tabular">
                  {formatClock(evt.time)}
                </span>
                <span className={twMerge('relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', DOT_STYLE[evt.type])} />
                <span
                  className={twMerge(
                    'text-xs leading-relaxed',
                    evt.type === 'danger'
                      ? 'text-danger-400'
                      : evt.type === 'warning'
                        ? 'text-fire-300'
                        : evt.type === 'success'
                          ? 'text-safe-400'
                          : evt.type === 'action'
                            ? 'text-slate-200'
                            : 'text-slate-400',
                  )}
                >
                  {evt.label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </GlassPanel>
  )
}
