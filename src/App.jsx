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
      default:
        return <RiskAnalysisTable state={state} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-[Inter]">
      <Sidebar 
        currentView={state.view} 
        setView={state.setView} 
        projectContext={state.captureContext} 
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
