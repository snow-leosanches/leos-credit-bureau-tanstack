import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  FileText,
  CreditCard,
  AlertTriangle,
  Calendar,
  Building2,
  Search,
  ArrowLeft,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Smartphone,
  Home,
  Wifi,
  Shield,
  Lightbulb,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { snowplowTracker } from '../lib/snowplow'

export const Route = createFileRoute('/credit-report')({
  component: CreditReport,
})

// Mock credit report data - varies by customer
function getCreditReportData(customerId: number) {
  const reports = {
    1: {
      // Good credit report
      ficoScore: 720,
      paymentHistory: {
        totalAccounts: 12,
        onTimePayments: 98,
        latePayments: 2,
        missedPayments: 0,
        status: 'excellent',
      },
      creditCardUsage: {
        totalCards: 4,
        totalCreditLimit: 50000,
        usedCredit: 8500,
        utilization: 17,
        status: 'excellent',
        cards: [
          { name: 'Visa Classic', limit: 15000, used: 2500, utilization: 17 },
          { name: 'Mastercard Gold', limit: 20000, used: 3500, utilization: 18 },
          { name: 'American Express', limit: 10000, used: 1500, utilization: 15 },
          { name: 'Discover', limit: 5000, used: 1000, utilization: 20 },
        ],
      },
      derogatoryMarks: {
        count: 0,
        items: [],
        status: 'clean',
      },
      creditAge: {
        oldestAccount: '10 years 3 months',
        averageAge: '7 years 6 months',
        newestAccount: '2 years 1 month',
        status: 'good',
      },
      totalAccounts: {
        open: 12,
        closed: 3,
        types: {
          creditCards: 4,
          mortgages: 1,
          autoLoans: 1,
          personalLoans: 2,
          studentLoans: 1,
          other: 3,
        },
      },
      hardInquiries: {
        last24Months: 2,
        last12Months: 1,
        inquiries: [
          { date: '2024-01-15', creditor: 'ABC Bank', type: 'Credit Card Application' },
          { date: '2023-06-20', creditor: 'XYZ Mortgage', type: 'Mortgage Pre-approval' },
        ],
      },
    },
    2: {
      // Average credit report
      ficoScore: 680,
      paymentHistory: {
        totalAccounts: 8,
        onTimePayments: 92,
        latePayments: 6,
        missedPayments: 2,
        status: 'good',
      },
      creditCardUsage: {
        totalCards: 3,
        totalCreditLimit: 25000,
        usedCredit: 11250,
        utilization: 45,
        status: 'fair',
        cards: [
          { name: 'Visa Classic', limit: 10000, used: 5000, utilization: 50 },
          { name: 'Mastercard Silver', limit: 10000, used: 4500, utilization: 45 },
          { name: 'Store Card', limit: 5000, used: 1750, utilization: 35 },
        ],
      },
      derogatoryMarks: {
        count: 1,
        items: [
          { type: 'Late Payment', date: '2023-08-15', account: 'Visa Classic', status: 'Resolved' },
        ],
        status: 'has_marks',
      },
      creditAge: {
        oldestAccount: '6 years 8 months',
        averageAge: '4 years 2 months',
        newestAccount: '1 year 3 months',
        status: 'average',
      },
      totalAccounts: {
        open: 8,
        closed: 4,
        types: {
          creditCards: 3,
          mortgages: 0,
          autoLoans: 1,
          personalLoans: 1,
          studentLoans: 1,
          other: 2,
        },
      },
      hardInquiries: {
        last24Months: 5,
        last12Months: 3,
        inquiries: [
          { date: '2024-01-10', creditor: 'DEF Credit Union', type: 'Credit Card Application' },
          { date: '2023-11-05', creditor: 'GHI Auto Finance', type: 'Auto Loan Application' },
          { date: '2023-08-20', creditor: 'JKL Bank', type: 'Personal Loan Application' },
          { date: '2023-05-15', creditor: 'MNO Credit', type: 'Credit Card Application' },
          { date: '2023-02-28', creditor: 'PQR Bank', type: 'Credit Card Application' },
        ],
      },
    },
    3: {
      // Poor credit report
      ficoScore: 620,
      paymentHistory: {
        totalAccounts: 6,
        onTimePayments: 78,
        latePayments: 15,
        missedPayments: 7,
        status: 'poor',
      },
      creditCardUsage: {
        totalCards: 2,
        totalCreditLimit: 12000,
        usedCredit: 10800,
        utilization: 90,
        status: 'poor',
        cards: [
          { name: 'Secured Visa', limit: 8000, used: 7200, utilization: 90 },
          { name: 'Store Card', limit: 4000, used: 3600, utilization: 90 },
        ],
      },
      derogatoryMarks: {
        count: 3,
        items: [
          { type: 'Collection Account', date: '2023-11-20', account: 'Medical Bill', status: 'Active' },
          { type: 'Late Payment', date: '2023-09-10', account: 'Secured Visa', status: 'Resolved' },
          { type: 'Late Payment', date: '2023-06-15', account: 'Store Card', status: 'Resolved' },
        ],
        status: 'has_marks',
      },
      creditAge: {
        oldestAccount: '4 years 2 months',
        averageAge: '2 years 8 months',
        newestAccount: '6 months',
        status: 'poor',
      },
      totalAccounts: {
        open: 6,
        closed: 8,
        types: {
          creditCards: 2,
          mortgages: 0,
          autoLoans: 1,
          personalLoans: 2,
          studentLoans: 1,
          other: 0,
        },
      },
      hardInquiries: {
        last24Months: 9,
        last12Months: 6,
        inquiries: [
          { date: '2024-02-01', creditor: 'STU Finance', type: 'Credit Card Application' },
          { date: '2023-12-15', creditor: 'VWX Credit', type: 'Credit Card Application' },
          { date: '2023-10-20', creditor: 'YZA Auto', type: 'Auto Loan Application' },
          { date: '2023-09-05', creditor: 'BCD Personal Loans', type: 'Personal Loan Application' },
          { date: '2023-07-18', creditor: 'EFG Credit', type: 'Credit Card Application' },
          { date: '2023-05-22', creditor: 'HIJ Finance', type: 'Credit Card Application' },
          { date: '2023-04-10', creditor: 'KLM Bank', type: 'Credit Card Application' },
          { date: '2023-02-28', creditor: 'NOP Credit', type: 'Personal Loan Application' },
          { date: '2023-01-15', creditor: 'QRS Finance', type: 'Credit Card Application' },
        ],
      },
    },
  }

  return reports[customerId as keyof typeof reports] || reports[2]
}

interface BoostData {
  bankAccounts: Array<{ name: string; type: string; last4: string }>
  bills: Array<{ name: string; provider: string; payments: number; icon?: string }>
  periodMonths: number
  boostAmount: number
  completedAt: string
}

function CreditReport() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [reportData, setReportData] = useState<ReturnType<typeof getCreditReportData> | null>(null)
  const [showCreditBoosting, setShowCreditBoosting] = useState(false)
  const [boostData, setBoostData] = useState<BoostData | null>(null)

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
    const data = getCreditReportData(customerIdNum)
    setReportData(data)

    // Check for existing boost data
    const storedBoostData = localStorage.getItem(`creditBoost_${customerIdNum}`)
    if (storedBoostData) {
      try {
        const parsed = JSON.parse(storedBoostData)
        setBoostData(parsed)
      } catch (e) {
        console.error('Error parsing boost data:', e)
      }
    }

    // Show credit boosting for scores below 700 and if no boost data exists
    if (data.ficoScore < 700 && !storedBoostData) {
      setShowCreditBoosting(true)
    }

    // Track page view
    snowplowTracker.trackPageView()
  }, [navigate])

  if (!reportData || !customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    if (status === 'excellent' || status === 'good' || status === 'clean') {
      return 'text-green-400 bg-green-500/20'
    }
    if (status === 'fair' || status === 'average' || status === 'has_marks') {
      return 'text-yellow-400 bg-yellow-500/20'
    }
    return 'text-red-400 bg-red-500/20'
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 30) return 'text-green-400'
    if (utilization < 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getBillIcon = (billName: string) => {
    const iconMap: { [key: string]: any } = {
      'Electricity Bill': Zap,
      'Internet Service': Wifi,
      'Mobile Phone': Smartphone,
      'Rent Payment': Home,
      'Auto Insurance': Shield,
    }
    return iconMap[billName] || FileText
  }

  const generateRecommendations = (boostData: BoostData | null, reportData: ReturnType<typeof getCreditReportData>) => {
    const recommendations: string[] = []
    
    if (!boostData) return recommendations

    // Based on number of bills
    if (boostData.bills.length < 3) {
      recommendations.push('Connect additional accounts to find more bill payment history')
    }

    // Based on period
    if (boostData.periodMonths < 12) {
      recommendations.push('Continue making on-time payments to build a longer payment history')
    }

    // Based on credit utilization
    if (reportData.creditCardUsage.utilization > 30) {
      recommendations.push('Reduce credit card utilization to below 30% for better credit score impact')
    }

    // Based on payment history
    if (reportData.paymentHistory.onTimePayments < 95) {
      recommendations.push('Maintain consistent on-time payments on all accounts')
    }

    // Based on number of accounts
    if (reportData.totalAccounts.open < 5) {
      recommendations.push('Consider adding a mix of credit types to diversify your credit profile')
    }

    // Always add a positive one
    if (boostData.bills.length >= 3) {
      recommendations.push('Keep your connected bills active and continue paying on time to maintain your boost')
    }

    return recommendations.slice(0, 5) // Limit to 5 recommendations
  }

  const handleCreditBoostingSignup = () => {
    // Track ecommerce add to cart event (service signup)
    snowplowTracker.trackAddToCart({
      id: `credit_boosting_${customerId}`,
      name: 'Credit Boosting Service',
      category: 'Credit Services',
      price: 0,
      quantity: 1,
      currency: 'USD',
    })

    // Navigate to the score boost step 1
    navigate({ to: '/score-boost/step-1' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Full Credit Report
              </h1>
              <p className="text-gray-400">
                Complete credit information for Customer {customerId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">FICO® Score</p>
              <p className={`text-4xl font-bold ${
                reportData.ficoScore >= 750 ? 'text-green-400' :
                reportData.ficoScore >= 700 ? 'text-cyan-400' :
                reportData.ficoScore >= 650 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {reportData.ficoScore}
              </p>
            </div>
          </div>
        </div>

        {/* Credit Boosting Banner for scores < 700 */}
        {showCreditBoosting && !boostData && (
          <div className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Improve Your Credit Score
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Enroll in our Credit Boosting service to get personalized recommendations and tools to improve your credit score.
                  </p>
                </div>
              </div>
              <button
                onClick={handleCreditBoostingSignup}
                data-sp-button-label="Get Started - Credit Boosting"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Credit Boost Summary - Show after completion */}
        {boostData && (
          <div className="mb-6 bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Credit Boost Active</h2>
                  <p className="text-gray-300 text-sm">
                    Your credit file has been updated with bill payment history
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs mb-1">Score Increase</p>
                <p className="text-3xl font-bold text-green-400">+{boostData.boostAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Connected Bank Accounts */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  Connected Bank Accounts ({boostData.bankAccounts.length})
                </h3>
                <div className="space-y-2">
                  {boostData.bankAccounts.map((account, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-white font-medium text-sm">{account.name}</p>
                      <p className="text-gray-400 text-xs">{account.type} ••••{account.last4}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synchronized Bills */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Synchronized Bills ({boostData.bills.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {boostData.bills.map((bill, index) => {
                    const Icon = getBillIcon(bill.name)
                    return (
                      <div key={index} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <div>
                            <p className="text-white font-medium text-xs">{bill.name}</p>
                            <p className="text-gray-400 text-xs">{bill.provider}</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs">{bill.payments} payments</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Period Information */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Payment History Period
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Analyzed {boostData.periodMonths} months of payment history from your connected accounts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">{boostData.periodMonths}</p>
                  <p className="text-gray-400 text-xs">months</p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {generateRecommendations(boostData, reportData).length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {generateRecommendations(boostData, reportData).map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment History */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Payment History</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Total Accounts</p>
                <p className="text-white text-2xl font-semibold">{reportData.paymentHistory.totalAccounts}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">On-Time</p>
                  <p className="text-green-400 text-xl font-semibold">{reportData.paymentHistory.onTimePayments}%</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Late</p>
                  <p className="text-yellow-400 text-xl font-semibold">{reportData.paymentHistory.latePayments}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Missed</p>
                  <p className="text-red-400 text-xl font-semibold">{reportData.paymentHistory.missedPayments}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(reportData.paymentHistory.status)}`}>
                {reportData.paymentHistory.status.charAt(0).toUpperCase() + reportData.paymentHistory.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Credit Card Usage */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Credit Card Usage</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-sm">Overall Utilization</p>
                  <p className={`text-xl font-semibold ${getUtilizationColor(reportData.creditCardUsage.utilization)}`}>
                    {reportData.creditCardUsage.utilization}%
                  </p>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      reportData.creditCardUsage.utilization < 30 ? 'bg-green-400' :
                      reportData.creditCardUsage.utilization < 50 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(reportData.creditCardUsage.utilization, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {reportData.creditCardUsage.cards.map((card, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white text-sm font-medium">{card.name}</p>
                      <p className={`text-sm font-semibold ${getUtilizationColor(card.utilization)}`}>
                        {card.utilization}%
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">
                      ${card.used.toLocaleString()} of ${card.limit.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(reportData.creditCardUsage.status)}`}>
                {reportData.creditCardUsage.status.charAt(0).toUpperCase() + reportData.creditCardUsage.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Derogatory Marks */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Derogatory Marks</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-1">Total Marks</p>
                <p className={`text-3xl font-semibold ${
                  reportData.derogatoryMarks.count === 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {reportData.derogatoryMarks.count}
                </p>
              </div>
              {reportData.derogatoryMarks.items.length > 0 ? (
                <div className="space-y-2">
                  {reportData.derogatoryMarks.items.map((item, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{item.type}</p>
                          <p className="text-gray-400 text-xs mt-1">{item.account}</p>
                          <p className="text-gray-500 text-xs mt-1">{item.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-300 text-sm">No derogatory marks found</p>
                </div>
              )}
            </div>
          </div>

          {/* Credit Age */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Credit Age</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Oldest</p>
                  <p className="text-white text-sm font-semibold">{reportData.creditAge.oldestAccount}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Average</p>
                  <p className="text-white text-sm font-semibold">{reportData.creditAge.averageAge}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">Newest</p>
                  <p className="text-white text-sm font-semibold">{reportData.creditAge.newestAccount}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(reportData.creditAge.status)}`}>
                {reportData.creditAge.status.charAt(0).toUpperCase() + reportData.creditAge.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Total Accounts */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Total Accounts</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Open Accounts</p>
                    <p className="text-white text-3xl font-semibold">{reportData.totalAccounts.open}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Closed Accounts</p>
                    <p className="text-white text-3xl font-semibold">{reportData.totalAccounts.closed}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Credit Cards</p>
                  <p className="text-white text-xl font-semibold">{reportData.totalAccounts.types.creditCards}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Mortgages</p>
                  <p className="text-white text-xl font-semibold">{reportData.totalAccounts.types.mortgages}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Auto Loans</p>
                  <p className="text-white text-xl font-semibold">{reportData.totalAccounts.types.autoLoans}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Personal Loans</p>
                  <p className="text-white text-xl font-semibold">{reportData.totalAccounts.types.personalLoans}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Student Loans</p>
                  <p className="text-white text-xl font-semibold">{reportData.totalAccounts.types.studentLoans}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Other</p>
                  <p className="text-white text-xl font-semibold">{reportData.totalAccounts.types.other}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hard Inquiries */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">Hard Inquiries</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Last 24 Months</p>
                  <p className={`text-2xl font-semibold ${
                    reportData.hardInquiries.last24Months <= 3 ? 'text-green-400' :
                    reportData.hardInquiries.last24Months <= 6 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {reportData.hardInquiries.last24Months}
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Last 12 Months</p>
                  <p className={`text-2xl font-semibold ${
                    reportData.hardInquiries.last12Months <= 2 ? 'text-green-400' :
                    reportData.hardInquiries.last12Months <= 4 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {reportData.hardInquiries.last12Months}
                  </p>
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {reportData.hardInquiries.inquiries.map((inquiry, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white text-sm font-medium">{inquiry.creditor}</p>
                        <p className="text-gray-400 text-xs mt-1">{inquiry.type}</p>
                      </div>
                      <p className="text-gray-500 text-xs">{inquiry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

