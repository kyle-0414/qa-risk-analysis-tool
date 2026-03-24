import React, { useState, useMemo } from "react";
import { Button, Input, Select } from "../../common/CommonUI";
import { Badge, Field } from "../../common/DisplayUI";
import { getScore, getPriority } from "../../../utils/riskCalculations";
import { Grid3X3, Layers, ZoomIn, ZoomOut, AlertCircle, TrendingUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RiskMatrix({ state }) {
  const { items, filters, setFilters, setView, setSelectedId, setForm } = state;
  const [selectedCell, setSelectedCell] = useState({ x: null, y: null });

  const axisY = [9, 5, 3, 1, 0];
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

  const getCellIntensity = (count) => {
    if (count === 0) return "bg-white";
    if (count < 2) return "bg-slate-50";
    if (count < 5) return "bg-slate-100";
    return "bg-slate-200/50";
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-[1800px] mx-auto">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Visual Risk Matrix</h1>
            <div className="bg-blue-600 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase tracking-widest mt-0.5">Live Data</div>
          </div>
          <p className="text-sm text-slate-500 font-medium tracking-tight flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-300" /> 리스크 분포 시각화 및 데이터 밀집 구역(Hotspot) 분석 대시보드
          </p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right mr-2">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visualization View</div>
                <div className="text-[13px] font-bold text-slate-800">{filteredItems.length} items analyzed</div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><ZoomIn className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-slate-200 self-center" />
                <button className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"><ZoomOut className="w-4 h-4" /></button>
            </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Field label="Risk Type">
                <Select value={filters.riskType} onChange={(e) => setFilters(f => ({...f, riskType: e.target.value}))} options={["All", "Product", "Project"]} />
            </Field>
            <Field label="Change Type">
                <Select value={filters.changeType} onChange={(e) => setFilters(f => ({...f, changeType: e.target.value}))} options={["All", "New", "Modify", "Maintenance", "Hotfix"]} />
            </Field>
            <Field label="Search Items">
                <Input value={filters.search} onChange={(e) => setFilters(f => ({...f, search: e.target.value}))} placeholder="Search by name or note..." />
            </Field>
            <div className="flex items-end justify-end">
                <button 
                    onClick={() => setFilters({ riskType: "All", changeType: "All", priority: "All", status: "All", search: "" })}
                    className="h-11 px-6 text-[12px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-all border border-slate-200 rounded-xl hover:bg-slate-50 w-full lg:w-auto"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-stretch pt-2">
        {/* Main Matrix Board */}
        <div className="xl:flex-1 bg-white rounded-[48px] border border-slate-200 p-10 lg:p-16 shadow-xl shadow-slate-200/20 relative overflow-hidden flex flex-col items-center min-h-[700px]">
            {/* Standard Axes Labeling */}
            {/* Impact Y-Axis (Left) */}
            <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 -rotate-180 flex items-center gap-4 [writing-mode:vertical-lr] pointer-events-none">
                <div className="w-[1px] h-32 bg-slate-200" />
                <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] select-none">Impact Intensity</span>
            </div>

            <div className="relative w-full max-w-[700px] aspect-square flex flex-col mt-4">
                {/* Visual Risk Zones Underlay */}
                <div className="absolute inset-0 border border-slate-100/50 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-3/5 h-3/5 bg-red-50/10" />
                    <div className="absolute bottom-0 right-0 w-2/5 h-2/5 bg-amber-50/10" />
                </div>

                <div className="flex-1 flex flex-col">
                    {axisY.map((y) => (
                    <div key={y} className="flex-1 flex">
                        {/* Y-Axis tick */}
                        <div className="w-10 flex items-center justify-end pr-4 text-[13px] font-black text-slate-400 leading-none select-none uppercase">{y}</div>
                        
                        <div className="flex-1 flex gap-2 lg:gap-3 py-1 lg:py-1.5">
                            {axisX.map((x) => {
                                const itemsAtCell = filteredItems.filter((item) => item.likelihood === x && item.impact === y);
                                const isSelected = selectedCell.x === x && selectedCell.y === y;
                                const cellCount = itemsAtCell.length;

                                return (
                                <button
                                    key={`${x}-${y}`}
                                    onClick={() => setSelectedCell({ x, y })}
                                    className={`relative flex-1 rounded-2xl border transition-all duration-500 flex items-center justify-center group/cell overflow-hidden ${
                                    isSelected
                                        ? "bg-slate-900 border-slate-900 shadow-2xl scale-[1.02] z-10"
                                        : cellCount > 0
                                        ? `${getCellIntensity(cellCount)} border-slate-200 shadow-sm hover:border-slate-400`
                                        : "bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                                    }`}
                                >
                                    {/* Data Marker (Count Bubble) */}
                                    {cellCount > 0 && (
                                        <div className={`
                                            w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-lg lg:text-xl font-black transition-all duration-500
                                            ${isSelected 
                                                ? "bg-white text-slate-900 shadow-lg" 
                                                : "bg-slate-900 text-white shadow-md shadow-slate-200"
                                            }
                                        `}>
                                            {cellCount}
                                        </div>
                                    )}
                                    
                                    {/* Empty Cell Visual Aid */}
                                    {cellCount === 0 && (
                                        <div className="w-1 h-1 rounded-full bg-slate-200 opacity-0 group-hover/cell:opacity-100 transition-opacity" />
                                    )}

                                    {/* Selected Indicator Label */}
                                    {isSelected && (
                                        <div className="absolute bottom-3 text-[9px] font-black uppercase tracking-widest text-slate-400/80">L{x} • I{y}</div>
                                    )}
                                </button>
                                );
                            })}
                        </div>
                    </div>
                    ))}
                    
                    {/* Likelihood X-Axis (Bottom) */}
                    <div className="flex">
                        <div className="w-10" />
                        <div className="flex-1 flex">
                            {axisX.map(x => (
                                <div key={x} className="flex-1 text-center py-4 text-[13px] font-black text-slate-400 uppercase leading-none select-none">{x}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Likelihood Axis Label */}
            <div className="mt-8 flex items-center gap-4 pointer-events-none">
                <div className="w-32 h-[1px] bg-slate-200" />
                <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] select-none">Likelihood Probability</span>
                <div className="w-32 h-[1px] bg-slate-200" />
            </div>
        </div>

        {/* Right Detail Panel */}
        <div className="xl:w-[400px] flex flex-col gap-8">
          <div className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm flex-1 min-h-[500px] flex flex-col overflow-hidden">
            <h3 className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-5">
              <Layers className="w-4 h-4 text-slate-400" /> Cell Item Snapshot
            </h3>
            
            <AnimatePresence mode="wait">
                {selectedCell.x === null ? (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center px-4"
                    >
                         <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                            <Grid3X3 className="w-8 h-8 text-slate-200" />
                         </div>
                         <p className="text-[11px] font-black text-slate-400 leading-relaxed uppercase tracking-[0.2em]">Select a cell on the grid<br/>to analyze risk items</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key={`${selectedCell.x}-${selectedCell.y}`}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                         <div className="flex items-center justify-between mb-6">
                             <div className="text-[11px] font-black text-slate-900 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">L: {selectedCell.x} • I: {selectedCell.y}</div>
                             <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{cellItems.length} items</div>
                         </div>
                         <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {cellItems.map(it => (
                                <button key={it.id} onClick={() => openEdit(it)} className="w-full text-left p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">{it.title}</div>
                                        <div className="flex items-center gap-2">
                                            <Badge priority={getPriority(getScore(it))} className="text-[9px] px-1.5 py-0 scale-90 origin-left" />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{it.relatedArea}</span>
                                        </div>
                                    </div>
                                    <TrendingUp className="absolute right-4 bottom-4 w-4 h-4 text-slate-200 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                                </button>
                            ))}
                            {cellItems.length === 0 && (
                                <div className="text-center py-20 opacity-30">
                                    <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                                    <div className="text-[10px] font-black uppercase tracking-widest">Cell Empty</div>
                                </div>
                            )}
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl">
             <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <Info className="w-4 h-4 text-blue-400" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white/60">Priority Guidelines</h4>
             </div>
             <div className="space-y-4">
                {[
                    { color: "bg-red-500", label: "Critical", range: "Score 45+", glow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]" },
                    { color: "bg-amber-500", label: "High", range: "Score 15-44", glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]" },
                    { color: "bg-slate-400", label: "Moderate/Low", range: "Score 1-14", glow: "" }
                ].map((row) => (
                    <div key={row.label} className="flex items-center gap-4 group">
                        <div className={`w-3 h-3 rounded-full ${row.color} ${row.glow} transition-transform group-hover:scale-125`} />
                        <div className="flex-1">
                            <div className="text-[11px] font-bold text-white uppercase tracking-tight">{row.label}</div>
                            <div className="text-[10px] text-white/40 font-medium">{row.range}</div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
