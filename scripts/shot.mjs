/**
 * 仅用于本地验证：驱动系统 Edge/Chrome 按真实时序对各区块截图，并收集 Console 错误。
 * 运行：node scripts/shot.mjs
 * 不属于前端打包产物。
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { execSync } from 'node:child_process'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT = new URL('../shots/', import.meta.url).pathname.replace(/^\/(\w:)/, '$1')
mkdirSync(OUT, { recursive: true })

const SECTION_IDS = ['home', 'features', 'hazards', 'fire', 'ai', 'report', 'comparison', 'architecture']

async function run(width, height, suffix) {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    defaultViewport: { width, height },
    args: ['--hide-scrollbars', '--disable-gpu'],
  })
  const page = await browser.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(`PAGEERROR: ${err.message}`))

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1800))
  await page.screenshot({ path: `${OUT}${suffix}-hero.png` })

  for (const id of SECTION_IDS) {
    await page.evaluate((sid) => {
      document.getElementById(sid)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, id)
    await new Promise((r) => setTimeout(r, 1300))
    await page.screenshot({ path: `${OUT}${suffix}-${id}.png` })
  }

  await browser.close()
  return errors
}

const errors1440 = await run(1440, 900, 'pc1440')
const errors1920 = await run(1920, 1080, 'pc1920')
const all = [...new Set([...errors1440, ...errors1920])]
console.log(all.length === 0 ? 'CONSOLE_ERRORS: 0' : `CONSOLE_ERRORS:\n${all.join('\n')}`)
execSync(`powershell -Command "Get-ChildItem '${OUT}' | Select-Object Name,Length | Format-Table -AutoSize"`, { stdio: 'inherit' })
