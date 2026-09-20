import { Gauge } from 'lucide-react'
import AIReviewPanel from '@/components/training/AIReviewPanel'
import ScoreDashboard from '@/components/training/ScoreDashboard'
import SectionHeading from '@/components/ui/SectionHeading'

export default function ScoreSection() {
  return (
    <section id="report" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="TRAINING REPORT · 训练报告"
          title={
            <span className="flex items-center justify-center gap-3">
              <Gauge className="h-8 w-8 text-tech-400" />
              量化评分与 AI 个性化复盘
            </span>
          }
          description="评分系统对隐患识别、火情判断、应急处置、疏散逃生四个维度自动量化，并由 AI 针对薄弱环节生成个性化复盘。当前分数随你的每一步操作实时变化。"
        />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <ScoreDashboard />
          <AIReviewPanel />
        </div>
      </div>
    </section>
  )
}
