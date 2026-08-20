import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  name: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class PlaygroundErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(`[${this.props.name}] Playground error:`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '0.75rem',
            background: 'rgba(239,68,68,0.05)',
            color: '#f87171',
            textAlign: 'center',
            margin: '2rem auto',
            maxWidth: '600px',
          }}
        >
          <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            {this.props.name} falhou ao carregar
          </p>
          <code style={{ fontSize: '0.75rem', opacity: 0.7 }}>
            {this.state.error?.message}
          </code>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            style={{
              display: 'block',
              margin: '1rem auto 0',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              background: 'rgba(34,211,238,0.1)',
              border: '1px solid rgba(34,211,238,0.3)',
              borderRadius: '0.5rem',
              color: '#22d3ee',
            }}
          >
            Tentar novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
