import { CardSkeleton } from './Skeleton'
import { ErrorState } from './ErrorState'
import { EmptyState } from '../ui/EmptyState'

// Standard wrapper for any API-driven region: loading skeleton, error + retry,
// empty state, or the resolved content. Point every data-fetching component
// at this instead of hand-rolling the four states inline.
export function AsyncState({
  status = 'success', // 'loading' | 'error' | 'empty' | 'success'
  skeleton = <CardSkeleton />,
  error,
  onRetry,
  empty,
  children,
}) {
  if (status === 'loading') return skeleton
  if (status === 'error') {
    return (
      <ErrorState
        title={error?.title}
        description={error?.description || error?.message}
        onRetry={onRetry}
      />
    )
  }
  if (status === 'empty') {
    return (
      <EmptyState
        icon={empty?.icon}
        title={empty?.title || 'Nothing here yet'}
        description={empty?.description}
        action={empty?.action}
      />
    )
  }
  return children
}
