import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { Signals } from '@snowplow/signals-node'

// Initialize Signals instance on the server side
function getSignalsInstance(): Signals | null {
  // Use import.meta.env for Vite environment variables (works on both client and server)
  const baseUrl = import.meta.env.VITE_SNOWPLOW_SIGNALS_ENDPOINT
  const apiKey = import.meta.env.VITE_SNOWPLOW_SIGNALS_API_KEY
  const apiKeyId = import.meta.env.VITE_SNOWPLOW_SIGNALS_API_KEY_ID
  const organizationId = import.meta.env.VITE_SNOWPLOW_SIGNALS_ORG_ID
  const sandboxToken = import.meta.env.VITE_SNOWPLOW_SIGNALS_SANDBOX_TOKEN

  if (!baseUrl) {
    console.error('Missing VITE_SNOWPLOW_SIGNALS_ENDPOINT environment variable')
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
      console.error('Missing required parameters: apiKey, apiKeyId, and organizationId')
      console.error('apiKey', apiKey)
      console.error('apiKeyId', apiKeyId)
      console.error('organizationId', organizationId)
      return null
    }

    return new Signals({
      baseUrl,
      apiKey,
      apiKeyId,
      organizationId,
    })
  } catch (error) {
    console.error('Failed to initialize Snowplow Signals on server:', error)
    return null
  }
}

export const Route = createFileRoute('/api/service-attributes')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const attributeKey = url.searchParams.get('attribute_key')
          const identifier = url.searchParams.get('identifier')
          const name = url.searchParams.get('name')

          if (!attributeKey || !identifier || !name) {
            return json(
              { error: 'Missing required parameters: attribute_key, identifier, and name are required' },
              { status: 400 }
            )
          }

          const signals = getSignalsInstance()
          if (!signals) {
            return json(
              { error: 'Snowplow Signals not configured on server' },
              { status: 500 }
            )
          }

          const attributes = await signals.getServiceAttributes({
            attribute_key: attributeKey,
            identifier,
            name,
          })

          return json(attributes)
        } catch (error) {
          console.error('Error fetching service attributes:', error)
          return json(
            { error: `Failed to fetch service attributes: ${error}` },
            { status: 500 }
          )
        }
      },
    },
  },
})

