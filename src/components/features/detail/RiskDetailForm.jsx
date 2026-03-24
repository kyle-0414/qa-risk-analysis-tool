import React from "react";
import { Button, Input, Select, TextArea } from "../../common/CommonUI";
import { Badge, StatCard, Field } from "../../common/DisplayUI";
import { getScore, getPriority, getIntensity } from "../../../utils/riskCalculations";
import { EVIDENCE_OPTIONS } from "../../../constants/riskData";
import { Info, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export function RiskDetailForm({ form, setForm }) {
  const score = getScore(form);
  const priority = getPriority(score);
  const intensity = getIntensity(score);

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const toggleEvidence = (flag) => {
    updateForm("evidenceFlags", form.evidenceFlags.includes(flag)
      ? form.evidenceFlags.filter(f => f !== flag)
      : [...form.evidenceFlags, flag]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8">
      <div className="space-y-10">
        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
             <Info className="w-5 h-5 text-blue-500" />
             <h3 className="text-lg font-black text-slate-800 tracking-tight">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Field label="Risk Item Name" required><Input value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="리스크 아이템명" /></Field>
              <Field label="Related Module / Area" required><Input value={form.relatedArea} onChange={(e) => updateForm("relatedArea", e.target.value)} placeholder="Summary" /></Field>
              <div className="grid grid-cols-2 gap-4">
                  <Field label="Risk Type">
                      <Select value={form.riskType} onChange={(e) => updateForm("riskType", e.target.value)} options={["Product", "Project"]} />
                  </Field>
                  <Field label="Change Type">
                      <Select value={form.changeType} onChange={(e) => updateForm("changeType", e.target.value)} options={["New", "Modify", "Maintenance", "Hotfix"]} />
                  </Field>
              </div>
            </div>
            <div>
              <Field label="Risk Description / Summary" className="h-full">
                  <TextArea value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="리스크의 구체적인 배경 및 개요 입력" className="h-[188px] resize-none" />
              </Field>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
             <AlertTriangle className="w-5 h-5 text-orange-500" />
             <h3 className="text-lg font-black text-slate-800 tracking-tight">Impact & Likelihood Analysis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Field label="Change Summary (What changed?)"><TextArea value={form.changeSummary} onChange={(e) => updateForm("changeSummary", e.target.value)} placeholder="코드 변경 내용 요약..." className="h-32" /></Field>
              <Field label="Concern Scenario (What could fail?)"><TextArea value={form.concernScenario} onChange={(e) => updateForm("concernScenario", e.target.value)} placeholder="발생 가능한 장애 시나리오..." className="h-32" /></Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Field label="Likelihood Logic (발생 가능성 근거)">
                  <TextArea value={form.likelihoodReason} onChange={(e) => updateForm("likelihoodReason", e.target.value)} className="h-24" />
                </Field>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest min-w-[100px]">Likelihood Score:</div>
                  <div className="flex gap-1.5 flex-wrap">
                      {[0,1,3,5,9].map(n => (
                          <button key={n} onClick={() => updateForm('likelihood', n)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border transition-all ${form.likelihood === n ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}>{n}</button>
                      ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Field label="Impact Logic (장애 영향도 근거)">
                  <TextArea value={form.impactReason} onChange={(e) => updateForm("impactReason", e.target.value)} className="h-24" />
                </Field>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest min-w-[100px]">Impact Score:</div>
                  <div className="flex gap-1.5 flex-wrap">
                      {[0,1,3,5,9].map(n => (
                          <button key={n} onClick={() => updateForm('impact', n)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border transition-all ${form.impact === n ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-300'}`}>{n}</button>
                      ))}
                  </div>
                </div>
              </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
             <CheckCircle2 className="w-5 h-5 text-green-500" />
             <h3 className="text-lg font-black text-slate-800 tracking-tight">QA Strategy & Response</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                  <Field label="Evidence / Red-flags">
                      <div className="flex flex-wrap gap-2">
                          {EVIDENCE_OPTIONS.map(opt => (
                              <button key={opt} onClick={() => toggleEvidence(opt)} className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all ${form.evidenceFlags.includes(opt) ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'}`}>{opt}</button>
                          ))}
                      </div>
                  </Field>
                  <Field label="Focus Check Points"><TextArea value={form.focusPoints} onChange={(e) => updateForm("focusPoints", e.target.value)} placeholder="가장 집중해서 확인해야 할 포인트..." className="h-24" /></Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Status">
                      <Select value={form.status} onChange={(e) => updateForm("status", e.target.value)} options={["Draft", "Reviewing", "Confirmed", "Closed"]} />
                  </Field>
                  <Field label="Update Time">
                      <Input value={form.updatedAt || '-'} disabled className="bg-slate-50 border-slate-50 font-mono text-[11px]" />
                  </Field>
                  <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2">
                           <input type="checkbox" checked={form.regressionRequired} onChange={(e) => updateForm("regressionRequired", e.target.checked)} id="reg" className="w-4 h-4 rounded border-slate-300" />
                           <label htmlFor="reg" className="text-xs font-bold text-slate-700">Regression Test</label>
                      </div>
                      <div className="flex items-center gap-2">
                           <input type="checkbox" checked={form.logCheckRequired} onChange={(e) => updateForm("logCheckRequired", e.target.checked)} id="log" className="w-4 h-4 rounded border-slate-300" />
                           <label htmlFor="log" className="text-xs font-bold text-slate-700">Log Check</label>
                      </div>
                      <div className="flex items-center gap-2">
                           <input type="checkbox" checked={form.extraReviewRequired} onChange={(e) => updateForm("extraReviewRequired", e.target.checked)} id="ext" className="w-4 h-4 rounded border-slate-300" />
                           <label htmlFor="ext" className="text-xs font-bold text-slate-700">Code Review Audit</label>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-8 shadow-sm">
          <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Risk Assessment</h3>
          <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                  <span className="text-sm font-bold text-slate-500">Total Score</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{score ?? '0'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                  <span className="text-sm font-bold text-slate-500">Priority Level</span>
                  <Badge priority={priority} className="text-sm px-4 py-1" />
              </div>
              <div className="space-y-3">
                  <span className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest">
                      <Activity className="w-3 h-3" /> Recommended Action
                  </span>
                  <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed text-center italic">
                         " {intensity} "
                      </p>
                  </div>
              </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
           <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Quick Tip</h4>
           <p className="text-xs font-medium text-slate-400 leading-relaxed">
             전체적인 리크스 스코어는 <span className="text-white">"발생 확률 × 피해 영향도"</span>로 계산됩니다. 45점 이상은 반드시 <span className="text-red-400 underline">Critical Regression</span> 대상으로 지정하세요.
           </p>
        </div>
      </div>
    </div>
  );
}
