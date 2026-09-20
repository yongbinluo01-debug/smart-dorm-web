import { SearchCode } from 'lucide-react'
import DormHazardDemo from '@/components/training/DormHazardDemo'
import TrainingModeSwitch from '@/components/training/TrainingModeSwitch'
import SectionHeading from '@/components/ui/SectionHeading'

export default function HazardsSection() {
  return (
    <section id="hazards" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="INTERACTIVE TRAINING · 安全训练"
          title={
            <span className="flex items-center justify-center gap-3">
              <SearchCode className="h-8 w-8 text-tech-400" />
              宿舍安全隐患排查 Demo
            </span>
          }
          description="在 2D 宿舍俯视图中排查 6 处典型安全隐患。点击热点查看风险等级与详细说明并标记发现，进度与评分实时同步。可切换教学 / 考核模式体验不同难度。"
        />
        <div className="mb-8">
          <TrainingModeSwitch />
        </div>
        <DormHazardDemo />
      </div>
    </section>
  )
}
