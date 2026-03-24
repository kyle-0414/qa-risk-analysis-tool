import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2, ArrowRight } from "lucide-react";
import { Button } from "../../common/CommonUI";
import { RiskDetailForm } from "./RiskDetailForm";

export function RiskDetailSlideOver({ state }) {
  const { 
    isSlideOverOpen, setSlideOverOpen, form, setForm, 
    saveItem, deleteItem, showToast, selectedId, setView
  } = state;

  if (!isSlideOverOpen) return null;

  const validateAndSave = () => {
    if (!form.title.trim()) {
        showToast("Risk Item Name is required.");
        return;
    }
    saveItem(form);
    setSlideOverOpen(false);
  };

  const handleDelete = () => {
    if (selectedId) {
        deleteItem(selectedId);
        setSlideOverOpen(false);
    }
  };

  const navigateToFullDetail = () => {
    setSlideOverOpen(false);
    setView('detail');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
          onClick={() => setSlideOverOpen(false)}
        />
        
        {/* Slide-over Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
          className="relative z-10 w-[95%] max-w-5xl h-full bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSlideOverOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
               >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Risk Detail</h2>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{selectedId ? 'Edit Mode' : 'New Item'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="md" onClick={navigateToFullDetail} className="hidden sm:flex">
                Open Full Page <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
              {selectedId && (
                <Button variant="danger" size="md" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              )}
              <Button variant="primary" size="md" onClick={validateAndSave}>
                <Save className="w-4 h-4 mr-2" /> Save & Close
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            <RiskDetailForm form={form} setForm={setForm} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
