import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { twMerge } from './twMerge'

interface SectionHeadingProps {
  kicker: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** 区块统一标题：小标签 + 主标题 + 描述，带淡入动效 */
export default function SectionHeading({
  kicker,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={twMerge(
        'mb-10 max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      <span className="section-kicker">{kicker}</span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>
      )}
    </motion.div>
  )
}
