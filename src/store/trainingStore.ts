/**
 * 训练全局状态（Zustand）
 * 集中管理：训练模式、隐患排查、火灾事故状态机、事件时间线、AI 对话、训练复盘。
 * 未来对接后端时，仅需把 action 中的本地状态迁移逻辑替换为接口调用 + 状态同步。
 */
import { create } from 'zustand'
import {
  FIRE_STAGE_ORDER,
  HAZARDS,
  STAGE_DURATION,
} from '@/data/mockData'
import { aiOfflineMessage, generateAIReview, sendAIMessage } from '@/services/api'
import type {
  AIReview,
  ChatMessage,
  FireState,
  TimelineEvent,
  TrainingContext,
  TrainingMode,
  TrainingPhase,
} from '@/types'
import { computeDimensions, computeTotal, type ScoreSnapshot } from '@/utils/scoring'
import { uid } from '@/utils/format'

export type FeedbackTone = 'danger' | 'success' | 'warning' | 'info'

export interface ActionFeedback {
  tone: FeedbackTone
  text: string
}

interface TrainingState {
  /* 训练模式 */
  mode: TrainingMode
  setMode: (mode: TrainingMode) => void

  /* 隐患排查 */
  foundHazards: Record<string, boolean>
  selectedHazardId: string | null
  selectHazard: (id: string | null) => void
  discoverHazard: (id: string) => void
  resetHazards: () => void

  /* 火灾模拟 */
  fireState: FireState
  simStarted: boolean
  simRunning: boolean
  simClock: number
  stateEnteredAt: number
  powerCut: boolean
  fireExtinguished: boolean
  evacuated: boolean
  majorMistakes: number
  threatStartedAt: number | null
  reactionTime: number | null
  evacuatedFromState: FireState | null
  feedback: ActionFeedback | null
  timeline: TimelineEvent[]
  startSimulation: () => void
  pauseSimulation: () => void
  resetSimulation: () => void
  tick: () => void
  cutPower: () => void
  useWater: () => void
  useExtinguisher: () => void
  evacuate: () => void
  clearFeedback: () => void

  /* AI 对话 */
  chat: ChatMessage[]
  aiOnline: boolean
  aiLoading: boolean
  sendChatMessage: (text: string) => Promise<void>

  /* AI 复盘 */
  review: AIReview | null
  reviewLoading: boolean
  generateReview: () => Promise<void>

  /* 派生数据 */
  getSnapshot: () => ScoreSnapshot
  getContext: () => TrainingContext
}

const AUTO_STATES: FireState[] = FIRE_STAGE_ORDER // Normal → Critical

function timeline(time: number, label: string, type: TimelineEvent['type']): TimelineEvent {
  return { id: uid('evt'), time, label, type }
}

export const useTrainingStore = create<TrainingState>((set, get) => {
  /** 向时间线追加事件 */
  const pushEvent = (label: string, type: TimelineEvent['type']) => {
    const { simClock, timeline: list } = get()
    set({ timeline: [...list, timeline(simClock, label, type)] })
  }

  const setFeedback = (tone: FeedbackTone, text: string) => set({ feedback: { tone, text } })

  /** 记录起火/冒烟后的首次正确反应时间 */
  const recordReaction = () => {
    const { threatStartedAt, reactionTime, simClock } = get()
    if (reactionTime === null && threatStartedAt !== null) {
      set({ reactionTime: Math.max(0, simClock - threatStartedAt) })
    }
  }

  return {
    /* ------------------------------ 模式 ------------------------------ */
    mode: 'Teaching',
    setMode: (mode) => set({ mode }),

    /* ---------------------------- 隐患排查 ---------------------------- */
    foundHazards: {},
    selectedHazardId: null,
    selectHazard: (id) => set({ selectedHazardId: id }),
    discoverHazard: (id) => {
      const { foundHazards } = get()
      if (foundHazards[id]) return
      const hazard = HAZARDS.find((h) => h.id === id)
      set({ foundHazards: { ...foundHazards, [id]: true } })
      if (hazard) {
        setFeedback('success', `发现隐患「${hazard.name}」 +${hazard.score} 分`)
      }
    },
    resetHazards: () => set({ foundHazards: {}, selectedHazardId: null }),

    /* ---------------------------- 火灾模拟 ---------------------------- */
    fireState: 'Normal',
    simStarted: false,
    simRunning: false,
    simClock: 0,
    stateEnteredAt: 0,
    powerCut: false,
    fireExtinguished: false,
    evacuated: false,
    majorMistakes: 0,
    threatStartedAt: null,
    reactionTime: null,
    evacuatedFromState: null,
    feedback: null,
    timeline: [],

    startSimulation: () => {
      set({
        fireState: 'Normal',
        simStarted: true,
        simRunning: true,
        simClock: 0,
        stateEnteredAt: 0,
        powerCut: false,
        fireExtinguished: false,
        evacuated: false,
        majorMistakes: 0,
        threatStartedAt: null,
        reactionTime: null,
        evacuatedFromState: null,
        feedback: { tone: 'info', text: '事故模拟开始：插线板已通电运行。' },
        timeline: [timeline(0, '训练开始，插线板通电运行', 'info')],
      })
    },

    pauseSimulation: () => {
      const { simRunning } = get()
      set({ simRunning: !simRunning, feedback: simRunning ? { tone: 'info', text: '模拟已暂停。' } : { tone: 'info', text: '模拟继续。' } })
    },

    resetSimulation: () =>
      set({
        fireState: 'Normal',
        simStarted: false,
        simRunning: false,
        simClock: 0,
        stateEnteredAt: 0,
        powerCut: false,
        fireExtinguished: false,
        evacuated: false,
        majorMistakes: 0,
        threatStartedAt: null,
        reactionTime: null,
        evacuatedFromState: null,
        feedback: null,
        timeline: [],
      }),

    tick: () => {
      const s = get()
      if (!s.simRunning) return
      const simClock = s.simClock + 1
      let { fireState, stateEnteredAt, threatStartedAt } = s

      // 断电后：失控前的火势暂停升级（给学员处置窗口）；Critical 为最高阶段不再升级
      const stageIndex = AUTO_STATES.indexOf(fireState)
      if (stageIndex >= 0 && stageIndex < AUTO_STATES.length - 1) {
        const freezeAfterPowerCut = s.powerCut && fireState !== 'Critical'
        const duration = STAGE_DURATION[fireState] ?? 6
        if (!freezeAfterPowerCut && simClock - stateEnteredAt >= duration) {
          fireState = AUTO_STATES[stageIndex + 1]
          stateEnteredAt = simClock
          const eventMap: Partial<Record<FireState, { label: string; type: TimelineEvent['type'] }>> = {
            Overloaded: { label: '插线板进入过载状态', type: 'warning' },
            Smoking: { label: '检测到烟雾，插线板过热冒烟', type: 'warning' },
            Ignited: { label: '发生电气火灾，出现明火', type: 'danger' },
            Growing: { label: '火势向周边可燃物蔓延', type: 'danger' },
            Critical: { label: '火势失控，现场已无法扑救', type: 'danger' },
          }
          const evt = eventMap[fireState]
          const nextTimeline = evt
            ? [...s.timeline, timeline(simClock, evt.label, evt.type)]
            : s.timeline
          if (fireState === 'Smoking' && threatStartedAt === null) threatStartedAt = simClock
          set({ simClock, fireState, stateEnteredAt, threatStartedAt, timeline: nextTimeline })
          return
        }
      }
      set({ simClock })
    },

    cutPower: () => {
      const s = get()
      if (s.powerCut) {
        setFeedback('info', '电源此前已经切断，请勿重复操作。')
        return
      }
      if (s.fireState === 'Extinguished' || s.fireState === 'Evacuated') {
        setFeedback('info', '当前训练已结束，可重置后再次训练。')
        return
      }
      recordReaction()
      const prevented = s.fireState === 'Normal' || s.fireState === 'Overloaded' || s.fireState === 'Smoking'
      set({ powerCut: true })
      pushEvent('学员切断宿舍总电源', 'action')
      if (prevented) {
        // 起火前断电：阻止事故升级
        set({ simRunning: false })
        pushEvent('险情被阻止，未发展为火灾', 'success')
        setFeedback('success', '电源已切断，过热险情被成功阻止，事故未发展为火灾。')
      } else {
        setFeedback('success', '电源已切断。请继续判断火势，使用灭火器处置明火。')
      }
    },

    useWater: () => {
      const s = get()
      if (s.fireState === 'Evacuated' || s.fireState === 'Extinguished') {
        setFeedback('info', '训练已结束，请重置后再试。')
        return
      }
      if (!s.powerCut && s.fireState !== 'Normal') {
        // 带电用水：重大错误，事故升级
        const mistakes = s.majorMistakes + 1
        const jumpedState: FireState =
          s.fireState === 'Critical'
            ? 'Critical'
            : s.fireState === 'Growing'
              ? 'Critical'
              : 'Growing'
        set({ majorMistakes: mistakes, fireState: jumpedState, stateEnteredAt: s.simClock })
        pushEvent('危险操作：未断电情况下用水扑救（重大错误 +1）', 'danger')
        setFeedback(
          'danger',
          '危险操作！电气设备未断电时严禁用水，可能导致触电和爆燃，火势已进一步扩大！',
        )
        return
      }
      if (s.powerCut && (s.fireState === 'Ignited' || s.fireState === 'Growing' || s.fireState === 'Critical')) {
        setFeedback(
          'warning',
          '电源虽已切断，但电气火灾推荐使用干粉 / 二氧化碳灭火器，用水可能导致复燃。',
        )
        pushEvent('学员尝试用水（已断电，非首选方式）', 'warning')
        return
      }
      setFeedback('info', '当前没有需要用水处置的火情，电气火灾应牢记“先断电、用干粉”。')
    },

    useExtinguisher: () => {
      const s = get()
      if (s.fireState === 'Extinguished' || s.fireState === 'Evacuated') {
        setFeedback('info', '训练已结束，请重置后再试。')
        return
      }
      if (s.fireState === 'Normal' || s.fireState === 'Overloaded') {
        setFeedback('info', '当前没有明火，无需使用灭火器，请先排查并消除过载隐患。')
        return
      }
      if (s.fireState === 'Smoking') {
        setFeedback('warning', '目前只有烟雾、尚无明火。请先切断电源并观察，暂不喷射灭火器。')
        return
      }
      if (s.fireState === 'Critical') {
        pushEvent('灭火器无法压制失控火势，处置失败', 'danger')
        setFeedback('danger', '火势已失控，手提式灭火器无法压制，不要冒险，立即撤离并拨打 119！')
        return
      }
      // Ignited / Growing：灭火成功
      recordReaction()
      set({ fireExtinguished: true, fireState: 'Extinguished', simRunning: false })
      pushEvent(
        s.powerCut ? '学员使用灭火器，明火被扑灭' : '学员未断电直接使用灭火器（存在触电风险）',
        s.powerCut ? 'success' : 'warning',
      )
      pushEvent('火势得到控制', 'success')
      setFeedback(
        s.powerCut ? 'success' : 'warning',
        s.powerCut
          ? '灭火成功！明火已扑灭，请持续观察防止复燃。'
          : '火虽被扑灭，但未断电就施救存在触电风险，正确流程应先切断电源。',
      )
    },

    evacuate: () => {
      const s = get()
      if (s.evacuated) {
        setFeedback('info', '人员已安全撤离。')
        return
      }
      set({ evacuated: true, evacuatedFromState: s.fireState, fireState: 'Evacuated', simRunning: false })
      pushEvent('学员组织人员立即撤离', 'action')
      pushEvent('人员到达安全集合点，疏散完成', 'success')
      setFeedback('success', '已安全撤离至集合点，请清点人数并拨打 119，切勿返回火场。')
    },

    clearFeedback: () => set({ feedback: null }),

    /* ----------------------------- AI 对话 ----------------------------- */
    chat: [],
    aiOnline: true,
    aiLoading: false,

    sendChatMessage: async (text) => {
      const content = text.trim()
      if (!content || get().aiLoading) return
      const userMsg: ChatMessage = { id: uid('u'), role: 'user', content, timestamp: Date.now() }
      const pendingMsg: ChatMessage = {
        id: uid('a'),
        role: 'ai',
        content: '',
        timestamp: Date.now(),
        pending: true,
      }
      set({ chat: [...get().chat, userMsg, pendingMsg], aiLoading: true })
      try {
        const { reply } = await sendAIMessage({ message: content, context: get().getContext() })
        const done: ChatMessage = { ...pendingMsg, content: reply, pending: false }
        set({ chat: get().chat.map((m) => (m.id === pendingMsg.id ? done : m)), aiLoading: false, aiOnline: true })
      } catch {
        const offline = aiOfflineMessage()
        set({
          chat: [...get().chat.filter((m) => m.id !== pendingMsg.id), offline],
          aiLoading: false,
          aiOnline: false,
        })
      }
    },

    /* ----------------------------- AI 复盘 ----------------------------- */
    review: null,
    reviewLoading: false,
    generateReview: async () => {
      if (get().reviewLoading) return
      set({ reviewLoading: true })
      try {
        const state = get()
        const snapshot = state.getSnapshot()
        const dimensions = computeDimensions(snapshot)
        const foundIds = HAZARDS.filter((h) => state.foundHazards[h.id]).map((h) => h.id)
        const review = await generateAIReview(state.getContext(), dimensions, foundIds)
        set({ review, reviewLoading: false })
      } catch {
        set({ reviewLoading: false })
        setFeedback('danger', 'AI 复盘服务暂时不可用，请稍后再试。')
      }
    },

    /* ----------------------------- 派生数据 ----------------------------- */
    getSnapshot: () => {
      const s = get()
      return {
        hazardsFound: Object.values(s.foundHazards).filter(Boolean).length,
        totalHazards: HAZARDS.length,
        simStarted: s.simStarted,
        fireState: s.fireState,
        powerCut: s.powerCut,
        fireExtinguished: s.fireExtinguished,
        evacuated: s.evacuated,
        majorMistakes: s.majorMistakes,
        reactionTime: s.reactionTime,
      }
    },

    getContext: () => {
      const s = get()
      const snapshot = s.getSnapshot()
      const dimensions = computeDimensions(snapshot)
      const found = Object.values(s.foundHazards).filter(Boolean).length

      let phase: TrainingPhase = 'HazardInspection'
      if (s.evacuated || s.fireExtinguished) phase = 'Completed'
      else if (s.simStarted) phase = 'FireResponse'

      return {
        mode: s.mode,
        phase,
        fireState: s.fireState,
        hazardsFound: found,
        totalHazards: HAZARDS.length,
        powerCut: s.powerCut,
        fireExtinguished: s.fireExtinguished,
        evacuated: s.evacuated,
        currentScore: computeTotal(dimensions),
        majorMistakes: s.majorMistakes,
        elapsedTime: s.simClock,
        reactionTime: s.reactionTime,
      }
    },
  }
})

/** 选择器：当前评分维度 */
export function selectDimensions(state: TrainingState) {
  return computeDimensions(state.getSnapshot())
}

/** 选择器：当前总分 */
export function selectTotalScore(state: TrainingState): number {
  return computeTotal(computeDimensions(state.getSnapshot()))
}
