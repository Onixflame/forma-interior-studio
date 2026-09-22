import type {MetadataRoute} from 'next';
import {routes} from '@/lib/routes';
import {locales} from '@/lib/i18n';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://stanislav-design-studio.pages.dev').replace(/\/$/,'');
 return routes.filter(r=>r!=='my-project').flatMap(route=>locales.map(locale=>{
  const suffix=route?`/${route}`:'';
  return {url:`${base}/${locale}${suffix}/`,lastModified:'2026-09-20',alternates:{languages:Object.fromEntries([...locales.map(l=>[l,`${base}/${l}${suffix}/`]),['x-default',`${base}/en${suffix}/`]])}};
 }));
}
