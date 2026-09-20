import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  Droplets,
  Footprints,
  Pause,
  Play,
  Power,
  RotateCcw,
  SprayCan,
} from 'lucide-react'
import { useTrainingStore, type FeedbackTone } from '@/store/trainingStore'
import { twMerge } from '@/components/ui/twMerge'

const FEEDBACK_STYLE: Record<FeedbackTone, string> = {
  danger: 'border-danger-500/50 bg-danger-500/15 text-danger-400',
  warning: 'border-fire-500/50 bg-fire-500/15 text-fire-300',
  success: 'border-safe-500/50 bg-safe-500/15 text-safe-400',
  info: 'border-tech-500/40 bg-tech-500/10 text-tech-300',
}

export default function FireControlPanel() {
  const simStarted = useTrainingStore((s) => s.simStarted)
  const simRunning = useTrainingStore((s) => s.simRunning)
  const fireState = useTrainingStore((s) => s.fireState)
  const powerCut = useTrainingStore((s) => s.powerCut)
  const feedback = useTrainingStore((s) => s.feedback)
  const startSimulation = useTrainingStore((s) => s.startSimulation)
  const pauseSimulation = useTrainingStore((s) => s.pauseSimulation)
  const resetSimulation = useTrainingStore((s) => s.resetSimulation)
  const cutPower = useTrainingStore((s) => s.cutPower)
  const useWater = useTrainingStore((s) => s.useWater)
  const useExtinguisher = useTrainingStore((s) => s.useExtinguisher)
  const evacuate = useTrainingStore((s) => s.evacuate)

  const terminal = fireState === 'Extinguished' || fireState === 'Evacuated'
  const actionDisabled = !simStarted || terminal

  return (
    <div className="space-y-3.5">
      {/* 模拟主控 */}
      <div className="flex gap-2.5">
        {!simStarted || terminal ? (
          <button onClick={startSimulation} className="btn-primary flex-1">
            <Play className="h-4 w-4" />
            {terminal ? '重新开始事故' : '开始事故模拟'}
          </button>
        ) : (
          <button onClick={pauseSimulation} className="btn-secondary flex-1">
            {simRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {simRunning ? '暂停' : '继续'}
          </button>
        )}
        <button onClick={resetSimulation} className="btn-ghost" disabled={!simStarted}>
          <RotateCcw className="h-4 w-4" />
          重置
        </button>
      </div>

      {/* 处置操作 */}
      <div className="grid grid-cols-2 gap-2.5">
        <ActionButton
          onClick={cutPower}
          disabled={actionDisabled || powerCut}
          active={powerCut}
          tone="safe"
          icon={<Power className="h-4 w-4" />}
          label="切断电源"
        />
        <ActionButton
          onClick={useWater}
          disabled={actionDisabled}
          tone="ghost"
          icon={<Droplets className="h-4 w-4" />}
          label="尝试用水"
        />
        <ActionButton
          onClick={useExtinguisher}
          disabled={actionDisabled}
          tone="fire"
          icon={<SprayCan className="h-4 w-4" />}
          label="使用灭火器"
        />
        <ActionButton
          onClick={evacuate}
          disabled={actionDisabled}
          tone="tech"
          icon={<Footprints className="h-4 w-4" />}
          label="立即撤离"
        />
      </div>

      {/* 操作反馈 */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={feedback.text + feedback.tone}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={twMerge(
              'flex items-start gap-2 overflow-hidden rounded-xl border px-3.5 py-2.5 text-xs leading-relaxed',
              FEEDBACK_STYLE[feedback.tone],
            )}
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{feedback.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActionButton({
  onClick,
  disabled,
  active,
  tone,
  icon,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  tone: 'safe' | 'ghost' | 'fire' | 'tech'
  icon: ReactNode
  label: string
}) {
  const tones = {
    safe: 'border-safe-500/40 bg-safe-500/10 text-safe-400 hover:bg-safe-500/20',
    ghost: 'border-white/15 bg-white/[0.04] text-slate-300 hover:bg-white/10',
    fire: 'border-fire-500/40 bg-fire-500/10 text-fire-300 hover:bg-fire-500/20',
    tech: 'border-tech-500/40 bg-tech-500/10 text-tech-300 hover:bg-tech-500/20',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35',
        tones[tone],
        active && 'ring-1 ring-safe-400/60',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
