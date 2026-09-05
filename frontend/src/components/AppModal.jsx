import { X, Smartphone, Download, HelpCircle } from 'lucide-react'

function AppModal({ product, onOpenApp, onDownloadApp, onClose, appOpenStatus, appUnavailable, onNeedHelp }) {
  if (!product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="text-orange-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {product.nameTamil}
          </h3>
          <p className="text-gray-600">{product.nameEnglish}</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            ₹{product.price.toFixed(2)}/{product.unit}
          </p>
        </div>

        <p className="text-gray-600 text-center mb-6">Choose the option that suits you. Ordering continues safely inside the Android app.</p>

        {appOpenStatus && (
          <p className="text-sm text-center text-gray-600 mb-4" role="status">
            {appOpenStatus}
          </p>
        )}

        <div className="app-choice-grid">
          <div><strong>Already installed?</strong><span>Open Palani Broilers App</span>{!appUnavailable && <button onClick={onOpenApp} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold"><Smartphone size={20} /><span>Open App</span></button>}</div>
          <div><strong>New to Palani Broilers?</strong><span>Download the Android APK</span><button onClick={onDownloadApp} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold"><Download size={20} /><span>Download App</span></button></div>
        </div>
        <button onClick={onNeedHelp} className="modal-help"><HelpCircle size={17} /> Need Help?</button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Don't have our app? Download it to get the best experience.
        </p>
      </div>
    </div>
  )
}

export default AppModal
