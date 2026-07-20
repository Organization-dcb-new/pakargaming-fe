'use client'
import { Mail, Smartphone, Ticket } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCheckReferralCode } from '../hooks/useCheckReferralCode'

interface ContactFormProps {
  step?: number
  setSelectedEmail: React.Dispatch<React.SetStateAction<string | null>>
  email: string
  requiresPhone?: boolean
  userMdn: string
  setUserMdn: (value: string) => void
  referralCode: string
  setReferralCode: (value: string) => void
  isLocked?: boolean
  onLockedAction?: () => void
}

export default function ContactForm({
  step,
  setSelectedEmail,
  email,
  requiresPhone = false,
  userMdn,
  setUserMdn,
  referralCode,
  setReferralCode,
  isLocked = false,
  onLockedAction,
}: ContactFormProps) {
  const t = useTranslations('GameCheckout')
  const checkMutation = useCheckReferralCode()
  const [validationMsg, setValidationMsg] = useState<{ text: string; isError: boolean } | null>(null)

  const handleCheckCode = () => {
    if (!referralCode.trim()) {
      setValidationMsg({ text: 'Kode referral tidak boleh kosong', isError: true })
      return
    }
    checkMutation.mutate(referralCode.trim(), {
      onSuccess: (res) => {
        if (res.data && res.data.is_active) {
          setValidationMsg({
            text: `Kode referral valid!`,
            isError: false
          })
        } else {
          setValidationMsg({
            text: 'Kode referral tidak aktif.',
            isError: true
          })
        }
      },
      onError: () => {
        setValidationMsg({
          text: 'Kode referral tidak ditemukan.',
          isError: true
        })
      }
    })
  }

  return (
    <div id="contact-section" className="relative w-full sm:w-150 ">
      {/* Step Badge */}
      <div
        className="
      absolute -top-2 -left-2
      sm:-top-3 sm:-left-3
      w-7 h-7 sm:w-8 sm:h-8
      rounded-full
      flex items-center justify-center
      text-[11px] sm:text-xs font-bold
      bg-gradient-to-br from-purple-500 to-pink-500
      text-white
      shadow-md
      border-2 border-white dark:border-zinc-900
      z-10
    "
      >
        {step}
      </div>

      <div className="bg-black/5 dark:bg-white/10  rounded-3xl p-4 sm:p-6 border border-purple-500/30 hover:border-purple-500 transition-all duration-300 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            {t('contactEmailTitle')} <span className="text-red-500">*</span>
          </h2>
          <Mail className="w-4 h-4 text-purple-400 dark:text-purple-300" />
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
          {t('contactEmailHint')}
        </p>
        {/* Input */}
        <input
          type="email"
          value={email ?? ''}
          required
          onChange={(e) => setSelectedEmail(e.target.value)}
          readOnly={isLocked}
          onFocus={() => {
            if (isLocked) onLockedAction?.()
          }}
          placeholder={t('placeholderEmail')}
          className="
    w-full px-4 py-3 rounded-2xl
    bg-white/80 dark:bg-white/20
    border border-purple-500/50 dark:border-purple-300
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-purple-300
    focus:outline-none
    focus:border-purple-500
    focus:ring-2 focus:ring-purple-500/20
    focus:bg-white dark:focus:bg-white/30
    transition-all duration-200
    text-sm
  "
        />

        {requiresPhone && (
          <>
            <div className="flex items-center gap-2 mb-2 mt-5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {t('contactPhoneTitle')} <span className="text-red-500">*</span>
              </h2>
              <Smartphone className="w-4 h-4 text-purple-400 dark:text-purple-300" />
            </div>
            <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
              {t('contactPhoneHint')}
            </p>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={userMdn}
              onChange={(e) => setUserMdn(e.target.value)}
              readOnly={isLocked}
              onFocus={() => {
                if (isLocked) onLockedAction?.()
              }}
              placeholder={t('placeholderPhone')}
              className="
    w-full px-4 py-3 rounded-2xl
    bg-white/80 dark:bg-white/20
    border border-purple-500/50 dark:border-purple-300
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-purple-300
    focus:outline-none
    focus:border-purple-500
    focus:ring-2 focus:ring-purple-500/20
    focus:bg-white dark:focus:bg-white/30
    transition-all duration-200
    text-sm
  "
            />
          </>
        )}

        <div className="flex items-center gap-2 mb-2 mt-5">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Kode Referral (Opsional)
          </h2>
          <Ticket className="w-4 h-4 text-purple-400 dark:text-purple-300" />
        </div>
        <p className="text-gray-600 dark:text-purple-200 mb-4 text-xs leading-snug">
          Masukkan kode referral Anda jika ada untuk mendapatkan diskon tambahan.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralCode}
            onChange={(e) => {
              setReferralCode(e.target.value)
              if (validationMsg) setValidationMsg(null)
            }}
            readOnly={isLocked}
            onFocus={() => {
              if (isLocked) onLockedAction?.()
            }}
            placeholder="Contoh : MABAR"
            className="
              flex-1 px-4 py-3 rounded-2xl
              bg-white/80 dark:bg-white/20
              border border-purple-500/50 dark:border-purple-300
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-purple-300
              focus:outline-none
              focus:border-purple-500
              focus:ring-2 focus:ring-purple-500/20
              focus:bg-white dark:focus:bg-white/30
              transition-all duration-200
              text-sm
            "
          />
          <button
            type="button"
            onClick={handleCheckCode}
            disabled={isLocked || checkMutation.isPending}
            className="
              px-5 py-3 rounded-2xl
              bg-gradient-to-r from-purple-500 to-pink-500
              text-white text-sm font-bold
              hover:from-purple-600 hover:to-pink-600
              disabled:opacity-50 transition-all duration-200
              shadow-md
            "
          >
            {checkMutation.isPending ? 'Checking...' : 'Cek'}
          </button>
        </div>
        {validationMsg && (
          <p className={`mt-2 text-xs font-medium ${validationMsg.isError ? 'text-red-500' : 'text-green-500'}`}>
            {validationMsg.text}
          </p>
        )}
      </div>
    </div>
  )
}
