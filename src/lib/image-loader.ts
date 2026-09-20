'use client';
import type {ImageLoaderProps} from 'next/image';
export default function imageLoader({src,width}:ImageLoaderProps){const sizes=[480,768,1024,1536];const size=sizes.find(s=>s>=width)||1536;return src.replace(/\.png$/,`-${size}.webp`);}
