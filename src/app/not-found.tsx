import Link from 'next/link';
import {t} from '@/lib/i18n';
import {Footer} from '@/components/editorial';
export default function NotFound(){return <><main id="main" className="container not-found"><span className="eyebrow">FORMA / 404</span><h1>{t('en','notFound')}</h1><p>{t('en','notFoundText')}</p><Link href="/en/" className="button">{t('en','home')} →</Link><div className="button-row"><Link href="/cs/">Čeština →</Link><Link href="/ru/">Русский →</Link></div></main><Footer locale="en"/></>;}
