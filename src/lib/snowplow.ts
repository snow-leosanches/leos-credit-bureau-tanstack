import { newTracker, enableActivityTracking } from '@snowplow/browser-tracker'

import { SnowplowEcommercePlugin } from '@snowplow/browser-plugin-snowplow-ecommerce'
import { PerformanceNavigationTimingPlugin } from '@snowplow/browser-plugin-performance-navigation-timing'
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking'
import { ButtonClickTrackingPlugin, enableButtonClickTracking } from '@snowplow/browser-plugin-button-click-tracking'
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking'

import {
  SignalsPlugin,
} from '@snowplow/signals-browser-plugin';
// import { ElementTrackingPlugin, enableElementTracking } from '@snowplow/browser-plugin-element-tracking'

export const snowplowTracker = newTracker(
  'leos-credit-bureau-tanstack',
  String(import.meta.env.VITE_SNOWPLOW_COLLECTOR_URL || 'http://localhost:9090'),
  {
    appId: 'leos-credit-bureau-tanstack',
    contexts: {
      session: true,
      browser: true,
    },
    plugins: [
      PerformanceNavigationTimingPlugin(),
      SnowplowEcommercePlugin(),
      SiteTrackingPlugin(),
      ButtonClickTrackingPlugin(),
      LinkClickTrackingPlugin(),
      SignalsPlugin(),
      // ElementTrackingPlugin(),
    ],
  }
)

// Enable automatic button click tracking
enableButtonClickTracking()

// Enable automatic link click tracking
enableLinkClickTracking()

// Enable automatic element tracking
// enableElementTracking()

// Enable activity tracking (page pings)
enableActivityTracking({
  minimumVisitLength: 30,
  heartbeatDelay: 15,
})
