import DemoTourBar from '@/components/layout/DemoTourBar'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import AISection from '@/components/sections/AISection'
import ArchitectureSection from '@/components/sections/ArchitectureSection'
import ComparisonSection from '@/components/sections/ComparisonSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import FireSection from '@/components/sections/FireSection'
import HazardsSection from '@/components/sections/HazardsSection'
import HeroSection from '@/components/sections/HeroSection'
import ScoreSection from '@/components/sections/ScoreSection'
import { useDemoTour } from '@/hooks/useDemoTour'

export default function App() {
  const tour = useDemoTour()

  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar onStartDemo={tour.start} />

      <main>
        {/* 首页 Hero */}
        <HeroSection />
        {/* 项目简介 + 核心能力 */}
        <FeaturesSection />
        {/* 交互式宿舍安全隐患体验 */}
        <HazardsSection />
        {/* 火灾事故模拟 */}
        <FireSection />
        {/* AI 教官 */}
        <AISection />
        {/* 训练评分 + AI 复盘 */}
        <ScoreSection />
        {/* 项目特色：与传统方式对比 */}
        <ComparisonSection />
        {/* 技术架构 + 技术栈 */}
        <ArchitectureSection />
      </main>

      <Footer />
      <DemoTourBar active={tour.active} step={tour.step} steps={tour.steps} onStop={tour.stop} />
    </div>
  )
}
