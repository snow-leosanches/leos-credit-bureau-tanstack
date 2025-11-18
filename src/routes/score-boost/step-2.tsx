import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { snowplowTracker } from '../../lib/snowplow'
import { ELIGIBLE_BILLS, Bill, BankAccount } from './types'
import { generatePeriodMonths } from './types'

export const Route = createFileRoute('/score-boost/step-2')({
  component: Step2,
})

function Step2() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([])

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const authCustomerId = localStorage.getItem('authenticatedCustomer')

    if (!isAuthenticated || !authCustomerId) {
      navigate({ to: '/login' })
      return
    }

    const customerIdNum = parseInt(authCustomerId, 10)
    setCustomerId(customerIdNum)

    // Load connected accounts from localStorage
    const storedAccounts = localStorage.getItem(`boostAccounts_${customerIdNum}`)
    if (storedAccounts) {
      try {
        setConnectedAccounts(JSON.parse(storedAccounts))
      } catch (e) {
        console.error('Error parsing stored accounts:', e)
      }
    } else {
      // If no accounts found, redirect to step 1
      navigate({ to: '/score-boost/step-1' })
      return
    }

    // Track page view
    if (snowplowTracker) {
      try {
        snowplowTracker.trackPageView()
      } catch (e) {
        console.error('Error tracking page view:', e)
      }
    }
  }, [navigate])

  const handleContinue = () => {
    if (!customerId) return

    // Generate mocked period based on customer ID
    const periodMonths = generatePeriodMonths(customerId)
    
    // Store bills (without icons) and period in localStorage
    // Icons can't be serialized, so we store just the data and restore icons later
    const billsData = ELIGIBLE_BILLS.map(({ icon, ...rest }) => rest)
    localStorage.setItem(`boostBills_${customerId}`, JSON.stringify(billsData))
    localStorage.setItem(`boostPeriod_${customerId}`, JSON.stringify(periodMonths))

    navigate({ to: '/score-boost/step-3' })
  }

  if (!customerId || connectedAccounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate({ to: '/score-boost/step-1' })}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Select the bills you want to use</h2>
          <p className="text-gray-400 mb-6">
            We found bills with on-time payments. Verify the information is correct, then add them to your credit file.
          </p>

          <div className="space-y-4 mb-6">
            {ELIGIBLE_BILLS.map((bill, index) => {
              const Icon = bill.icon
              return (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">{bill.name}</p>
                        <p className="text-gray-400 text-sm">{bill.provider}</p>
                        <p className="text-gray-500 text-xs mt-1">{bill.payments} on-time payments found</p>
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium mb-1">All bills verified</p>
                <p className="text-gray-400 text-xs">
                  All selected bills have at least 3 payments in the last 6 months (including 1 payment within the last 3 months).
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            data-sp-button-label="Continue to confirmation"
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
          >
            Continue to Confirmation
          </button>
        </div>
      </div>
    </div>
  )
}

