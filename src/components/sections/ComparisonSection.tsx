import { motion } from 'framer-motion'
import { Check, MonitorPlay, X, Zap } from 'lucide-react'
import { COMPARISON_SMART, COMPARISON_TRADITIONAL } from '@/data/mockData'
import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeading from '@/components/ui/SectionHeading'

/** “为什么不是传统消防宣传？”对比模块 */
export default function ComparisonSection() {
  return (
    <section id="comparison" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="WHY SMART DORM · 项目特色"
          title="为什么不是传统消防宣传？"
          description="知识“听过”不等于现场“会做”。智安宿舍把消防教育从单向灌输升级为情境中的主动决策与闭环复盘。"
        />

        <div className="relative grid gap-5 md:grid-cols-2">
          {/* 传统方式 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassPanel className="h-full p-7 opacity-80">
              <p className="flex items-center gap-2.5 text-base font-semibold text-slate-400">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400">
                  <MonitorPlay className="h-5 w-5" />
                </span>
                传统消防宣传
              </p>
              <ul className="mt-6 space-y-3.5">
                {COMPARISON_TRADITIONAL.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5">
                      <X className="h-3.5 w-3.5 text-slate-500" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-slate-500">
                学生“记住了知识点”，但面对真实冒烟、起火时仍然不知道第一步做什么。
              </p>
            </GlassPanel>
          </motion.div>

          {/* 智安宿舍 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <GlassPanel className="h-full border-tech-500/30 p-7 shadow-glow-tech">
              <p className="flex items-center gap-2.5 text-base font-semibold text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-fire-500/40 bg-fire-500/10 text-fire-300">
                  <Zap className="h-5 w-5" />
                </span>
                智安宿舍沉浸式实训
              </p>
              <ul className="mt-6 space-y-3.5">
                {COMPARISON_SMART.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-safe-500/15">
                      <Check className="h-3.5 w-3.5 text-safe-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-tech-500/25 bg-tech-500/[0.07] px-4 py-3 text-xs leading-relaxed text-tech-200/90">
                学生在仿真情境中亲自排查、决策、处置并接受 AI 复盘，把知识转化为可迁移的应急能力。
              </p>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
