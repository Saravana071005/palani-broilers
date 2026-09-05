import { CheckCircle2, Download, PackageOpen, Search, ShoppingCart } from 'lucide-react'

const downloadSteps = [
  { icon: Download, title: 'Download App பட்டனை அழுத்தவும்', text: 'இந்த இணையதளத்தில் உள்ள Download App பட்டனை அழுத்தவும். Palani Broilers APK கோப்பு உங்கள் Android மொபைலில் பதிவிறக்கம் ஆகும்.', image: '/help/open-app.jpeg' },
  { icon: PackageOpen, title: 'பதிவிறக்கம் செய்த கோப்பை திறக்கவும்', text: 'பதிவிறக்கம் முடிந்ததும் உங்கள் மொபைலின் Downloads பகுதியில் palani-broilers.apk கோப்பைத் திறக்கவும்.', image: '/help/downloads.jpeg' },
  { icon: CheckCircle2, title: 'செயலியை நிறுவவும்', text: 'தேவையான அனுமதியை வழங்கி Install என்பதை அழுத்தவும். நிறுவல் முடிந்ததும் Open என்பதை அழுத்தி செயலியைத் திறக்கவும்.', image: '/help/install.jpeg' }
]
const orderSteps = [
  { icon: Search, title: 'பொருட்களை தேர்வு செய்யவும்', text: 'இந்த இணையதளத்தில் வகைகள் மூலம் உலாவவும் அல்லது தேடவும். பின்னர் விரும்பிய பொருளைத் தேர்வு செய்து செயலியைத் திறக்கவும்.', image: '/help/open-app.jpeg' },
  { icon: ShoppingCart, title: 'அளவை தேர்வு செய்து Cart-ல் சேர்க்கவும்', text: 'செயலியில் தேவையான அளவு அல்லது எண்ணிக்கையைத் தேர்வு செய்து Add to Cart என்பதை அழுத்தவும்.', image: '/help/add-to-cart.jpeg' },
  { icon: ShoppingCart, title: 'Cart-ஐ சரிபார்க்கவும்', text: 'My Cart பகுதியில் பொருட்கள், அளவு மற்றும் மொத்தத் தொகையை சரிபார்த்து Proceed to Checkout என்பதை அழுத்தவும்.', image: '/help/cart.jpeg' },
  { icon: CheckCircle2, title: 'ஆர்டரை அனுப்பவும்', text: 'டெலிவரி விவரங்களை சரிபார்த்து Place Order என்பதை அழுத்தவும். செயலி ஆர்டர் உறுதிப்படுத்தலைக் காண்பிக்கும்.', image: '/help/checkout.jpeg' }
]

function Steps({ steps }) { return <div className="help-steps">{steps.map(({ icon: Icon, title, text, image }, index) => <article className="help-step" key={title}><div className="help-copy"><span className="step-number">படி {index + 1}</span><Icon size={22} /><h3>{title}</h3><p>{text}</p></div><a href={image} target="_blank" rel="noreferrer" aria-label={`${title} படத்தை பெரிதாகப் பார்க்க`}><img loading="lazy" src={image} alt={`${title} வழிகாட்டி படம்`} /></a></article>)}</div> }

function HelpSection({ onDownloadApp }) {
  return <section id="help" className="help-section">
    <div className="help-intro"><span>உதவி</span><h2>உதவி வழிகாட்டி</h2><p>Palani Broilers செயலியை எளிதாகப் பயன்படுத்துவதற்கான வழிமுறைகள்.</p><div className="help-jumps"><a href="#how-to-order">ஆர்டர் செய்வது</a><a href="#app-help">பதிவிறக்கம் & நிறுவல்</a><button onClick={onDownloadApp}><Download size={16} /> செயலியை பதிவிறக்கவும்</button></div></div>
    <div id="app-help" className="help-heading"><span>செயலி வழிமுறை</span><h2>செயலியை பதிவிறக்குவது எப்படி?</h2><p>இது Android APK கோப்பு. பதிவிறக்கம் ஆகும் வரை காத்திருந்து, கோப்பைத் திறந்து செயலியை நிறுவவும்.</p></div><Steps steps={downloadSteps} />
    <div className="help-heading"><span>செயலி வழிமுறை</span><h2>செயலியை திறப்பது எப்படி?</h2><p>Open App பட்டனை அழுத்தவும். செயலி ஏற்கனவே நிறுவப்பட்டிருந்தால் அது நேரடியாகத் திறக்கும். நிறுவப்படவில்லை என்றால் மேலே உள்ள Download App வழிமுறையைப் பயன்படுத்தவும்.</p></div>
    <div id="how-to-order" className="help-heading"><span>ஆர்டர் வழிமுறை</span><h2>பொருட்களை ஆர்டர் செய்வது எப்படி?</h2><p>பொருட்களைத் தேர்வு செய்து செயலியைத் திறந்த பிறகு, Cart மற்றும் Checkout வழியாக ஆர்டரை அனுப்பலாம்.</p></div><Steps steps={orderSteps} />
  </section>
}
export default HelpSection
