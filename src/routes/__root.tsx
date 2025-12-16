import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'

import Header from '../components/Header'
import '../lib/snowplow'
import { SnowplowSignalsProvider } from '../contexts/SnowplowSignalsContext'
import { getStoredUTMParams, applyUTMToURL } from '../lib/utm'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: "Leo's Credit Bureau",
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    // Snowplow tracker is initialized when the module is imported
    // This ensures it's available for tracking throughout the app
  }, [])

  // Apply stored UTM parameters to the URL on route changes
  useEffect(() => {
    const storedUTM = getStoredUTMParams()
    if (storedUTM && Object.keys(storedUTM).length > 0) {
      const currentURL = window.location.href
      const urlObj = new URL(currentURL)
      
      // Check if all UTM parameters are already in the URL
      const allUTMPresent = Object.keys(storedUTM).every(key => 
        urlObj.searchParams.has(key)
      )
      
      // Only apply if not all UTM parameters are present
      if (!allUTMPresent) {
        const urlWithUTM = applyUTMToURL(currentURL, storedUTM)
        // Use replaceState to avoid adding to browser history
        // Only update if the URL actually changed
        if (urlWithUTM !== currentURL) {
          window.history.replaceState({}, '', urlWithUTM)
        }
      }
    }
  }, [location.pathname, location.search]) // Re-run when route path or search params change

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SnowplowSignalsProvider>
          <Header />
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </SnowplowSignalsProvider>
        <Scripts />
      </body>
    </html>
  )
}
