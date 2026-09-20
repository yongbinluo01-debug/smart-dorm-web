import { AnimatePresence, motion } from 'framer-motion'
import { Bot, GraduationCap, ClipboardPenLine, Send, Sparkles, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { QUICK_QUESTIONS } from '@/data/mockData'
import { useTrainingStore } from '@/store/trainingStore'
import GlassPanel from '@/components/ui/GlassPanel'
import { twMerge } from '@/components/ui/twMerge'

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-tech-300"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  )
}

/** AI 消防教官聊天面板 */
export default function AIInstructorPanel() {
  const chat = useTrainingStore((s) => s.chat)
  const aiLoading = useTrainingStore((s) => s.aiLoading)
  const aiOnline = useTrainingStore((s) => s.aiOnline)
  const mode = useTrainingStore((s) => s.mode)
  const sendChatMessage = useTrainingStore((s) => s.sendChatMessage)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat, aiLoading])

  const submit = (text: string) => {
    if (!text.trim() || aiLoading) return
    void sendChatMessage(text)
    setInput('')
  }

  return (
    <GlassPanel hud className="flex h-[560px] flex-col overflow-hidden">
      {/* 标题栏 */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-tech-500/40 bg-tech-500/10 text-tech-300">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">AI 消防教官</p>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              {mode === 'Teaching' ? (
                <>
                  <GraduationCap className="h-3 w-3" /> 教学模式 · 全程引导
                </>
              ) : (
                <>
                  <ClipboardPenLine className="h-3 w-3" /> 考核模式 · 独立判断
                </>
              )}
            </p>
          </div>
        </div>
        <span
          className={twMerge(
            'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]',
            aiOnline
              ? 'border-safe-500/30 bg-safe-500/10 text-safe-400'
              : 'border-danger-500/30 bg-danger-500/10 text-danger-400',
          )}
        >
          <span className={twMerge('h-1.5 w-1.5 rounded-full', aiOnline ? 'animate-blink-dot bg-safe-500' : 'bg-danger-500')} />
          {aiOnline ? '在线' : '离线'}
        </span>
      </div>

      {/* 消息区 */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {chat.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-tech-500/30 bg-tech-500/10 text-tech-300">
              <Sparkles className="h-7 w-7" />
            </span>
            <p className="mt-4 text-sm font-medium text-white">你好，我是你的 AI 消防教官</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
              我会结合当前隐患排查与火灾模拟的实时状态给出处置建议。试试下面的问题，或直接开始事故模拟后向我提问。
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => submit(q)}
                  className="rounded-full border border-tech-500/30 bg-tech-500/[0.07] px-3 py-1.5 text-xs text-tech-300 transition-colors hover:bg-tech-500/20"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {chat.map((msg) => {
              if (msg.role === 'system') {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 px-3.5 py-2.5 text-xs text-danger-400"
                  >
                    <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
                    {msg.content}
                  </motion.div>
                )
              }
              const isUser = msg.role === 'user'
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={twMerge('flex items-end gap-2.5', isUser && 'flex-row-reverse')}
                >
                  {!isUser && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-tech-500/30 bg-tech-500/10 text-tech-300">
                      <Bot className="h-4 w-4" />
                    </span>
                  )}
                  <div
                    className={twMerge(
                      'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                      isUser
                        ? 'rounded-br-sm bg-gradient-to-br from-tech-600 to-tech-500 text-white'
                        : 'rounded-bl-sm border border-white/10 bg-white/[0.05] text-slate-200',
                    )}
                  >
                    {msg.pending ? (
                      <div>
                        <TypingDots />
                        <p className="mt-1 text-[11px] text-slate-500">AI 教官正在分析……</p>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 快捷问题（有对话后也保留） */}
      {chat.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => submit(q)}
              disabled={aiLoading}
              className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400 transition-colors hover:border-tech-500/40 hover:text-tech-300 disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 输入区 */}
      <div className="border-t border-white/10 p-3.5">
        <div className="flex items-center gap-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit(input)
            }}
            placeholder="请输入你的问题……"
            disabled={aiLoading}
            className="h-10 flex-1 rounded-xl border border-white/10 bg-base-950/60 px-4 text-sm text-white placeholder:text-slate-600 focus:border-tech-500/50 focus:outline-none focus:ring-1 focus:ring-tech-500/30 disabled:opacity-50"
          />
          <button
            onClick={() => submit(input)}
            disabled={aiLoading || !input.trim()}
            className="btn-primary h-10 w-10 !px-0"
            aria-label="发送"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}
