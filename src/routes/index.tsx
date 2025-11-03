import { createFileRoute, Link } from '@tanstack/react-router'
import {
  FileText,
  TrendingUp,
  Shield,
  Eye,
  CreditCard,
  AlertCircle,
  Lock,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Bell,
  TrendingDown,
} from 'lucide-react'
import { useEffect } from 'react'
import { snowplowTracker } from '../lib/snowplow'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  useEffect(() => {
    // Track page view
    try {
      if (snowplowTracker) {
        snowplowTracker.trackPageView()
      }
    } catch (e) {
      console.error('Failed to track page view:', e)
    }
  }, [])

  const features = [
    {
      icon: <FileText className="w-12 h-12 text-cyan-400" />,
      title: 'Credit Report & FICO® Score',
      description:
        'Access your complete credit report and view your FICO® Score anytime. Get detailed insights into your credit history, payment patterns, and account information.',
      link: '/login',
      linkText: 'View Your Score',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-cyan-400" />,
      title: 'Credit Score Factors',
      description:
        'Understand what affects your credit score. Get detailed analysis of payment history, credit utilization, credit age, and more with personalized recommendations.',
      link: '/login',
      linkText: 'See Your Factors',
    },
    {
      icon: <Shield className="w-12 h-12 text-cyan-400" />,
      title: 'Identity Protection',
      description:
        '24/7 monitoring across all three credit bureaus. Get alerts for dark web activity, suspicious accounts, and potential identity theft threats.',
      link: '/login',
      linkText: 'Get Protected',
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-cyan-400" />,
      title: 'Credit Boosting',
      description:
        'Improve your credit score by adding positive payment history from utility bills, rent, and insurance. See instant score improvements with our free credit boost service.',
      link: '/login',
      linkText: 'Boost Your Score',
    },
    {
      icon: <Bell className="w-12 h-12 text-cyan-400" />,
      title: 'Credit Monitoring & Alerts',
      description:
        'Real-time alerts when changes occur on your credit report. Monitor new accounts, inquiries, balance changes, and potential fraud attempts.',
      link: '/login',
      linkText: 'Start Monitoring',
    },
    {
      icon: <CreditCard className="w-12 h-12 text-cyan-400" />,
      title: 'Comprehensive Credit Analysis',
      description:
        'Detailed breakdown of your credit card usage, payment history, derogatory marks, credit age, total accounts, and hard inquiries.',
      link: '/login',
      linkText: 'View Analysis',
    },
  ]

  const benefits = [
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      text: 'Free credit monitoring across all three bureaus',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      text: 'Instant FICO® Score updates',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      text: 'Identity theft protection included',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      text: 'Credit boosting services available',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      text: 'Real-time fraud alerts',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      text: 'Detailed credit score insights',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 md:w-14 md:h-14 text-cyan-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white [letter-spacing:-0.05em]">
              <span className="text-gray-300">Leo's</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Credit Bureau
              </span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            Take control of your credit health
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            Access your FICO® Score, monitor your credit report, protect your identity, and improve 
            your credit score—all in one secure customer portal.
          </p>
          <div className="flex flex-col items-center justify-center">
            <Link
              to="/login"
              data-sp-button-label="Get Started - Hero"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Manage Your Credit
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our comprehensive platform gives you the tools and insights to understand, monitor, 
            and improve your credit score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 flex-grow">
                {feature.description}
              </p>
              <Link
                to={feature.link}
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition-colors"
              >
                {feature.linkText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose Leo's Credit Bureau?
              </h2>
              <p className="text-gray-400 text-lg">
                Everything you need to stay on top of your credit health
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  {benefit.icon}
                  <p className="text-gray-300">{benefit.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/login"
                data-sp-button-label="Get Started - Benefits"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
            <TrendingUp className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">Instant Access</h3>
            <p className="text-gray-400">
              View your FICO® Score and credit report immediately after logging in
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
            <Shield className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">24/7 Monitoring</h3>
            <p className="text-gray-400">
              Continuous credit monitoring across all three major credit bureaus
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
            <Eye className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-2">Identity Protection</h3>
            <p className="text-gray-400">
              Comprehensive identity theft protection with dark web monitoring
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Credit?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of customers who trust Leo's Credit Bureau to monitor their credit, 
              protect their identity, and improve their financial health.
            </p>
            <Link
              to="/login"
              data-sp-button-label="Get Started - CTA"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              <Lock className="w-5 h-5" />
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-gray-400 text-sm mt-4">
              Free for all customers • No credit card required
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
