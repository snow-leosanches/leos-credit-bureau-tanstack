import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Building2, FileText, Bell } from 'lucide-react'
import { snowplowTracker } from '../../lib/snowplow'
import { trackCreditBoostStepSpec } from '../../../snowtype/snowplow'
import { BankAccount, Bill, BoostData, BillData } from './types'
import { calculateBoostAmount, restoreBillsFromStorage } from './types'

export const Route = createFileRoute('/score-boost/step-3')({
  component: Step3,
})

function Step3() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([])
  const [selectedBills, setSelectedBills] = useState<Bill[]>([])
  const [periodMonths, setPeriodMonths] = useState<number>(0)

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

    // Load data from localStorage
    const storedAccounts = localStorage.getItem(`boostAccounts_${customerIdNum}`)
    const storedBills = localStorage.getItem(`boostBills_${customerIdNum}`)
    const storedPeriod = localStorage.getItem(`boostPeriod_${customerIdNum}`)

    if (storedAccounts) {
      try {
        setConnectedAccounts(JSON.parse(storedAccounts))
      } catch (e) {
        console.error('Error parsing stored accounts:', e)
      }
    } else {
      navigate({ to: '/score-boost/step-1' })
      return
    }

    if (storedBills) {
      try {
        const billsData: BillData[] = JSON.parse(storedBills)
        // Restore icon components from the stored bill data
        const restoredBills = restoreBillsFromStorage(billsData)
        setSelectedBills(restoredBills)
      } catch (e) {
        console.error('Error parsing stored bills:', e)
        navigate({ to: '/score-boost/step-2' })
        return
      }
    } else {
      navigate({ to: '/score-boost/step-2' })
      return
    }

    if (storedPeriod) {
      try {
        setPeriodMonths(JSON.parse(storedPeriod))
      } catch (e) {
        console.error('Error parsing stored period:', e)
      }
    }

    // Track page view
    if (snowplowTracker) {
      try {
        snowplowTracker.trackPageView()
      } catch (e) {
        console.error('Error tracking page view:', e)
      }
    }

    // Track Credit Boost Step event
    try {
      trackCreditBoostStepSpec({
        step_number: 3,
      })
    } catch (e) {
      console.error('Error tracking credit boost step:', e)
    }
  }, [navigate])

  const handleConfirm = () => {
    if (!customerId) return

    // Calculate boost amount
    const boostAmount = calculateBoostAmount(selectedBills, periodMonths)

    // Store boost data
    const boostData: BoostData = {
      bankAccounts: connectedAccounts,
      bills: selectedBills,
      periodMonths,
      boostAmount,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem(`creditBoost_${customerId}`, JSON.stringify(boostData))

    // Track ecommerce event (service completion)
    try {
      // @ts-ignore - trackAddToCart is available via SnowplowEcommercePlugin
      snowplowTracker.trackAddToCart({
        id: `credit_boost_${customerId}_${Date.now()}`,
        name: 'Credit Boost Service',
        category: 'Credit Services',
        price: 0,
        quantity: 1,
        currency: 'USD',
      })
    } catch (e) {
      console.error('Error tracking ecommerce event:', e)
    }

    navigate({ to: '/score-boost/conclusion' })
  }

  if (!customerId || connectedAccounts.length === 0 || selectedBills.length === 0) {
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
          onClick={() => navigate({ to: '/score-boost/step-2' })}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Confirm Your Information</h2>
          <p className="text-gray-400 mb-6">
            Please review the information below before we add it to your credit file.
          </p>

          {/* Bank Accounts Summary */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              Connected Bank Accounts ({connectedAccounts.length})
            </h3>
            <div className="space-y-2">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-white font-medium">{account.name}</p>
                  <p className="text-gray-400 text-sm">{account.type} ••••{account.last4}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bills Summary */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Bills to Add ({selectedBills.length})
            </h3>
            <div className="space-y-2">
              {selectedBills.map((bill, index) => {
                const Icon = bill.icon
                return (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium text-sm">{bill.name}</p>
                        <p className="text-gray-400 text-xs">{bill.provider}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs">{bill.payments} payments</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Period Information */}
          <div className="mb-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium mb-1">Payment History Period</p>
                <p className="text-gray-300 text-sm">
                  We'll analyze {periodMonths} months of payment history from your connected accounts.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            data-sp-button-label="Confirm and add to credit file"
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
          >
            Confirm and Add to Credit File
          </button>
        </div>
      </div>
    </div>
  )
}

