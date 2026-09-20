'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {projects,styles,imagePath} from '@/lib/content';
import {L,t,type Locale} from '@/lib/i18n';
import {Icon} from './icons';

export function HeroCarousel({locale}:{locale:Locale}){
  const [index,setIndex]=useState(0);
  const project=projects[index];
  const previous=()=>setIndex(value=>(value-1+projects.length)%projects.length);
  const next=()=>setIndex(value=>(value+1)%projects.length);

  return <figure className="hero-carousel">
    <div className="hero-carousel-media">
      <Image
        key={project.id}
        className="hero-carousel-image"
        src={imagePath(project)}
        alt={project.alts[0][locale]}
        width={1536}
        height={1024}
        sizes="(max-width: 760px) 100vw, 60vw"
        priority={index===0}
      />
      <span className="hero-image-label">{t(locale,'concept')}</span>
      <div className="hero-carousel-controls" aria-label={L('Featured projects','Vybrané projekty','Избранные проекты')[locale]}>
        <button type="button" className="carousel-arrow carousel-arrow-prev" onClick={previous} aria-label={t(locale,'previous')}><Icon name="arrow"/></button>
        <button type="button" className="carousel-arrow" onClick={next} aria-label={t(locale,'nextImage')}><Icon name="arrow"/></button>
      </div>
      <div className="hero-carousel-dots" aria-hidden="true">
        {projects.map((item,i)=><span key={item.id} className={i===index?'active':''}/>) }
      </div>
    </div>
    <figcaption aria-live="polite">
      <span><strong>{project.title[locale]}</strong><span>{project.area} m² · {styles[project.style][locale]}</span></span>
      <Link href={`/${locale}/projects/${project.slug}`} aria-label={`${t(locale,'viewProject')}: ${project.title[locale]}`}><Icon name="arrow"/></Link>
    </figcaption>
  </figure>;
}
