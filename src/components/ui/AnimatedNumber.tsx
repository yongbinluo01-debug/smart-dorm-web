import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  decimals?: number
  duration?: number
  className?: string
  suffix?: string
}

/** 数字缓慢增长动画 */
export default function AnimatedNumber({
  value,
  decimals = 0,
  duration = 0.9,
  className,
  suffix = '',
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    })
    prevRef.current = value
    return () => controls.stop()
  }, [value, duration])

  return (
    <span className={`tabular ${className ?? ''}`}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}
