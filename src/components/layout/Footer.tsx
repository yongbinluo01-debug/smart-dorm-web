import { Flame, FolderGit2, ServerCog } from 'lucide-react'
import GlassPanel from '@/components/ui/GlassPanel'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-base-900/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GlassPanel className="grid gap-8 p-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fire-500 to-danger-600">
                <Flame className="h-5 w-5 text-white" />
              </span>
              <div>
                <p className="font-bold text-white">智安宿舍</p>
                <p className="text-xs text-slate-500">Smart Dorm Fire Safety Training</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              基于大模型智能体的高校宿舍消防安全沉浸式实训系统，让消防安全从被动学习变成可交互、可决策、可复盘的沉浸式训练。
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">训练模块</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>交互式宿舍安全隐患排查</li>
              <li>电气火灾动态事故模拟</li>
              <li>AI 消防教官实时引导</li>
              <li>多维度评分与智能复盘</li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-white">技术与工程</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <ServerCog className="h-4 w-4 text-tech-400" />
                Unity + FastAPI + LLM 全栈架构
              </li>
              <li className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-tech-400" />
                web-dashboard / backend / Unity 分目录协作
              </li>
              <li className="text-slate-500">当前为前端 Mock 演示版本，接口已预留</li>
            </ul>
          </div>
        </GlassPanel>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 智安宿舍项目组 · 高校消防安全沉浸式实训系统</p>
          <p className="font-mono tracking-wider">React · TypeScript · Vite · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
