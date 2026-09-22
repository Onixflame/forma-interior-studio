import type {Metadata} from 'next';
import {Suspense} from 'react';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/inter';
import './globals.css';
import {ProjectProvider} from '@/components/state';
import {Header} from '@/components/navigation';
export const metadata:Metadata={
  metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://stanislav-design-studio.pages.dev'),
  title:{default:'FORMA — Considered spaces',template:'%s | FORMA'},
  description:'A portfolio concept for a fictional interior design studio, featuring residential projects, interior design, renovation, furnishing and an interactive budget calculator.',
  robots:{index:true,follow:true},
  icons:{icon:'/icon.svg'}
};
const themeScript=`(()=>{let p='system';try{const s=localStorage.getItem('forma-theme');if(['light','dark','system'].includes(s))p=s;}catch{}const m=matchMedia('(prefers-color-scheme: dark)');const apply=()=>{document.documentElement.dataset.theme=p==='system'?(m.matches?'dark':'light'):p;};document.documentElement.dataset.preference=p;apply();m.addEventListener('change',()=>{p=document.documentElement.dataset.preference||'system';apply();});})();`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head>
<meta property="og:type" content="website" />
<meta property="og:title" content="FORMA — Interior Design & Renovation Portfolio" />
<meta property="og:description" content="A portfolio concept for a fictional interior design studio, featuring residential projects, interior design, renovation, furnishing and an interactive budget calculator." />
<meta property="og:url" content="https://stanislav-design-studio.pages.dev/en/" />
<meta property="og:image" content="https://stanislav-design-studio.pages.dev/forma-social-preview-v3.jpg" />
<meta property="og:image:secure_url" content="https://stanislav-design-studio.pages.dev/forma-social-preview-v3.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="FORMA interior design studio portfolio preview" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="FORMA — Interior Design & Renovation Portfolio" />
<meta name="twitter:description" content="A portfolio concept for a fictional interior design studio, featuring residential projects, interior design, renovation, furnishing and an interactive budget calculator." />
<meta name="twitter:image" content="https://stanislav-design-studio.pages.dev/forma-social-preview-v3.jpg" />
<script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><ProjectProvider><Suspense fallback={<div className="header-fallback">FORMA</div>}><Header/></Suspense>{children}</ProjectProvider></body></html>;}
