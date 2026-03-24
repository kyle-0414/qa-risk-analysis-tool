import React from "react";
import { Badge } from "../../common/DisplayUI";
import { Info, HelpCircle, AlertCircle, CheckCircle2, ShieldCheck, Activity, BookOpen } from "lucide-react";

export function RiskGuide() {
  return (
    <div className="max-w-4xl space-y-12 pb-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Guide & Methodology</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">QA 리스크 분석 방법론 및 기준 정의</p>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
           <ShieldCheck className="w-5 h-5 text-blue-500" />
           <h3 className="text-xl font-black text-slate-800 tracking-tight">Risk Analysis Principles</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-blue-400">
                <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-4">Core Definition</h4>
                <p className="text-sm font-bold text-slate-900 mb-2">리스크 아이템 도출</p>
                <div className="text-xs text-slate-500 leading-relaxed font-medium">
                    사용자 가치 또는 비즈니스 연속성에 부정적인 영향을 줄 가능성이 있는 모든 변경점 및 환경 요소를 포함합니다.
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-blue-400">
                <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-4">Quantification</h4>
                <p className="text-sm font-bold text-slate-900 mb-2">정량적 평가 기준</p>
                <div className="text-xs text-slate-500 leading-relaxed font-medium">
                    Likelihood(발생 가능성)와 Impact(영향도)의 곱을 통해 리스크를 객관화하고 테스트 강도를 결정합니다.
                </div>
            </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
           <Activity className="w-5 h-5 text-orange-500" />
           <h3 className="text-xl font-black text-slate-800 tracking-tight">Likelihood / Impact Scale</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-8 py-4">Score</th>
                        <th className="px-8 py-4">Level</th>
                        <th className="px-8 py-4">Criteria Guideline</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { s: 9, l: 'Critical', d: '장애 발생이 거의 확실하거나, 전체 시스템 마비를 초래할 수 있는 심각한 수준' },
                        { s: 5, l: 'High', d: '과거 유사 사례 빈번, 복잡도 높음, 혹은 핵심 기능 동작 불신 수준' },
                        { s: 3, l: 'Moderate', d: '발생 가능성 평균 수준, 혹은 특정 영역의 영향이 제한적인 수준' },
                        { s: 1, l: 'Low', d: '단순 UI 오기입, 혹은 발생 가능성이 극히 희박한 예외 케이스' },
                        { s: 0, l: 'None', d: '리스크 분석에서 제외하거나 추가 검증이 전혀 불필요한 수준' },
                    ].map(row => (
                        <tr key={row.s} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                                <span className={`w-10 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${row.s >= 5 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{row.s}</span>
                            </td>
                            <td className="px-8 py-6 font-bold text-slate-800 text-sm">{row.l}</td>
                            <td className="px-8 py-6 text-xs text-slate-500 font-medium leading-relaxed">{row.d}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Priority Threshold</h3>
            </div>
            <div className="space-y-3">
                {[
                    { p: 'Critical', s: '45 ~ 81 pt', c: 'bg-red-50 text-red-700 border-red-200' },
                    { p: 'High', s: '15 ~ 44 pt', c: 'bg-orange-50 text-orange-700 border-orange-200' },
                    { p: 'Moderate', s: '5 ~ 14 pt', c: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { p: 'Low', s: '1 ~ 4 pt', c: 'bg-sky-50 text-sky-700 border-sky-200' },
                    { p: 'None', s: '0 pt', c: 'bg-slate-100 text-slate-500 border-slate-200' },
                ].map(p => (
                    <div key={p.p} className={`flex items-center justify-between p-4 rounded-2xl border ${p.c} transition-all hover:scale-[1.02] cursor-default`}>
                        <span className="text-sm font-black uppercase tracking-tight">{p.p}</span>
                        <span className="text-xs font-bold font-mono">{p.s}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Action Intensity</h3>
            </div>
            <div className="space-y-4">
                <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Category A (Critical/High)</div>
                    <ul className="text-xs font-medium text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">• <span className="text-slate-900 font-bold">집중 검증:</span> 핵심 시나리오 + 예외 케이스</li>
                        <li className="flex items-start gap-2">• <span className="text-slate-900 font-bold">회부 확인:</span> 유관 팀 전파 및 공동 리뷰</li>
                        <li className="flex items-start gap-2">• <span className="text-slate-900 font-bold">리그레션:</span> 연관 컴포넌트 전체 영향도 파악</li>
                        <li className="flex items-start gap-2">• <span className="text-slate-900 font-bold">로그 분석:</span> 실시간 덤프 및 이상 징후 추적</li>
                    </ul>
                </div>
                <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category B (Moderate/Low)</div>
                    <ul className="text-xs font-medium text-slate-500 space-y-2">
                        <li className="flex items-start gap-2">• <span className="text-slate-800 font-bold">기본 검증:</span> 주요 해피 패스 중심 확인</li>
                        <li className="flex items-start gap-2">• <span className="text-slate-800 font-bold">샘플링:</span> 대표 케이스에 대한 사이드 이펙트 샘플 체크</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
