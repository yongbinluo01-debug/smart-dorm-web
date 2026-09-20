import { useCallback, useEffect, useRef, useState } from 'react'

export interface DemoStep {
  id: string
  label: string
  dwell: number
}

/** 比赛演示模式：自动依次跳转到关键交互模块 */
export const DEMO_STEPS: DemoStep[] = [
  { id: 'hazards', label: '宿舍隐患排查', dwell: 10000 },
  { id: 'fire', label: '火灾事故模拟', dwell: 16000 },
  { id: 'ai', label: 'AI 智能教官', dwell: 9000 },
  { id: 'report', label: '训练评分报告', dwell: 9000 },
]

export function useDemoTour() {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const timerRef = useRef<number | null>(null)

  const stop = useCallback(() => {
    setActive(false)
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [])

  const start = useCallback(() => {
    setStep(0)
    setActive(true)
  }, [])

  useEffect(() => {
    if (!active) return
    const el = document.getElementById(DEMO_STEPS[step].id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    timerRef.current = window.setTimeout(() => {
      if (step < DEMO_STEPS.length - 1) {
        setStep((s) => s + 1)
      } else {
        setActive(false)
      }
    }, DEMO_STEPS[step].dwell)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [active, step])

  return { active, step, start, stop, steps: DEMO_STEPS }
}
