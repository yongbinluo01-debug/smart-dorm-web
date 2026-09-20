import {
  Activity,
  Atom,
  Bot,
  Boxes,
  BrainCircuit,
  ClipboardCheck,
  FileBarChart,
  FileCode,
  FileCode2,
  FileType,
  Gauge,
  MessageSquareText,
  MonitorSmartphone,
  ScrollText,
  Server,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Atom,
  Bot,
  Boxes,
  BrainCircuit,
  ClipboardCheck,
  FileBarChart,
  FileCode,
  FileCode2,
  FileType,
  Gauge,
  MessageSquareText,
  MonitorSmartphone,
  ScrollText,
  Server,
  ShieldAlert,
}

interface DynamicIconProps {
  name: string
  className?: string
}

/** 按 mockData 中的图标名字符串渲染 lucide 图标 */
export default function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = ICON_MAP[name] ?? Activity
  return <Icon className={className} />
}
