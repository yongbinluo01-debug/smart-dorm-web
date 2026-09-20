import { Flame } from 'lucide-react'
import FireSimulator from '@/components/training/FireSimulator'
import SectionHeading from '@/components/ui/SectionHeading'

export default function FireSection() {
  return (
    <section id="fire" className="relative py-20">
      {/* 危险区域淡红光晕 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-danger-600/[0.06] blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="FIRE INCIDENT SIMULATOR · 火灾事故模拟"
          title={
            <span className="flex items-center justify-center gap-3">
              <Flame className="h-8 w-8 text-fire-500" />
              电气火灾事故模拟器
            </span>
          }
          description="从正常、过载、冒烟到起火、扩大、失控，事故按时间动态演化。你的每一步操作——断电、用水、灭火、撤离——都会改变事故走向，错误操作将被记为重大错误。"
        />
        <FireSimulator />
      </div>
    </section>
  )
}
