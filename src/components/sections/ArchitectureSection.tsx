import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { ArrowRight, ChevronDown, Cpu, Database, Tags } from 'lucide-react'
import {
  ARCHITECTURE_PIPELINE_A,
  ARCHITECTURE_PIPELINE_B,
  TECH_STACK,
} from '@/data/mockData'
import type { ArchitectureNode } from '@/types'
import DynamicIcon from '@/components/ui/DynamicIcon'
import GlassPanel from '@/components/ui/GlassPanel'
import SectionHeading from '@/components/ui/SectionHeading'

const LAYER_STYLE: Record<ArchitectureNode['layer'], string> = {
  client: 'border-tech-500/35 hover:shadow-glow-tech',
  context: 'border-tech-500/25',
  server: 'border-fire-500/35 hover:shadow-glow-fire',
  ai: 'border-fire-500/25',
  evaluation: 'border-safe-500/30',
}

const LAYER_ICON: Record<ArchitectureNode['layer'], string> = {
  client: 'text-tech-300 bg-tech-500/10 border-tech-500/30',
  context: 'text-tech-300 bg-tech-500/10 border-tech-500/25',
  server: 'text-fire-300 bg-fire-500/10 border-fire-500/30',
  ai: 'text-fire-300 bg-fire-500/10 border-fire-500/25',
  evaluation: 'text-safe-400 bg-safe-500/10 border-safe-500/30',
}

function Pipeline({
  nodes,
  label,
  icon,
  accent,
  delayStart,
}: {
  nodes: ArchitectureNode[]
  label: string
  icon: ReactNode
  accent: string
  delayStart: number
}) {
  return (
    <div>
      <p className={`mb-4 flex items-center gap-2 text-sm font-semibold ${accent}`}>
        {icon}
        {label}
      </p>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-1 flex-col items-center md:flex-row md:contents">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: delayStart + i * 0.07 }}
              className="w-full flex-1"
            >
              <GlassPanel hover className={`h-full border p-4 ${LAYER_STYLE[node.layer]}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${LAYER_ICON[node.layer]}`}>
                    <DynamicIcon name={node.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{node.name}</p>
                    <p className="truncate font-mono text-[10px] text-slate-500">{node.en}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">{node.description}</p>
              </GlassPanel>
            </motion.div>
            {i < nodes.length - 1 && (
              <>
                <ArrowRight className="mx-1 hidden h-4 w-4 shrink-0 text-slate-600 md:block" />
                <ChevronDown className="my-1 h-4 w-4 shrink-0 self-center text-slate-600 md:hidden" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="relative py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="SYSTEM ARCHITECTURE · 技术架构"
          title="Unity 客户端 × FastAPI 后端 × 大模型智能体"
          description="实时交互链路负责场景状态聚合与 AI 引导，训练评测链路负责全过程事件记录、量化评分与智能复盘，两条链路共同构成闭环训练系统。"
        />

        <div className="space-y-8">
          <Pipeline
            nodes={ARCHITECTURE_PIPELINE_A}
            label="实时交互链路：从训练上下文到 AI 指导"
            icon={<Cpu className="h-4 w-4" />}
            accent="text-tech-300"
            delayStart={0}
          />
          <Pipeline
            nodes={ARCHITECTURE_PIPELINE_B}
            label="训练评测链路：从事件日志到训练报告"
            icon={<Database className="h-4 w-4" />}
            accent="text-safe-400"
            delayStart={0.15}
          />
        </div>

        {/* 技术栈 */}
        <GlassPanel className="mt-10 p-6">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <Tags className="h-4 w-4 text-tech-400" />
            技术栈
          </p>
          <div className="flex flex-wrap gap-2.5">
            {TECH_STACK.map((tech, i) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition-colors hover:border-tech-500/40 hover:text-tech-300"
              >
                <DynamicIcon name={tech.icon} className="h-4 w-4 text-tech-400" />
                {tech.name}
              </motion.span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            工程目录建议：<code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-tech-300">web-dashboard/</code>（本前端）、
            <code className="ml-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-tech-300">backend/</code>（FastAPI）与 Unity 的
            <code className="ml-1 rounded bg-white/5 px-1.5 py-0.5 font-mono text-tech-300">Assets/</code> 并存于同一 Git 仓库。
          </p>
        </GlassPanel>
      </div>
    </section>
  )
}
