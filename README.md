# 智安宿舍・Web 前端（web-dashboard）

> 基于大模型智能体的高校宿舍消防安全沉浸式实训系统 —— 交互演示前端

*Landing Page + Interactive Dashboard*，用于比赛演示与项目展示。

技术栈：**React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Zustand + Lucide Icons**



***

## 一、启动方式



```
\# 1. 安装依赖（Node.js 18+，推荐 20/22）

npm install

\# 2. 启动开发服务器（默认 http://localhost:5173）

npm run dev

\# 3. 生产构建（输出到 dist/，已通过 tsc 严格类型检查）

npm run build

npm run preview   # 本地预览生产构建
```

> 比赛现场建议使用 
>
> `npm run dev`
>
>  或 
>
> `npm run preview`
>
> ，浏览器以 1920×1080 / 1440×900 全屏演示效果最佳；平板与手机基础浏览已适配。
> 顶部导航栏「演示模式」按钮会自动依次巡演：隐患排查 → 火灾模拟 → AI 教官 → 训练报告。

## 二、页面与交互



| 区块      | 锚点              | 内容                                                  |
| ------- | --------------- | --------------------------------------------------- |
| 首页 Hero | `#home`         | 项目标题 / 标签 / 双按钮 + 与训练状态实时联动的 HUD 状态面板               |
| 项目简介    | `#features`     | 定位文案、项目标签、四大核心能力卡片                                  |
| 安全训练    | `#hazards`      | 2D 宿舍俯视图 + **6 个可点击隐患热点** + 详情卡片 + 排查清单，教学 / 考核模式切换 |
| 火灾模拟    | `#fire`         | 6 阶段事故状态机自动演化、动态场景、8 项控制操作、事故事件时间线                  |
| AI 教官   | `#ai`           | 聊天面板，回复随火灾状态 / 电源状态 / 训练模式变化（Mock AI）               |
| 训练报告    | `#report`       | 圆环总分 + 四维评分 + 训练统计 + AI 个性化复盘                       |
| 项目特色    | `#comparison`   | 传统消防宣传 vs 智安宿舍沉浸式实训对比                               |
| 技术架构    | `#architecture` | 实时交互链路 + 训练评测链路双流水线图、技术栈标签                          |

### 关键交互规则



* **隐患排查**：点击热点查看风险等级（高 / 中 / 低 Badge）与说明，「标记为已发现」每项 +5 分，全部找到得 30/30。考核模式隐藏热点脉冲与答案，需自行排查。

* **火灾模拟**：正常 → 过载 → 冒烟 → 起火 → 扩大 → 失控 自动推进；


  * 起火前**切断电源**可阻止事故；带电**尝试用水**记重大错误并使事故升级；

  * **灭火器**仅在起火 / 扩大阶段有效，失控阶段无效；**立即撤离**进入疏散终态；

  * 所有操作带时间戳写入右侧时间线，并实时影响评分与反应时间。

* **AI 教官**：本地规则引擎按 `火灾状态 × 是否断电 × 教学/考核模式 × 问题关键词` 给出不同回复；考核模式只给关键判断。

## 三、目录结构



```
web-dashboard/

├── index.html

├── vite.config.ts            # 含 @ → src 路径别名

├── tailwind.config.js        # 科技蓝/消防橙/危险红设计令牌与动效

├── .env.example              # VITE\_API\_BASE\_URL 配置示例

└── src/

&#x20;   ├── types/index.ts        # 全部业务类型（未来对齐 Unity / FastAPI 数据结构）

&#x20;   ├── data/mockData.ts      # 隐患、状态机元数据、架构、技术栈等 Mock 数据

&#x20;   ├── services/

&#x20;   │   ├── api.ts            # 统一数据访问层：getTrainingContext / sendAIMessage /

&#x20;   │   │                     #   generateAIReview / getTrainingResult / healthCheck

&#x20;   │   └── mockAI.ts         # 本地 Mock AI 规则引擎与复盘生成

&#x20;   ├── store/trainingStore.ts# Zustand 全局状态（模式/隐患/火灾状态机/时间线/聊天/复盘）

&#x20;   ├── utils/

&#x20;       ├── scoring.ts        # 纯函数评分引擎（四维 30/20/30/20）

&#x20;       └── format.ts         # 时间、等级、id 工具

&#x20;   ├── hooks/useDemoTour.ts  # 比赛演示模式自动巡演

&#x20;   └── components/

&#x20;       ├── layout/           # Navbar（滚动高亮/移动端菜单）、Footer、DemoTourBar

&#x20;       ├── ui/               # GlassPanel/RiskBadge/ProgressBar/CircularProgress 等基础组件

&#x20;       ├── training/         # 隐患排查、火灾模拟、AI 面板、评分、复盘等交互组件

&#x20;       └── sections/         # 各页面区块
```

## 四、后端对接预留（Unity + FastAPI + LLM）



* 所有数据经 `src/services/api.ts` 访问，UI 不直接写死业务数据。

* 在 `.env.local` 配置 `VITE_API_BASE_URL=http://127.0.0.1:8000` 即尝试连接真实接口；

  接口不可用时**自动回退 Mock，页面不会报错崩溃**。

* 预留接口：



| 方法   | 路径                      | 说明                                 |
| ---- | ----------------------- | ---------------------------------- |
| GET  | `/health`               | 后端健康检查                             |
| GET  | `/api/training/context` | 拉取实时训练上下文（对应 `TrainingContext`）    |
| POST | `/api/ai/instructor`    | AI 教官对话（入参 `{ message, context }`） |
| POST | `/api/ai/review`        | AI 个性化复盘                           |
| GET  | `/api/training/result`  | 训练结果报告                             |



* `TrainingContext` 数据结构（`src/types/index.ts`）即未来 Unity 客户端通过 FastAPI 下发的状态：

  `mode / phase / fireState / hazardsFound / powerCut / fireExtinguished / evacuated / majorMistakes / reactionTime ...`

## 五、其它



* 类型检查：`npm run build` 内置 `tsc -b`，`strict` 全开，无未使用变量。

* 可选验证脚本（开发用，依赖 devDependency `puppeteer-core`，调用系统 Edge 截图）：

  `node scripts/shot.mjs`（需先启动 dev server）。