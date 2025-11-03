import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { clearUserData } from '@snowplow/browser-tracker';

import { snowplowTracker } from '../lib/snowplow'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const customerLogins: {[key: string]: {name: string, email: string}} = {
    "1": {
      name: 'Customer 1',
      email: 'customer1@protonmail.com'
    },
    "2": {
      name: 'Customer 2',
      email: 'customer.two@gmail.com'
    },
    "3": {
      name: 'Customer 3',
      email: 'ilovegambling@hotmail.com'
    }
  }

  useEffect(() => {
    clearUserData()
    // Track page view when login page is loaded
    try {
      if (snowplowTracker) {
        snowplowTracker.trackPageView()
      }
    } catch (e) {
      console.error('Failed to track page view:', e)
    }
  }, [])

  const handleCustomerLogin = (customerId: number) => {
    const customer = customerLogins[String(customerId)]
    if (!customer) {
      console.error('Customer not found:', customerId)
      return
    }

    // Store the authenticated customer ID in localStorage
    localStorage.setItem('authenticatedCustomer', String(customerId))
    localStorage.setItem('authenticatedCustomerName', customer.name)
    localStorage.setItem('authenticatedCustomerEmail', customer.email)
    localStorage.setItem('isAuthenticated', 'true')

    snowplowTracker?.setUserId(String(customer.email))
    
    // Navigate to the dashboard after authentication
    navigate({ to: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Leo's Credit Bureau
            </h1>
            <p className="text-gray-400">Customer Portal Login</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleCustomerLogin(1)}
              data-sp-button-label="Authenticate Customer 1"
              className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
            >
              Authenticate Customer 1
            </button>

            <button
              onClick={() => handleCustomerLogin(2)}
              data-sp-button-label="Authenticate Customer 2"
              className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
            >
              Authenticate Customer 2
            </button>

            <button
              onClick={() => handleCustomerLogin(3)}
              data-sp-button-label="Authenticate Customer 3"
              className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70"
            >
              Authenticate Customer 3
            </button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-6">
            Select a customer to authenticate as a demo user
          </p>
        </div>
      </div>
    </div>
  )
}

