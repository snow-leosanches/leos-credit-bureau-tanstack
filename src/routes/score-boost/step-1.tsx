import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Building2, ArrowLeft, Shield, CheckCircle2 } from 'lucide-react'
import { snowplowTracker } from '../../lib/snowplow'
import { BankAccount } from './types'

export const Route = createFileRoute('/score-boost/step-1')({
  component: Step1,
})

function Step1() {
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

    // Load existing connected accounts from localStorage
    const storedAccounts = localStorage.getItem(`boostAccounts_${customerIdNum}`)
    if (storedAccounts) {
      try {
        setConnectedAccounts(JSON.parse(storedAccounts))
      } catch (e) {
        console.error('Error parsing stored accounts:', e)
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
  }, [navigate])

  const handleConnectBank = (accountName: string, accountType: string, last4: string) => {
    if (!customerId) return
    
    const newAccount: BankAccount = { name: accountName, type: accountType, last4 }
    const updatedAccounts = [...connectedAccounts, newAccount]
    setConnectedAccounts(updatedAccounts)
    
    // Store in localStorage
    localStorage.setItem(`boostAccounts_${customerId}`, JSON.stringify(updatedAccounts))
  }

  const handleContinue = () => {
    if (connectedAccounts.length > 0) {
      navigate({ to: '/score-boost/step-2' })
    }
  }

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: '/score-boost' })}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Connect your bank accounts</h2>
          <p className="text-gray-400 mb-6">
            Add any bank accounts you use to pay your bills. Your information remains private and secure with bank-level SSL encryption.
          </p>

          <div className="space-y-4 mb-6">
            <div className={`bg-slate-700/50 rounded-lg p-4 flex items-center justify-between ${
              connectedAccounts.some(acc => acc.name === 'Chase Bank') ? 'border border-green-500/50' : ''
            }`}>
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Chase Bank</p>
                  <p className="text-gray-400 text-sm">Checking Account ••••1234</p>
                  {connectedAccounts.some(acc => acc.name === 'Chase Bank') && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </p>
                  )}
                </div>
              </div>
              {!connectedAccounts.some(acc => acc.name === 'Chase Bank') ? (
                <button
                  onClick={() => handleConnectBank('Chase Bank', 'Checking Account', '1234')}
                  data-sp-button-label="Connect Chase Bank"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Connect
                </button>
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              )}
            </div>

            <div className={`bg-slate-700/50 rounded-lg p-4 flex items-center justify-between ${
              connectedAccounts.some(acc => acc.name === 'Wells Fargo') ? 'border border-green-500/50' : ''
            }`}>
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Wells Fargo</p>
                  <p className="text-gray-400 text-sm">Savings Account ••••5678</p>
                  {connectedAccounts.some(acc => acc.name === 'Wells Fargo') && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </p>
                  )}
                </div>
              </div>
              {!connectedAccounts.some(acc => acc.name === 'Wells Fargo') ? (
                <button
                  onClick={() => handleConnectBank('Wells Fargo', 'Savings Account', '5678')}
                  data-sp-button-label="Connect Wells Fargo"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Connect
                </button>
              ) : (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              )}
            </div>
          </div>

          {connectedAccounts.length > 0 && (
            <button
              onClick={handleContinue}
              data-sp-button-label="Continue with selected accounts"
              className="w-full mb-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              Continue ({connectedAccounts.length} account{connectedAccounts.length !== 1 ? 's' : ''} connected)
            </button>
          )}

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium mb-1">Your data is secure</p>
                <p className="text-gray-400 text-xs">
                  We use bank-level SSL security encryption to make sure your data is safe when you connect your accounts. 
                  Your security is our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

