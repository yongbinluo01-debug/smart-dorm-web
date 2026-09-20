import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  CheckCircle2,
  Circle,
  Cpu,
  Flame,
  GraduationCap,
  ListChecks,
  Power,
  ScanLine,
  ShieldCheck,
} from 'lucide-react'
import { FIRE_STATE_META } from '@/data/mockData'
import { useTrainingStore } from '@/store/trainingStore'
import type { TrainingPhase } from '@/types'
import { computeDimensions, computeTotal } from '@/utils/scoring'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import { twMerge } from '@/components/ui/twMerge'

const PHASE_LABEL: Record<TrainingPhase, string> = {
  Idle: '隐患排查',
  HazardInspection: '隐患排查',
  FireResponse: '火情应对',
  Evacuation: '疏散逃生',
  Completed: '复盘评分',
}

const FLOW = ['隐患排查', '火情应对', '疏散逃生', '复盘评分']

function flowIndex(phase: TrainingPhase, found: number, total: number): number {
  if (phase === 'Completed') return 3
  if (phase === 'Evacuation') return 2
  if (phase === 'FireResponse') return 1
  if (found >= total) return 1
  return 0
}

function Row({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-slate-400">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-white">{children}</span>
    </div>
  )
}

/** Hero 右侧：动态宿舍训练状态面板（与全局训练状态实时联动） */
export default function HeroStatusPanel() {
  const mode = useTrainingStore((s) => s.mode)
  const foundHazards = useTrainingStore((s) => s.foundHazards)
  const fireState = useTrainingStore((s) => s.fireState)
  const powerCut = useTrainingStore((s) => s.powerCut)
  const simStarted = useTrainingStore((s) => s.simStarted)
  const snapshot = useTrainingStore((s) => s.getSnapshot())
  const ctx = useTrainingStore((s) => s.getContext())

  const found = Object.values(foundHazards).filter(Boolean).length
  const total = snapshot.totalHazards
  const dimensions = computeDimensions(snapshot)
  const totalScore = computeTotal(dimensions)
  const fireMeta = FIRE_STATE_META[fireState]
  const activeFlow = flowIndex(ctx.phase, found, total)

  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
      className="relative"
    >
      {/* 光晕 */}
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-tech-500/10 blur-3xl" />

      <div className="glass-panel hud-corner relative overflow-hidden p-6">
        {/* 扫描线动效 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute inset-x-0 h-12 animate-scan-line bg-gradient-to-b from-transparent via-tech-400/10 to-transparent" />
        </div>

        {/* 标题栏 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-tech-400" />
            <span className="font-mono text-sm tracking-wider text-tech-300">DORM TRAINING STATUS</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-safe-500/30 bg-safe-500/10 px-2.5 py-0.5 text-xs text-safe-400">
            <span className="h-1.5 w-1.5 animate-blink-dot rounded-full bg-safe-500" />
            LIVE
          </span>
        </div>

        <Row icon={<GraduationCap className="h-4 w-4 text-tech-400" />} label="当前模式">
          <span className={mode === 'Teaching' ? 'text-tech-300' : 'text-fire-300'}>
            {mode === 'Teaching' ? '教学模式' : '考核模式'}
          </span>
        </Row>
        <Row icon={<ListChecks className="h-4 w-4 text-tech-400" />} label="训练阶段">
          {PHASE_LABEL[ctx.phase]}
        </Row>
        <Row icon={<ScanLine className="h-4 w-4 text-tech-400" />} label="已发现隐患">
          <span className="tabular">
            <AnimatedNumber value={found} /> <span className="text-slate-500">/ {total}</span>
          </span>
        </Row>
        <Row icon={<Flame className="h-4 w-4 text-fire-400" />} label="火灾状态">
          <span className={twMerge('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs', fireMeta.badgeClass)}>
            <span className={twMerge('h-1.5 w-1.5 rounded-full', fireMeta.dotClass)} />
            {simStarted || fireState !== 'Normal' ? fireMeta.label : '安全'}
          </span>
        </Row>
        <Row icon={<Power className="h-4 w-4 text-tech-400" />} label="电源状态">
          {powerCut ? <span className="text-safe-400">已切断</span> : <span className="text-slate-300">通电中</span>}
        </Row>
        <Row icon={<ShieldCheck className="h-4 w-4 text-tech-400" />} label="AI 教官">
          <span className="flex items-center gap-1.5 text-safe-400">
            <span className="h-1.5 w-1.5 animate-blink-dot rounded-full bg-safe-500" />
            在线
          </span>
        </Row>

        {/* 总分 + 流程 */}
        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-base-950/40 p-4">
          <div>
            <p className="text-xs text-slate-500">当前总评分</p>
            <p className="mt-1 text-3xl font-bold text-white">
              <AnimatedNumber value={totalScore} />
              <span className="text-base font-normal text-slate-500"> / 100</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5 text-[11px]">
                {i <= activeFlow ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-tech-400" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-slate-600" />
                )}
                <span className={i <= activeFlow ? 'text-slate-300' : 'text-slate-600'}>{step}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
