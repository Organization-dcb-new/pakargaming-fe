'use client'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useCheckReferralCode } from '../hooks/useCheckReferralCode'
import StepCard from './StepCard'
import { fieldHintClass, fieldInputClass, fieldLabelClass } from './fieldStyles'

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
      setValidationMsg({ text: t('referralEmpty'), isError: true })
      return
    }
    checkMutation.mutate(referralCode.trim(), {
      onSuccess: (res) => {
        if (res.data && res.data.is_active) {
          setValidationMsg({
            text: t('referralValid'),
            isError: false
          })
        } else {
          setValidationMsg({
            text: t('referralInactive'),
            isError: true
          })
        }
      },
      onError: () => {
        setValidationMsg({
          text: t('referralNotFound'),
          isError: true
        })
      }
    })
  }

  const lockedFocus = () => {
    if (isLocked) onLockedAction?.()
  }

  return (
    <StepCard
      id="contact-section"
      step={step ?? 4}
      title={t('contactStepTitle')}
      locked={isLocked}
      lockedLabel={t('stepLocked')}
    >
      <div className="flex flex-col gap-4">
        <label className={fieldLabelClass}>
          <span>
            {t('contactEmailTitle')}
            <span aria-hidden className="ml-1 text-destructive">
              *
            </span>
          </span>
          <input
            type="email"
            value={email ?? ''}
            required
            aria-required
            autoComplete="email"
            onChange={(e) => setSelectedEmail(e.target.value)}
            readOnly={isLocked}
            onFocus={lockedFocus}
            placeholder={t('placeholderEmail')}
            className={fieldInputClass}
          />
          <span className={fieldHintClass}>{t('contactEmailHint')}</span>
        </label>

        {requiresPhone && (
          <label className={fieldLabelClass}>
            <span>
              {t('contactPhoneTitle')}
              <span aria-hidden className="ml-1 text-destructive">
                *
              </span>
            </span>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-required
              value={userMdn}
              onChange={(e) => setUserMdn(e.target.value)}
              readOnly={isLocked}
              onFocus={lockedFocus}
              placeholder={t('placeholderPhone')}
              className={fieldInputClass}
            />
            <span className={fieldHintClass}>{t('contactPhoneHint')}</span>
          </label>
        )}

        <div className={fieldLabelClass}>
          <label htmlFor="referral-code">{t('referralTitle')}</label>
          <div className="flex gap-2">
            <input
              id="referral-code"
              type="text"
              value={referralCode}
              onChange={(e) => {
                setReferralCode(e.target.value)
                if (validationMsg) setValidationMsg(null)
              }}
              readOnly={isLocked}
              onFocus={lockedFocus}
              placeholder={t('referralPlaceholder')}
              aria-describedby="referral-hint"
              className={`${fieldInputClass} min-w-0 flex-1 font-semibold uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal`}
            />
            <button
              type="button"
              onClick={handleCheckCode}
              disabled={isLocked || checkMutation.isPending}
              className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-brand/60 bg-brand/10 px-4 text-sm font-bold text-brand transition-colors duration-200 hover:bg-brand-solid hover:text-brand-solid-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
            >
              {checkMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />
              )}
              {checkMutation.isPending ? t('referralChecking') : t('referralCheck')}
            </button>
          </div>
          <span id="referral-hint" className={fieldHintClass}>
            {t('referralHint')}
          </span>
          {validationMsg && (
            <p
              role="status"
              className={`flex items-center gap-1.5 text-sm font-semibold ${
                validationMsg.isError ? 'text-destructive' : 'text-success'
              }`}
            >
              {validationMsg.isError ? (
                <XCircle className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
              )}
              {validationMsg.text}
            </p>
          )}
        </div>
      </div>
    </StepCard>
  )
}
