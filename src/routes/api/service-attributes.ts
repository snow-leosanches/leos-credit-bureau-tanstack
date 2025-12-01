import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { Signals } from '@snowplow/signals-node'

// Initialize Signals instance on the server side
function getSignalsInstance(): Signals | null {
  // Use process.env for server-side access to private environment variables
  // These are NOT exposed to the client bundle (unlike VITE_ prefixed vars)
  const baseUrl = process.env.SNOWPLOW_SIGNALS_ENDPOINT || process.env.VITE_SNOWPLOW_SIGNALS_ENDPOINT
  const apiKey = process.env.SNOWPLOW_SIGNALS_API_KEY || process.env.VITE_SNOWPLOW_SIGNALS_API_KEY
  const apiKeyId = process.env.SNOWPLOW_SIGNALS_API_KEY_ID || process.env.VITE_SNOWPLOW_SIGNALS_API_KEY_ID
  const organizationId = process.env.SNOWPLOW_SIGNALS_ORG_ID || process.env.VITE_SNOWPLOW_SIGNALS_ORG_ID
  const sandboxToken = process.env.SNOWPLOW_SIGNALS_SANDBOX_TOKEN || process.env.VITE_SNOWPLOW_SIGNALS_SANDBOX_TOKEN

  if (!baseUrl) {
    console.error('Missing SNOWPLOW_SIGNALS_ENDPOINT or VITE_SNOWPLOW_SIGNALS_ENDPOINT environment variable')
    return null
  }

  try {
    // Support sandbox mode if sandboxToken is provided
    if (sandboxToken) {
      console.log('Initializing Signals with sandbox token mode')
      return new Signals({
        baseUrl,
        sandboxToken,
      })
    }

    // Otherwise use regular API key mode
    if (!apiKey || !apiKeyId || !organizationId) {
      console.error('Missing required parameters for API key mode:')
      console.error('- apiKey:', apiKey ? '***set***' : 'MISSING')
      console.error('- apiKeyId:', apiKeyId ? '***set***' : 'MISSING')
      console.error('- organizationId:', organizationId ? '***set***' : 'MISSING')
      console.error('Available env vars:', {
        hasBaseUrl: !!baseUrl,
        hasApiKey: !!apiKey,
        hasApiKeyId: !!apiKeyId,
        hasOrgId: !!organizationId,
        hasSandboxToken: !!sandboxToken,
      })
      return null
    }

    console.log('Initializing Signals with API key mode')
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
            console.error('Snowplow Signals instance is null - check environment variables')
            return json(
              { 
                error: 'Snowplow Signals not configured on server',
                details: 'Check that environment variables are set in Vercel'
              },
              { status: 500 }
            )
          }

          console.log('Fetching service attributes with:', { attributeKey, identifier, name })
          
          const attributes = await signals.getServiceAttributes({
            attribute_key: attributeKey,
            identifier,
            name,
          })

          console.log('Service attributes response:', attributes)

          // Handle empty or null responses
          if (!attributes || (typeof attributes === 'object' && Object.keys(attributes).length === 0)) {
            return json(
              { 
                message: 'No attributes found',
                attributeKey,
                identifier,
                name,
                attributes: attributes || {}
              },
              { status: 200 }
            )
          }

          return json(attributes)
        } catch (error) {
          console.error('Error fetching service attributes:', error)
          const errorMessage = error instanceof Error ? error.message : String(error)
          const errorStack = error instanceof Error ? error.stack : undefined
          
          return json(
            { 
              error: 'Failed to fetch service attributes',
              message: errorMessage,
              stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
            },
            { status: 500 }
          )
        }
      },
    },
  },
})

