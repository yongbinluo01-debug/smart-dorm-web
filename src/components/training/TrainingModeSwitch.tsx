import { motion } from 'framer-motion'
import { ClipboardPenLine, GraduationCap } from 'lucide-react'
import { useTrainingStore } from '@/store/trainingStore'
import type { TrainingMode } from '@/types'
import { twMerge } from '@/components/ui/twMerge'

const OPTIONS: { value: TrainingMode; label: string; icon: typeof GraduationCap; hint: string }[] = [
  { value: 'Teaching', label: '教学模式', icon: GraduationCap, hint: 'AI 全程引导，显示安全提示与热点指引' },
  { value: 'Exam', label: '考核模式', icon: ClipboardPenLine, hint: '隐藏答案提示，AI 回复克制，考验独立判断' },
]

/** 教学 / 考核模式切换（全局生效） */
export default function TrainingModeSwitch() {
  const mode = useTrainingStore((s) => s.mode)
  const setMode = useTrainingStore((s) => s.setMode)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {OPTIONS.map((opt) => {
          const active = mode === opt.value
          const Icon = opt.icon
          return (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={twMerge(
                'relative z-10 flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-colors',
                active ? 'text-white' : 'text-slate-400 hover:text-slate-200',
              )}
            >
              {active && (
                <motion.span
                  layoutId="mode-switch-bg"
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-tech-600/80 to-tech-500/70 shadow-glow-tech"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {opt.label}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-slate-500">
        {OPTIONS.find((o) => o.value === mode)?.hint}
      </p>
    </div>
  )
}
