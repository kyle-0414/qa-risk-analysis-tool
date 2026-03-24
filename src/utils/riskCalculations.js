export function getScore(item) {
  const l = item.likelihood === null || item.likelihood === undefined ? null : Number(item.likelihood);
  const i = item.impact === null || item.impact === undefined ? null : Number(item.impact);
  if (l === null || i === null) return null;
  return l * i;
}

export function getPriority(score) {
  if (score === null || score === undefined) return "None";
  if (score >= 45) return "Critical";
  if (score >= 15) return "High";
  if (score >= 5) return "Moderate";
  if (score >= 1) return "Low";
  return "None";
}

export function getIntensity(score) {
  if (score >= 45) return "Focused validation + Regression + Log check";
  if (score >= 15) return "Core + exception scenarios + related area check";
  if (score >= 5) return "Main flow validation + sample side-effect check";
  if (score >= 1) return "Basic confirmation";
  return "No additional risk-driven action";
}

export function formatNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}`;
}

export function makeCaptureRow(criteria) {
  const likelihoodDetails = Object.fromEntries(criteria.likelihood.map((label) => [label, null]));
  const impactDetails = Object.fromEntries(criteria.impact.map((label) => [label, null]));
  return {
    localId: `cap-${Math.random().toString(36).slice(2, 9)}`,
    title: "",
    relatedArea: "",
    riskType: "Product",
    changeType: "New",
    likelihood: 0,
    impact: 0,
    likelihoodDetails,
    impactDetails,
    note: "",
    selected: false,
  };
}
