import React from 'react';
import { cn } from './CommonUI';
import { PRIORITY_META } from '../../constants/riskData';
import { motion } from 'framer-motion';

export function Badge({ priority, children, className }) {
  const styles = PRIORITY_META[priority] || PRIORITY_META.None;
  return (
    <span className={cn(
      "rounded-full border px-2.5 py-0.5 text-xs font-semibold ring-1",
      styles,
      className
    )}>
      {children || priority}
    </span>
  );
}

export function StatCard({ label, value, icon: Icon, color = "slate" }) {
  const colorMaps = {
    slate: "text-slate-600 border-slate-100",
    red: "text-red-500 border-red-100",
    orange: "text-orange-500 border-orange-100",
    amber: "text-amber-500 border-amber-100",
    blue: "text-blue-500 border-blue-100",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
          {label}
        </span>
        {Icon && <Icon className={cn("w-4 h-4", colorMaps[color].split(' ')[0])} />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>
    </motion.div>
  );
}

export function Field({ label, children, required = false, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="flex items-center text-[13px] font-semibold text-slate-600/90 ml-1">
        {label} 
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
