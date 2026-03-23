'use client'

import { Users, Gift, Clock, CheckCircle } from 'lucide-react'
import { ReferralStats } from '../types/referral'

interface StatsProps {
  stats: ReferralStats
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    indigo: 'from-indigo-500/80 to-indigo-600/80',
    emerald: 'from-emerald-500/80 to-emerald-600/80',
    amber: 'from-amber-400/80 to-amber-500/80',
    violet: 'from-violet-500/80 to-violet-600/80',
  }
  return (
    <div
      className={`relative p-4 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-sm hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex justify-between items-start">
        <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{title}</p>
        <div className="p-1.5 bg-white/10 dark:bg-white/20 rounded-lg backdrop-blur-sm">
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold mt-3">{value}</p>
      <div className="absolute -right-3 -bottom-3 w-14 h-14 bg-white/10 rounded-full blur-2xl" />
    </div>
  )
}

export default function ReferralStatsCards({ stats }: StatsProps) {
  const formatIDR = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Referrals"
        value={stats.totalReferrals}
        icon={Users}
        color="indigo"
      />
      <StatCard
        title="Bonus Diterima"
        value={formatIDR(stats.earnedBonus)}
        icon={Gift}
        color="emerald"
      />
      <StatCard
        title="Bonus Menunggu"
        value={formatIDR(stats.pendingBonus)}
        icon={Clock}
        color="amber"
      />
      <StatCard
        title="Referral Sukses"
        value={stats.successfulReferrals}
        icon={CheckCircle}
        color="violet"
      />
    </div>
  )
}
