import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Flame, Network, Sparkles } from 'lucide-react'
import { PROJECT_TAGS } from '@/data/mockData'
import HeroStatusPanel from '@/components/training/HeroStatusPanel'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

const STATS = [
  { value: '6', unit: '类', label: '宿舍典型隐患' },
  { value: '6', unit: '阶段', label: '事故动态演化' },
  { value: '4', unit: '维', label: '训练量化评分' },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pb-24">
      {/* 背景网格 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
        {/* 左侧文案 */}
        <div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.55 }}
            className="flex flex-wrap items-center gap-2"
          >
            {PROJECT_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 flex items-center gap-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            智安宿舍
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fire-500 to-danger-600 shadow-glow-fire sm:h-16 sm:w-16">
              <Flame className="h-8 w-8 text-white sm:h-9 sm:w-9" />
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-4 text-lg font-medium text-tech-300 sm:text-xl"
          >
            基于大模型智能体的高校宿舍消防安全沉浸式实训系统
          </motion.p>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-400"
          >
            让消防安全从<span className="text-slate-200">被动学习</span>，变成
            <span className="text-fire-300">可交互</span>、
            <span className="text-fire-300">可决策</span>、
            <span className="text-tech-300">可复盘</span>
            的沉浸式训练。
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <button onClick={() => scrollTo('hazards')} className="btn-primary px-6 py-3 text-base">
              <Sparkles className="h-5 w-5" />
              开始安全训练
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => scrollTo('architecture')} className="btn-secondary px-6 py-3 text-base">
              <Network className="h-5 w-5" />
              查看系统架构
            </button>
          </motion.div>

          {/* 数据条 */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-3"
          >
            {STATS.map((s) => (
              <div key={s.label} className="glass-panel px-4 py-3.5 text-center">
                <p className="text-2xl font-bold text-white">
                  {s.value}
                  <span className="ml-0.5 text-xs font-normal text-tech-300">{s.unit}</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.48 }}
            onClick={() => scrollTo('hazards')}
            className="mt-8 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-tech-300"
          >
            无需安装，10 秒内开始交互训练
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* 右侧动态状态面板 */}
        <HeroStatusPanel />
      </div>
    </section>
  )
}
