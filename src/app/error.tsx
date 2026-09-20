'use client';
import {usePathname} from 'next/navigation';
import {isLocale,t} from '@/lib/i18n';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){const value=usePathname().split('/')[1];const locale=isLocale(value)?value:'en';return <main id="main" className="container not-found"><span className="eyebrow">FORMA</span><h1>{t(locale,'error')}</h1><button onClick={reset} className="button">{t(locale,'retry')}</button></main>;}
