'use client'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { GameDetail, GameInput } from '@/types/game'
import { useCheckID } from '@/features/game-topup/api/useCheckID'
import { Check, Loader2 } from 'lucide-react'
import StepCard from './StepCard'
import { fieldInputClass, fieldLabelClass } from '@/styles/formField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type DynamicAccount = Record<string, any>

interface AccountCardProps {
  gameData: GameInput[]
  step?: number
  game: GameDetail
  setAccount: React.Dispatch<React.SetStateAction<DynamicAccount | null>>
  account: DynamicAccount
  /** Nickname hasil cek ID untuk isian saat ini (null bila belum/tidak valid) — untuk ringkasan & konfirmasi. */
  onAccountNameChange?: (name: string | null) => void
}

/** Isian yang terakhir lolos cek ID beserta nickname-nya. */
type VerifiedAccount = { payload: string; username: string }

export default function AccountCard({
  gameData,
  step = 1,
  game,
  setAccount,
  onAccountNameChange,
}: AccountCardProps) {
  const t = useTranslations('GameCheckout')

  const { mutate, isPending } = useCheckID()

  const { register, watch, control } = useForm<Record<string, string>>({
    mode: 'onChange',
    // Semua field mulai dari '' (sama seperti <select>/<input> bawaan) supaya isi game_data tidak berubah
    defaultValues: Object.fromEntries(gameData.map((g) => [g.key, ''])),
  })

  const values = watch()
  // String stabil dari isian — objek `values` dari watch() berganti referensi tiap render
  const payload = JSON.stringify(values)
  const requiredFilled = gameData.filter((g) => g.required).every((g) => values[g.key])

  const [verified, setVerified] = useState<VerifiedAccount | null>(null)
  const lastRequestedRef = useRef('')
  const isVerified = verified?.payload === payload

  /**
   * Akun hanya valid bila isian SAMA PERSIS dengan isian yang lolos cek. Begitu ID diubah, akun
   * dikosongkan (langkah berikut terkunci lagi) sampai lolos cek ulang — tanpa ini, pesanan bisa
   * terkirim ke ID lama walau form menampilkan ID baru. Kembali ke ID yang sudah lolos → pulih.
   */
  useEffect(() => {
    if (isVerified) {
      setAccount(JSON.parse(payload))
      onAccountNameChange?.(verified.username)
    } else {
      setAccount(null)
      onAccountNameChange?.(null)
    }
  }, [isVerified, payload, verified, setAccount, onAccountNameChange])

  // Cek ID otomatis 500 ms setelah berhenti mengetik; isian yang sama tidak dicek dua kali
  useEffect(() => {
    if (!requiredFilled || isVerified || lastRequestedRef.current === payload) return

    const timer = setTimeout(() => {
      lastRequestedRef.current = payload
      const requested = payload
      mutate(
        {
          category_code: game.code,
          game_id: game.id,
          provider_id: game.provider_id,
          game_data: JSON.parse(requested),
        },
        {
          onSuccess: (data) => {
            if (data?.username) setVerified({ payload: requested, username: data.username })
          },
        },
      )
    }, 500)

    return () => clearTimeout(timer)
  }, [payload, requiredFilled, isVerified, mutate, game.code, game.id, game.provider_id])

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
                <Controller
                  name={input.key}
                  control={control}
                  rules={{ required: input.required }}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange} name={field.name}>
                      <SelectTrigger
                        ref={field.ref}
                        onBlur={field.onBlur}
                        aria-required={input.required}
                        className={fieldInputClass}
                      >
                        <SelectValue placeholder={input.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Data backend kadang memuat opsi "Pilih Server" sendiri → jangan dobel dengan placeholder */}
                        {input.Options?.filter((opt) => opt.value && opt.name !== input.placeholder).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
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

        {!isPending && isVerified && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-3.5 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
              <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{t('accountFound')}</span>
              <span className="truncate font-bold text-foreground">{verified.username}</span>
            </span>
          </div>
        )}
      </div>
    </StepCard>
  )
}
