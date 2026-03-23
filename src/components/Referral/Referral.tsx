'use client'

import ReferralClientLayout from '../ReferralClientLayout'
import ReferralStatsCards from './components/Stats'
import ReferralLinkWidget from './components/ReferralLink'
import ReferralTable from './components/ReferralTable'
import { dummyReferralStats, dummyReferralUsers } from './data/dummyReferral'

export default function ReferralDashboard() {
  return (
    <ReferralClientLayout>
      <div className="p-4 lg:p-6 space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Program Referral</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ajak teman bermain dan dapatkan bonus setiap kali mereka bertransaksi.
          </p>
        </div>

        {/* Stats */}
        <ReferralStatsCards stats={dummyReferralStats} />

        {/* Referral Link */}
        <ReferralLinkWidget referralCode={dummyReferralStats.referralCode} />

        {/* Table */}
        <ReferralTable users={dummyReferralUsers} />
      </div>
    </ReferralClientLayout>
  )
}
