import { X, Gift } from 'lucide-react'

interface SorryAboutDelayModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SorryAboutDelayModal({ isOpen, onClose }: SorryAboutDelayModalProps) {
  if (!isOpen) return null

  const handleApplyDiscount = () => {
    // Track the discount acceptance
    // You can add Snowplow tracking here if needed
    console.log('Offer accepted')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
            <Gift className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Sorry about the delay!
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-center mb-6">
          We apologize for keeping you waiting. As a thank you for your patience, 
          enjoy <span className="text-cyan-400 font-semibold">1 month off</span> of your 
          next subscription payment!
        </p>

        {/* Action button */}
        <button
          onClick={handleApplyDiscount}
          className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
        >
          Apply Discount
        </button>
      </div>
    </div>
  )
}