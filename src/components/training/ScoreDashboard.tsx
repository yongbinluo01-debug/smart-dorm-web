import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  Check,
  Hourglass,
  PlugZap,
  ShieldAlert,
  Sparkles,
  SprayCan,
  Footprints,
  Target,
  Timer,
  X,
} from 'lucide-react'
import { useTrainingStore } from '@/store/trainingStore'
import { computeDimensions, computeTotal } from '@/utils/scoring'
import { formatClock, formatGrade, gradeColor } from '@/utils/format'
import AnimatedNumber from '@/components/ui/AnimatedNumber'
import CircularProgress from '@/components/ui/CircularProgress'
import GlassPanel from '@/components/ui/GlassPanel'
import ProgressBar from '@/components/ui/ProgressBar'
import { twMerge } from '@/components/ui/twMerge'

const DIMENSION_COLOR = ['fire', 'danger', 'tech', 'safe'] as const

function BooleanCell({ label, ok, icon }: { label: string; ok: boolean; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
        {icon}
        {label}
      </p>
      <p className={twMerge('mt-1.5 flex items-center gap-1 text-sm font-semibold', ok ? 'text-safe-400' : 'text-slate-500')}>
        {ok ? <Check className="h-4 w-4" /> : <X className="h-3.5 w-3.5" />}
        {ok ? '是' : '否'}
      </p>
    </div>
  )
}

/** 训练报告 Dashboard：总分 + 四维评分 + 训练统计（实时联动） */
export default function ScoreDashboard() {
  const snapshot = useTrainingStore((s) => s.getSnapshot())
  const simClock = useTrainingStore((s) => s.simClock)
  const dimensions = computeDimensions(snapshot)
  const total = computeTotal(dimensions)
  const grade = formatGrade(total)
  const color = gradeColor(total)
  const notStarted = !snapshot.simStarted && snapshot.hazardsFound === 0

  return (
    <GlassPanel hud className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <Target className="h-4 w-4 text-tech-400" />
          训练报告 Dashboard
        </p>
        <span className="font-mono text-[11px] tracking-wider text-slate-500">REAL-TIME SCORING</span>
      </div>

      {notStarted && (
        <div className="rounded-xl border border-tech-500/25 bg-tech-500/[0.07] px-4 py-3 text-xs leading-relaxed text-tech-200/90">
          训练尚未开始，当前为初始评分。完成隐患排查或开始事故模拟后，各项分数将实时更新。
        </div>
      )}

      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        {/* 圆环总分 */}
        <div className="flex justify-center">
          <CircularProgress value={total} color={color}>
            <AnimatedNumber value={total} className="text-4xl font-bold" />
            <span className="text-xs text-slate-500">/ 100</span>
            <span
              className="mt-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ color, backgroundColor: `${color}1f`, border: `1px solid ${color}55` }}
            >
              {grade}
            </span>
          </CircularProgress>
        </div>

        {/* 四维评分 */}
        <div className="space-y-4">
          {dimensions.map((d, i) => (
            <ProgressBar
              key={d.key}
              value={d.score}
              full={d.fullScore}
              color={DIMENSION_COLOR[i]}
              label={d.label}
            />
          ))}
        </div>
      </div>

      {/* 训练统计 */}
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400">训练统计</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Target className="h-3.5 w-3.5" />
              发现隐患
            </p>
            <p className="mt-1.5 text-sm font-semibold text-white tabular">
              {snapshot.hazardsFound}
              <span className="text-slate-500"> / {snapshot.totalHazards}</span>
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldAlert className="h-3.5 w-3.5" />
              重大错误
            </p>
            <p className={twMerge('mt-1.5 text-sm font-semibold tabular', snapshot.majorMistakes > 0 ? 'text-danger-400' : 'text-white')}>
              {snapshot.majorMistakes}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Hourglass className="h-3.5 w-3.5" />
              火灾反应时间
            </p>
            <p className="mt-1.5 text-sm font-semibold text-white tabular">
              {snapshot.reactionTime !== null ? `${snapshot.reactionTime.toFixed(1)} 秒` : '--'}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Timer className="h-3.5 w-3.5" />
              事故训练时间
            </p>
            <p className="mt-1.5 text-sm font-semibold text-white tabular">
              {snapshot.simStarted ? formatClock(simClock) : '--'}
            </p>
          </div>
          <BooleanCell label="是否断电" ok={snapshot.powerCut} icon={<PlugZap className="h-3.5 w-3.5" />} />
          <BooleanCell label="是否成功灭火" ok={snapshot.fireExtinguished} icon={<SprayCan className="h-3.5 w-3.5" />} />
          <BooleanCell label="是否撤离" ok={snapshot.evacuated} icon={<Footprints className="h-3.5 w-3.5" />} />
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Sparkles className="h-3.5 w-3.5" />
              AI 复盘
            </p>
            <motion.p whileHover={{ x: 2 }} className="mt-1.5 text-xs font-medium text-tech-300">
              见右侧面板 →
            </motion.p>
          </div>
        </div>
      </div>
    </GlassPanel>
  )
}
