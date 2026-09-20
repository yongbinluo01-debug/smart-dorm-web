/**
 * API Service —— 统一的数据访问层
 * 当前：未配置 VITE_API_BASE_URL 时全部走本地 Mock，页面不会因后端缺失而报错。
 * 未来：在 .env.local 中配置 VITE_API_BASE_URL（如 http://127.0.0.1:8000），
 *       即可对接 FastAPI；请求失败仍自动回退 Mock，保证演示不中断。
 *
 * 预留后端接口：
 *   GET  /health
 *   GET  /api/training/context
 *   POST /api/ai/instructor
 *   POST /api/ai/review
 *   GET  /api/training/result
 */
import { HAZARDS } from '@/data/mockData'
import type {
  AIInstructorRequest,
  AIInstructorResponse,
  AIReview,
  ChatMessage,
  ScoreDimension,
  TrainingContext,
  TrainingResult,
} from '@/types'
import { computeDimensions, computeTotal } from '@/utils/scoring'
import { mockAIReply, mockAIReview } from './mockAI'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const REQUEST_TIMEOUT = 3000

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) throw new Error('API_BASE_URL_NOT_CONFIGURED')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...init,
    })
    if (!res.ok) throw new Error(`HTTP_${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

/** 后端健康检查；后端不可用时返回 false，不抛错 */
export async function healthCheck(): Promise<boolean> {
  try {
    await request<{ status: string }>('/health')
    return true
  } catch {
    return false
  }
}

/** Mock 初始训练上下文（未来由 Unity / FastAPI 下发） */
export function mockTrainingContext(): TrainingContext {
  return {
    mode: 'Teaching',
    phase: 'Idle',
    fireState: 'Normal',
    hazardsFound: 0,
    totalHazards: HAZARDS.length,
    powerCut: false,
    fireExtinguished: false,
    evacuated: false,
    currentScore: 0,
    majorMistakes: 0,
    elapsedTime: 0,
    reactionTime: null,
  }
}

export async function getTrainingContext(): Promise<TrainingContext> {
  try {
    return await request<TrainingContext>('/api/training/context')
  } catch {
    await delay(200)
    return mockTrainingContext()
  }
}

export async function sendAIMessage(
  payload: AIInstructorRequest,
): Promise<AIInstructorResponse> {
  try {
    if (BASE_URL) {
      return await request<AIInstructorResponse>('/api/ai/instructor', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }
    throw new Error('USE_MOCK')
  } catch {
    // Mock fallback：模拟网络思考延迟
    await delay(700 + Math.random() * 500)
    return { reply: mockAIReply(payload.message, payload.context) }
  }
}

export async function generateAIReview(
  ctx: TrainingContext,
  dimensions: ScoreDimension[],
  foundIds: string[],
): Promise<AIReview> {
  try {
    if (BASE_URL) {
      return await request<AIReview>('/api/ai/review', {
        method: 'POST',
        body: JSON.stringify({ context: ctx, dimensions, foundIds }),
      })
    }
    throw new Error('USE_MOCK')
  } catch {
    await delay(1100)
    return mockAIReview(ctx, dimensions, foundIds)
  }
}

export async function getTrainingResult(
  ctx: TrainingContext,
  simStarted: boolean,
): Promise<TrainingResult> {
  try {
    if (BASE_URL) {
      return await request<TrainingResult>('/api/training/result')
    }
    throw new Error('USE_MOCK')
  } catch {
    const dimensions = computeDimensions({
      hazardsFound: ctx.hazardsFound,
      totalHazards: ctx.totalHazards,
      simStarted,
      fireState: ctx.fireState,
      powerCut: ctx.powerCut,
      fireExtinguished: ctx.fireExtinguished,
      evacuated: ctx.evacuated,
      majorMistakes: ctx.majorMistakes,
      reactionTime: ctx.reactionTime,
    })
    return {
      totalScore: computeTotal(dimensions),
      grade: '',
      dimensions,
      stats: {
        hazardsFound: ctx.hazardsFound,
        totalHazards: ctx.totalHazards,
        majorMistakes: ctx.majorMistakes,
        reactionTime: ctx.reactionTime,
        totalTime: ctx.elapsedTime,
        powerCut: ctx.powerCut,
        fireExtinguished: ctx.fireExtinguished,
        evacuated: ctx.evacuated,
      },
    }
  }
}

/** 将聊天记录中的错误转换为统一提示（供 UI 使用） */
export function aiOfflineMessage(): ChatMessage {
  return {
    id: `sys-${Date.now()}`,
    role: 'system',
    content: 'AI 服务暂时不可用，请稍后再试。你仍可以继续进行隐患排查与火灾模拟训练。',
    timestamp: Date.now(),
    error: true,
  }
}
