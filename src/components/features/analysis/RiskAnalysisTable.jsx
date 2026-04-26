import React, { useState } from "react";
import { Button, Input, Select } from "../../common/CommonUI";
import { Badge, StatCard, Field } from "../../common/DisplayUI";
import { RISK_SCALE } from "../../../constants/riskData";
import { getScore, getPriority, makeCaptureRow } from "../../../utils/riskCalculations";
import { Plus, Save, Trash2, ExternalLink, HelpCircle, Activity, TrendingUp, PanelRightOpen, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MiniRiskMatrix } from "./MiniRiskMatrix";
import { CriteriaSettingsSlideOver } from "../settings/CriteriaSettingsSlideOver";

export function RiskAnalysisTable({ state }) {
  const {
    captureContext, setCaptureContext, captureRows, setCaptureRows,
    criteria, addCriterion, removeCriterion, renameCriterion,
    showToast, saveItem, setView, setForm, setSelectedId, setSlideOverOpen
  } = state;

  const [isCriteriaSettingsOpen, setIsCriteriaSettingsOpen] = useState(false);

  const selectedCount = captureRows.filter(r => r.selected).length;

  const deleteSelected = () => {
    setCaptureRows(prev => prev.filter(r => !r.selected));
    showToast(`${selectedCount} items deleted.`);
  };

  const openDetailedAnalysis = (row) => {
    setForm({
      title: row.title,
      relatedArea: row.relatedArea,
      description: row.note || "",
      riskType: row.riskType,
      changeType: "New", // Default for analysis tab
      likelihood: row.likelihood,
      impact: row.impact,
      status: "Draft",
      project: captureContext.project,
      product: captureContext.product,
      release: captureContext.release,
      evidenceFlags: [],
      changeSummary: "",
      concernScenario: row.note || "",
      likelihoodReason: "",
      impactReason: "",
      dependencyArea: "",
      testConstraints: "",
      focusPoints: "",
      regressionRequired: false,
      logCheckRequired: false,
      extraReviewRequired: false,
    });
    setSelectedId(null);
    setSlideOverOpen(true);
  };

  const updateCaptureRow = (localId, key, value) => {
    setCaptureRows((prev) =>
      prev.map((row) => (row.localId === localId ? { ...row, [key]: value } : row))
    );
  };

  const updateCaptureDetailScore = (localId, group, label, value) => {
    setCaptureRows((prev) =>
      prev.map((row) => {
        if (row.localId !== localId) return row;
        const updated = {
          ...row,
          [`${group}Details`]: {
            ...row[`${group}Details`],
            [label]: value,
          },
        };
        const lValues = Object.values(updated.likelihoodDetails).filter(v => v !== null);
        const iValues = Object.values(updated.impactDetails).filter(v => v !== null);
        const lAvg = lValues.length ? Math.round(lValues.reduce((a, b) => a + b, 0) / lValues.length) : null;
        const iAvg = iValues.length ? Math.round(iValues.reduce((a, b) => a + b, 0) / iValues.length) : null;
        return {
          ...updated,
          likelihood: lAvg,
          impact: iAvg
        };
      })
    );
  };

  const addRow = () => setCaptureRows(prev => [...prev, makeCaptureRow(criteria)]);

  const saveAll = () => {
    const validRows = captureRows.filter(r => r.title.trim() && r.likelihood !== null && r.impact !== null);
    if (!validRows.length) {
      showToast("리스크 정보를 입력하세요.");
      return;
    }
    validRows.forEach(row => {
      saveItem({
          title: row.title,
          relatedArea: row.relatedArea,
          description: row.note,
          riskType: row.riskType,
          changeType: row.changeType,
          likelihood: row.likelihood,
          impact: row.impact,
          status: "Draft",
          fromCapture: true,
          project: captureContext.project,
          product: captureContext.product,
          release: captureContext.release,
          evidenceFlags: [],
          changeSummary: "",
          concernScenario: row.note,
          likelihoodReason: "",
          impactReason: "",
          dependencyArea: "",
          testConstraints: "",
          focusPoints: "",
          regressionRequired: false,
          logCheckRequired: false,
          extraReviewRequired: false,
      });
    });
    setCaptureRows([makeCaptureRow(criteria), makeCaptureRow(criteria)]);
    showToast(`${validRows.length} items saved to board.`);
  };

  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Risk Identification</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">리스크 아이템 도출 및 정량적 Likelihood / Impact 분석 단계</p>
        </div>
        <div className="flex gap-3 items-end">
          {selectedCount > 0 && (
            <Button variant="danger" onClick={deleteSelected} size="md">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Selected ({selectedCount})
            </Button>
          )}
          <Button variant="ghost" onClick={() => setIsCriteriaSettingsOpen(true)} size="md" title="평가 항목 설정">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Criteria
          </Button>
          <Button variant="secondary" onClick={addRow} size="md">
            <Plus className="w-4 h-4 mr-2" /> Add Row
          </Button>
          <Button variant="primary" onClick={saveAll} size="md">
            <Save className="w-4 h-4 mr-2" /> Save to Board
          </Button>
        </div>
      </div>

      <div className="flex flex-col 2xl:grid 2xl:grid-cols-[1fr,400px] gap-8">
        <div className="space-y-6 flex-1 min-w-0">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Field label="Project Context"><Input value={captureContext.project} onChange={(e) => setCaptureContext(c => ({...c, project: e.target.value}))} placeholder="BCM" /></Field>
              <Field label="Target Product"><Input value={captureContext.product} onChange={(e) => setCaptureContext(c => ({...c, product: e.target.value}))} placeholder="Viewer" /></Field>
              <Field label="Target Build / Release"><Input value={captureContext.release} onChange={(e) => setCaptureContext(c => ({...c, release: e.target.value}))} placeholder="1.3.0-qa.2" /></Field>
              <Field label="Risk Template"><Input value={captureContext.template} onChange={(e) => setCaptureContext(c => ({...c, template: e.target.value}))} placeholder="Standard 3x3" /></Field>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20">
            <div className="overflow-x-auto">
              <table className="min-w-[1700px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 align-middle">
                    <th rowSpan={2} className="w-14 px-4 py-3 text-center align-middle font-bold text-[11px] uppercase tracking-wider">Sel</th>
                    <th rowSpan={2} className="px-5 py-4 text-left align-middle font-bold text-[11px] uppercase tracking-wider text-slate-600">Risk Item Description</th>
                    <th rowSpan={2} className="px-5 py-4 text-center align-middle font-bold text-[11px] uppercase tracking-wider text-slate-600">Module / Area</th>
                    <th rowSpan={2} className="px-5 py-4 text-center align-middle font-bold text-[11px] uppercase tracking-wider text-slate-600">Risk Type</th>
                    <th colSpan={criteria.likelihood.length + 1} className="px-5 py-3 text-center align-middle font-black text-[12px] uppercase tracking-wider text-blue-700 border-l border-slate-200/50 bg-blue-50/20">장애 발생 가능성 (Likelihood)</th>
                    <th colSpan={criteria.impact.length + 1} className="px-5 py-3 text-center align-middle font-black text-[12px] uppercase tracking-wider text-indigo-700 border-l border-slate-200/50 bg-indigo-50/20">장애 발생 시 영향도 (Impact)</th>
                    <th rowSpan={2} className="px-5 py-4 text-center align-middle font-bold text-[11px] uppercase tracking-wider text-slate-600 border-l border-slate-200/50">Score</th>
                    <th rowSpan={2} className="px-5 py-4 text-center align-middle font-bold text-[11px] uppercase tracking-wider text-slate-600">Priority</th>
                    <th rowSpan={2} className="w-20 px-4 py-4"></th>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 align-middle">
                    {criteria.likelihood.map((label) => (
                      <th key={`lh-${label}`} className="px-3 py-3 text-center align-middle font-black text-[11px] uppercase tracking-tight text-slate-600 leading-none whitespace-nowrap bg-blue-50/10 first:border-l first:border-slate-200/50">{label}</th>
                    ))}
                    <th className="px-3 py-3 text-center align-middle font-black text-[11px] uppercase tracking-tight text-blue-800 bg-blue-50/30">Total</th>
                    {criteria.impact.map((label) => (
                      <th key={`im-${label}`} className="px-3 py-3 text-center align-middle font-black text-[11px] uppercase tracking-tight text-slate-600 leading-none whitespace-nowrap bg-indigo-50/10 first:border-l first:border-slate-200/50">{label}</th>
                    ))}
                    <th className="px-3 py-3 text-center align-middle font-black text-[11px] uppercase tracking-tight text-indigo-800 bg-indigo-50/30">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {captureRows.map((row, idx) => {
                      const score = getScore(row);
                      const priority = getPriority(score);
                      return (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={row.localId} 
                          className="group border-b border-slate-50 align-middle hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-4 py-3 text-center align-middle">
                            <input type="checkbox" checked={row.selected || false} onChange={(e) => updateCaptureRow(row.localId, "selected", e.target.checked)} className="h-4 w-4 rounded-lg border-slate-200 text-slate-900 focus:ring-slate-900 transition-all cursor-pointer" />
                          </td>
                          <td className="px-5 py-4 min-w-[300px]">
                            <Input value={row.title} onChange={(e) => updateCaptureRow(row.localId, "title", e.target.value)} placeholder="리스크 아이템명" className="h-10 border-slate-100 hover:border-slate-300 focus:border-slate-900" />
                          </td>
                          <td className="px-5 py-4 min-w-[140px]">
                            <Input value={row.relatedArea} onChange={(e) => updateCaptureRow(row.localId, "relatedArea", e.target.value)} placeholder="Summary" className="h-10 border-slate-100 text-center" />
                          </td>
                          <td className="px-5 py-4 min-w-[130px]">
                            <Select value={row.riskType} onChange={(e) => updateCaptureRow(row.localId, "riskType", e.target.value)} options={["Product", "Project"]} className="h-10 border-slate-100" />
                          </td>

                          {criteria.likelihood.map((label) => (
                            <td key={`${row.localId}-lh-${label}`} className="px-3 py-4 min-w-[80px] text-center align-middle bg-blue-50/5">
                              <select
                                value={row.likelihoodDetails[label] ?? ""}
                                onChange={(e) => updateCaptureDetailScore(row.localId, "likelihood", label, e.target.value === "" ? null : Number(e.target.value))}
                                className="h-8 w-[64px] appearance-none rounded-lg border border-slate-200 bg-white text-center text-xs font-bold text-slate-800 outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                              >
                                <option value="">-</option>
                                {RISK_SCALE.map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            </td>
                          ))}
                          <td className="px-3 py-4 text-center align-middle font-black text-blue-700 bg-blue-50/20">{row.likelihood ?? '-'}</td>

                          {criteria.impact.map((label) => (
                            <td key={`${row.localId}-im-${label}`} className="px-3 py-4 min-w-[80px] text-center align-middle bg-indigo-50/5">
                              <select
                                value={row.impactDetails[label] ?? ""}
                                onChange={(e) => updateCaptureDetailScore(row.localId, "impact", label, e.target.value === "" ? null : Number(e.target.value))}
                                className="h-8 w-[64px] appearance-none rounded-lg border border-slate-200 bg-white text-center text-xs font-bold text-slate-800 outline-none hover:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                              >
                                <option value="">-</option>
                                {RISK_SCALE.map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            </td>
                          ))}
                          <td className="px-3 py-4 text-center align-middle font-black text-indigo-700 bg-indigo-50/20">{row.impact ?? '-'}</td>

                          <td className="px-3 py-4 text-center align-middle font-black text-slate-900 bg-slate-50 border-l border-slate-200/50">{score ?? '-'}</td>
                          <td className="px-5 py-4 whitespace-nowrap text-center align-middle">
                            {priority === "None" ? <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Wait</span> : <Badge priority={priority} />}
                          </td>
                          <td className="px-4 py-4 text-center align-middle flex items-center justify-center gap-1 h-[72px]">
                            <button 
                                onClick={() => openDetailedAnalysis(row)}
                                title="Detailed Analysis"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all duration-200"
                            >
                                <PanelRightOpen className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => {
                                    setCaptureRows(prev => prev.filter(r => r.localId !== row.localId));
                                }}
                                title="Delete Row"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                            >
                                <Trash2 className="w-4 h-4 cursor-pointer" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 우측 StatCard 영역 (모바일/태블릿에서는 상단 또는 하단에 적절히 유동적으로 배치) */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-2 gap-4">
            <StatCard label="Critical Risks" value={captureRows.filter(r => getPriority(getScore(r)) === "Critical").length} color="red" icon={Activity} />
            <StatCard label="High Risks" value={captureRows.filter(r => getPriority(getScore(r)) === "High").length} color="orange" icon={TrendingUp} />
          </div>
        </div>
      </div>

      {/* 하단 가이드 및 매트릭스 영역 (Grid 밖으로 분리하여 전체 너비 사용) */}
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 items-stretch pt-4">
        {/* Analysis Guide 패널 (50%) */}
        <div className="flex-1 min-h-[480px] rounded-[40px] border border-slate-200 bg-white p-8 lg:p-12 shadow-sm flex flex-col">
          <h3 className="flex items-center gap-3 text-base font-black text-slate-800 uppercase tracking-widest mb-6 lg:mb-10 border-b border-slate-100 pb-5">
            <HelpCircle className="w-5 h-5 text-slate-400" /> Analysis Strategy Guide
          </h3>
          
          <div className="flex-1 flex flex-col justify-between space-y-8">
            <div className="bg-slate-50 p-6 lg:p-8 rounded-[28px] border border-slate-100">
              <p className="text-[15px] lg:text-[16px] font-black text-slate-900 mb-2">리스크 점수 산정 알고리즘</p>
              <p className="text-[13px] lg:text-[14px] text-slate-500 leading-relaxed font-medium">
                본 시스템은 각 평가 항목의 입력값(0-9)을 가중 평균하여 Likelihood와 Impact를 도출합니다. 두 지표의 곱이 최종 위험 지수가 되며, 이는 매트릭스 차트에 실시간 매핑됩니다.
              </p>
            </div>

            <div className="space-y-5 lg:space-y-6">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Scoring Definitions</div>
              <div className="grid grid-cols-1 gap-3.5 lg:gap-5">
                {[
                  { val: 9, label: "Critical", desc: "장애 발생이 거의 확실하거나 시스템 전체 마비 초래" },
                  { val: 5, label: "High", desc: "핵심 기능 동작 불신 혹은 과거 유사 사례 빈번" },
                  { val: 3, label: "Moderate", desc: "영향이 특정 영역에 제한적이거나 평균적인 수준" },
                  { val: 1, label: "Low", desc: "단순 UI 오기입 혹은 발생 가능성이 극히 희박함" },
                  { val: 0, label: "None", desc: "추가 검증이 전혀 불필요하거나 분석 제외 항목" }
                ].map((row) => (
                  <div key={row.val} className="flex items-center gap-5 lg:gap-6">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[13px] lg:text-[14px] font-black text-slate-600 shrink-0">
                      {row.val}
                    </div>
                    <div className="flex items-baseline gap-4 lg:gap-6">
                      <span className="text-[11px] lg:text-[12px] font-black text-slate-700 uppercase tracking-tight w-16 lg:w-20">{row.label}</span>
                      <span className="text-[12px] lg:text-[13px] text-slate-500 font-semibold">{row.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <button 
                onClick={() => setView('guide')} 
                className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                View Framework Details <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mini Risk Matrix 패널 (50%) */}
        <div className="flex-1 min-h-[480px] rounded-[40px] border border-slate-200 bg-white p-8 lg:p-12 shadow-sm flex items-center justify-center">
          <MiniRiskMatrix items={captureRows} />
        </div>
      </div>

      <CriteriaSettingsSlideOver
        isOpen={isCriteriaSettingsOpen}
        onClose={() => setIsCriteriaSettingsOpen(false)}
        criteria={criteria}
        addCriterion={addCriterion}
        removeCriterion={removeCriterion}
        renameCriterion={renameCriterion}
      />
    </div>
  );
}
