const statusStyles = {
  Pending:   "bg-amber-500/10 text-amber-300 border border-amber-500/25",
  Confirmed: "bg-teal-500/10 text-teal-300 border border-teal-500/25",
  Completed: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25",
  Cancelled: "bg-rose-500/10 text-rose-300 border border-rose-500/25",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
        statusStyles[status] ?? "bg-slate-800 text-slate-400 border border-slate-700"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === "Pending" ? "bg-amber-400 animate-pulse" :
        status === "Confirmed" ? "bg-teal-400" :
        status === "Completed" ? "bg-emerald-400" :
        status === "Cancelled" ? "bg-rose-400" : "bg-slate-400"
      }`} />
      {status}
    </span>
  );
};

export default StatusBadge;
