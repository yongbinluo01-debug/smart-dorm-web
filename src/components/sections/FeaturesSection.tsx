import { motion } from 'framer-motion'
import { FEATURES, PROJECT_POSITIONING, PROJECT_TAGS } from '@/data/mockData'
import DynamicIcon from '@/components/ui/DynamicIcon'
import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeading from '@/components/ui/SectionHeading'

/** 项目简介 + 四大核心能力 */
export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="PROJECT OVERVIEW · 项目简介"
          title="不只是消防宣传，而是可决策的沉浸式训练"
          description={PROJECT_POSITIONING}
        />

        {/* 项目标签 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap justify-center gap-2.5"
        >
          {PROJECT_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-tech-500/25 bg-tech-500/[0.07] px-4 py-1.5 text-sm text-tech-300"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <GlassPanel hover className="group h-full p-6">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-tech-500/30 bg-tech-500/10 text-tech-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-tech">
                  <DynamicIcon name={feature.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                <div className="mt-5 h-0.5 w-8 rounded-full bg-gradient-to-r from-tech-500 to-transparent transition-all duration-300 group-hover:w-16" />
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
