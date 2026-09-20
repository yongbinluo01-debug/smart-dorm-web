/**
 * 智安宿舍 Web 前端 —— 全局类型定义
 * 这些数据结构未来直接对齐 Unity 客户端 / FastAPI 后端下发的 Training Context。
 */

/** 训练模式：教学 / 考核 */
export type TrainingMode = 'Teaching' | 'Exam'

/** 训练阶段 */
export type TrainingPhase =
  | 'HazardInspection' // 隐患排查
  | 'FireResponse' // 火情应对
  | 'Evacuation' // 疏散逃生
  | 'Completed' // 训练完成
  | 'Idle' // 尚未开始

/**
 * 火灾事故状态机
 * Normal 正常 → Overloaded 过载 → Smoking 冒烟 → Ignited 起火
 * → Growing 火势扩大 → Critical 失控
 * 终态：Extinguished 已扑灭 / Evacuated 已撤离
 */
export type FireState =
  | 'Normal'
  | 'Overloaded'
  | 'Smoking'
  | 'Ignited'
  | 'Growing'
  | 'Critical'
  | 'Extinguished'
  | 'Evacuated'

/** 风险等级 */
export type RiskLevel = 'High' | 'Medium' | 'Low'

/** 隐患定义 */
export interface Hazard {
  id: string
  /** 序号 */
  index: number
  name: string
  level: RiskLevel
  /** 风险说明 */
  description: string
  /** 教学模式下的安全提示 / 正确做法 */
  tip: string
  /** 排查得分 */
  score: number
  /** 在 2D 宿舍平面图上的热点坐标（百分比定位） */
  position: { x: number; y: number }
}

/** 事故事件时间线条目 */
export interface TimelineEvent {
  id: string
  /** 相对事故开始的秒数 */
  time: number
  label: string
  type: 'info' | 'warning' | 'danger' | 'success' | 'action'
}

/** 聊天消息 */
export interface ChatMessage {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  /** 时间戳（毫秒） */
  timestamp: number
  pending?: boolean
  error?: boolean
}

/** 评分维度 */
export interface ScoreDimension {
  key: ScoreDimensionKey
  label: string
  score: number
  fullScore: number
}

export type ScoreDimensionKey =
  | 'hazard' // 隐患识别 /30
  | 'judgment' // 火情判断 /20
  | 'response' // 应急处置 /30
  | 'evacuation' // 疏散逃生 /20

/** 训练上下文：未来由 Unity / FastAPI 下发 */
export interface TrainingContext {
  mode: TrainingMode
  phase: TrainingPhase
  fireState: FireState
  hazardsFound: number
  totalHazards: number
  powerCut: boolean
  fireExtinguished: boolean
  evacuated: boolean
  currentScore: number
  majorMistakes: number
  /** 已训练秒数 */
  elapsedTime: number
  /** 起火后到首次正确处置的反应时间（秒） */
  reactionTime: number | null
}

/** 训练结果报告 */
export interface TrainingResult {
  totalScore: number
  grade: string
  dimensions: ScoreDimension[]
  stats: {
    hazardsFound: number
    totalHazards: number
    majorMistakes: number
    reactionTime: number | null
    totalTime: number
    powerCut: boolean
    fireExtinguished: boolean
    evacuated: boolean
  }
}

/** AI 个性化复盘 */
export interface AIReview {
  summary: string
  problems: string[]
  suggestions: string[]
  generatedAt: number
}

/** AI 接口请求体 */
export interface AIInstructorRequest {
  message: string
  context: TrainingContext
}

export interface AIInstructorResponse {
  reply: string
}

/** 核心能力卡片 */
export interface FeatureItem {
  icon: string
  title: string
  description: string
}

/** 技术架构节点 */
export interface ArchitectureNode {
  id: string
  name: string
  en: string
  description: string
  icon: string
  layer: 'client' | 'context' | 'server' | 'ai' | 'evaluation'
}
