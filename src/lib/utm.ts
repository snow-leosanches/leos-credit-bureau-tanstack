/**
 * Utility functions for managing UTM parameters
 * These parameters persist across pages until logout
 */

const UTM_STORAGE_KEY = 'snowplow_utm_params'

export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Store UTM parameters in localStorage
 */
export function storeUTMParams(params: UTMParams): void {
  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params))
  } catch (e) {
    console.error('Failed to store UTM parameters:', e)
  }
}

/**
 * Retrieve stored UTM parameters from localStorage
 */
export function getStoredUTMParams(): UTMParams | null {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY)
    if (!stored) return null
    return JSON.parse(stored) as UTMParams
  } catch (e) {
    console.error('Failed to retrieve UTM parameters:', e)
    return null
  }
}

/**
 * Clear stored UTM parameters
 */
export function clearUTMParams(): void {
  try {
    localStorage.removeItem(UTM_STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear UTM parameters:', e)
  }
}

/**
 * Extract UTM parameters from URL query string
 */
export function extractUTMFromURL(url: string = window.location.href): UTMParams {
  const urlObj = new URL(url)
  const params: UTMParams = {}
  
  const utmKeys: (keyof UTMParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  
  utmKeys.forEach(key => {
    const value = urlObj.searchParams.get(key)
    if (value) {
      params[key] = value
    }
  })
  
  return params
}

/**
 * Apply UTM parameters to a URL
 */
export function applyUTMToURL(url: string, params: UTMParams): string {
  try {
    const urlObj = new URL(url, window.location.origin)
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value)
      }
    })
    
    return urlObj.toString()
  } catch (e) {
    console.error('Failed to apply UTM parameters to URL:', e)
    return url
  }
}

/**
 * Get UTM parameters as URLSearchParams string
 */
export function getUTMAsQueryString(params: UTMParams): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })
  
  return searchParams.toString()
}

/**
 * Simulate UTM parameters by adding them to the current URL
 * This will trigger Snowplow to capture them via SiteTrackingPlugin
 */
export function simulateUTMParams(params: UTMParams): void {
  // Store the parameters
  storeUTMParams(params)
  
  // Apply to current URL
  const currentURL = window.location.href
  const urlWithUTM = applyUTMToURL(currentURL, params)
  
  // Update the URL without reloading the page
  window.history.replaceState({}, '', urlWithUTM)
  
  // Trigger a page view so Snowplow captures the UTM parameters
  // This will be handled by the page's useEffect that calls trackPageView
}

/**
 * Get default demo UTM parameters for simulation
 */
export function getDefaultUTMParams(): UTMParams {
  return {
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'credit_monitoring_2024',
    utm_term: 'credit_score',
    utm_content: 'homepage_banner'
  }
}
