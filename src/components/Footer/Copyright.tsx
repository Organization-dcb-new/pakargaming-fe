import { useTranslations } from "next-intl"

export default function CopyrightComponent() {
  const t = useTranslations('Footer')

  return (
    <div className="border-t border-purple-200 dark:border-purple-500/20 pt-8 text-center mb-5">
      <p className="text-gray-500 dark:text-gray-500">
        &copy; {new Date().getFullYear()} AuraGame. {t('rights')}
      </p>
    </div>
  )
}
