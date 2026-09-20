import type {Metadata} from 'next';
import {Suspense} from 'react';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/inter';
import './globals.css';
import {ProjectProvider} from '@/components/state';
import {Header} from '@/components/navigation';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'FORMA — Considered spaces',template:'%s | FORMA'},robots:{index:false,follow:true},icons:{icon:'/icon.svg'}};
const themeScript=`(()=>{let p='system';try{const s=localStorage.getItem('forma-theme');if(['light','dark','system'].includes(s))p=s;}catch{}const m=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{document.documentElement.dataset.theme=p==='system'?(m.matches?'dark':'light'):p;};document.documentElement.dataset.preference=p;apply();m.addEventListener('change',()=>{p=document.documentElement.dataset.preference||'system';apply();});})();`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><ProjectProvider><Suspense fallback={<div className="header-fallback">FORMA</div>}><Header/></Suspense>{children}</ProjectProvider></body></html>;}
