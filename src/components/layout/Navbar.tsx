import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Menu, Play, Rocket, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { twMerge } from '@/components/ui/twMerge'

const NAV_ITEMS = [
  { id: 'home', label: '首页' },
  { id: 'hazards', label: '安全训练' },
  { id: 'fire', label: '火灾模拟' },
  { id: 'ai', label: 'AI 教官' },
  { id: 'report', label: '训练报告' },
  { id: 'architecture', label: '技术架构' },
]

interface NavbarProps {
  onStartDemo: () => void
}

export default function Navbar({ onStartDemo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 当前区域高亮
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={twMerge(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-base-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button onClick={() => go('home')} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-fire-500 to-danger-600 shadow-glow-fire">
            <Flame className="h-5 w-5 text-white" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-base font-bold tracking-wide text-white">智安宿舍</span>
            <span className="hidden text-[10px] tracking-[0.2em] text-tech-300/80 sm:block">
              SMART DORM · FIRE SAFETY
            </span>
          </span>
        </button>

        {/* 桌面导航 */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={twMerge(
                'relative rounded-md px-3.5 py-2 text-sm transition-colors',
                activeSection === item.id
                  ? 'text-tech-300'
                  : 'text-slate-400 hover:text-white',
              )}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-tech-400"
                />
              )}
            </button>
          ))}
        </div>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2.5">
          <button onClick={onStartDemo} className="btn-ghost hidden h-9 px-3.5 py-0 text-xs sm:inline-flex">
            <Play className="h-3.5 w-3.5" />
            演示模式
          </button>
          <button onClick={() => go('hazards')} className="btn-primary hidden h-9 px-4 py-0 text-xs sm:inline-flex">
            <Rocket className="h-3.5 w-3.5" />
            开始体验
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="菜单"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-base-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={twMerge(
                    'block w-full rounded-lg px-3 py-2.5 text-left text-sm',
                    activeSection === item.id
                      ? 'bg-tech-500/10 text-tech-300'
                      : 'text-slate-300 hover:bg-white/5',
                  )}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setMenuOpen(false); onStartDemo() }} className="btn-ghost flex-1 text-xs">
                  <Play className="h-3.5 w-3.5" /> 演示模式
                </button>
                <button onClick={() => go('hazards')} className="btn-primary flex-1 text-xs">
                  <Rocket className="h-3.5 w-3.5" /> 开始体验
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
