import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  TrendingUp,
  CheckCircle2,
  Shield,
  CreditCard,
  Building2,
  ArrowLeft,
  Lock,
  DollarSign,
  FileText,
  Bell,
  Smartphone,
  Zap,
  Home,
  Wifi,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { snowplowTracker } from '../lib/snowplow'

export const Route = createFileRoute('/score-boost')({
  component: ScoreBoost,
})

function ScoreBoost() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [currentScore, setCurrentScore] = useState<number | null>(null)
  const [step, setStep] = useState<'intro' | 'connecting' | 'selecting' | 'results'>('intro')
  const [boostAmount, setBoostAmount] = useState<number>(0)

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
    const scores = {
      1: 720,
      2: 680,
      3: 620,
    }
    setCurrentScore(scores[customerIdNum as keyof typeof scores] || 680)

    // Track page view
    snowplowTracker.trackPageView()
  }, [navigate])

  const handleStartBoost = () => {
    setStep('connecting')
  }

  const handleConnectBank = () => {
    setStep('selecting')
  }

  const handleSelectBills = () => {
    // Simulate boost calculation
    const boost = Math.floor(Math.random() * 20) + 10 // 10-30 points
    setBoostAmount(boost)
    setStep('results')
    // Track ecommerce purchase (service completion)
    snowplowTracker.trackPurchase({
      orderId: `credit_boost_${customerId}_${Date.now()}`,
      total: 0,
      currency: 'USD',
      items: [{
        id: `boost_${customerId}`,
        name: 'Credit Boost Service',
        category: 'Credit Services',
        price: 0,
        quantity: 1,
        currency: 'USD',
      }],
    })
  }

  const handleComplete = () => {
    navigate({ to: '/dashboard' })
  }

  if (!customerId || !currentScore) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const eligibleBills = [
    { name: 'Electricity Bill', icon: Zap, provider: 'City Power Co.', payments: 24 },
    { name: 'Internet Service', icon: Wifi, provider: 'Broadband Plus', payments: 18 },
    { name: 'Mobile Phone', icon: Smartphone, provider: 'Telco Wireless', payments: 12 },
    { name: 'Rent Payment', icon: Home, provider: 'Property Management', payments: 6 },
    { name: 'Auto Insurance', icon: Shield, provider: 'Safe Auto Insurance', payments: 12 },
  ]

  if (step === 'intro') {
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
              {eligibleBills.slice(0, 4).map((bill, index) => {
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

  if (step === 'connecting') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep('intro')}
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
              <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Building2 className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">Chase Bank</p>
                    <p className="text-gray-400 text-sm">Checking Account ••••1234</p>
                  </div>
                </div>
                <button
                  onClick={handleConnectBank}
                  data-sp-button-label="Connect Chase Bank"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Building2 className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">Wells Fargo</p>
                    <p className="text-gray-400 text-sm">Savings Account ••••5678</p>
                  </div>
                </div>
                <button
                  onClick={handleConnectBank}
                  data-sp-button-label="Connect Wells Fargo"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>

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

  if (step === 'selecting') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep('connecting')}
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
              {eligibleBills.map((bill, index) => {
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
              onClick={handleSelectBills}
              data-sp-button-label="Add bills to credit file"
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              Add bills to credit file
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'results') {
    const newScore = currentScore + boostAmount

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
              <p className="text-5xl font-bold text-green-400 mb-4">+{boostAmount} points</p>
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
              Your credit file has been updated with {eligibleBills.length} eligible bills showing on-time payments.
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

  return null
}

