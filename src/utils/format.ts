/** 秒 → mm:ss */
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** 训练总分 → 等级 */
export function formatGrade(score: number): string {
  if (score >= 90) return '优秀'
  if (score >= 75) return '良好'
  if (score >= 60) return '合格'
  return '待加强'
}

/** 等级对应的颜色（用于 CircularProgress） */
export function gradeColor(score: number): string {
  if (score >= 90) return '#34D399'
  if (score >= 75) return '#38BDF8'
  if (score >= 60) return '#FB923C'
  return '#F87171'
}

let idSeed = 0
/** 生成前端临时唯一 id */
export function uid(prefix = 'id'): string {
  idSeed += 1
  return `${prefix}-${Date.now().toString(36)}-${idSeed}`
}
