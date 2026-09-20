import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  Lightbulb,
  Loader2,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { useTrainingStore } from '@/store/trainingStore'
import GlassPanel from '@/components/ui/GlassPanel'

/** AI 个性化复盘面板（当前 Mock，未来对接 POST /api/ai/review） */
export default function AIReviewPanel() {
  const review = useTrainingStore((s) => s.review)
  const reviewLoading = useTrainingStore((s) => s.reviewLoading)
  const generateReview = useTrainingStore((s) => s.generateReview)

  return (
    <GlassPanel hud className="flex min-h-[420px] flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-white">
          <ClipboardCheck className="h-4 w-4 text-tech-400" />
          AI 个性化复盘
        </p>
        <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
          /api/ai/review
        </span>
      </div>

      <AnimatePresence mode="wait">
        {reviewLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-tech-400" />
            <p className="text-sm text-slate-300">AI 教官正在分析训练过程……</p>
            <p className="text-xs text-slate-600">正在汇总隐患识别、火情判断与处置数据</p>
          </motion.div>
        ) : review ? (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 space-y-5 overflow-y-auto"
          >
            <section>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-tech-300">
                <Sparkles className="h-3.5 w-3.5" />
                总体表现
              </p>
              <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-sm leading-relaxed text-slate-300">
                {review.summary}
              </p>
            </section>

            <section>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-danger-400">
                <XCircle className="h-3.5 w-3.5" />
                主要问题
              </p>
              <ul className="mt-2 space-y-2">
                {review.problems.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-2 rounded-lg border border-danger-500/20 bg-danger-500/[0.06] px-3 py-2 text-xs leading-relaxed text-slate-300"
                  >
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger-400" />
                    {p}
                  </motion.li>
                ))}
              </ul>
            </section>

            <section>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-safe-400">
                <Lightbulb className="h-3.5 w-3.5" />
                训练建议
              </p>
              <ul className="mt-2 space-y-2">
                {review.suggestions.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-2 rounded-lg border border-safe-500/20 bg-safe-500/[0.06] px-3 py-2 text-xs leading-relaxed text-slate-300"
                  >
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe-400" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </section>

            <button onClick={() => void generateReview()} className="btn-ghost w-full text-xs">
              <ClipboardCheck className="h-3.5 w-3.5" />
              重新生成复盘
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tech-500/30 bg-tech-500/10 text-tech-300">
              <FileSearch className="h-7 w-7" />
            </span>
            <p className="mt-4 text-sm font-medium text-white">训练完成后生成 AI 复盘</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
              完成隐患排查与火灾处置后，AI 将基于全过程事件给出总体表现、主要问题与针对性训练建议。
            </p>
            <button onClick={() => void generateReview()} className="btn-secondary mt-5 text-sm">
              <Sparkles className="h-4 w-4" />
              生成 AI 个性化复盘
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  )
}
