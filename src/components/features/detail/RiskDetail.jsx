import React from "react";
import { Button, Input, Select, TextArea } from "../../common/CommonUI";
import { Badge, StatCard, Field } from "../../common/DisplayUI";
import { getScore, getPriority, getIntensity } from "../../../utils/riskCalculations";
import { EVIDENCE_OPTIONS } from "../../../constants/riskData";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import { RiskDetailForm } from "./RiskDetailForm";

export function RiskDetail({ state }) {
  const { 
    form, setForm, saveItem, deleteItem, setView, showToast, selectedId 
  } = state;

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

  const validateAndSave = () => {
    if (!form.title.trim()) {
        showToast("Risk Item Name is required.");
        return;
    }
    saveItem(form);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="md" onClick={() => setView('review')} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Risk Detailed Analysis</h1>
            <p className="text-sm text-slate-500 font-medium tracking-tight">고위험 항목에 대한 심층 분석 및 대응 전략 수립</p>
          </div>
        </div>
        <div className="flex gap-3">
          {selectedId && (
            <Button variant="danger" size="md" onClick={() => deleteItem(selectedId)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
          <Button variant="primary" size="md" onClick={validateAndSave}>
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      <RiskDetailForm form={form} setForm={setForm} />
    </div>
  );
}
