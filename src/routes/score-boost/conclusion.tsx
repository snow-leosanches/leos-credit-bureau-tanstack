import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { TrendingUp, CheckCircle2 } from 'lucide-react'
import { snowplowTracker } from '../../lib/snowplow'
import { trackCreditBoostStepSpec } from '../../../snowtype/snowplow'
import { BoostData, ELIGIBLE_BILLS } from './types'
import { getCurrentScore } from './types'

export const Route = createFileRoute('/score-boost/conclusion')({
  component: Conclusion,
})

function Conclusion() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [boostData, setBoostData] = useState<BoostData | null>(null)
  const [currentScore, setCurrentScore] = useState<number | null>(null)

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

    // Get current score
    const score = getCurrentScore(customerIdNum)
    setCurrentScore(score)

    // Load boost data from localStorage
    const storedBoostData = localStorage.getItem(`creditBoost_${customerIdNum}`)
    if (storedBoostData) {
      try {
        setBoostData(JSON.parse(storedBoostData))
      } catch (e) {
        console.error('Error parsing boost data:', e)
        // If no boost data, redirect to step 1
        navigate({ to: '/score-boost/step-1' })
      }
    } else {
      // If no boost data, redirect to step 1
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

    // Track Credit Boost Step event
    try {
      trackCreditBoostStepSpec({
        step_number: 4,
      })
    } catch (e) {
      console.error('Error tracking credit boost step:', e)
    }
  }, [navigate])

  const handleComplete = () => {
    navigate({ to: '/credit-report' })
  }

  if (!customerId || !currentScore || !boostData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const newScore = currentScore + boostData.boostAmount

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Congrats! You got a boost.
          </h2>

          <div className="bg-slate-900/50 rounded-xl p-8 mb-6">
            <p className="text-gray-400 text-sm mb-2">Your FICO® Score increased by</p>
            <p className="text-5xl font-bold text-green-400 mb-4">+{boostData.boostAmount} points</p>
            <div className="flex items-center justify-center gap-8 mt-6">
              <div>
                <p className="text-gray-400 text-xs mb-1">Previous Score</p>
                <p className="text-2xl font-semibold text-gray-300">{currentScore}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              <div>
                <p className="text-gray-400 text-xs mb-1">New Score</p>
                <p className="text-2xl font-semibold text-cyan-400">{newScore}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            Your credit file has been updated with {ELIGIBLE_BILLS.length} eligible bills showing on-time payments.
          </p>

          <button
            onClick={handleComplete}
            data-sp-button-label="View Updated Credit Report"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
          >
            View Updated Credit Report
          </button>
        </div>

        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">What happens next?</h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Your credit file has been updated with the selected bills</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Continue making on-time payments to maintain your improved score</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Monitor your credit report regularly for any changes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

