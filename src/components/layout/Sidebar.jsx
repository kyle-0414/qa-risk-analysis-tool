import React from 'react';
import {
  BarChart3,
  Layers,
  FileEdit,
  Grid3X3,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Map,
  Activity,
} from 'lucide-react';
import { cn } from '../common/CommonUI';
import { motion } from "framer-motion";

const NAV_GROUPS = [
  {
    label: "리스크 식별",
    step: 1,
    items: [
      { id: 'identification', label: 'Risk Capture', icon: Layers, description: '초기 리스크 도출' },
      { id: 'review', label: 'Risk Board', icon: BarChart3, description: '우선순위 대시보드' },
    ],
  },
  {
    label: "리스크 분석",
    step: 2,
    items: [
      { id: 'detail', label: 'Detailed Analysis', icon: FileEdit, description: '심층 분석 및 대응' },
      { id: 'matrix', label: 'Risk Matrix', icon: Grid3X3, description: '분포 데이터 시각화' },
    ],
  },
  {
    label: "리스크 계획",
    step: 3,
    items: [
      { id: 'strategy', label: 'Test Strategy', icon: Map, description: '테스트 전략 수립', soon: true },
    ],
  },
  {
    label: "리스크 추적",
    step: 4,
    items: [
      { id: 'tracking', label: 'Risk Tracking', icon: Activity, description: '리스크 추적 관리', soon: true },
    ],
  },
];

const STEP_LABELS = ['①', '②', '③', '④'];

export function Sidebar({ currentView, setView, state = {} }) {
  const { runDemo = () => {} } = state;
  const [clickCount, setClickCount] = React.useState(0);

  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount + 1 >= 3) {
      runDemo();
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <aside className="w-72 border-r border-slate-200 bg-white p-6 flex flex-col min-h-screen sticky top-0 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] z-30">
      {/* Brand Logo */}
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

      {/* Nav Groups */}
      <nav className="space-y-5 px-1 flex-1">
        {NAV_GROUPS.map((group, gi) => (
          <div key={group.label}>
            {/* Group Header */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[13px] text-slate-300 leading-none select-none">{STEP_LABELS[gi]}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{group.label}</span>
            </div>

            {/* Group Items */}
            <div className="space-y-1 pl-2">
              {group.items.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => !item.soon && setView(item.id)}
                    disabled={item.soon}
                    className={cn(
                      "w-full group rounded-2xl flex items-center gap-4 px-4 py-3 text-left transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                        : item.soon
                        ? "text-slate-400 opacity-40 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                    <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold tracking-tight flex items-center gap-2">
                        {item.label}
                        {item.soon && (
                          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">SOON</span>
                        )}
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-slate-400 font-medium leading-none mt-0.5"
                        >
                          {item.description}
                        </motion.div>
                      )}
                    </div>
                    {!item.soon && (
                      <ChevronRight className={cn("w-4 h-4 shrink-0 transition-all", isActive ? "rotate-90 opacity-40" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5")} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Divider + Guide */}
        <div className="border-t border-slate-100 mt-4 pt-4">
          {(() => {
            const item = { id: 'guide', label: 'Guide & Policy', icon: BookOpen, description: 'QA 리스크 정책' };
            const isActive = currentView === item.id;
            return (
              <button
                onClick={() => setView(item.id)}
                className={cn(
                  "w-full group rounded-2xl flex items-center gap-4 px-4 py-3 text-left transition-all duration-300 relative overflow-hidden",
                  isActive
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />}
                <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                <div className="flex-1">
                  <div className="text-sm font-bold tracking-tight">{item.label}</div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-slate-400 font-medium leading-none mt-0.5"
                    >
                      {item.description}
                    </motion.div>
                  )}
                </div>
                <ChevronRight className={cn("w-4 h-4 shrink-0 transition-all", isActive ? "rotate-90 opacity-40" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5")} />
              </button>
            );
          })()}
        </div>
      </nav>
    </aside>
  );
}
