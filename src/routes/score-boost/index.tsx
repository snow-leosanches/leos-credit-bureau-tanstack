import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  TrendingUp,
  Shield,
  CreditCard,
  ArrowLeft,
  FileText,
  Bell,
} from 'lucide-react'
import { snowplowTracker } from '../../lib/snowplow'
import { ELIGIBLE_BILLS, getCurrentScore } from './types'

export const Route = createFileRoute('/score-boost/')({
  component: ScoreBoostIntro,
})

function ScoreBoostIntro() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
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

    // Get current score based on customer
    const score = getCurrentScore(customerIdNum)
    setCurrentScore(score)

    // Track page view
    if (snowplowTracker) {
      try {
        snowplowTracker.trackPageView()
      } catch (e) {
        console.error('Error tracking page view:', e)
      }
    }
  }, [navigate])

  const handleStartBoost = () => {
    navigate({ to: '/score-boost/step-1' })
  }

  if (!customerId || !currentScore) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate({ to: '/credit-report' })}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Credit Report</span>
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-6">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Instantly raise your credit score for free
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Get credit for bills like your cell phone, utilities, rent and insurance
          </p>
          <p className="text-gray-400">
            with Leo's Credit Boost™
          </p>
        </div>

        {/* Current Score Display */}
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8 mb-8 text-center">
          <p className="text-gray-300 text-sm mb-2">Your Current FICO® Score</p>
          <p className="text-6xl font-bold text-cyan-400 mb-2">{currentScore}</p>
          <p className="text-gray-400">Build your credit history and potentially raise your score</p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-xl font-bold">1</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Connect your bank accounts</h3>
            <p className="text-gray-400 text-sm">
              Add any bank accounts you use to pay your bills. Your information remains private and secure.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-xl font-bold">2</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Select the bills you want to use</h3>
            <p className="text-gray-400 text-sm">
              We'll detect bills with on-time payments, and you can add them to your credit file.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-cyan-400 text-xl font-bold">3</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">See your results instantly</h3>
            <p className="text-gray-400 text-sm">
              You'll find out right away if your FICO® Score increased and by how many points.
            </p>
          </div>
        </div>

        {/* Popular Bills */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Popular bills that work with Leo's Credit Boost</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ELIGIBLE_BILLS.slice(0, 4).map((bill, index) => {
              const Icon = bill.icon
              return (
                <div key={index} className="flex flex-col items-center p-4 bg-slate-700/50 rounded-lg">
                  <Icon className="w-8 h-8 text-cyan-400 mb-2" />
                  <p className="text-white text-sm text-center">{bill.name}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Included */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Included with Leo's Credit Boost</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Access your FICO® Score and credit report</h3>
                <p className="text-gray-400 text-sm">Stay up to date with your latest credit report and FICO® Score daily.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CreditCard className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Get credit card and loan offers matched to you</h3>
                <p className="text-gray-400 text-sm">See personalized offers based on your unique credit profile.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Run a free identity scan</h3>
                <p className="text-gray-400 text-sm">Check if your personal info is exposed on the dark web and people finder sites.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-semibold mb-1">Credit monitoring alerts</h3>
                <p className="text-gray-400 text-sm">Get notified about changes to your credit report in real-time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleStartBoost}
            data-sp-button-label="Start your boost"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 text-lg"
          >
            Start your boost
          </button>
          <p className="text-gray-400 text-sm mt-4">No credit card required • Free forever</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-gray-500 text-xs max-w-2xl mx-auto">
          <p>Results will vary. Not all payments are boost-eligible. Some users may not receive an improved score or approval odds. 
          Not all lenders use credit files impacted by Leo's Credit Boost™. Learn more.</p>
        </div>
      </div>
    </div>
  )
}