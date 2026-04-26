import React from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { useRiskToolState } from "./hooks/useRiskToolState";
import { RiskAnalysisTable } from "./components/features/analysis/RiskAnalysisTable";
import { RiskReview } from "./components/features/review/RiskReview";
import { RiskDetail } from "./components/features/detail/RiskDetail";
import { RiskDetailSlideOver } from "./components/features/detail/RiskDetailSlideOver";
import { RiskMatrix } from "./components/features/matrix/RiskMatrix";
import { RiskGuide } from "./components/features/guide/RiskGuide";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Activity } from "lucide-react";

function ComingSoon({ icon: Icon, title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-[28px] flex items-center justify-center">
        <Icon className="w-9 h-9 text-slate-300" />
      </div>
      <div>
        <div className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] mb-2">Coming Soon</div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
        <p className="text-sm text-slate-400 font-medium mt-2">현재 준비 중입니다.</p>
      </div>
    </div>
  );
}

function App() {
  const state = useRiskToolState();

  const renderView = () => {
    switch (state.view) {
      case "identification":
        return <RiskAnalysisTable state={state} />;
      case "review":
        return <RiskReview state={state} />;
      case "detail":
        return <RiskDetail state={state} />;
      case "matrix":
        return <RiskMatrix state={state} />;
      case "guide":
        return <RiskGuide state={state} />;
      case "strategy":
        return <ComingSoon icon={Map} title="Test Strategy" />;
      case "tracking":
        return <ComingSoon icon={Activity} title="Risk Tracking" />;
      default:
        return <RiskAnalysisTable state={state} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-[Inter]">
      <Sidebar 
        currentView={state.view} 
        setView={state.setView} 
        state={state} 
      />
      
      <main className="flex-1 overflow-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.view}
            initial={{ opacity: 0, scale: 0.99, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.01, y: -4 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="p-8 lg:px-12 min-h-full w-full max-w-[1800px] mx-auto"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {state.toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 20, x: "-50%" }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-bold tracking-tight">{state.toast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <RiskDetailSlideOver state={state} />
      </main>
    </div>
  );
}

export default App;
