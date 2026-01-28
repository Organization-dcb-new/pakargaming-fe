'use client'
import { useParams } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import SpinnerGameTransaction from './Spinner'
import LayoutGamesTransaction from './Layout'
import BannerGameTransaction from './Banner'

export default function GameTransaction() {
  const { slug } = useParams<{ slug: string }>()
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />
  }

  return (
    <LayoutGamesTransaction>
      <BannerGameTransaction />
    </LayoutGamesTransaction>
  )
}
