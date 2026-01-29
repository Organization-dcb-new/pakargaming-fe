'use client'
import { useParams } from 'next/navigation'
import { useGetGamesBySlug } from '../../hooks/useGame'
import SpinnerGameTransaction from './Spinner'
import LayoutGamesTransaction from './Layout'
import BannerGameTransaction from './Banner'
import AccountComponent from './Account'
import LayoutData from './LayoutData'
import { cloneElement, ReactElement } from 'react'

export default function GameTransaction() {
  const { slug } = useParams<{ slug: string }>()
  const { data: dataGameDetail, isLoading: isLoadingGameDetail } = useGetGamesBySlug(slug)
  const inputs = dataGameDetail?.data?.input || []

  if (isLoadingGameDetail) {
    return <SpinnerGameTransaction />
  }

  const sections: ReactElement[] = [
    inputs.length > 0 ? <AccountComponent gameData={inputs} /> : null,
  ].filter(Boolean) as ReactElement[]

  return (
    <LayoutGamesTransaction>
      <BannerGameTransaction game={dataGameDetail.data} />
      <LayoutData>
        {sections.map((Section, i) =>
          cloneElement(Section, {
            step: i + 1,
            key: `section-${i}`,
          })
        )}
      </LayoutData>
    </LayoutGamesTransaction>
  )
}
