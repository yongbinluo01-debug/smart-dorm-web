import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, EyeOff, Lightbulb, Lock, MousePointerClick, Search } from 'lucide-react'
import { HAZARDS } from '@/data/mockData'
import { useTrainingStore } from '@/store/trainingStore'
import GlassPanel from '@/components/ui/GlassPanel'
import RiskBadge from '@/components/ui/RiskBadge'
import { twMerge } from '@/components/ui/twMerge'

/** 隐患详情卡片 + 隐患清单 */
export default function HazardDetailPanel() {
  const mode = useTrainingStore((s) => s.mode)
  const selectedId = useTrainingStore((s) => s.selectedHazardId)
  const foundHazards = useTrainingStore((s) => s.foundHazards)
  const selectHazard = useTrainingStore((s) => s.selectHazard)
  const discoverHazard = useTrainingStore((s) => s.discoverHazard)

  const hazard = HAZARDS.find((h) => h.id === selectedId) ?? null
  const found = hazard ? Boolean(foundHazards[hazard.id]) : false
  const teaching = mode === 'Teaching'

  return (
    <div className="flex h-full flex-col gap-4">
      <GlassPanel className="relative min-h-[280px] flex-1 overflow-hidden p-5">
        <AnimatePresence mode="wait">
          {!hazard ? (
            /* 空状态 */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[240px] flex-col items-center justify-center text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tech-500/30 bg-tech-500/10 text-tech-300">
                <Search className="h-7 w-7" />
              </span>
              <p className="mt-4 text-sm font-medium text-white">
                {teaching ? '点击场景中闪烁的热点查看隐患' : '仔细观察宿舍，点击你认为可疑的位置'}
              </p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
                {teaching
                  ? '教学模式下，6 处隐患会以脉冲光点标出，点击即可查看风险讲解。'
                  : '考核模式下不提供热点提示，请像真实排查一样逐项扫描插座、线路、通道与可燃物。'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={hazard.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs tracking-widest text-tech-400">
                    HAZARD-{String(hazard.index).padStart(2, '0')}
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-white">
                    {teaching || found ? hazard.name : '可疑点位'}
                  </h4>
                </div>
                <RiskBadge level={hazard.level} />
              </div>

              {/* 考核模式未发现：隐藏答案 */}
              {!teaching && !found ? (
                <div className="mt-5 rounded-xl border border-white/10 bg-base-950/50 p-5 text-center">
                  <Lock className="mx-auto h-6 w-6 text-slate-500" />
                  <p className="mt-3 text-sm text-slate-400">
                    考核模式下，隐患详情在确认排查后揭示。
                  </p>
                  <p className="mt-1 text-xs text-slate-600">确认这里存在安全隐患？</p>
                </div>
              ) : (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">{hazard.description}</p>
                  {teaching && (
                    <div className="mt-4 flex gap-2.5 rounded-xl border border-tech-500/20 bg-tech-500/[0.07] p-3.5">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-tech-300" />
                      <p className="text-xs leading-relaxed text-tech-300/90">{hazard.tip}</p>
                    </div>
                  )}
                </>
              )}

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  排查分值 <span className="text-sm font-semibold text-fire-300">+{hazard.score}</span> 分
                </span>
                {found ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-safe-500/40 bg-safe-500/10 px-4 py-2 text-sm font-medium text-safe-400">
                    <CheckCircle2 className="h-4 w-4" />
                    已发现
                  </span>
                ) : (
                  <button
                    onClick={() => discoverHazard(hazard.id)}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    <MousePointerClick className="h-4 w-4" />
                    标记为已发现 +{hazard.score}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>

      {/* 隐患清单 */}
      <GlassPanel className="p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400">
          <EyeOff className="h-3.5 w-3.5 text-tech-400" />
          隐患排查清单
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {HAZARDS.map((h) => {
            const isFound = Boolean(foundHazards[h.id])
            const isSelected = selectedId === h.id
            return (
              <button
                key={h.id}
                onClick={() => selectHazard(h.id)}
                className={twMerge(
                  'flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                  isSelected
                    ? 'border-tech-500/50 bg-tech-500/10 text-white'
                    : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/15 hover:bg-white/5',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={twMerge(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                      isFound ? 'bg-safe-500/20 text-safe-400' : 'bg-white/5 text-slate-500',
                    )}
                  >
                    {isFound ? <CheckCircle2 className="h-3.5 w-3.5" /> : h.index}
                  </span>
                  {teaching || isFound ? h.name : '未排查点位'}
                </span>
                {isFound && <span className="text-safe-400">+{h.score}</span>}
              </button>
            )
          })}
        </div>
      </GlassPanel>
    </div>
  )
}
