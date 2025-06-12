export interface MemberCardTypes {
  name?: string
  description?: string
  projectNo?: string
  profile?: string
  message?: string
  width?: string
  height?: string
  onApprove?: () => void
  loading?: boolean
  isMember?: boolean
}
