import { CheckCircle2, Download, ExternalLink, PackageOpen, Search, ShoppingCart, Smartphone } from 'lucide-react'

const appSteps = [
  { icon: Download, title: 'Download the APK', text: 'Tap Download App on this website. The Palani Broilers APK will save to your Android phone.', image: '/help/open-app.jpeg' },
  { icon: PackageOpen, title: 'Open the downloaded file', text: 'Open your browser Downloads list and tap palani-broilers.apk.', image: '/help/downloads.jpeg' },
  { icon: CheckCircle2, title: 'Install and open', text: 'Tap Install. Android may ask you to allow installation from your browser or downloads app. Then tap Open.', image: '/help/install.jpeg' }
]
const orderSteps = [
  { icon: Search, title: 'Browse and select', text: 'Browse categories or search on this website, then tap a product to open the Palani Broilers app.', image: '/help/open-app.jpeg' },
  { icon: ShoppingCart, title: 'Add products in the app', text: 'In the Android app, choose the option and quantity, then tap Add to Cart.', image: '/help/add-to-cart.jpeg' },
  { icon: ShoppingCart, title: 'Review your cart', text: 'Open My Cart to check quantities and your total, then select Proceed to Checkout.', image: '/help/cart.jpeg' },
  { icon: CheckCircle2, title: 'Place your order', text: 'Confirm delivery details and tap Place Order. The app will show your order confirmation.', image: '/help/checkout.jpeg' }
]

function Steps({ steps }) { return <div className="help-steps">{steps.map(({ icon: Icon, title, text, image }, index) => <article className="help-step" key={title}><div className="help-copy"><span className="step-number">Step {index + 1}</span><Icon size={22} /><h3>{title}</h3><p>{text}</p></div><a href={image} target="_blank" rel="noreferrer" aria-label={`Enlarge image for ${title}`}><img loading="lazy" src={image} alt={`${title} instruction screenshot`} /></a></article>)}</div> }

function HelpSection({ onDownloadApp }) {
  return <section id="help" className="help-section">
    <div className="help-intro"><span>Help centre</span><h2>உதவி தேவைப்படுகிறதா?</h2><p>Simple guidance for using Palani Broilers on your phone.</p><div className="help-jumps"><a href="#how-to-order">How to order</a><a href="#app-help">Download & install</a><button onClick={onDownloadApp}><Download size={16} /> Download App</button></div></div>
    <div id="how-to-order" className="help-heading"><span>How to Order</span><h2>எப்படி ஆர்டர் செய்வது?</h2><p>After choosing a product on this website, ordering continues in the installed Android app.</p></div><Steps steps={orderSteps} />
    <div id="app-help" className="help-heading"><span>How to Download the App</span><h2>செயலியை எப்படி பதிவிறக்கம் செய்வது?</h2><p>This is an Android APK download, not a store installation.</p></div><Steps steps={appSteps} />
  </section>
}
export default HelpSection
