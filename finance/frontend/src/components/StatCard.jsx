export default function StatCard({ title, amount, colorClass = "text-white" }) {
  return (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${colorClass}`}>
        ${amount.toLocaleString()}
      </h2>
    </div>
  );
}