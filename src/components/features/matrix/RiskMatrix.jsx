import React, { useState, useMemo } from "react";
import { Button, Input, Select } from "../../common/CommonUI";
import { Badge, StatCard, Field } from "../../common/DisplayUI";
import { getScore, getPriority } from "../../../utils/riskCalculations";
import { Filter, Grid3X3, Layers, ZoomIn, ZoomOut, AlertCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RiskMatrix({ state }) {
  const { items, filters, setFilters, setView, setSelectedId, setForm } = state;
  const [selectedCell, setSelectedCell] = useState({ x: null, y: null });

  const axis = [9, 5, 3, 1, 0];
  const axisX = [0, 1, 3, 5, 9];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const score = getScore(item);
      const priority = getPriority(score);
      const searchBase = `${item.title} ${item.relatedArea} ${item.description} ${item.changeSummary}`.toLowerCase();
      return (
        (filters.riskType === "All" || item.riskType === filters.riskType) &&
        (filters.changeType === "All" || item.changeType === filters.changeType) &&
        (filters.priority === "All" || priority === filters.priority) &&
        (filters.status === "All" || item.status === filters.status) &&
        (!filters.search || searchBase.includes(filters.search.toLowerCase()))
      );
    });
  }, [items, filters]);

  const cellItems = useMemo(() => {
    if (selectedCell.x === null || selectedCell.y === null) return [];
    return filteredItems.filter(
      (item) => item.likelihood === selectedCell.x && item.impact === selectedCell.y
    );
  }, [filteredItems, selectedCell]);

  const openEdit = (item) => {
    setSelectedId(item.id);
    setForm({ ...item });
    setView("detail");
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Visual Risk Matrix</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">리스크 분포 데이터 시각화 및 밀집도 분석</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="w-10 h-10 p-0"><ZoomIn className="w-4 h-4" /></Button>
            <Button variant="secondary" size="sm" className="w-10 h-10 p-0"><ZoomOut className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
            <Field label="Risk Type Filter">
                <Select value={filters.riskType} onChange={(e) => setFilters(f => ({...f, riskType: e.target.value}))} options={["All", "Product", "Project"]} />
            </Field>
            <Field label="Change Type Filter">
                <Select value={filters.changeType} onChange={(e) => setFilters(f => ({...f, changeType: e.target.value}))} options={["All", "New", "Modify", "Maintenance", "Hotfix"]} />
            </Field>
            <Field label="Search">
                <Input value={filters.search} onChange={(e) => setFilters(f => ({...f, search: e.target.value}))} placeholder="아이템 검색..." />
            </Field>
            <div className="pt-6 flex justify-end">
                <Button variant="ghost" onClick={() => setFilters({ riskType: "All", changeType: "All", priority: "All", status: "All", search: "" })}>Clear Filters</Button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr,360px] gap-8">
        <div className="bg-white rounded-[40px] border border-slate-200 p-12 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
            {/* Background Gradients for Priority */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-red-50/20 pointer-events-none group-hover:bg-red-50/40 transition-colors" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-slate-50/50 pointer-events-none" />

            <div className="flex relative">
                {/* Y Axis Label */}
                <div className="absolute -left-12 top-1/2 -rotate-90 origin-center text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none whitespace-nowrap">
                    Impact Impact Impact
                </div>

                <div className="flex-1 space-y-4">
                    {axis.map((y) => (
                    <div key={y} className="flex gap-4">
                        <div className="w-8 h-24 flex items-center justify-end pr-2 text-xs font-black text-slate-400 leading-none">{y}</div>
                        <div className="flex-1 grid grid-cols-5 gap-4">
                        {axisX.map((x) => {
                            const itemsAtCell = filteredItems.filter((item) => item.likelihood === x && item.impact === y);
                            const isSelected = selectedCell.x === x && selectedCell.y === y;
                            const score = x * y;
                            const isCriticalAtOrigin = score >= 45;
                            const isHighAtOrigin = score >= 15 && score < 45;

                            return (
                            <button
                                key={`${x}-${y}`}
                                onClick={() => setSelectedCell({ x, y })}
                                className={`relative h-24 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group/cell ${
                                isSelected
                                    ? "bg-slate-900 border-slate-900 shadow-2xl scale-[1.05] z-10"
                                    : itemsAtCell.length > 0
                                    ? isCriticalAtOrigin ? "bg-red-50/80 border-red-200 shadow-sm" : isHighAtOrigin ? "bg-amber-50/80 border-amber-200 shadow-sm" : "bg-white border-slate-100 shadow-sm"
                                    : "bg-slate-200/5 hover:bg-slate-100 hover:border-slate-300 border-dashed border-slate-200 shadow-none"
                                }`}
                            >
                                {itemsAtCell.length > 0 && (
                                    <div className={`text-xl font-black ${isSelected ? "text-white" : isCriticalAtOrigin ? "text-red-700" : isHighAtOrigin ? "text-amber-700" : "text-slate-900"} tracking-tight`}>
                                        {itemsAtCell.length}
                                    </div>
                                )}
                                {isSelected && <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">L{x} • I{y}</div>}
                                {itemsAtCell.length > 0 && !isSelected && (
                                    <div className="flex gap-0.5 justify-center flex-wrap px-2">
                                        {itemsAtCell.slice(0, 3).map((it) => (
                                            <div key={it.id} className={`w-1.5 h-1.5 rounded-full ${isCriticalAtOrigin ? "bg-red-400" : isHighAtOrigin ? "bg-amber-400" : "bg-slate-300"}`} />
                                        ))}
                                    </div>
                                )}
                            </button>
                            );
                        })}
                        </div>
                    </div>
                    ))}
                    <div className="flex gap-4">
                        <div className="w-8 h-8" />
                        <div className="flex-1 grid grid-cols-5 gap-4 px-2">
                            {axisX.map(x => <div key={x} className="w-full text-center text-xs font-black text-slate-400 leading-none">{x}</div>)}
                        </div>
                    </div>
                    <div className="text-center pt-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Likelihood Likelihood Likelihood</div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px]">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
              <Layers className="w-4 h-4 text-slate-400" /> Cell Item Snapshot
            </h3>
            
            <AnimatePresence mode="wait">
                {selectedCell.x === null ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                         <Grid3X3 className="w-12 h-12 text-slate-100 mb-4" />
                         <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">분포 현황을 볼 매트릭스 셀을<br/>선택하세요.</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key={`${selectedCell.x}-${selectedCell.y}`}
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-3"
                    >
                         <div className="flex items-center justify-between mb-4">
                             <div className="text-[11px] font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">L: {selectedCell.x} • I: {selectedCell.y}</div>
                             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{cellItems.length} items found</div>
                         </div>
                         <div className="space-y-2 overflow-y-auto max-h-[450px] pr-2 scrollbar-hide">
                            {cellItems.map(it => (
                                <button key={it.id} onClick={() => openEdit(it)} className="w-full text-left p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all group flex items-start gap-3">
                                    <div className="flex-1">
                                        <div className="text-[12px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{it.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge priority={getPriority(getScore(it))} className="text-[9px] px-1.5 py-0 scale-90 origin-left" />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{it.relatedArea}</span>
                                        </div>
                                    </div>
                                    <TrendingUp className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-800" />
                                </button>
                            ))}
                            {cellItems.length === 0 && (
                                <div className="text-center py-10 opacity-30 grayscale saturate-0">
                                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                    <div className="text-[10px] font-black uppercase tracking-widest">No Items</div>
                                </div>
                            )}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/50">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Priority Guidelines</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="text-[11px] font-bold text-slate-600">Critical (Score 45+)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-bold text-slate-600">High (Score 15-44)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="text-[11px] font-bold text-slate-600">Moderate/Low (Score 1-14)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
