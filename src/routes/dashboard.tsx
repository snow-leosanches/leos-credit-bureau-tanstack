import { createFileRoute } from '@tanstack/react-router'
import {
  FileText,
  AlertCircle,
  TrendingUp,
  Shield,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  CreditCard,
  Building2,
  User,
  Eye,
  Lock,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { 
  addInterventionHandlers, 
  Intervention, 
  subscribeToInterventions
} from '@snowplow/signals-browser-plugin';

import VerySlowFeature from '../components/dashboard/VerySlowFeature'
import { snowplowTracker } from '../lib/snowplow'
import { SorryAboutDelayModal } from '@/components/dashboard/SorryAboutDelayModal';
import { ChatbotWidget } from '@/components/dashboard/ChatbotWidget';
import { useSnowplowSignalsOptional } from '@/contexts/SnowplowSignalsContext';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

// Mock credit data - this would come from an API in a real app
function getCreditData(customerId: number) {
  const baseScores = {
    1: 720,
    2: 680,
    3: 620,
  }
  
  const baseScore = baseScores[customerId as keyof typeof baseScores] || 700
  
  // Customer-specific data
  const customerData = {
    1: {
      creditFactors: [
        { factor: 'Payment History', impact: 'High', status: 'good', description: 'All payments on time' },
        { factor: 'Credit Utilization', impact: 'Medium', status: 'good', description: 'Using 17% of available credit' },
        { factor: 'Length of Credit History', impact: 'Medium', status: 'good', description: '7 years average age' },
        { factor: 'Credit Mix', impact: 'Low', status: 'good', description: 'Good variety of accounts' },
        { factor: 'New Credit Inquiries', impact: 'Low', status: 'good', description: '2 inquiries in past year' },
      ],
      alerts: [
        { type: 'info', message: 'Credit score updated - increased by 5 points', date: '2024-01-10' },
        { type: 'success', message: 'All accounts in good standing', date: '2024-01-01' },
      ],
    },
    2: {
      creditFactors: [
        { factor: 'Payment History', impact: 'High', status: 'good', description: '92% on-time payment rate' },
        { factor: 'Credit Utilization', impact: 'Medium', status: 'fair', description: 'Using 45% of available credit' },
        { factor: 'Length of Credit History', impact: 'Medium', status: 'average', description: '4 years average age' },
        { factor: 'Credit Mix', impact: 'Low', status: 'good', description: 'Moderate variety of accounts' },
        { factor: 'New Credit Inquiries', impact: 'Low', status: 'fair', description: '5 inquiries in past 2 years' },
      ],
      alerts: [
        { type: 'warning', message: 'Late payment detected on Visa Classic', date: '2024-01-15' },
        { type: 'info', message: 'Credit score updated', date: '2024-01-10' },
      ],
    },
    3: {
      creditFactors: [
        { factor: 'Payment History', impact: 'High', status: 'poor', description: '78% on-time payment rate' },
        { factor: 'Credit Utilization', impact: 'Medium', status: 'poor', description: 'Using 90% of available credit' },
        { factor: 'Length of Credit History', impact: 'Medium', status: 'poor', description: '2 years average age' },
        { factor: 'Credit Mix', impact: 'Low', status: 'fair', description: 'Limited variety of accounts' },
        { factor: 'New Credit Inquiries', impact: 'Low', status: 'poor', description: '9 inquiries in past 2 years' },
      ],
      alerts: [
        { type: 'warning', message: 'Collection account detected on credit report', date: '2024-01-20' },
        { type: 'warning', message: 'High credit utilization - above recommended threshold', date: '2024-01-15' },
        { type: 'warning', message: 'Multiple late payments detected', date: '2024-01-10' },
      ],
    },
  }
  
  const data = customerData[customerId as keyof typeof customerData] || customerData[1]
  
  return {
    ficoScore: baseScore,
    creditFactors: data.creditFactors,
    alerts: data.alerts,
  }
}

function Dashboard() {
  const navigate = useNavigate()
  const signals = useSnowplowSignalsOptional()
  
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [creditData, setCreditData] = useState<ReturnType<typeof getCreditData> | null>(null)
  const [sorryAboutDelayModal, setSorryAboutDelayModal] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  let [customerAttributes, setCustomerAttributes] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (signals && snowplowTracker) {
      // Get the current domain_sessionid from the Snowplow tracker
      const domainUserInfo = snowplowTracker.getDomainUserInfo()
      const domainSessionId = domainUserInfo?.[6] // sessionId is at index 6
      console.log('domainSessionId', domainSessionId)

      if (domainSessionId) {
        signals.getServiceAttributes({
          attribute_key: "domain_sessionid",
          identifier: domainSessionId,
          name: "leos_credit_bureau_service",
        }).then((attributes) => {
          setCustomerAttributes(attributes)
        }).catch((error) => {
          console.error('Failed to get service attributes:', error)
        })
      } else {
        console.warn('Domain session ID not available yet')
      }
    }
  }, [signals])

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const authCustomerId = localStorage.getItem('authenticatedCustomer')

    if (!isAuthenticated || !authCustomerId) {
      // Redirect to login if not authenticated
      navigate({ to: '/login' })
      return
    }

    const customerIdNum = parseInt(authCustomerId, 10)
    setCustomerId(customerIdNum)
    const data = getCreditData(customerIdNum)
    setCreditData(data)
    // const userId = localStorage.getItem('authenticatedCustomerEmail')

    // Track dashboard page view
    try {
      if (snowplowTracker) {
        snowplowTracker.trackPageView()
      }
    } catch (e) {
      console.error('Failed to track page view:', e)
    }

    addInterventionHandlers({
      handler: (intervention: Intervention) => {
        switch (intervention.name) {
          case 'leos_credit_bureau_rage_clicks_calm_down':
            setSorryAboutDelayModal(true)
            break;
          case 'leos_credit_bureau_idle_promo':
            console.log('leos_credit_bureau_idle_promo intervention received!')
            setShowChatbot(true)
            break;
          default:
            console.log('intervention received!', intervention);
            break;
        }
      },
    });

    // Subscribe to interventions
    // Get endpoint from environment variable or use default
    const signalsEndpoint = String(
      import.meta.env.VITE_SNOWPLOW_SIGNALS_ENDPOINT || 
      '00000000-0000-0000-0000-000000000000.svc.snplow.net'
    )

    // console.log('userId before subscribing to interventions:', userId)
    subscribeToInterventions({
      endpoint: signalsEndpoint,
      /* attributeKeyIds: {
        user_id: userId || '',
      }, */
    })
  }, [navigate])

  if (!creditData || !customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-400'
    if (score >= 700) return 'text-cyan-400'
    if (score >= 650) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 800) return 'Excellent'
    if (score >= 750) return 'Very Good'
    if (score >= 700) return 'Good'
    if (score >= 650) return 'Fair'
    return 'Poor'
  }

  const getFactorStatusIcon = (status: string) => {
    if (status === 'good') {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />
    }
    if (status === 'fair') {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
    return <XCircle className="w-5 h-5 text-red-400" />
  }

  const getAlertIcon = (type: string) => {
    if (type === 'success') {
      return <CheckCircle2 className="w-5 h-5 text-green-400" />
    }
    if (type === 'warning') {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
    return <Shield className="w-5 h-5 text-cyan-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, Customer {customerId}
          </h1>
          <p className="text-gray-400">View and manage your credit information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Credit Report and FICO® Score Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Credit Report and FICO® Score
                </h2>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 border border-slate-700">
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-2">Your FICO® Score</p>
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(creditData.ficoScore)}`}>
                    {creditData.ficoScore}
                  </div>
                  <p className="text-gray-400 text-lg">{getScoreGrade(creditData.ficoScore)}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <Building2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Accounts</p>
                    <p className="text-white text-xl font-semibold">12</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <CreditCard className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Credit Cards</p>
                    <p className="text-white text-xl font-semibold">4</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <User className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Inquiries</p>
                    <p className="text-white text-xl font-semibold">2</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate({ to: '/credit-report' })
                  }}
                  data-sp-button-label="View Full Credit Report"
                  className="w-full mt-6 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  View Full Credit Report
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Credit Score Factors Section */}
            <div
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              data-sp-element="credit_factors"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Credit Score Factors
                </h2>
              </div>

              <div className="space-y-4">
                {creditData.creditFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getFactorStatusIcon(factor.status)}
                        <div>
                          <h3 className="text-white font-semibold">{factor.factor}</h3>
                          <p className="text-gray-400 text-sm">{factor.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        factor.impact === 'High' 
                          ? 'bg-red-500/20 text-red-400' 
                          : factor.impact === 'Medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {factor.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Credit Monitoring and Alerts Section */}
          <div className="lg:col-span-1">
            <div
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
              data-sp-element="credit_monitoring"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Credit Monitoring & Alerts
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                {creditData.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-white text-sm mb-1">{alert.message}</p>
                        <p className="text-gray-500 text-xs">{alert.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg p-4 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-white font-semibold">Monitoring Status</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Your credit is being monitored 24/7. We'll notify you of any significant changes.
                </p>
              </div>
            </div>

            {/* Identity Protection Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-white">
                  Identity Protection
                </h2>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">Protect Your Identity</h3>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Get comprehensive identity theft protection with 24/7 monitoring across all three credit bureaus, 
                  dark web scanning, and identity theft insurance.
                </p>
                <button
                  onClick={() => navigate({ to: '/identity-protection' })}
                  data-sp-button-label="View Identity Protection"
                  className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  View Identity Protection
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <VerySlowFeature />
            <SorryAboutDelayModal isOpen={sorryAboutDelayModal} onClose={() => setSorryAboutDelayModal(false)} />
            <ChatbotWidget isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
          </div>
        </div>
      </div>
    </div>
  )
}

