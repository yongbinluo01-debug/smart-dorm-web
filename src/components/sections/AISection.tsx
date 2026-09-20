import { motion } from 'framer-motion'
import { BrainCircuit, MessageSquareText, Route, ShieldQuestion } from 'lucide-react'
import AIInstructorPanel from '@/components/training/AIInstructorPanel'
import SectionHeading from '@/components/ui/SectionHeading'

const POINTS = [
  {
    icon: BrainCircuit,
    title: '状态感知',
    desc: '教官实时读取隐患进度、火情阶段、电源状态等训练上下文，回答随局势变化。',
  },
  {
    icon: Route,
    title: '分步引导',
    desc: '教学模式按“断电—灭火—报警—撤离”流程给出解释，帮助建立正确决策链。',
  },
  {
    icon: ShieldQuestion,
    title: '错误即时纠正',
    desc: '当你询问危险操作（如带电用水）时，立即指出风险并给出正确处置方式。',
  },
  {
    icon: MessageSquareText,
    title: '考核模式克制回复',
    desc: '考核中教官只给关键判断，不直接公布答案，训练独立应急决策能力。',
  },
]

export default function AISection() {
  return (
    <section id="ai" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="AI INSTRUCTOR · 智能教官"
          title="AI 消防教官，随训练局势实时对话"
          description="基于大模型智能体，AI 教官不是固定话术机器人——它的回答与当前火灾状态、电源状态和训练模式联动。未来对接 FastAPI + LLM，当前为本地 Mock AI。"
        />
        <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="glass-panel flex items-start gap-4 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-tech-500/30 bg-tech-500/10 text-tech-300">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-white">{p.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <AIInstructorPanel />
        </div>
      </div>
    </section>
  )
}
