import React, { useMemo } from 'react';

export function MiniRiskMatrix({ items = [] }) {
  // items 내부 likelihood/impact 값 변경을 감지하기 위한 키
  const itemsKey = items.map(item => `${item.likelihood ?? 'x'}_${item.impact ?? 'x'}`).join(',');

  const stats = useMemo(() => {
    const counts = { itaTech: 0, sta: 0, fta: 0, itaBiz: 0 };
    const points = { itaTech: [], sta: [], fta: [], itaBiz: [] };

    items.forEach((item) => {
      const l = Number(item.likelihood) || 0;
      const i = Number(item.impact) || 0;
      
      const isLHigh = l > 4.5;
      const isIHigh = i > 4.5;

      // 점수를 시각적 위치로 변환 (0~9 scale -> 15%~85% 범위로 제한하여 경계선에 너무 붙지 않게 함)
      const dot = { 
        x: (i / 9) * 70 + 15,
        y: 100 - ((l / 9) * 70 + 15) // Y축은 위가 높음
      };

      if (isLHigh && !isIHigh) {
        counts.itaTech++;
        points.itaTech.push(dot);
      } else if (isLHigh && isIHigh) {
        counts.sta++;
        points.sta.push(dot);
      } else if (!isLHigh && !isIHigh) {
        counts.fta++;
        points.fta.push(dot);
      } else {
        counts.itaBiz++;
        points.itaBiz.push(dot);
      }
    });

    return { counts, points };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, itemsKey]);

  const GridSection = ({ label, count, points, labelPos, className }) => (
    <div className={`relative flex-1 h-full p-3 overflow-hidden ${className}`}>
      {/* 분면 라벨 */}
      <span className={`absolute text-[11px] font-extrabold uppercase tracking-tight select-none ${labelPos} text-slate-400 z-10`}>
        {label}
      </span>
      
      {/* 중앙 큰 숫자 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span className="text-[40px] md:text-[48px] lg:text-[56px] font-black select-none leading-none text-slate-200/60 transition-all">
          {count}
        </span>
      </div>

      {/* 리스크 분포 점 (개선된 시각화) */}
      <div className="absolute inset-0 pointer-events-none">
        {points.map((p, idx) => {
          const isSTA = label === "STA";
          return (
            <div 
              key={idx}
              className={`absolute w-2 h-2 rounded-full transition-all duration-700 ease-out ${
                isSTA 
                  ? "bg-indigo-500 opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-[pulse_2s_infinite]" 
                  : "bg-slate-400 opacity-70"
              }`}
              style={{ 
                left: `${(p.x % 50) * 2}%`, 
                top: `${(p.y % 50) * 2}%`
              }}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full justify-center gap-2 lg:gap-4">
      {/* Matrix 본체 */}
      <div className="relative flex items-center gap-4 lg:gap-6 w-full justify-center">
        {/* Y축 (Likelihood) */}
        <div className="flex flex-col items-center self-start pt-14 lg:pt-20">
          <span className="text-[10px] lg:text-[11px] font-bold text-slate-500 uppercase tracking-widest -rotate-180 [writing-mode:vertical-lr]">
            Likelihood
          </span>
        </div>

        <div className="flex flex-col gap-3 lg:gap-4 flex-1 max-w-[340px] md:max-w-[380px] lg:max-w-[420px] transition-all">
          <div className="w-full flex justify-center mb-1 lg:mb-2">
            <h4 className="text-[13px] lg:text-[15px] font-black text-slate-800 uppercase tracking-[0.25em] leading-none">
              Risk Analysis Matrix
            </h4>
          </div>

          <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col">
            {/* 상단 행 */}
            <div className="flex-1 flex">
              <GridSection 
                label="ITA(Tech)" 
                count={stats.counts.itaTech} 
                points={stats.points.itaTech}
                labelPos="top-5 left-5" 
                className="border-r border-slate-200/70" 
              />
              <GridSection 
                label="STA" 
                count={stats.counts.sta} 
                points={stats.points.sta}
                labelPos="top-5 right-5" 
                className="" 
              />
            </div>
            {/* 중앙 가로 경계선 */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-px h-[1px] bg-slate-200/70" />
            {/* 하단 행 */}
            <div className="flex-1 flex">
              <GridSection 
                label="FTA" 
                count={stats.counts.fta} 
                points={stats.points.fta}
                labelPos="bottom-5 left-5" 
                className="border-r border-slate-200/70" 
              />
              <GridSection 
                label="ITA(Biz)" 
                count={stats.counts.itaBiz} 
                points={stats.points.itaBiz}
                labelPos="bottom-5 right-5" 
                className="" 
              />
            </div>
            {/* 중앙 세로 경계선 */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-px w-[1px] bg-slate-200/70" />
            {/* 중심 교차점 강조 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-200/80 z-20" />
          </div>

          {/* X축 (Impact) */}
          <div className="w-full flex justify-end pr-6 lg:pr-8">
            <span className="text-[10px] lg:text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em]">
              Impact
            </span>
          </div>

          {/* 하단 범례 - 매트릭스 영역 기준 중앙정렬 */}
          <div className="w-full flex justify-center pt-2 lg:pt-4">
            <div className="flex items-center justify-center gap-5 lg:gap-8 text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <span>· STA Severe</span>
              <span>· ITA Intensive</span>
              <span>· FTA Fundamental</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
