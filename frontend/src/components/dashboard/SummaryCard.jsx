export default function SummaryCard({
  title,
  value,
}) {
  return (
    <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6">

      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-semibold mt-3">
        {value}
      </h2>

    </div>
  );
}