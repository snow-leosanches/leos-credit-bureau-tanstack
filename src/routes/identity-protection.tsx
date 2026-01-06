import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Shield,
  AlertTriangle,
  Eye,
  CreditCard,
  User,
  Search,
  FileText,
  Bell,
  CheckCircle2,
  ArrowLeft,
  Users,
  Building2,
  Globe,
  Key,
  FileCheck,
  Home,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { snowplowTracker } from '../lib/snowplow'

export const Route = createFileRoute('/identity-protection')({
  component: IdentityProtection,
})

function IdentityProtection() {
  const navigate = useNavigate()
  const [customerId, setCustomerId] = useState<number | null>(null)
  const [isProtected, setIsProtected] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showEducationalContent, setShowEducationalContent] = useState(false)

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

    // Check if user has protection enabled (mock)
    const hasProtection = localStorage.getItem(`identityProtection_${customerIdNum}`) === 'true'
    setIsProtected(hasProtection)

    // Track page view
    snowplowTracker?.trackPageView()
  }, [navigate])

  const handleEnableProtection = () => {
    if (customerId) {
      localStorage.setItem(`identityProtection_${customerId}`, 'true')
      setIsProtected(true)
      setShowSignup(false)
      // Track ecommerce transaction (service enrollment)
      /* snowplowTracker?.trackTransaction({
        orderId: `identity_protection_${customerId}_${Date.now()}`,
        total: 0,
        currency: 'USD',
      }) */
    }
  }

  const handleLearnMore = () => {
    setShowSignup(true)
  }

  const handleReviewInfo = () => {
    setShowEducationalContent(true)
  }

  if (!customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const protectionFeatures = [
    {
      icon: CreditCard,
      title: 'Credit Monitoring',
      description: 'Track all three major credit bureaus—Equifax®, Experian®, and TransUnion®—for changes that could indicate fraud.',
    },
    {
      icon: Globe,
      title: 'Dark Web Monitoring',
      description: 'Get alerts when your personal information, such as your Social Security number or phone number, appears on the dark web.',
    },
    {
      icon: User,
      title: 'SSN Monitoring',
      description: 'Receive alerts if a new name, alias, or address becomes associated with your Social Security number.',
    },
    {
      icon: Search,
      title: 'Identity Monitoring',
      description: 'Monitor private databases and public records for suspicious activity, including new accounts or court records.',
    },
    {
      icon: Shield,
      title: 'Identity Theft Insurance',
      description: 'Coverage for eligible costs related to identity theft recovery, including legal fees and lost wages.',
    },
    {
      icon: FileCheck,
      title: 'Identity Resolution Assistance',
      description: 'Access to fraud resolution experts who can help investigate and restore your identity if you become a victim.',
    },
    {
      icon: Users,
      title: 'Child Identity Protection',
      description: 'Extend monitoring and assistance services to your children to protect their identities.',
    },
    {
      icon: Bell,
      title: 'Real-Time Alerts',
      description: 'Get instant notifications about suspicious activity, changes to your credit report, or potential fraud.',
    },
  ]

  const identityTheftTypes = [
    {
      icon: AlertTriangle,
      title: 'Criminal Identity Theft',
      description: 'Occurs when someone steals your identity and uses it to commit a crime under your name.',
    },
    {
      icon: User,
      title: 'Synthetic Identity Theft',
      description: 'Combines personal information from several sources with fictional information to create a new identity.',
    },
    {
      icon: CreditCard,
      title: 'Credit Identity Theft',
      description: 'When someone uses your Social Security number to open a line of credit in your name.',
    },
    {
      icon: Users,
      title: 'Child Identity Theft',
      description: 'A child\'s identity can be attractive to ID thieves because parents often don\'t monitor their children\'s credit reports.',
    },
    {
      icon: Key,
      title: 'Account Takeover',
      description: 'Happens when a bad actor accesses an online account—like a social media or bank account—without permission.',
    },
    {
      icon: FileText,
      title: 'Medical Identity Theft',
      description: 'Occurs when someone uses your information to receive medical care in your name, leaving you with the bill.',
    },
    {
      icon: Building2,
      title: 'Tax Identity Theft',
      description: 'Someone might use your Social Security number to commit tax fraud, like filing a tax return in your name.',
    },
    {
      icon: Home,
      title: 'Home Title Fraud',
      description: 'Occurs when someone pretends to be you to access a home title, then changes ownership to their name.',
    },
  ]

  const protectionTips = [
    "Don't carry your Social Security card",
    'Destroy old documents with sensitive data',
    'Check your credit score and credit report periodically',
    'Watch out for phishing attempts',
    'Add a fraud alert or security freeze to your credit reports',
    'Use strong, unique passwords for all accounts',
    'Enable two-factor authentication when available',
    'Monitor your accounts regularly for suspicious activity',
  ]

  if (isProtected && !showEducationalContent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {/* Protected Status Banner */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">Identity Protection Active</h2>
                <p className="text-gray-300">Your identity is being monitored 24/7 across all three credit bureaus</p>
              </div>
              <button
                onClick={handleReviewInfo}
                data-sp-button-label="Review Identity Protection Information"
                className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition-colors"
              >
                Review Protection Info
              </button>
            </div>
          </div>

          {/* Protection Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Credit Monitoring</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">All 3 bureaus monitored</p>
              <p className="text-green-400 font-semibold">Active</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-cyan-400" />
                <h3 className="text-white font-semibold">Dark Web Scan</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">Last scan: Today</p>
              <p className="text-cyan-400 font-semibold">No threats found</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-6 h-6 text-yellow-400" />
                <h3 className="text-white font-semibold">Recent Alerts</h3>
              </div>
              <p className="text-gray-400 text-sm mb-2">Active monitoring</p>
              <p className="text-yellow-400 font-semibold">0 alerts</p>
            </div>
          </div>

          {/* Protection Features */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Protection Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {protectionFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Protection Tips */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Ways to Protect Yourself</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {protectionTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showSignup) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => {
              setShowSignup(false)
              setShowEducationalContent(false)
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Enable Identity Protection</h2>
            <p className="text-gray-400 mb-8">
              Get comprehensive identity theft protection with 24/7 monitoring across all three credit bureaus.
            </p>

            <div className="space-y-6 mb-8">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {protectionFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Identity Theft Insurance Included</p>
                    <p className="text-gray-400 text-xs">
                      Up to $1,000,000 in coverage for eligible costs related to identity theft recovery, 
                      including lost wages, legal fees, and restoration services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleEnableProtection}
              data-sp-button-label="Enable Protection Now"
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              Enable Protection Now
            </button>
            <p className="text-gray-400 text-sm text-center mt-4">Free for all Leo's Credit Bureau customers</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => {
            if (isProtected && showEducationalContent) {
              setShowEducationalContent(false)
            } else {
              navigate({ to: '/dashboard' })
            }
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{isProtected && showEducationalContent ? 'Back to Protection Status' : 'Back to Dashboard'}</span>
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full mb-6">
            <Shield className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            How to Help Protect Yourself From Identity Theft
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Identity theft protection services help you keep your information private with monitoring and support.
          </p>
          <p className="text-gray-400">
            With identity theft protection, you'll have elevated financial security around the clock.
          </p>
        </div>

        {/* Key Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Recovery is Complex</h3>
            <p className="text-gray-400 text-sm">
              It can be a long and complex process to recover from identity theft.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <Shield className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">Protection Services Help</h3>
            <p className="text-gray-400 text-sm">
              Identity theft protection services are a good idea for financial security and credit monitoring.
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <Eye className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-white font-semibold mb-2">24/7 Monitoring</h3>
            <p className="text-gray-400 text-sm">
              You'll have elevated financial security around the clock with continuous monitoring.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">How do identity theft protection services work?</h2>
          <p className="text-gray-300 mb-6">
            Identity theft protection services work differently depending on the program. Often, they'll include a range of 
            services and tools that can help alert you when your personal info is online or if someone tries to open an account 
            in your name. There may also be resources that can help you recover from a stolen identity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {protectionFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Types of Identity Theft */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Different types of identity theft</h2>
          <p className="text-gray-300 mb-6">
            In today's financial landscape, it's vital to understand the wide range of tactics identity thieves may use to access 
            your information. Your approach to data security should include tools to combat many types of frauds and attacks.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {identityTheftTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <Icon className="w-6 h-6 text-yellow-400 mb-3" />
                  <h3 className="text-white font-medium mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm">{type.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* What It Detects */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">What does identity theft protection detect?</h2>
          <p className="text-gray-300 mb-6">
            Identity theft protection services go beyond essential credit monitoring or credit score tracking. These services look 
            for your information in various databases and alert you of suspicious activity, such as a change of address. These alerts 
            can be an early warning that an identity thief is trying to use your personal information to commit fraud. This allows you 
            to respond to the issue immediately.
          </p>
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium mb-1">Early Warning System</p>
                <p className="text-gray-400 text-xs">
                  Identity protection isn't the same as identity theft prevention. The services generally focus on detection and recovery, 
                  but they can't keep your personal information from getting stolen in the first place. However, early detection can help 
                  minimize the damage and make recovery faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Protection Tips */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Ways to protect yourself from identity fraud</h2>
          <p className="text-gray-300 mb-6">
            You can take several steps to help keep your information secure and protect yourself from fraud.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {protectionTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8 text-center">
          <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            {isProtected ? 'Your Protection is Active' : 'Get Protected Today'}
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {isProtected 
              ? 'You\'re already protected! Review the information above to learn more about how identity protection works and what features you have access to.'
              : 'Join millions of customers who trust Leo\'s Credit Bureau for comprehensive identity theft protection. Monitor all three credit bureaus, get dark web alerts, and have peace of mind with 24/7 protection.'}
          </p>
          {!isProtected && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLearnMore}
                data-sp-button-label="Enable Protection"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
              >
                Enable Protection
              </button>
              <button
                onClick={() => navigate({ to: '/dashboard' })}
                data-sp-button-label="Learn More - Identity Protection"
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                Learn More
              </button>
            </div>
          )}
          {isProtected && (
            <button
              onClick={() => setShowEducationalContent(false)}
              data-sp-button-label="Back to Protection Status"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              Back to Protection Status
            </button>
          )}
          {!isProtected && (
            <p className="text-gray-400 text-sm mt-4">Free for all Leo's Credit Bureau customers • No credit card required</p>
          )}
        </div>
      </div>
    </div>
  )
}

