import {
  Cake,
  DollarSign,
  Snail
} from 'lucide-react'

export default function VerySlowFeature() {

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <Snail className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-semibold text-white">
          Very Slow Feature
        </h2>
      </div>

      <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-lg p-4 border border-orange-500/30 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Cake className="w-5 h-5 text-orange-400" />
          <h3 className="text-white font-semibold">Get your free bonus today</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Click below to get your bonus
        </p>
        <button
          onClick={() => console.info('Claiming bonus...')}
          data-sp-button-label="Claim my bonus"
          className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-orange-500/50 flex items-center justify-center gap-2"
        >
          <DollarSign className="w-5 h-5" />
          Claim my bonus
        </button>
      </div>
    </div>
  )
}