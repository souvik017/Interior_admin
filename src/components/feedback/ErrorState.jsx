import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load this data. Please try again.',
  onRetry,
  retryLabel = 'Retry',
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-danger/30 bg-danger/5 p-8 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <Icon name="error" className="text-2xl" />
      </div>
      <h3 className="mt-4 text-base font-bold text-text tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-xs text-xs text-muted leading-relaxed">{description}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" size="sm" icon="refresh" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
