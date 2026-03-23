'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ReferralLinkProps {
  referralCode: string
}

export default function ReferralLinkWidget({ referralCode }: ReferralLinkProps) {
  const [copied, setCopied] = useState(false)
  const [referralUrl, setReferralUrl] = useState(`https://pakargaming.com/en?ref=${referralCode}`)

  useEffect(() => {
    setReferralUrl(`${window.location.origin}/en?ref=${referralCode}`)
  }, [referralCode])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    toast.success('Link referral disalin!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator
        .share({
          title: 'Pakar Gaming - Referral',
          text: `Top up game murah & cepat di Pakar Gaming! Pakai kode referralku: ${referralCode}`,
          url: referralUrl,
        })
        .catch(() => {})
    } else {
      handleCopy()
    }
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl border border-purple-200/50 dark:border-purple-500/20 shadow-xl overflow-hidden">
      {/* Purple accent bar */}
      <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />

      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Link Referral Kamu</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Bagikan link ini ke teman dan dapatkan bonus saat mereka bertransaksi!
          </p>
        </div>

        {/* Referral code badge */}
        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg font-mono font-bold text-sm tracking-widest">
          🎮 {referralCode}
        </div>

        {/* URL row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 font-mono truncate">
            {referralUrl}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Disalin!' : 'Salin'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition-all duration-200 shrink-0 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            Bagikan
          </button>
        </div>
      </div>
    </div>
  )
}
