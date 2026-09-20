import { useEffect } from 'react'
import { useTrainingStore } from '@/store/trainingStore'
import GlassPanel from '@/components/ui/GlassPanel'
import FireControlPanel from './FireControlPanel'
import FireScene from './FireScene'
import FireStatusPanel from './FireStatusPanel'
import IncidentTimeline from './IncidentTimeline'

/** 火灾事故模拟器（场景 + 状态 + 控制 + 时间线） */
export default function FireSimulator() {
  const tick = useTrainingStore((s) => s.tick)
  const simRunning = useTrainingStore((s) => s.simRunning)

  // 事故时钟：每秒推进一次（状态机逻辑在 store.tick 内）
  useEffect(() => {
    if (!simRunning) return
    const timer = window.setInterval(() => tick(), 1000)
    return () => window.clearInterval(timer)
  }, [simRunning, tick])

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      <GlassPanel hud className="space-y-5 p-4 sm:p-5">
        <FireScene />
        <FireStatusPanel />
        <FireControlPanel />
      </GlassPanel>
      <IncidentTimeline />
    </div>
  )
}
