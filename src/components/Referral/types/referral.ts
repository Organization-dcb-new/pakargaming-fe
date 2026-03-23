export type ReferralStatus = 'active' | 'pending' | 'inactive'

export interface ReferralUser {
  id: string
  username: string
  email: string
  joinedAt: string
  totalTransactions: number
  totalSpent: number
  bonusEarned: number
  status: ReferralStatus
}

export interface ReferralStats {
  totalReferrals: number
  earnedBonus: number
  pendingBonus: number
  successfulReferrals: number
  referralCode: string
}
