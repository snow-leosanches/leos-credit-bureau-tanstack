import { createContext, useContext, useMemo, ReactNode } from 'react'
import { Signals } from '@snowplow/signals-node'

// Create the context
const SnowplowSignalsContext = createContext<Signals | null>(null)

// Provider component props
interface SnowplowSignalsProviderProps {
  children: ReactNode
}

// Create the provider component
export const SnowplowSignalsProvider = ({ children }: SnowplowSignalsProviderProps) => {
  // Initialize the Signals instance
  const signals = useMemo(() => {
    const baseUrl = import.meta.env.VITE_SNOWPLOW_SIGNALS_ENDPOINT
    const apiKey = import.meta.env.VITE_SNOWPLOW_SIGNALS_API_KEY
    const apiKeyId = import.meta.env.VITE_SNOWPLOW_SIGNALS_API_KEY_ID
    const organizationId = import.meta.env.VITE_SNOWPLOW_SIGNALS_ORG_ID
    const sandboxToken = import.meta.env.VITE_SNOWPLOW_SIGNALS_SANDBOX_TOKEN

    // Check if baseUrl is provided
    if (!baseUrl) {
      console.warn(
        'Snowplow Signals: Missing VITE_SNOWPLOW_SIGNALS_BASE_URL. Signals will not be initialized.'
      )
      return null
    }

    try {
      // Support sandbox mode if sandboxToken is provided
      if (sandboxToken) {
        return new Signals({
          baseUrl,
          sandboxToken,
        })
      }

      // Otherwise use regular API key mode
      if (!apiKey || !apiKeyId || !organizationId) {
        console.warn(
          'Snowplow Signals: Missing required environment variables (API key mode requires VITE_SNOWPLOW_SIGNALS_API_KEY, VITE_SNOWPLOW_SIGNALS_API_KEY_ID, and VITE_SNOWPLOW_SIGNALS_ORG_ID). Signals will not be initialized.'
        )
        return null
      }

      return new Signals({
        baseUrl,
        apiKey,
        apiKeyId,
        organizationId,
      })
    } catch (error) {
      console.error('Failed to initialize Snowplow Signals:', error)
      return null
    }
  }, [])

  return (
    <SnowplowSignalsContext.Provider value={signals}>
      {children}
    </SnowplowSignalsContext.Provider>
  )
}

// Custom hook to use the Snowplow Signals context
export const useSnowplowSignals = (): Signals => {
  const context = useContext(SnowplowSignalsContext)
  if (!context) {
    throw new Error('useSnowplowSignals must be used within a SnowplowSignalsProvider')
  }
  return context
}

// Optional hook that returns null if Signals is not available (for cases where it's optional)
export const useSnowplowSignalsOptional = (): Signals | null => {
  return useContext(SnowplowSignalsContext)
}

