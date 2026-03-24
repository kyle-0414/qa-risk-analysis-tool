import React from "react";
import { Button, Input, Select } from "../../common/CommonUI";
import { Badge, StatCard, Field } from "../../common/DisplayUI";
import { getScore, getPriority } from "../../../utils/riskCalculations";
import { Filter, Search, RotateCcw, Plus, ArrowRight, Table } from "lucide-react";

export function RiskReview({ state }) {
  const { 
    items, filteredItems, filters, setFilters, setView, 
    setSelectedId, setForm 
  } = state;

  const summary = {
    total: items.length,
    critical: items.filter((i) => getPriority(getScore(i)) === "Critical").length,
    high: items.filter((i) => getPriority(getScore(i)) === "High").length,
    product: items.filter((i) => i.riskType === "Product").length,
    project: items.filter((i) => i.riskType === "Project").length,
  };

  const openEdit = (item) => {
    setSelectedId(item.id);
    setForm({ ...item });
    setView("detail");
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Risk Review Board</h1>
          <p className="text-sm text-slate-500 font-medium tracking-tight">캡처된 리스크 아이템의 우선순위 및 상태 검토</p>
        </div>
        <Button onClick={() => { 
            setSelectedId(null); 
            setForm({ ...state.emptyForm }); 
            setView("detail"); 
        }} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-2" /> New Detail Item
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total Risks" value={summary.total} color="slate" />
        <StatCard label="Critical" value={summary.critical} color="red" />
        <StatCard label="High" value={summary.high} color="orange" />
        <StatCard label="Product Risks" value={summary.product} color="blue" />
        <StatCard label="Project Risks" value={summary.project} color="amber" />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex-1 grid grid-cols-4 gap-4">
            <Field label="Risk Type">
              <Select value={filters.riskType} onChange={(e) => setFilters(f => ({...f, riskType: e.target.value}))} options={["All", "Product", "Project"]} />
            </Field>
            <Field label="Priority">
              <Select value={filters.priority} onChange={(e) => setFilters(f => ({...f, priority: e.target.value}))} options={["All", "Critical", "High", "Moderate", "Low", "None"]} />
            </Field>
            <Field label="Status">
              <Select value={filters.status} onChange={(e) => setFilters(f => ({...f, status: e.target.value}))} options={["All", "Draft", "Reviewing", "Confirmed", "Closed"]} />
            </Field>
            <Field label="Search Keywords">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={filters.search} onChange={(e) => setFilters(f => ({...f, search: e.target.value}))} placeholder="아이템 검색..." className="pl-10" />
              </div>
            </Field>
          </div>
          <div className="pt-6">
            <Button variant="secondary" size="md" onClick={() => setFilters({ riskType: "All", changeType: "All", priority: "All", status: "All", search: "" })}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-400">
            <tr>
              {["Risk Item Name", "Area", "Likelihood", "Impact", "Score", "Priority", "Status", ""].map((header) => (
                <th key={header} className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-slate-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const score = getScore(item);
              const priority = getPriority(score);
              return (
                <tr
                  key={item.id}
                  onClick={() => openEdit(item)}
                  className="cursor-pointer group hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tight">{item.riskType} Risk • {item.changeType}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-200">{item.relatedArea}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-600">{item.likelihood}</td>
                  <td className="px-6 py-5 font-bold text-slate-600">{item.impact}</td>
                  <td className="px-6 py-5 font-black text-slate-900">{score}</td>
                  <td className="px-6 py-5"><Badge priority={priority} /></td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                       {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td className="px-6 py-12 text-center" colSpan={8}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Table className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching risk items found.</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
