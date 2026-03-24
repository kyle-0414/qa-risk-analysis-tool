import { useState, useMemo, useCallback } from "react";
import { INITIAL_ITEMS, EMPTY_FORM } from "../constants/riskData";
import { getScore, getPriority, formatNow, makeCaptureRow } from "../utils/riskCalculations";

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
    makeCaptureRow({ likelihood: ["테스트 난이도", "상호관계", "복잡도"], impact: ["사용 빈도", "타 업무 영향도", "안전 규격 중요도"] }),
    makeCaptureRow({ likelihood: ["테스트 난이도", "상호관계", "복잡도"], impact: ["사용 빈도", "타 업무 영향도", "안전 규격 중요도"] }),
    makeCaptureRow({ likelihood: ["테스트 난이도", "상호관계", "복잡도"], impact: ["사용 빈도", "타 업무 영향도", "안전 규격 중요도"] }),
  ]);
  const [captureContext, setCaptureContext] = useState({
    project: "BCM",
    product: "Viewer",
    release: "1.3.0-qa.2",
    template: "BCM Default",
  });
  const [criteria] = useState({
    likelihood: ["테스트 난이도", "상호관계", "복잡도"],
    impact: ["사용 빈도", "타 업무 영향도", "안전 규격 중요도"],
  });

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

  return {
    items, setItems, view, setView, form, setForm, selectedId, setSelectedId,
    toast, showToast, filters, setFilters, captureRows, setCaptureRows,
    captureContext, setCaptureContext, criteria, resetForm, saveItem, deleteItem,
    filteredItems, isSlideOverOpen, setSlideOverOpen
  };
}
