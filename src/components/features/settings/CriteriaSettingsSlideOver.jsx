import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, GripVertical } from "lucide-react";
import { Button, Input } from "../../common/CommonUI";
import { Field } from "../../common/DisplayUI";

export function CriteriaSettingsSlideOver({ isOpen, onClose, criteria, addCriterion, removeCriterion, renameCriterion }) {
  const [newLikelihood, setNewLikelihood] = useState("");
  const [newImpact, setNewImpact] = useState("");

  if (!isOpen) return null;

  const handleAdd = (group, value, setter) => {
    const name = value.trim();
    if (!name) return;
    addCriterion(group, name);
    setter("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
          className="relative z-10 w-[480px] h-full bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Criteria Settings</h2>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">평가 항목 커스터마이징</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <CriteriaSection
              title="Likelihood 평가 항목"
              subtitle="장애 발생 가능성 (Likelihood)"
              color="blue"
              items={criteria.likelihood}
              newValue={newLikelihood}
              setNewValue={setNewLikelihood}
              onAdd={() => handleAdd("likelihood", newLikelihood, setNewLikelihood)}
              onRemove={(name) => removeCriterion("likelihood", name)}
              onRename={(oldName, newName) => renameCriterion("likelihood", oldName, newName)}
            />
            <CriteriaSection
              title="Impact 평가 항목"
              subtitle="장애 발생 시 영향도 (Impact)"
              color="indigo"
              items={criteria.impact}
              newValue={newImpact}
              setNewValue={setNewImpact}
              onAdd={() => handleAdd("impact", newImpact, setNewImpact)}
              onRemove={(name) => removeCriterion("impact", name)}
              onRename={(oldName, newName) => renameCriterion("impact", oldName, newName)}
            />

            <div className="rounded-2xl bg-slate-100 border border-slate-200 p-5 text-[12px] text-slate-500 font-medium leading-relaxed">
              항목을 추가하면 기존 행에 해당 항목이 미입력 상태로 추가됩니다.<br />
              삭제 시 해당 항목의 점수가 제외되고 평균이 재계산됩니다.<br />
              항목명을 클릭하면 이름을 수정할 수 있습니다.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function CriteriaSection({ title, subtitle, color, items, newValue, setNewValue, onAdd, onRemove, onRename }) {
  const borderColor = color === "blue" ? "border-blue-100 bg-blue-50/20" : "border-indigo-100 bg-indigo-50/20";
  const itemColor = color === "blue"
    ? "border-blue-100 bg-blue-50/30 text-blue-700"
    : "border-indigo-100 bg-indigo-50/30 text-indigo-700";
  const focusRing = color === "blue" ? "hover:border-blue-400 focus:ring-blue-100" : "hover:border-indigo-400 focus:ring-indigo-100";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-black text-slate-800 tracking-tight">{title}</h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
      </div>

      <div className="space-y-2">
        {items.map((name, idx) => (
          <CriteriaItem
            key={`${name}-${idx}`}
            name={name}
            canDelete={items.length > 1}
            onDelete={() => onRemove(name)}
            onRename={(newName) => onRename(name, newName)}
            itemColor={itemColor}
          />
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder="새 항목명 입력 후 Enter..."
          className={`h-9 text-sm ${focusRing}`}
        />
        <Button variant="secondary" size="sm" onClick={onAdd} className="shrink-0 px-4">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function CriteriaItem({ name, canDelete, onDelete, onRename, itemColor }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  const handleBlur = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    } else {
      setValue(name);
    }
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border group ${itemColor}`}>
      <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") { setValue(name); setEditing(false); }
          }}
          className="flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none border-b border-slate-400"
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className="flex-1 text-sm font-bold text-slate-800 cursor-text hover:opacity-70 transition-opacity"
        >
          {name}
        </span>
      )}
      {canDelete && (
        <button
          onClick={onDelete}
          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
