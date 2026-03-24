import React from 'react';
import { 
  BarChart3, 
  Layers, 
  FileEdit, 
  Grid3X3, 
  BookOpen, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '../common/CommonUI';
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { id: 'identification', label: 'Risk Identification', icon: Layers, description: '초기 리스크 도출' },
  { id: 'review', label: 'Risk Board / Review', icon: BarChart3, description: '우선순위 대시보드' },
  { id: 'detail', label: 'Detailed Analysis', icon: FileEdit, description: '심층 분석 및 대응' },
  { id: 'matrix', label: 'Visual Matrix', icon: Grid3X3, description: '분포 데이터 시각화' },
  { id: 'guide', label: 'Guide & Policy', icon: BookOpen, description: 'QA 리스크 정책' },
];

export function Sidebar({ currentView, setView, state = {} }) {
  const { runDemo = () => {} } = state;
  const [clickCount, setClickCount] = React.useState(0);

  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount + 1 >= 3) {
      runDemo();
      setClickCount(0);
    }
    // 3초 후 카운트 리셋
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <aside className="w-72 border-r border-slate-200 bg-white p-6 flex flex-col min-h-screen sticky top-0 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] z-30">
      {/* Brand Logo Section */}
      <div 
        onClick={handleLogoClick}
        className="mb-10 px-2 flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 transition-transform group-active:scale-95">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="inline-block bg-slate-100 text-[10px] px-1.5 py-0.5 rounded font-bold text-slate-500 uppercase tracking-widest mb-0.5">INTERNAL QA</div>
          <div className="text-xl font-black text-slate-800 tracking-tight leading-none">Risk Tool</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full group rounded-2xl flex items-center gap-4 px-4 py-3.5 text-left transition-all duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
              <div className="flex-1">
                <div className="text-sm font-bold tracking-tight">{item.label}</div>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-slate-400 font-medium leading-none mt-1"
                  >
                    {item.description}
                  </motion.div>
                )}
              </div>
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
              <ChevronRight className={cn("w-4 h-4 transition-all", isActive ? "rotate-90 opacity-40" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5")} />
            </button>
          );
        })}
      </nav>

      {/* Bottom Spacer to ensure background color fills down */}
      <div className="flex-1" />
    </aside>
  );
}
