import { AnimatePresence, motion } from 'framer-motion'
import { Clapperboard, X } from 'lucide-react'
import type { DemoStep } from '@/hooks/useDemoTour'

interface DemoTourBarProps {
  active: boolean
  step: number
  steps: DemoStep[]
  onStop: () => void
}

/** 演示模式进行中的底部浮动控制条 */
export default function DemoTourBar({ active, step, steps, onStop }: DemoTourBarProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
        >
          <div className="flex items-center gap-4 rounded-full border border-tech-500/40 bg-base-900/90 py-2.5 pl-5 pr-2.5 shadow-glow-tech backdrop-blur-xl">
            <Clapperboard className="h-4 w-4 text-tech-300" />
            <span className="text-sm font-medium text-white">
              演示模式 · {step + 1}/{steps.length} · {steps[step].label}
            </span>
            <div className="hidden items-center gap-1.5 sm:flex">
              {steps.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? 'w-5 bg-tech-400' : i < step ? 'w-1.5 bg-tech-600' : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onStop}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="退出演示模式"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
