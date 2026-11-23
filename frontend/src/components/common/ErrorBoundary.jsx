import React from 'react'
import { ShieldAlert, RotateCcw, Home } from 'lucide-react'

/**
 * Global ErrorBoundary Component
 * Catches JavaScript rendering errors anywhere in the component tree
 * and displays a user-friendly fallback screen instead of crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('DroneHub React Error Boundary caught an exception:', error, errorInfo)
  }

  handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas text-white flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full bg-surface border border-line rounded-2xl p-8 shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-400 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/40">
                System Safeguard Triggered
              </span>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs text-subtle font-medium leading-relaxed">
                An unexpected interface error occurred. Don't worry, your data and active drone rentals remain safe.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent text-white font-bold py-3 px-5 rounded-2xl text-xs shadow-lg transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = '/')}
                className="w-full inline-flex items-center justify-center gap-2 bg-surface-2 hover:bg-surface-3 text-fg-muted font-bold py-3 px-5 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
