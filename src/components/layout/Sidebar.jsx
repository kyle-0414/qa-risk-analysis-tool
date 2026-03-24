import React from 'react';
import { 
  BarChart3, 
  Layers, 
  FileEdit, 
  Grid3X3, 
  BookOpen, 
  Settings,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '../common/CommonUI';

const NAV_ITEMS = [
  { id: 'identification', label: 'Risk Identification', icon: Layers, description: '초기 리스크 도출' },
  { id: 'review', label: 'Risk Board / Review', icon: BarChart3, description: '우선순위 대시보드' },
  { id: 'detail', label: 'Detailed Analysis', icon: FileEdit, description: '심층 분석 및 대응' },
  { id: 'matrix', label: 'Visual Matrix', icon: Grid3X3, description: '분포 데이터 시각화' },
  { id: 'guide', label: 'Guide & Policy', icon: BookOpen, description: 'QA 리스크 정책' },
];

export function Sidebar({ currentView, setView, projectContext }) {
  return (
    <aside className="w-72 border-r border-slate-200 bg-white p-6 flex flex-col h-full shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)] z-10">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div>
          <div className="inline-block bg-slate-100 text-[10px] px-1.5 py-0.5 rounded font-bold text-slate-500 uppercase tracking-widest mb-0.5">INTERNAL QA</div>
          <div className="text-xl font-black text-slate-800 tracking-tight leading-none">Risk Tool</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full group rounded-2xl flex items-center gap-4 px-4 py-3.5 text-left transition-all duration-300 relative",
                isActive 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
              <div className="flex-1">
                <div className="text-sm font-bold tracking-tight">{item.label}</div>
                {isActive && <div className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">{item.description}</div>}
              </div>
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
              <ChevronRight className={cn("w-4 h-4 transition-transform", isActive ? "rotate-90 opacity-40" : "opacity-0 group-hover:opacity-100")} />
            </button>
          );
        })}
      </nav>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Active Context</span>
          </div>
          <div className="text-[13px] font-bold text-slate-800 truncate mb-1">{projectContext.project} {projectContext.product}</div>
          <div className="text-[11px] text-slate-500 bg-white/60 px-2 py-0.5 rounded-md border border-slate-200/50 inline-block font-medium">Build: {projectContext.release}</div>
        </div>
        
        <div className="px-2">
          <button className="w-full text-[11px] text-slate-400 font-semibold hover:text-slate-600 px-2 py-1 flex items-center justify-center gap-2 transition-colors">
            <span>Documentation v1.4</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
