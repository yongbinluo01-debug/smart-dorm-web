/**
 * 本地 Mock AI —— 在 FastAPI / 大模型接入前提供基于训练上下文的规则回复。
 * 回复内容随火灾状态、电源状态、训练模式动态变化，而不是固定话术。
 * 后端就绪后由 services/api.ts 切换到 POST /api/ai/instructor，本文件可删除。
 */
import { HAZARDS } from '@/data/mockData'
import type {
  AIReview,
  FireState,
  ScoreDimension,
  TrainingContext,
  TrainingMode,
} from '@/types'

/* --------------------------- AI 教官对话 Mock --------------------------- */

function teachingReply(question: string, ctx: TrainingContext): string {
  const q = question.toLowerCase()
  const has = (...keys: string[]) => keys.some((k) => q.includes(k))
  const burning =
    ctx.fireState === 'Ignited' ||
    ctx.fireState === 'Growing' ||
    ctx.fireState === 'Critical'

  // 用水相关
  if (has('用水', '泼水', '水灭', '浇水', '水扑')) {
    if (!ctx.powerCut && ctx.fireState !== 'Normal') {
      return '绝对不可以。当前电气设备仍处于通电状态，水具有导电性，直接用水扑救极易造成触电，并可能引发爆燃使火势瞬间扩大。请先切断宿舍总电源，再使用干粉或二氧化碳灭火器。'
    }
    if (ctx.powerCut && burning) {
      return '电源虽然已经切断，但电气火灾仍推荐使用干粉或二氧化碳灭火器；用水容易造成复燃、设备损坏和次生短路，不建议作为首选。'
    }
    return '当前场景为电气设备异常，任何带电设备起火都严禁直接用水。请牢记“先断电、后灭火”，并优先使用干粉灭火器。'
  }

  // 灭火器相关
  if (has('灭火器', '干粉', '怎么灭', '如何灭', '灭火')) {
    if (ctx.fireState === 'Critical') {
      return '当前火势已经明显扩大，超出了手提式灭火器的处置能力，不要冒险扑救。请立即撤离并拨打 119。'
    }
    if (ctx.fireState === 'Ignited' || ctx.fireState === 'Growing') {
      const prefix = ctx.powerCut
        ? '电源已切断，可以处置。'
        : '建议先切断电源再施救；若确定是初期小火，可保持安全距离使用干粉灭火器。'
      return `${prefix}使用口诀“提、拔、握、压”：提起灭火器、拔掉保险销、握住喷管前端、压下压把，站在上风方向对准火焰根部左右扫射，直到明火完全熄灭。`
    }
    if (ctx.fireState === 'Smoking') {
      return '目前只有烟雾、尚无明火，暂不需要喷射灭火器。请先切断电源、移除周边可燃物并保持观察，一旦出现明火立即处置。'
    }
    if (ctx.fireState === 'Extinguished') {
      return '明火已经扑灭，请保持现场通风、持续观察防止复燃，在确认安全前不要恢复供电。'
    }
    return '请牢记灭火器“提、拔、握、压”四步口诀，并对准火焰根部喷射。当前暂未出现火情，可先完成隐患排查。'
  }

  // 断电相关
  if (has('断电', '电源', '电闸', '总闸', '空开', '配电箱', '关掉电')) {
    if (ctx.powerCut) {
      return '电源已经切断，请继续根据火势大小判断：初期小火用灭火器处置，火势失控则立即撤离。'
    }
    if (ctx.fireState === 'Smoking') {
      return '当前设备仍处于通电冒烟状态，请优先判断电源风险——立即切断门口配电箱内的总电源，断电后多数过热险情可以被阻止。'
    }
    if (burning) {
      return '电气火灾处置第一步永远是切断电源。请立即关闭宿舍总电闸，严禁带电施救，断电后再用灭火器对准火焰根部喷射。'
    }
    return '宿舍总电源一般在门口的配电箱内。处置任何电气异常前，都应先切断电源，再进行后续操作。'
  }

  // 撤离相关
  if (has('撤离', '逃', '跑', '疏散', '逃生', '出口')) {
    if (ctx.evacuated || ctx.fireState === 'Evacuated') {
      return '已安全撤离。请在指定集合点清点人数，切勿返回火场取物，并安排人员到路口引导消防车。'
    }
    if (ctx.fireState === 'Critical') {
      return '当前火势已失控，必须立即撤离：用湿毛巾捂住口鼻、低姿前行，沿安全出口指示方向疏散，不要乘坐电梯，随手关门延缓烟气蔓延，到达集合点后拨打 119 并清点人数。'
    }
    return '当火势超出灭火器控制范围、烟气大量弥漫或通道受热受阻时，必须立即撤离。要点：低姿、捂口鼻、走安全通道、不乘电梯、不贪恋财物。'
  }

  // 报警
  if (has('119', '报警', '火警电话')) {
    return '发现无法控制的火情应立即拨打 119，讲清详细地址、起火物（宿舍电器 / 可燃物）、火势大小、有无人员被困，并派人到路口引导消防车。'
  }

  // 隐患
  if (has('隐患', '排查', '检查什么', '注意什么')) {
    const names = HAZARDS.map((h) => h.name).join('、')
    return `宿舍排查重点包括：${names}。发现异常先断电、再整改，离开宿舍时做到人走断电。`
  }

  // 默认：按当前状态给处置建议（覆盖“现在怎么办”等问法）
  const stateAdvice: Record<FireState, string> = {
    Normal:
      '当前设备运行正常。建议先完成宿舍隐患排查：重点查看插线板是否串联、是否接入大功率电器、可燃物是否靠近电源，发现问题立即整改。',
    Overloaded:
      '插线板已经过载，请立即移除多余的高功率电器并切断电源，待设备冷却后检查插头、导线是否发热或熔化，切勿继续使用。',
    Smoking: ctx.powerCut
      ? '电源已经切断，请继续观察烟雾变化并移除周边可燃物；若出现明火且火势较小，使用灭火器处置。'
      : '当前设备仍处于通电状态，请优先判断电源风险，立即切断总电源，再移除周边可燃物、准备灭火器并观察是否出现明火。',
    Ignited:
      '已经出现初期明火。请先切断电源，再用干粉或二氧化碳灭火器对准火焰根部喷射；若 30 秒内无法控制，立即撤离。',
    Growing:
      '火势正在蔓延，请在确保安全的前提下切断电源并用灭火器压制，同时安排人员报警；一旦判断无法控制，立即撤离。',
    Critical:
      '当前火势已经明显扩大，应优先考虑人员安全和撤离。不要贪恋财物，沿安全出口低姿撤离并拨打 119。',
    Extinguished:
      '明火已扑灭。请持续观察、防止复燃，保持现场通风，不要恢复供电，并将情况上报宿管与学校保卫处。',
    Evacuated:
      '人员已安全撤离。请在集合点清点人数、拨打 119，切勿返回火场。',
  }
  return stateAdvice[ctx.fireState]
}

/** 考核模式：回复更克制，只给关键判断，不直接给完整答案 */
function toExamReply(full: string): string {
  const firstSentence = full.split(/[。；]/).filter(Boolean)[0]
  return `${firstSentence}。请根据当前电源、火势和出口情况独立做出判断。`
}

export function mockAIReply(question: string, ctx: TrainingContext): string {
  const full = teachingReply(question, ctx)
  return ctx.mode === 'Exam' ? toExamReply(full) : full
}

/* ---------------------------- AI 复盘 Mock ---------------------------- */

export function mockAIReview(
  ctx: TrainingContext,
  dimensions: ScoreDimension[],
  foundIds: string[],
): AIReview {
  const total = dimensions.reduce((s, d) => s + d.score, 0)
  const missing = HAZARDS.filter((h) => !foundIds.includes(h.id))

  const summaryParts: string[] = []
  summaryParts.push(
    `本次训练总评 ${total} 分。你共识别出 ${ctx.hazardsFound}/${ctx.totalHazards} 项宿舍安全隐患`,
  )
  if (ctx.powerCut) summaryParts.push('在火情处置中完成了切断电源')
  if (ctx.fireExtinguished) summaryParts.push('并成功扑灭初期火灾')
  if (ctx.evacuated) summaryParts.push('最后按要求完成了安全撤离')
  if (!ctx.powerCut && ctx.fireState !== 'Normal') summaryParts.push('但未在处置前切断电源')
  const summary = summaryParts.join('，') + '。'

  const problems: string[] = []
  if (missing.length > 0) {
    problems.push(`隐患排查存在遗漏：未发现“${missing.map((m) => m.name).join('”“')}”。`)
  }
  if (ctx.majorMistakes > 0) {
    problems.push(
      `出现 ${ctx.majorMistakes} 次重大错误：在设备未断电的情况下尝试用水处置电气火灾，存在触电与爆燃风险。`,
    )
  }
  if (ctx.reactionTime !== null && ctx.reactionTime > 8) {
    problems.push(`火情出现后判断与处置偏慢，反应时间为 ${ctx.reactionTime.toFixed(1)} 秒，超过 8 秒的建议阈值。`)
  }
  if (!ctx.powerCut && ctx.fireState !== 'Normal' && !ctx.evacuated) {
    problems.push('处置电气火灾时没有第一时间切断电源，违反“先断电、后灭火”的原则。')
  }
  if (ctx.fireState === 'Critical' && !ctx.evacuated) {
    problems.push('火势失控后未及时撤离，现场决策存在严重安全隐患。')
  }
  if (problems.length === 0) {
    problems.push('整体操作规范，未发现明显决策失误，可进一步提高处置速度。')
  }

  const suggestions: string[] = []
  if (missing.some((m) => m.level === 'High')) {
    suggestions.push('加强宿舍电气安全隐患识别训练，重点掌握插线板串联、大功率电器共用两类高风险隐患。')
  } else if (missing.length > 0) {
    suggestions.push('针对遗漏的隐患点位进行专项排查训练，养成按区域逐项扫描的习惯。')
  }
  if (ctx.reactionTime !== null && ctx.reactionTime > 8) {
    suggestions.push('加强初期火情判断训练，目标是在烟雾出现后 8 秒内完成断电决策。')
  }
  if (ctx.majorMistakes > 0) {
    suggestions.push('反复练习电气火灾处置流程：断电 → 灭火器 → 撤离，牢记带电设备严禁用水。')
  }
  suggestions.push('完整演练一次“断电—灭火—报警—撤离—清点人数”的应急处置全流程。')

  return {
    summary,
    problems: Array.from(new Set(problems)).slice(0, 4),
    suggestions: Array.from(new Set(suggestions)).slice(0, 3),
    generatedAt: Date.now(),
  }
}

/** AI 在线状态 Mock（始终在线；接入后端时以 /health 结果为准） */
export function mockAIMode(_mode: TrainingMode): boolean {
  return true
}
