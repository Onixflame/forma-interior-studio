import type {MetadataRoute} from 'next';
export const dynamic='force-static';
export default function robots():MetadataRoute.Robots{
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://stanislav-design-studio.pages.dev').replace(/\/$/,'');
 return{
  rules:[
   {userAgent:'TelegramBot',allow:'/'},
   {userAgent:'*',allow:'/'}
  ],
  sitemap:`${base}/sitemap.xml`
 };
}
