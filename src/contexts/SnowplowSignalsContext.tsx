import { createContext, useContext, useMemo, ReactNode } from 'react'

// Context value type - only exposes the baseUrl (safe to expose on client)
// For authenticated Signals operations, use the API endpoints (e.g., /api/service-attributes)
interface SnowplowSignalsContextValue {
  baseUrl: string | null
}

// Create the context
const SnowplowSignalsContext = createContext<SnowplowSignalsContextValue | null>(null)

// Provider component props
interface SnowplowSignalsProviderProps {
  children: ReactNode
}

// Create the provider component
export const SnowplowSignalsProvider = ({ children }: SnowplowSignalsProviderProps) => {
  // Only expose baseUrl on the client (safe to expose)
  // API keys and other sensitive credentials are kept server-side only
  const contextValue = useMemo(() => {
    const baseUrl = import.meta.env.VITE_SNOWPLOW_SIGNALS_ENDPOINT || null

    return {
      baseUrl,
    }
  }, [])

  return (
    <SnowplowSignalsContext.Provider value={contextValue}>
      {children}
    </SnowplowSignalsContext.Provider>
  )
}

// Custom hook to use the Snowplow Signals context
export const useSnowplowSignals = (): SnowplowSignalsContextValue => {
  const context = useContext(SnowplowSignalsContext)
  if (!context) {
    throw new Error('useSnowplowSignals must be used within a SnowplowSignalsProvider')
  }
  return context
}

// Optional hook that returns null if Signals is not available (for cases where it's optional)
export const useSnowplowSignalsOptional = (): SnowplowSignalsContextValue | null => {
  return useContext(SnowplowSignalsContext)
}

