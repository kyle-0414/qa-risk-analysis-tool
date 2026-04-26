import { useState, useMemo, useCallback } from "react";
import { INITIAL_ITEMS, EMPTY_FORM, EVIDENCE_OPTIONS } from "../constants/riskData";
import { getScore, getPriority, formatNow, makeCaptureRow } from "../utils/riskCalculations";

const INITIAL_CRITERIA = {
  likelihood: ["테스트 난이도", "상호관계", "복잡도"],
  impact: ["사용 빈도", "타 업무 영향도", "안전 규격 중요도"]
};

export function useRiskToolState() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [view, setView] = useState("identification");
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState(null);
  const [isSlideOverOpen, setSlideOverOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [filters, setFilters] = useState({
    riskType: "All",
    changeType: "All",
    priority: "All",
    status: "All",
    search: "",
  });

  const [captureRows, setCaptureRows] = useState([
    makeCaptureRow(INITIAL_CRITERIA),
    makeCaptureRow(INITIAL_CRITERIA),
  ]);

  const [captureContext, setCaptureContext] = useState({
    project: "",
    product: "",
    release: "",
    template: "",
  });

  const [criteria, setCriteria] = useState(INITIAL_CRITERIA);

  const addCriterion = useCallback((group, name) => {
    if (!name.trim()) return;
    setCriteria(prev => ({ ...prev, [group]: [...prev[group], name] }));
    setCaptureRows(prev => prev.map(row => ({
      ...row,
      [`${group}Details`]: { ...row[`${group}Details`], [name]: null },
    })));
  }, []);

  const removeCriterion = useCallback((group, name) => {
    setCriteria(prev => ({ ...prev, [group]: prev[group].filter(n => n !== name) }));
    setCaptureRows(prev => prev.map(row => {
      const key = `${group}Details`;
      const newDetails = { ...row[key] };
      delete newDetails[name];
      const values = Object.values(newDetails).filter(v => v !== null);
      const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
      return { ...row, [key]: newDetails, [group]: avg };
    }));
  }, []);

  const renameCriterion = useCallback((group, oldName, newName) => {
    if (!newName.trim() || newName === oldName) return;
    setCriteria(prev => ({ ...prev, [group]: prev[group].map(n => n === oldName ? newName : n) }));
    setCaptureRows(prev => prev.map(row => {
      const key = `${group}Details`;
      const newDetails = {};
      for (const k of Object.keys(row[key])) {
        newDetails[k === oldName ? newName : k] = row[key][k];
      }
      return { ...row, [key]: newDetails };
    }));
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }, []);

  const resetForm = useCallback((initialValues = EMPTY_FORM) => {
    setForm(initialValues);
    setSelectedId(null);
  }, []);

  const saveItem = useCallback((payload) => {
    const isUpdate = !!selectedId;
    const finalItem = { 
      ...payload, 
      id: isUpdate ? selectedId : Date.now(), 
      updatedAt: formatNow() 
    };

    if (isUpdate) {
      setItems((prev) => prev.map((item) => (item.id === selectedId ? finalItem : item)));
      showToast("Risk item updated.");
    } else {
      setItems((prev) => [finalItem, ...prev]);
      showToast("Risk item created.");
    }
    setView("review");
  }, [selectedId, showToast]);

  const deleteItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Risk item deleted.");
    setView("review");
  }, [showToast]);

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

  // --- Magic Demo Sequence (v3 - Workflow & Density Focus) ---
  const wait = (ms) => new Promise(res => setTimeout(res, ms));
  
  const typeText = async (setter, key, text, delay = 40) => {
    let current = "";
    for (const char of text) {
      current += char;
      setter(prev => ({ ...prev, [key]: current }));
      await wait(delay);
    }
  };

  const typeCaptureRow = async (rowIndex, key, text) => {
    let current = "";
    for (const char of text) {
      current += char;
      setCaptureRows(prev => prev.map((r, i) => i === rowIndex ? { ...r, [key]: current } : r));
      await wait(30);
    }
  };

  const runDemo = async () => {
    showToast("🎬 K-Enterprise Demo Workflow Started...");
    
    // Initial Reset
    setItems([]);
    setCriteria(INITIAL_CRITERIA);
    setCaptureRows([makeCaptureRow(INITIAL_CRITERIA), makeCaptureRow(INITIAL_CRITERIA)]);
    setCaptureContext({ project: "", product: "", release: "", template: "" });
    setView("identification");
    
    await wait(1800);

    // 1. Context Input (Typing)
    showToast("📂 프로젝트 글로벌 컨텍스트 설정 중...");
    await typeText(setCaptureContext, "project", "BCM Global Payment");
    await typeText(setCaptureContext, "release", "v2.5.0-RC1");
    await wait(300);
    setCaptureContext(prev => ({ ...prev, product: "Core Checkout", template: "Standard 3x3 Template" }));

    await wait(1500);

    // 2. Identify 6 Items with rhythmic flow
    showToast("📋 주요 리스크 식별 및 데이터 모델링...");
    
    // Item 1: Critical (Type title only)
    await typeCaptureRow(0, "title", "결제 확정 API 동시성 제어 실패");
    setCaptureRows(prev => prev.map((r, i) => i === 0 ? { ...r, relatedArea: "Backend/API", likelihood: 9, likelihoodDetails:{"테스트 난이도":9,"상호관계":9,"복잡도":9}, impact: 9, impactDetails:{"사용 빈도":9,"타 업무 영향도":9,"안전 규격 중요도":9} } : r));
    
    await wait(1000);
    // Item 2: High
    await typeCaptureRow(1, "title", "레거시 DB 마이그레이션 호환성");
    setCaptureRows(prev => prev.map((r, i) => i === 1 ? { ...r, relatedArea: "Infrastructure", likelihood: 5, impact: 9, likelihoodDetails:{"테스트 난이도":5,"상호관계":5,"복잡도":5}, impactDetails:{"사용 빈도":9,"타 업무 영향도":9,"안전 규격 중요도":9} } : r));

    await wait(1000);
    // Add Row for more
    setCaptureRows(prev => [...prev, makeCaptureRow(INITIAL_CRITERIA)]);
    await wait(300);
    // Item 3: Moderate
    setCaptureRows(prev => prev.map((r, i) => i === 2 ? { ...r, title: "세션 타임아웃 처리 로직 오류", relatedArea: "Authentication", likelihood: 5, impact: 5, likelihoodDetails:{"테스트 난이도":5,"상호관계":5,"복잡도":5}, impactDetails:{"사용 빈도":5,"타 업무 영향도":5,"안전 규격 중요도":5} } : r));

    await wait(500);
    // Item 4: High
    setCaptureRows(prev => [...prev, { ...makeCaptureRow(INITIAL_CRITERIA), title: "결제 취소 메시지 큐 지연 현상", relatedArea: "Messaging", likelihood: 3, impact: 9, likelihoodDetails:{"테스트 난이도":3,"상호관계":3,"복잡도":3}, impactDetails:{"사용 빈도":9,"타 업무 영향도":9,"안전 규격 중요도":9} }]);

    await wait(500);
    // Item 5: Low
    setCaptureRows(prev => [...prev, { ...makeCaptureRow(INITIAL_CRITERIA), title: "UI 다크모드 대응 텍스트 시인성", relatedArea: "Frontend UI", likelihood: 5, impact: 1, likelihoodDetails:{"테스트 난이도":5,"상호관계":5,"복잡도":5}, impactDetails:{"사용 빈도":1,"타 업무 영향도":1,"안전 규격 중요도":1} }]);

    await wait(500);
    // Item 6: Low
    setCaptureRows(prev => [...prev, { ...makeCaptureRow(INITIAL_CRITERIA), title: "메인 배너 리소스 로딩 지연 (LCP)", relatedArea: "Frontend UI", likelihood: 3, impact: 3, likelihoodDetails:{"테스트 난이도":3,"상호관계":3,"복잡도":3}, impactDetails:{"사용 빈도":3,"타 업무 영향도":3,"안전 규격 중요도":3} }]);

    // Show Mini Matrix
    await wait(1200);
    window.scrollTo({ top: 1200, behavior: "smooth" });
    showToast("📍 데이터 분포 Hotspot 실시간 모니터링...");
    await wait(2500);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 3. Deep Analysis with Korean content
    await wait(1000);
    showToast("🔍 고위험군 아이템 심층 분석 시작...");
    const criticalData = {
        title: "결제 확정 API 동시성 제어 실패",
        relatedArea: "Backend/API",
        riskType: "Product",
        changeType: "New",
        likelihood: 9,
        impact: 9,
        status: "Draft",
        updatedAt: formatNow(),
        project: "BCM Global Payment",
        product: "Core Checkout",
        release: "v2.5.0-RC1",
        description: "신규 비동기 처리 엔진 도입으로 인한 동시성 이슈 발생 가능성",
        concernScenario: "",
        likelihoodReason: "",
        impactReason: "전사적 재무 손실 및 사용자 신뢰도 급락 위험",
        evidenceFlags: ["Complex", "Legacy", "Concurrency"]
    };
    setForm(criticalData);
    setSlideOverOpen(true);
    
    await wait(1800);
    const panel = document.querySelector('.overflow-y-auto');
    if (panel) panel.scrollTo({ top: 450, behavior: 'smooth' });
    
    await wait(1200);
    await typeText(setForm, "concernScenario", "결제 확정 로직 내 동시성 제어 실패로 인한 중복 과금 발생 우려");
    await wait(600);
    await typeText(setForm, "likelihoodReason", "최근 수행한 부하 테스트 환경에서 간헐적 재현 확인됨");
    
    await wait(2500);
    // Save to Items
    const fullItems = [
        { ...criticalData, concernScenario: "결제 확정 로직 내 동시성 제어 실패로 인한 중복 과금 발생 우려", likelihoodReason: "최근 수행한 부하 테스트 환경에서 간헐적 재현 확인됨" },
        { title: "레거시 DB 마이그레이션 호환성", relatedArea: "Infrastructure", likelihood: 5, impact: 9, riskType:"Project", status:"Reviewing", updatedAt: formatNow() },
        { title: "세션 타임아웃 처리 로직 오류", relatedArea: "Authentication", likelihood: 5, impact: 5, riskType:"Product", status:"Draft", updatedAt: formatNow() },
        { title: "결제 취소 메시지 큐 지연 현상", relatedArea: "Messaging", likelihood: 3, impact: 9, riskType:"Product", status:"Draft", updatedAt: formatNow() },
        { title: "UI 다크모드 대응 텍스트 시인성", relatedArea: "Frontend UI", likelihood: 5, impact: 1, riskType:"Product", status:"Closed", updatedAt: formatNow() },
        { title: "메인 배너 리소스 로딩 지연 (LCP)", relatedArea: "Frontend UI", likelihood: 3, impact: 3, riskType:"Product", status:"Draft", updatedAt: formatNow() }
    ].map((it, idx) => ({ ...it, id: Date.now() + idx }));

    setItems(fullItems);
    setSlideOverOpen(false);
    showToast("💾 분석된 리스트 전송 완료.");

    // 4. Show Review Board View
    await wait(1800);
    setView("review");
    showToast("📋 Risk Board: 우선순위 대시보드 검토 중...");
    await wait(3500);

    // 5. Final Visual Matrix
    setView("matrix");
    showToast("📈 최종 리스크 분포 시각화 매핑...");
  };

  return {
    items, setItems, view, setView, form, setForm, selectedId, setSelectedId,
    toast, showToast, filters, setFilters, captureRows, setCaptureRows,
    captureContext, setCaptureContext, criteria, setCriteria,
    addCriterion, removeCriterion, renameCriterion,
    resetForm, saveItem, deleteItem,
    filteredItems, isSlideOverOpen, setSlideOverOpen, runDemo
  };
}
