import React from 'react'
import { Icon } from '../ui/Icon'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onRetry) {
      this.props.onRetry()
    } else {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-danger/10 bg-danger/5 p-6 text-center shadow-soft backdrop-blur-sm sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
            <Icon name="error" className="text-3xl" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-text sm:text-xl">Something went wrong</h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            {this.state.error?.message || 'An unexpected application error occurred.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <Icon name="refresh" className="text-sm" />
            Retry Action
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
