/**
 * Mock 数据中心
 * 所有演示数据集中管理，UI 组件不直接写死业务数据。
 * 后端就绪后，本文件中的数据改由 services/api.ts 从 FastAPI 拉取。
 */
import type {
  ArchitectureNode,
  FeatureItem,
  FireState,
  Hazard,
  RiskLevel,
} from '@/types'

/* ------------------------------ 项目标签 ------------------------------ */

export const PROJECT_TAGS = [
  '高校消防安全',
  'AI Agent',
  '数字媒体技术',
  '沉浸式训练',
  '智能复盘',
]

export const PROJECT_POSITIONING =
  '智安宿舍以高校宿舍典型电气火灾为训练场景，通过交互式隐患排查、动态火灾模拟、大模型智能教官和个性化训练复盘，让学生从“记住消防知识”转变为“能够在情境中正确决策”。'

/* ------------------------------ 隐患数据 ------------------------------ */

export const HAZARDS: Hazard[] = [
  {
    id: 'charger-left-plugged',
    index: 1,
    name: '充电器长期通电',
    level: 'Low',
    description:
      '手机、电脑充电器长期插在插座上持续通电，会加速元件老化并持续发热，劣质充电器在无人看管时存在短路自燃风险。',
    tip: '离开宿舍或长时间不使用时，应拔下充电器；选择合格产品，不在床品、衣物附近充电。',
    score: 5,
    position: { x: 13.5, y: 14 },
  },
  {
    id: 'power-strip-daisy-chain',
    index: 2,
    name: '插线板串联',
    level: 'High',
    description:
      '多个插线板相互串联（“拖板接拖板”）会使前段线路长期承载超额电流，造成接触电阻增大、线路过热，是宿舍电气火灾的主要诱因之一。',
    tip: '严禁插线板串联使用，每个插线板独立接入墙面插座，发现插头发热、打火立即停用。',
    score: 5,
    position: { x: 40, y: 17 },
  },
  {
    id: 'high-power-appliances',
    index: 3,
    name: '高功率电器共用插线板',
    level: 'High',
    description:
      '电热锅、热得快、吹风机等高功率电器同时接入同一插线板，总功率极易超过额定负载，导致导线过载发热、绝缘熔化，进而引发明火。',
    tip: '宿舍内严禁使用违规大功率电器；电器随用随插、用毕断电，不与其他设备共用插线板。',
    score: 5,
    position: { x: 61, y: 15 },
  },
  {
    id: 'combustible-near-strip',
    index: 4,
    name: '可燃物靠近插线板',
    level: 'Medium',
    description:
      '书本、纸张、衣物、纸箱、床帘等可燃物紧贴通电插线板和充电器堆放，设备一旦过热或打火，可燃物会被迅速引燃并蔓延。',
    tip: '插线板、充电器周围 0.5 米内不堆放可燃物，保持桌面整洁、散热通畅。',
    score: 5,
    position: { x: 52, y: 28 },
  },
  {
    id: 'cable-under-furniture',
    index: 5,
    name: '电源线被家具压住',
    level: 'Medium',
    description:
      '电源线长期被床架、衣柜压住或直角弯折，绝缘层会磨损破裂造成短路，同时热量无法散发，局部温度升高易引燃周边可燃物。',
    tip: '布线避开家具压接点和人行通道，不挤压、不缠绕电线，发现外皮破损立即更换。',
    score: 5,
    position: { x: 25, y: 50 },
  },
  {
    id: 'exit-blocked',
    index: 6,
    name: '出口附近堆放杂物',
    level: 'Medium',
    description:
      '宿舍门口、疏散通道堆放纸箱、鞋架、自行车等杂物，会堵塞逃生路线，紧急情况下延误疏散，也会妨碍消防人员进入施救。',
    tip: '保持宿舍门、楼道、安全出口畅通，杂物及时清理，确保任何时候都能快速开门撤离。',
    score: 5,
    position: { x: 79, y: 83 },
  },
]

/* --------------------------- 火灾状态机元数据 --------------------------- */

export interface FireStateMeta {
  label: string
  /** 自动推进阶段序号（0~5），终态为 -1 */
  stage: number
  badgeClass: string
  dotClass: string
  description: string
}

export const FIRE_STATE_META: Record<FireState, FireStateMeta> = {
  Normal: {
    label: '正常',
    stage: 0,
    badgeClass: 'border-safe-500/40 bg-safe-500/10 text-safe-400',
    dotClass: 'bg-safe-500',
    description: '用电设备运行正常，未发现异常温升。',
  },
  Overloaded: {
    label: '过载',
    stage: 1,
    badgeClass: 'border-fire-500/40 bg-fire-500/10 text-fire-300',
    dotClass: 'bg-fire-400',
    description: '多个高功率设备同时工作，插线板总功率超过额定负载。',
  },
  Smoking: {
    label: '冒烟',
    stage: 2,
    badgeClass: 'border-fire-500/50 bg-fire-500/15 text-fire-300',
    dotClass: 'bg-fire-500',
    description: '插线板与导线过热，绝缘层熔化并开始冒烟，尚未出现明火。',
  },
  Ignited: {
    label: '起火',
    stage: 3,
    badgeClass: 'border-danger-500/50 bg-danger-500/15 text-danger-400',
    dotClass: 'bg-danger-500',
    description: '可燃物被引燃，出现初期明火，此刻是扑救的黄金时间。',
  },
  Growing: {
    label: '火势扩大',
    stage: 4,
    badgeClass: 'border-danger-500/60 bg-danger-500/20 text-danger-400',
    dotClass: 'bg-danger-500',
    description: '火势向周边可燃物蔓延，烟气增多，处置窗口正在缩小。',
  },
  Critical: {
    label: '失控',
    stage: 5,
    badgeClass: 'border-danger-500/70 bg-danger-500/25 text-red-300',
    dotClass: 'bg-red-500',
    description: '火势已无法用灭火器控制，必须立即撤离并拨打 119。',
  },
  Extinguished: {
    label: '已扑灭',
    stage: -1,
    badgeClass: 'border-tech-500/40 bg-tech-500/10 text-tech-300',
    dotClass: 'bg-tech-400',
    description: '明火已被扑灭，需持续观察防止复燃并上报情况。',
  },
  Evacuated: {
    label: '已撤离',
    stage: -1,
    badgeClass: 'border-safe-500/40 bg-safe-500/10 text-safe-400',
    dotClass: 'bg-safe-500',
    description: '人员已安全撤离至集合点，正在清点人数并等待救援。',
  },
}

/** 自动推进顺序 */
export const FIRE_STAGE_ORDER: FireState[] = [
  'Normal',
  'Overloaded',
  'Smoking',
  'Ignited',
  'Growing',
  'Critical',
]

/** 每个阶段持续的模拟秒数 */
export const STAGE_DURATION: Record<string, number> = {
  Normal: 6,
  Overloaded: 6,
  Smoking: 7,
  Ignited: 7,
  Growing: 8,
}

/* ------------------------------ 风险等级 ------------------------------ */

export const RISK_META: Record<
  RiskLevel,
  { label: string; badgeClass: string; dotClass: string }
> = {
  High: {
    label: '高风险',
    badgeClass: 'border-danger-500/50 bg-danger-500/15 text-danger-400',
    dotClass: 'bg-danger-500',
  },
  Medium: {
    label: '中风险',
    badgeClass: 'border-fire-500/50 bg-fire-500/15 text-fire-300',
    dotClass: 'bg-fire-400',
  },
  Low: {
    label: '低风险',
    badgeClass: 'border-tech-500/40 bg-tech-500/10 text-tech-300',
    dotClass: 'bg-tech-400',
  },
}

/* ------------------------------ 核心能力 ------------------------------ */

export const FEATURES: FeatureItem[] = [
  {
    icon: 'Boxes',
    title: '3D 沉浸式训练',
    description:
      'Unity 1:1 还原高校宿舍真实场景，隐患排查与火情处置全部在可自由交互的三维情境中完成。',
  },
  {
    icon: 'Bot',
    title: 'AI 智能教官',
    description:
      '基于大模型智能体，结合实时训练上下文给予引导，随时回答“现在该怎么做”的消防处置问题。',
  },
  {
    icon: 'ShieldAlert',
    title: '真实消防决策',
    description:
      '从断电、灭火到疏散，每一步操作都会改变事故走向；危险操作即时警示，让错误只发生在训练里。',
  },
  {
    icon: 'ClipboardCheck',
    title: '个性化训练复盘',
    description:
      '全过程事件自动入档，多维度评分结合 AI 复盘，定位每个学生的薄弱环节并推送针对性训练。',
  },
]

/* ------------------------------ 技术架构 ------------------------------ */

export const ARCHITECTURE_PIPELINE_A: ArchitectureNode[] = [
  {
    id: 'unity',
    name: 'Unity 3D 客户端',
    en: 'Unity 3D Client',
    description: '沉浸式宿舍场景与交互操作',
    icon: 'Boxes',
    layer: 'client',
  },
  {
    id: 'context',
    name: '训练上下文',
    en: 'Training Context',
    description: '火情、隐患、操作状态聚合',
    icon: 'Activity',
    layer: 'context',
  },
  {
    id: 'fastapi',
    name: 'FastAPI 后端',
    en: 'FastAPI Backend',
    description: '业务编排与接口服务',
    icon: 'Server',
    layer: 'server',
  },
  {
    id: 'agent',
    name: 'AI 智能教官',
    en: 'AI Instructor Agent',
    description: '意图理解与决策引导',
    icon: 'Bot',
    layer: 'ai',
  },
  {
    id: 'llm',
    name: '大模型',
    en: 'LLM',
    description: '消防知识推理与生成',
    icon: 'BrainCircuit',
    layer: 'ai',
  },
  {
    id: 'response',
    name: '实时指导',
    en: 'AI Response',
    description: '回到客户端的语音/文字指导',
    icon: 'MessageSquareText',
    layer: 'ai',
  },
]

export const ARCHITECTURE_PIPELINE_B: ArchitectureNode[] = [
  {
    id: 'unity-b',
    name: 'Unity 3D 客户端',
    en: 'Unity 3D Client',
    description: '采集学员每一步操作',
    icon: 'Boxes',
    layer: 'client',
  },
  {
    id: 'event-log',
    name: '训练事件日志',
    en: 'Training Event Log',
    description: '带时间戳的全过程记录',
    icon: 'ScrollText',
    layer: 'context',
  },
  {
    id: 'score',
    name: '评分系统',
    en: 'Score System',
    description: '多维度自动量化评分',
    icon: 'Gauge',
    layer: 'server',
  },
  {
    id: 'ai-review',
    name: 'AI 智能复盘',
    en: 'AI Review',
    description: '定位薄弱项并生成建议',
    icon: 'ClipboardCheck',
    layer: 'evaluation',
  },
  {
    id: 'report',
    name: '训练报告',
    en: 'Training Report',
    description: '可追溯的成绩与档案',
    icon: 'FileBarChart',
    layer: 'evaluation',
  },
]

/* ------------------------------ 技术栈 ------------------------------ */

export const TECH_STACK: { name: string; icon: string }[] = [
  { name: 'Unity', icon: 'Boxes' },
  { name: 'C#', icon: 'FileCode2' },
  { name: 'Python', icon: 'FileCode' },
  { name: 'FastAPI', icon: 'Server' },
  { name: 'LLM 大模型', icon: 'BrainCircuit' },
  { name: 'React', icon: 'Atom' },
  { name: 'TypeScript', icon: 'FileType' },
  { name: 'Windows PC', icon: 'MonitorSmartphone' },
]

/* ---------------------------- 传统方式对比 ---------------------------- */

export const COMPARISON_TRADITIONAL = [
  'PPT 课堂宣讲',
  '消防宣传视频',
  '被动听讲学习',
  '千人一面的统一内容',
  '缺乏操作与反馈环节',
]

export const COMPARISON_SMART = [
  '高保真情境训练',
  '学员主动决策',
  '操作实时反馈',
  'AI 教官全程引导',
  '个性化复盘与提升',
]

/* --------------------------- AI 教官快捷问题 --------------------------- */

export const QUICK_QUESTIONS = [
  '现在应该怎么办？',
  '我可以用水灭火吗？',
  '灭火器怎么使用？',
  '什么时候必须撤离？',
]

/* ------------------------------ 满分配置 ------------------------------ */

export const SCORE_FULL = {
  hazard: 30,
  judgment: 20,
  response: 30,
  evacuation: 20,
  total: 100,
} as const
