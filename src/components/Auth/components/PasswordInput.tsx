'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { forwardRef, useState, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../ui/utils'
import { authInputClass } from './styles'

type PasswordInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>

/** Input password + tombol tampilkan/sembunyikan. Props (id, aria-*) dari <FormControl> diteruskan ke <input>. */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className, disabled, ...props },
  ref,
) {
  const t = useTranslations('AuthDialog')
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        disabled={disabled}
        className={cn(authInputClass, 'pr-12', className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        disabled={disabled}
        aria-label={visible ? t('hidePassword') : t('showPassword')}
        className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-lg text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
})

export default PasswordInput
