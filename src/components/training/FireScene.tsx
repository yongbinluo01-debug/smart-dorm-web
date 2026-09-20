import { AnimatePresence, motion } from 'framer-motion'
import { FIRE_STATE_META } from '@/data/mockData'
import { useTrainingStore } from '@/store/trainingStore'
import type { FireState } from '@/types'
import { twMerge } from '@/components/ui/twMerge'

/** 烟雾粒子 */
function Smoke({ count, label }: { count: number; label: string }) {
  return (
    <div className="absolute inset-x-0 bottom-[38%] flex items-end justify-center gap-3" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="animate-smoke-rise rounded-full bg-slate-400/50 blur-[3px]"
          style={{
            width: 26 + (i % 3) * 10,
            height: 26 + (i % 3) * 10,
            animationDelay: `${i * 0.55}s`,
            animationDuration: `${2.2 + (i % 3) * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

/** 火焰 */
function FlameShape({ scale, danger }: { scale: number; danger?: boolean }) {
  return (
    <div
      className="absolute bottom-[34%] left-1/2 -translate-x-1/2 origin-bottom animate-flicker"
      style={{ transform: `translateX(-50%) scale(${scale})` }}
    >
      <svg width="90" height="110" viewBox="0 0 90 110">
        <path
          d="M45 4 C58 26 78 40 72 70 C68 94 56 106 45 106 C34 106 22 94 18 70 C14 46 32 34 40 18 C42 30 48 34 45 4Z"
          fill={danger ? '#DC2626' : '#F97316'}
          opacity="0.95"
        />
        <path
          d="M45 34 C54 50 64 58 60 78 C57 92 50 98 45 98 C40 98 33 92 30 78 C27 60 38 54 42 42 C44 50 47 52 45 34Z"
          fill="#FBBF24"
          opacity="0.9"
        />
        <path
          d="M45 58 C50 68 55 74 52 84 C50 91 47 93 45 93 C43 93 40 91 38 84 C36 75 41 70 43 64 C44 69 46 70 45 58Z"
          fill="#FEF3C7"
        />
      </svg>
    </div>
  )
}

const STAGE_HINT: Record<FireState, string> = {
  Normal: '观察阶段：留意插线板负载与温度变化，隐患越早处置代价越小。',
  Overloaded: '教学提示：过载是明确的危险信号，应立即移除大功率电器并切断电源。',
  Smoking: '教学提示：设备过热冒烟，请立即切断总电源！多数险情可在起火前阻止。',
  Ignited: '教学提示：初期明火遵循“先断电、后灭火”，对准火焰根部喷射。',
  Growing: '教学提示：火势正在扩大，若灭火器无法在 30 秒内控制，立即撤离。',
  Critical: '教学提示：火势失控，停止扑救，立即撤离并拨打 119！',
  Extinguished: '教学提示：明火已扑灭，保持通风、观察复燃，暂不恢复供电。',
  Evacuated: '教学提示：到达集合点清点人数，切勿返回火场，安排人员引导救援。',
}

/** 火灾事故动态场景 */
export default function FireScene() {
  const fireState = useTrainingStore((s) => s.fireState)
  const powerCut = useTrainingStore((s) => s.powerCut)
  const simStarted = useTrainingStore((s) => s.simStarted)
  const mode = useTrainingStore((s) => s.mode)
  const meta = FIRE_STATE_META[fireState]

  const showSmoke = fireState === 'Smoking' || fireState === 'Growing' || fireState === 'Critical'
  const smokeCount = fireState === 'Smoking' ? 3 : fireState === 'Growing' ? 5 : 6
  const flameScale = fireState === 'Ignited' ? 0.7 : fireState === 'Growing' ? 1.05 : fireState === 'Critical' ? 1.5 : 0
  const critical = fireState === 'Critical'
  const dark = fireState === 'Evacuated'

  return (
    <div className="space-y-3">
      <div
        className={twMerge(
          'relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-base-950/70 transition-colors duration-500',
          critical ? 'border-danger-500/60 animate-alert-flash' : 'border-white/10',
        )}
      >
        {/* 背景墙 / 桌面 */}
        <svg viewBox="0 0 480 270" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(15,24,40,0.9)" />
              <stop offset="100%" stopColor="rgba(8,13,24,1)" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="480" height="190" fill="url(#wall)" />
          <rect x="0" y="190" width="480" height="80" fill="rgba(30,41,59,0.35)" />
          <line x1="0" y1="190" x2="480" y2="190" stroke="rgba(148,197,255,0.25)" strokeWidth="2" />
          {/* 墙面插座 */}
          <rect x="60" y="70" width="34" height="44" rx="4" fill="rgba(15,24,40,0.9)" stroke="rgba(148,197,255,0.4)" strokeWidth="1.5" />
          <circle cx="71" cy="86" r="2.5" fill={powerCut ? '#475569' : '#34D399'} />
          <circle cx="83" cy="86" r="2.5" fill={powerCut ? '#475569' : '#34D399'} />
          <circle cx="71" cy="102" r="2.5" fill={powerCut ? '#475569' : '#34D399'} />
          <circle cx="83" cy="102" r="2.5" fill={powerCut ? '#475569' : '#34D399'} />
          {/* 电线 */}
          <path
            d="M94 92 C150 92 170 150 226 168"
            stroke={powerCut ? '#475569' : fireState === 'Normal' ? '#38BDF8' : '#FB923C'}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray={fireState === 'Overloaded' || fireState === 'Smoking' ? '7 4' : undefined}
            opacity="0.8"
          />
          {/* 桌面电器：吹风机 */}
          <g transform="translate(150,120)">
            <rect x="0" y="18" width="60" height="30" rx="8" fill="rgba(71,85,105,0.6)" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" />
            <rect x="48" y="10" width="26" height="16" rx="8" fill="rgba(71,85,105,0.6)" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" />
          </g>
          {/* 桌面电器：电热杯 */}
          <g transform="translate(300,118)">
            <rect x="0" y="0" width="34" height="50" rx="5" fill="rgba(71,85,105,0.55)" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" />
            <path d="M34 12 q14 2 0 22" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" fill="none" />
          </g>
          {/* 插线板（状态颜色随事故变化） */}
          <g>
            <rect
              x="206"
              y="158"
              width="78"
              height="26"
              rx="5"
              fill={
                fireState === 'Normal'
                  ? 'rgba(16,185,129,0.12)'
                  : fireState === 'Overloaded'
                    ? 'rgba(249,115,22,0.16)'
                    : fireState === 'Extinguished'
                      ? 'rgba(71,85,105,0.3)'
                      : 'rgba(239,68,68,0.18)'
              }
              stroke={
                powerCut
                  ? 'rgba(100,116,139,0.6)'
                  : fireState === 'Normal'
                    ? 'rgba(52,211,153,0.7)'
                    : fireState === 'Overloaded'
                      ? 'rgba(251,146,60,0.8)'
                      : 'rgba(248,113,113,0.85)'
              }
              strokeWidth="2"
            />
            {[222, 240, 258, 276].map((x) => (
              <circle key={x} cx={x} cy="171" r="4" fill={powerCut ? '#334155' : fireState === 'Normal' ? '#34D399' : '#FB923C'} />
            ))}
          </g>
          {/* 过载热气波纹 */}
          {fireState === 'Overloaded' && !powerCut && (
            <g stroke="rgba(251,146,60,0.6)" strokeWidth="1.5" fill="none">
              <path d="M210 148 q6 -8 12 0 t12 0 t12 0 t12 0 t12 0" />
              <path d="M210 138 q6 -8 12 0 t12 0 t12 0 t12 0 t12 0" opacity="0.6" />
            </g>
          )}
          {/* 安全出口标识 */}
          <g transform="translate(404,30)">
            <rect width="52" height="22" rx="3" fill="rgba(16,185,129,0.15)" stroke="rgba(52,211,153,0.6)" strokeWidth="1.2" />
            <text x="26" y="15" textAnchor="middle" fontSize="11" fill="#34D399" fontWeight="bold">EXIT</text>
          </g>
        </svg>

        {/* 烟雾 */}
        {showSmoke && <Smoke count={smokeCount} label="烟雾" />}
        {fireState === 'Extinguished' && <Smoke count={4} label="余烟" />}

        {/* 火焰 */}
        <AnimatePresence>
          {flameScale > 0 && (
            <motion.div
              key="flame"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <FlameShape scale={flameScale} danger={fireState === 'Critical'} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 顶部状态浮层 */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${meta.badgeClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass} ${simStarted ? 'animate-blink-dot' : ''}`} />
            {simStarted ? meta.label : '待机'}
          </span>
          {powerCut && (
            <span className="rounded-full border border-safe-500/40 bg-safe-500/10 px-3 py-1 text-xs text-safe-400">
              电源已切断
            </span>
          )}
          {fireState === 'Evacuated' && (
            <span className="rounded-full border border-safe-500/40 bg-safe-500/10 px-3 py-1 text-xs text-safe-400">
              人员已撤离
            </span>
          )}
        </div>

        {/* Critical 警告条纹 */}
        {critical && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(45deg,#EF4444_0_12px,#1F2937_12px_24px)]" />
        )}

        {/* 撤离暗化 */}
        {dark && <div className="absolute inset-0 bg-base-950/55" />}
      </div>

      {/* 教学提示（考核模式隐藏） */}
      {mode === 'Teaching' && (
        <AnimatePresence mode="wait">
          <motion.p
            key={fireState + String(powerCut)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-tech-500/20 bg-tech-500/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-tech-300/90"
          >
            {STAGE_HINT[fireState]}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  )
}
