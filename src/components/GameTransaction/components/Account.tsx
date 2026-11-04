'use client'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { GameDetail, GameInput } from '../../../types/Game'
import { useCheckIDV2 } from '../hooks/useCheckID'
import { Check, Loader2 } from 'lucide-react'
import StepCard from './StepCard'
import { fieldInputClass, fieldLabelClass } from './fieldStyles'

type DynamicAccount = Record<string, any>

interface AccountCardProps {
  gameData: GameInput[]
  step?: number
  game: GameDetail
  setAccount: React.Dispatch<React.SetStateAction<DynamicAccount | null>>
  account: DynamicAccount
}

export default function AccountCard({
  gameData,
  step = 1,
  game,
  setAccount,
  account,
}: AccountCardProps) {
  const t = useTranslations('GameCheckout')
  const { mutate, isPending, data } = useCheckIDV2()

  const { register, watch } = useForm<Record<string, string>>({
    mode: 'onChange',
  })

  const values = watch()

  const hasCheckedRef = useRef(false)
  const lastPayloadRef = useRef<string>('')

  useEffect(() => {
    if (data?.username) {
      const newAccount = {
        ...values,
      }
      setAccount(newAccount)
    }
  }, [data])

  useEffect(() => {
    hasCheckedRef.current = false
  }, [values])

  useEffect(() => {
    const requiredFilled = gameData.filter((g) => g.required).every((g) => values[g.key])

    if (!requiredFilled) {
      hasCheckedRef.current = false
      return
    }

    const payloadString = JSON.stringify(values)

    if (payloadString === lastPayloadRef.current) return

    if (hasCheckedRef.current) return

    const t = setTimeout(() => {
      mutate({
        category_code: game.code,
        game_id: game.id,
        provider_id: game.provider_id,
        game_data: values,
      })

      hasCheckedRef.current = true
      lastPayloadRef.current = payloadString
    }, 500)

    return () => clearTimeout(t)
  }, [data, values, game.id, setAccount, account])

  return (
    <StepCard id="account-section" step={step} title={t('accountEnterTitle')}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {gameData
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map((input) => (
            <label key={input.id} className={fieldLabelClass}>
              <span>
                {input.label}
                {input.required && (
                  <span aria-hidden className="ml-1 text-destructive">
                    *
                  </span>
                )}
              </span>

              {input.input_type === 'dropdown' ? (
                <select
                  {...register(input.key, { required: input.required })}
                  aria-required={input.required}
                  className={`${fieldInputClass} cursor-pointer`}
                >
                  <option value="">{input.placeholder}</option>
                  {input.Options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(input.key, { required: input.required })}
                  type={input.input_type}
                  placeholder={input.placeholder}
                  aria-required={input.required}
                  className={fieldInputClass}
                />
              )}
            </label>
          ))}
      </div>

      <div role="status" aria-live="polite">
        {isPending && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
            {t('accountChecking')}
          </p>
        )}

        {!isPending && data?.username && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-3.5 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{t('accountFound')}</span>
              <span className="truncate font-bold text-foreground">{data.username}</span>
            </span>
          </div>
        )}
      </div>
    </StepCard>
  )
}
