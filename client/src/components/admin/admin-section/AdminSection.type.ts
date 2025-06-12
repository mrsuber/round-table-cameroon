import { ReactNode } from 'react'

export interface AdminSectionTypes {
  title?: string
  onNext?: () => void
  onPrevious?: () => void
  children?: ReactNode | ReactNode[]
  style?: object
  showNavigation?: boolean
  nextDisabled?: boolean
  previousDisabled?: boolean
}
