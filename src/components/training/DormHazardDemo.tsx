import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, RotateCcw, ScanLine, Target } from 'lucide-react'
import { HAZARDS } from '@/data/mockData'
import { useTrainingStore } from '@/store/trainingStore'
import DormScene from './DormScene'
import HazardDetailPanel from './HazardDetailPanel'
import HazardHotspot from './HazardHotspot'
import GlassPanel from '@/components/ui/GlassPanel'
import ProgressBar from '@/components/ui/ProgressBar'

/** 交互式宿舍安全隐患排查 Demo */
export default function DormHazardDemo() {
  const mode = useTrainingStore((s) => s.mode)
  const foundHazards = useTrainingStore((s) => s.foundHazards)
  const resetHazards = useTrainingStore((s) => s.resetHazards)

  const foundCount = Object.values(foundHazards).filter(Boolean).length
  const total = HAZARDS.length
  const allFound = foundCount === total
  const teaching = mode === 'Teaching'

  return (
    <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      {/* 左侧：2D 宿舍场景 */}
      <GlassPanel hud className="overflow-hidden p-4 sm:p-5">
        {/* 顶部 HUD 状态条 */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-tech-400" />
            <span className="font-mono text-sm tracking-wider text-tech-300">DORM SCENE · 2F-201</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
              <Target className="h-3.5 w-3.5 text-fire-400" />
              已发现
              <span className="font-semibold text-white tabular">
                {foundCount}/{total}
              </span>
            </span>
            <button
              onClick={resetHazards}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              重置
            </button>
          </div>
        </div>

        <ProgressBar value={foundCount} full={total} color="fire" height={6} showLabel={false} className="mb-4" />

        {/* 场景 + 热点 */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-base-950/60">
          <div className="aspect-[4/3] w-full">
            <DormScene />
          </div>
          <div className="absolute inset-0">
            {HAZARDS.map((hazard) => (
              <HazardHotspot key={hazard.id} hazard={hazard} />
            ))}
          </div>

          {/* 完成遮罩 */}
          <AnimatePresence>
            {allFound && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-base-950/70 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ scale: 0.85, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="glass-panel mx-4 max-w-sm p-7 text-center"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-safe-500/40 bg-safe-500/15 text-safe-400">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h4 className="mt-4 text-xl font-bold text-white">隐患排查完成</h4>
                  <p className="mt-2 text-sm text-slate-400">
                    6 处宿舍安全隐患全部识别，本环节得分
                  </p>
                  <p className="mt-1 text-3xl font-bold text-safe-400 tabular">30 / 30</p>
                  <button onClick={resetHazards} className="btn-secondary mt-5 text-sm">
                    <RotateCcw className="h-4 w-4" />
                    再练一次
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-3 text-center text-xs text-slate-500">
          {teaching
            ? '教学模式：脉冲光点为隐患位置，点击热点查看风险讲解并标记发现'
            : '考核模式：无热点提示，请自行观察并点击可疑位置，详情在确认后揭示'}
        </p>
      </GlassPanel>

      {/* 右侧：详情 + 清单 */}
      <HazardDetailPanel />
    </div>
  )
}
