export default function MyTransaction() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        My <span className="text-purple-400">Transaction</span>
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            <tr className="hover:bg-slate-800/60 transition">
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                TRX-102391
              </td>
              <td className="px-4 py-3">2025-01-12</td>
              <td className="px-4 py-3 font-semibold">
                Rp 150.000
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  Success
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="text-purple-400 hover:text-purple-300 transition">
                  View
                </button>
              </td>
            </tr>

            <tr className="hover:bg-slate-800/60 transition">
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                TRX-102392
              </td>
              <td className="px-4 py-3">2025-01-10</td>
              <td className="px-4 py-3 font-semibold">
                Rp 300.000
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="text-purple-400 hover:text-purple-300 transition">
                  View
                </button>
              </td>
            </tr>

            <tr className="hover:bg-slate-800/60 transition">
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                TRX-102393
              </td>
              <td className="px-4 py-3">2025-01-05</td>
              <td className="px-4 py-3 font-semibold">
                Rp 75.000
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                  Failed
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="text-purple-400 hover:text-purple-300 transition">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
