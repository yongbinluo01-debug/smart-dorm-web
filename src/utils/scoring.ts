/**
 * 训练评分引擎（纯函数，便于单元测试与后端规则对齐）
 * 四个维度：隐患识别 /30、火情判断 /20、应急处置 /30、疏散逃生 /20
 */
import { SCORE_FULL } from '@/data/mockData'
import type { FireState, ScoreDimension, TrainingContext } from '@/types'

export interface ScoreSnapshot {
  hazardsFound: number
  totalHazards: number
  simStarted: boolean
  fireState: FireState
  powerCut: boolean
  fireExtinguished: boolean
  evacuated: boolean
  majorMistakes: number
  reactionTime: number | null
}

/** 火情是否已进入明火阶段 */
function isBurning(state: FireState): boolean {
  return state === 'Ignited' || state === 'Growing' || state === 'Critical'
}

export function computeDimensions(s: ScoreSnapshot): ScoreDimension[] {
  /* 1. 隐患识别：每项 5 分 */
  const hazard = Math.round(
    (s.hazardsFound / Math.max(1, s.totalHazards)) * SCORE_FULL.hazard,
  )

  /* 2. 火情判断 */
  let judgment = 0
  if (!s.simStarted) {
    judgment = 0
  } else if (!isBurning(s.fireState) && s.powerCut && !s.fireExtinguished) {
    // 起火前断电，成功阻止险情
    judgment = 20
  } else if (s.fireExtinguished) {
    judgment = s.powerCut ? 20 : 14
  } else if (s.evacuated) {
    judgment = s.fireState === 'Evacuated' ? 10 : 8
  } else if (s.powerCut) {
    judgment = s.fireState === 'Ignited' ? 18 : s.fireState === 'Growing' ? 14 : 8
  } else if (s.fireState === 'Critical') {
    judgment = 0
  }

  /* 3. 应急处置 */
  let response = 0
  if (!s.simStarted) {
    response = 0
  } else if (!isBurning(s.fireState) && s.powerCut && !s.fireExtinguished) {
    response = 24 // 冒烟前/冒烟中断电，险情被阻止
  } else {
    if (s.powerCut) response += 12
    if (s.fireExtinguished) response += s.powerCut ? 18 : 14
    if (s.evacuated && !s.fireExtinguished && s.powerCut) response = Math.max(response, 12)
  }
  response = Math.max(0, response - s.majorMistakes * 8)
  response = Math.min(response, SCORE_FULL.response)

  /* 4. 疏散逃生 */
  let evacuation = 0
  if (s.evacuated) {
    evacuation = 20 // 只要在失控前/失控时完成撤离均视为成功逃生，按决策时机由判断分区分
  } else if (s.fireExtinguished) {
    evacuation = 15 // 火势可控、成功扑灭，留场观察合理
  } else if (s.simStarted && s.fireState === 'Critical') {
    evacuation = 0 // 火势失控仍未撤离
  }

  return [
    { key: 'hazard', label: '隐患识别', score: hazard, fullScore: SCORE_FULL.hazard },
    { key: 'judgment', label: '火情判断', score: judgment, fullScore: SCORE_FULL.judgment },
    { key: 'response', label: '应急处置', score: response, fullScore: SCORE_FULL.response },
    { key: 'evacuation', label: '疏散逃生', score: evacuation, fullScore: SCORE_FULL.evacuation },
  ]
}

export function computeTotal(dimensions: ScoreDimension[]): number {
  return dimensions.reduce((sum, d) => sum + d.score, 0)
}

/** 从 TrainingContext（后端数据结构）生成评分快照 */
export function snapshotFromContext(ctx: TrainingContext & { simStarted?: boolean }): ScoreSnapshot {
  return {
    hazardsFound: ctx.hazardsFound,
    totalHazards: ctx.totalHazards,
    simStarted: ctx.simStarted ?? ctx.phase !== 'Idle',
    fireState: ctx.fireState,
    powerCut: ctx.powerCut,
    fireExtinguished: ctx.fireExtinguished,
    evacuated: ctx.evacuated,
    majorMistakes: ctx.majorMistakes,
    reactionTime: ctx.reactionTime,
  }
}
