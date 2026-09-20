/**
 * 2D 宿舍俯视示意图（SVG）
 * 热点坐标以百分比覆盖在本图之上（见 mockData.ts 中 position）。
 */
export default function DormScene() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="h-full w-full"
      role="img"
      aria-label="学生宿舍 2D 俯视示意图"
    >
      <defs>
        <pattern id="floor-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56,189,248,0.05)" strokeWidth="1" />
        </pattern>
        <linearGradient id="furniture" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(56,189,248,0.10)" />
          <stop offset="100%" stopColor="rgba(56,189,248,0.04)" />
        </linearGradient>
      </defs>

      {/* 房间外墙 */}
      <rect x="16" y="16" width="768" height="568" rx="10" fill="url(#floor-grid)" />
      {/* 北墙（含窗洞 280-420） */}
      <path d="M16 16 H280" stroke="rgba(148,197,255,0.45)" strokeWidth="4" fill="none" />
      <path d="M420 16 H784" stroke="rgba(148,197,255,0.45)" strokeWidth="4" fill="none" />
      {/* 东西墙 */}
      <path d="M16 16 V584" stroke="rgba(148,197,255,0.45)" strokeWidth="4" fill="none" />
      <path d="M784 16 V584" stroke="rgba(148,197,255,0.45)" strokeWidth="4" fill="none" />
      {/* 南墙（含门洞 560-680） */}
      <path d="M16 584 H560" stroke="rgba(148,197,255,0.45)" strokeWidth="4" fill="none" />
      <path d="M680 584 H784" stroke="rgba(148,197,255,0.45)" strokeWidth="4" fill="none" />

      {/* 窗户 */}
      <rect x="280" y="10" width="140" height="12" rx="2" fill="rgba(125,211,252,0.25)" stroke="rgba(125,211,252,0.6)" strokeWidth="1.5" />
      <line x1="350" y1="10" x2="350" y2="22" stroke="rgba(125,211,252,0.6)" strokeWidth="1" />
      <text x="350" y="42" textAnchor="middle" fontSize="12" fill="rgba(148,163,184,0.7)">窗户</text>

      {/* 门与开门弧线 */}
      <path d="M560 584 A120 120 0 0 1 680 584" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
      <line x1="560" y1="584" x2="560" y2="464" stroke="rgba(52,211,153,0.55)" strokeWidth="3" />
      <rect x="572" y="548" width="96" height="20" rx="3" fill="rgba(16,185,129,0.18)" stroke="rgba(52,211,153,0.6)" strokeWidth="1.2" />
      <text x="620" y="563" textAnchor="middle" fontSize="12" fill="#34D399" fontWeight="bold">安全出口</text>

      {/* 左床（靠西墙） */}
      <g>
        <rect x="40" y="70" width="150" height="262" rx="6" fill="url(#furniture)" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" />
        <rect x="52" y="82" width="126" height="46" rx="4" fill="rgba(226,232,240,0.10)" stroke="rgba(148,197,255,0.25)" />
        <rect x="52" y="138" width="126" height="182" rx="4" fill="rgba(56,189,248,0.06)" stroke="rgba(148,197,255,0.18)" />
        <text x="115" y="320" textAnchor="middle" fontSize="12" fill="rgba(148,163,184,0.7)">床 A</text>
        {/* 床头墙面插座 + 充电器 */}
        <rect x="98" y="62" width="22" height="12" rx="2" fill="rgba(249,115,22,0.16)" stroke="rgba(251,146,60,0.7)" strokeWidth="1.3" />
        <circle cx="105" cy="68" r="1.8" fill="#FB923C" />
        <circle cx="113" cy="68" r="1.8" fill="#FB923C" />
      </g>

      {/* 右床（靠东墙） */}
      <g>
        <rect x="610" y="70" width="150" height="262" rx="6" fill="url(#furniture)" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" />
        <rect x="622" y="82" width="126" height="46" rx="4" fill="rgba(226,232,240,0.10)" stroke="rgba(148,197,255,0.25)" />
        <rect x="622" y="138" width="126" height="182" rx="4" fill="rgba(56,189,248,0.06)" stroke="rgba(148,197,255,0.18)" />
        <text x="685" y="320" textAnchor="middle" fontSize="12" fill="rgba(148,163,184,0.7)">床 B</text>
      </g>

      {/* 书桌（靠窗） */}
      <g>
        <rect x="250" y="56" width="300" height="96" rx="6" fill="url(#furniture)" stroke="rgba(148,197,255,0.35)" strokeWidth="1.5" />
        {/* 显示器 */}
        <rect x="396" y="66" width="52" height="34" rx="3" fill="rgba(15,24,40,0.9)" stroke="rgba(125,211,252,0.5)" strokeWidth="1.2" />
        <line x1="422" y1="100" x2="422" y2="108" stroke="rgba(148,197,255,0.4)" strokeWidth="2" />
        {/* 书本 */}
        <rect x="270" y="70" width="40" height="10" rx="2" fill="rgba(226,232,240,0.12)" />
        <rect x="270" y="82" width="34" height="8" rx="2" fill="rgba(226,232,240,0.08)" />
        {/* 串联插线板 1、2 */}
        <rect x="300" y="96" width="46" height="14" rx="3" fill="rgba(249,115,22,0.14)" stroke="rgba(251,146,60,0.75)" strokeWidth="1.3" />
        <rect x="346" y="96" width="46" height="14" rx="3" fill="rgba(249,115,22,0.14)" stroke="rgba(251,146,60,0.75)" strokeWidth="1.3" />
        <line x1="346" y1="103" x2="346" y2="103" stroke="#FB923C" strokeWidth="2" />
        <circle cx="312" cy="103" r="2" fill="#FB923C" />
        <circle cx="324" cy="103" r="2" fill="#FB923C" />
        <circle cx="358" cy="103" r="2" fill="#FB923C" />
        <circle cx="370" cy="103" r="2" fill="#FB923C" />
        {/* 高功率电器：电热杯 + 吹风机 */}
        <rect x="468" y="74" width="26" height="30" rx="4" fill="rgba(239,68,68,0.14)" stroke="rgba(248,113,113,0.7)" strokeWidth="1.3" />
        <path d="M470 74 q10 -10 22 0" stroke="rgba(248,113,113,0.7)" strokeWidth="1.3" fill="none" />
        <rect x="440" y="86" width="22" height="12" rx="6" fill="rgba(239,68,68,0.12)" stroke="rgba(248,113,113,0.6)" strokeWidth="1.2" />
        <text x="400" y="144" textAnchor="middle" fontSize="12" fill="rgba(148,163,184,0.7)">书桌</text>
      </g>

      {/* 椅子 */}
      <rect x="372" y="166" width="56" height="46" rx="5" fill="rgba(56,189,248,0.05)" stroke="rgba(148,197,255,0.25)" strokeWidth="1.3" />

      {/* 桌前可燃物纸箱 */}
      <g>
        <rect x="392" y="150" width="52" height="44" rx="2" fill="rgba(249,115,22,0.08)" stroke="rgba(251,146,60,0.55)" strokeWidth="1.3" />
        <path d="M392 162 H444 M418 150 V194" stroke="rgba(251,146,60,0.35)" strokeWidth="1" />
      </g>

      {/* 地面电线（被矮柜压住） */}
      <path
        d="M300 112 C260 150 236 220 200 278 L200 330"
        stroke="rgba(251,146,60,0.55)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
      />
      {/* 压线矮柜 */}
      <g>
        <rect x="172" y="278" width="56" height="54" rx="4" fill="rgba(56,189,248,0.10)" stroke="rgba(148,197,255,0.4)" strokeWidth="1.4" />
        <line x1="172" y1="296" x2="228" y2="296" stroke="rgba(148,197,255,0.25)" strokeWidth="1" />
        <text x="200" y="364" textAnchor="middle" fontSize="11" fill="rgba(148,163,184,0.65)">矮柜</text>
      </g>

      {/* 衣柜 */}
      <rect x="40" y="420" width="120" height="130" rx="5" fill="url(#furniture)" stroke="rgba(148,197,255,0.3)" strokeWidth="1.4" />
      <line x1="100" y1="420" x2="100" y2="550" stroke="rgba(148,197,255,0.22)" strokeWidth="1" />
      <text x="100" y="492" textAnchor="middle" fontSize="12" fill="rgba(148,163,184,0.7)">衣柜</text>

      {/* 垃圾桶 */}
      <path d="M250 432 L282 432 L278 470 L254 470 Z" fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.3)" strokeWidth="1.2" />

      {/* 右下储物柜 */}
      <rect x="688" y="380" width="84" height="110" rx="5" fill="url(#furniture)" stroke="rgba(148,197,255,0.3)" strokeWidth="1.4" />
      <text x="730" y="440" textAnchor="middle" fontSize="12" fill="rgba(148,163,184,0.7)">储物柜</text>

      {/* 门口杂物堆 */}
      <g>
        <rect x="596" y="492" width="40" height="46" rx="2" fill="rgba(249,115,22,0.10)" stroke="rgba(251,146,60,0.6)" strokeWidth="1.3" />
        <rect x="638" y="504" width="38" height="34" rx="2" fill="rgba(249,115,22,0.08)" stroke="rgba(251,146,60,0.5)" strokeWidth="1.3" />
        <path d="M596 505 H636 M616 492 V538" stroke="rgba(251,146,60,0.35)" strokeWidth="1" />
        {/* 鞋架 */}
        <line x1="588" y1="486" x2="684" y2="486" stroke="rgba(251,146,60,0.4)" strokeWidth="2" />
        <line x1="592" y1="478" x2="592" y2="492" stroke="rgba(251,146,60,0.4)" strokeWidth="2" />
        <line x1="680" y1="478" x2="680" y2="492" stroke="rgba(251,146,60,0.4)" strokeWidth="2" />
      </g>
    </svg>
  )
}
