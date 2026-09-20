import { motion } from 'framer-motion'
import { Clock, PlugZap, ShieldAlert, TimerReset } from 'lucide-react'
import { FIRE_STAGE_ORDER, FIRE_STATE_META } from '@/data/mockData'
import { useTrainingStore } from '@/store/trainingStore'
import { formatClock } from '@/utils/format'
import { twMerge } from '@/components/ui/twMerge'

/** 火灾阶段进度 + 实时统计 */
export default function FireStatusPanel() {
  const fireState = useTrainingStore((s) => s.fireState)
  const simStarted = useTrainingStore((s) => s.simStarted)
  const simClock = useTrainingStore((s) => s.simClock)
  const powerCut = useTrainingStore((s) => s.powerCut)
  const majorMistakes = useTrainingStore((s) => s.majorMistakes)
  const reactionTime = useTrainingStore((s) => s.reactionTime)

  const meta = FIRE_STATE_META[fireState]
  const currentStage = meta.stage
  const isTerminal = currentStage === -1

  const stats = [
    { icon: Clock, label: '模拟计时', value: formatClock(simClock), tone: 'text-white' },
    {
      icon: PlugZap,
      label: '电源状态',
      value: powerCut ? '已切断' : simStarted ? '通电中' : '待机',
      tone: powerCut ? 'text-safe-400' : 'text-slate-200',
    },
    {
      icon: ShieldAlert,
      label: '重大错误',
      value: String(majorMistakes),
      tone: majorMistakes > 0 ? 'text-danger-400' : 'text-slate-200',
    },
    {
      icon: TimerReset,
      label: '反应时间',
      value: reactionTime !== null ? `${reactionTime.toFixed(1)} 秒` : '--',
      tone: reactionTime !== null && reactionTime > 8 ? 'text-fire-300' : 'text-slate-200',
    },
  ]

  return (
    <div className="space-y-4">
      {/* 阶段进度 */}
      <div className="rounded-xl border border-white/10 bg-base-950/50 p-4">
        <div className="flex items-center">
          {FIRE_STAGE_ORDER.map((state, i) => {
            const m = FIRE_STATE_META[state]
            const reached = simStarted && (isTerminal || currentStage >= i)
            const isCurrent = simStarted && currentStage === i
            return (
              <div key={state} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <motion.span
                    animate={{ scale: isCurrent ? [1, 1.18, 1] : 1 }}
                    transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.2 }}
                    className={twMerge(
                      'flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-bold transition-colors duration-300',
                      isCurrent
                        ? `${m.badgeClass} shadow-glow-fire`
                        : reached
                          ? 'border-fire-500/50 bg-fire-500/15 text-fire-300'
                          : 'border-white/10 bg-white/[0.03] text-slate-600',
                    )}
                  >
                    {i + 1}
                  </motion.span>
                  <span
                    className={twMerge(
                      'whitespace-nowrap text-[10px]',
                      isCurrent ? 'font-semibold text-white' : reached ? 'text-slate-400' : 'text-slate-600',
                    )}
                  >
                    {m.label}
                  </span>
                </div>
                {i < FIRE_STAGE_ORDER.length - 1 && (
                  <div className="mx-1 mb-5 h-0.5 flex-1 overflow-hidden rounded bg-white/[0.06]">
                    <motion.div
                      className={twMerge('h-full', currentStage > i ? 'bg-fire-500' : 'bg-transparent')}
                      animate={{ width: currentStage > i ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {isTerminal && (
          <p className="mt-3 text-center text-sm font-medium text-tech-300">
            终态：{meta.label} —— {meta.description}
          </p>
        )}
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
            <s.icon className="mx-auto h-4 w-4 text-tech-400" />
            <p className={`mt-1.5 text-sm font-semibold tabular ${s.tone}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
