'use client';

import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {L,t,type Locale} from '@/lib/i18n';
import {packageNames,projects,services} from '@/lib/content';
import {calculate,PRICING_VERSION} from '@/lib/pricing';
import {useProject,type FormDraft} from './state';
import {Icon} from './icons';
import {Price} from './estimate';

export function ContactForm({locale,enabled}:{locale:Locale;enabled:boolean}){
 const store=useProject();
 const form=store.form;
 const query=useSearchParams();
 const [errors,setErrors]=useState<Record<string,string>>({});
 const [status,setStatus]=useState<'idle'|'submitting'|'complete'>('idle');
 const formRef=useRef<HTMLFormElement>(null);
 const completeRef=useRef<HTMLDivElement>(null);
 const applied=useRef('');
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);

 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 useEffect(()=>{
   if(!store.ready||applied.current===query.toString()+'!')return;
   applied.current=query.toString()+'!';
   const service=services.find(s=>s.slug===query.get('service'))?.slug;
   const requestedMode=query.get('mode');
   const mode=requestedMode==='quick'||requestedMode==='detailed'?requestedMode:undefined;
   store.setForm({
     ...store.form,
     ...(mode?{mode}:{}),
     ...(service?{service}:{}),
     ...(query.get('context')==='estimate'&&store.estimate?{
       area:String(store.estimate.input.area),
       property:store.estimate.input.property,
       start:store.estimate.input.start,
     }:{}),
   });
 },[query,store]);

 function update<K extends keyof FormDraft>(key:K,value:FormDraft[K]){
   store.setForm({...form,[key]:value});
   if(errors[key])setErrors({...errors,[key]:''});
 }

 function submit(e:React.FormEvent){
   e.preventDefault();
   if(!enabled||status==='submitting')return;
   const next:Record<string,string>={};
   if(!form.name.trim())next.name='required';
   if(!form.email.trim())next.email='required';
   else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))next.email='invalidEmail';
   if(!form.message.trim())next.message='required';
   if(form.mode==='detailed'&&(!Number.isFinite(Number(form.area))||Number(form.area)<=0))next.area='invalidArea';
   setErrors(next);
   if(Object.keys(next).length){
     formRef.current?.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
     return;
   }
   setStatus('submitting');
   timer.current=setTimeout(()=>{
     setStatus('complete');
     setTimeout(()=>completeRef.current?.focus(),0);
   },350);
 }

 function field(key:'name'|'email'|'phone'|'area',type='text'){
   return <label className="field" htmlFor={`form-${key}`}>
     {t(locale,key)}
     <input
       id={`form-${key}`}
       name={key}
       type={type}
       autoComplete="off"
       inputMode={key==='email'?'email':key==='area'?'decimal':key==='phone'?'tel':'text'}
       maxLength={key==='area'?8:150}
       value={form[key]}
       onChange={e=>update(key,e.target.value)}
       aria-invalid={!!errors[key]}
       aria-describedby={errors[key]?`error-${key}`:undefined}
     />
     {errors[key]&&<span className="field-error" id={`error-${key}`}>{t(locale,errors[key] as 'required'|'invalidEmail'|'invalidArea')}</span>}
   </label>;
 }

 const attachedProjects=projects.filter(p=>store.ids.includes(p.id));
 const attachable=!!(attachedProjects.length||store.estimate);
 const validEstimate=store.estimate&&store.estimate.version===PRICING_VERSION&&calculate(store.estimate.input);
 const quickIntro=L(
   'Choose the closest option. You can stay unsure — the message is what matters.',
   'Vyberte nejbližší možnost. Nemusíte mít jasno — nejdůležitější je vaše zpráva.',
   'Выберите ближайший вариант. Необязательно знать всё заранее — важнее кратко описать задачу.'
 )[locale];
 const detailedIntro=L(
   'Use the full brief when you already know the property, timing and approximate scope.',
   'Podrobný formulář použijte, pokud už znáte objekt, termín a přibližný rozsah.',
   'Подробный бриф удобен, если уже понятны объект, сроки и примерный объём работ.'
 )[locale];

 return <div className="contact-layout" id="request">
   <aside className="contact-aside">
     <span className="eyebrow">FORMA / {t(locale,'contact')}</span>
     <h2>{L('Tell us where you are now.','Řekněte nám, kde právě jste.','Расскажите, на каком этапе вы сейчас.')[locale]}</h2>
     <p>{L('A short message is enough to start. If you already have a clear brief, switch to the detailed form.','Na začátek stačí krátká zpráva. Pokud už máte jasné zadání, přepněte na podrobný formulář.','Для первого шага достаточно короткого сообщения. Если задача уже понятна, переключитесь на подробный бриф.')[locale]}</p>
     <div className="studio-contact">
       <span className="eyebrow">{L('STUDIO CONTACT','KONTAKT NA STUDIO','СВЯЗЬ СО СТУДИЕЙ')[locale]}</span>
       <strong>+420 000 000 000</strong>
       <span>{L('Demo line · fictional number','Ukázková linka · fiktivní číslo','Демо-линия · вымышленный номер')[locale]}</span>
     </div>
     <div className="contact-note"><span className="status-dot"/>{t(locale,'demoForm')}</div>
     <Link className="text-link" href={`/${locale}/process`}>{t(locale,'process')}<Icon name="arrow"/></Link>
   </aside>

   <div>
   {status==='complete'?
     <div className="form-complete" ref={completeRef} tabIndex={-1}>
       <span className="complete-icon"><Icon name="check"/></span>
       <h2>{t(locale,'complete')}</h2>
       <p>{t(locale,'completeNote')}</p>
       <div className="lead-handoff"><span className="status-dot"/><p>{L('In a real studio, a project manager would now review the brief and contact the client to agree the next step.','Ve skutečném studiu by nyní projektový manažer prošel zadání a kontaktoval klienta kvůli dalšímu postupu.','В реальной студии менеджер сейчас изучил бы бриф и связался с клиентом, чтобы согласовать следующий шаг.')[locale]}</p></div>
       <button className="button" onClick={()=>setStatus('idle')}>{t(locale,'back')}<Icon name="arrow"/></button>
     </div>
   :
     <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
       <div className="contact-form-head">
         <span className="eyebrow">{form.mode==='quick'?L('QUICK START','RYCHLÝ START','БЫСТРЫЙ СТАРТ')[locale]:L('PROJECT BRIEF','PROJEKTOVÉ ZADÁNÍ','БРИФ ПРОЕКТА')[locale]}</span>
         <h3>{form.mode==='quick'?L('What do you need help with?','S čím potřebujete pomoci?','С чем вам нужна помощь?')[locale]:L('Tell us about the project.','Popište nám projekt.','Расскажите о проекте.')[locale]}</h3>
         <p>{form.mode==='quick'?quickIntro:detailedIntro}</p>
       </div>

       <fieldset className="form-mode">
         <legend className="sr-only">{t(locale,'scope')}</legend>
         {(['quick','detailed'] as const).map(mode=><label className={form.mode===mode?'selected':''} key={mode}>
           <input type="radio" name="mode" checked={form.mode===mode} onChange={()=>update('mode',mode)}/>
           {t(locale,mode)}
         </label>)}
       </fieldset>

       {Object.values(errors).some(Boolean)&&<div role="alert" className="error-summary">{t(locale,'errorSummary')}</div>}

       {form.mode==='quick'?<>
         <fieldset className="contact-intents">
           <legend>{L('Closest match','Nejbližší možnost','Что ближе всего к вашей задаче')[locale]}</legend>
           <div className="contact-intent-grid">
             {services.map(s=><label className={form.service===s.slug?'selected':''} key={s.slug}>
               <input type="radio" name="quick-service" value={s.slug} checked={form.service===s.slug} onChange={()=>update('service',s.slug)}/>
               <span><strong>{s.title[locale]}</strong><small>{s.short[locale]}</small></span>
             </label>)}
             <label className={form.service===''?'selected':''}>
               <input type="radio" name="quick-service" value="" checked={form.service===''} onChange={()=>update('service','')}/>
               <span><strong>{L('Not sure yet','Ještě si nejsem jistý/á','Пока не уверен(а)')[locale]}</strong><small>{L('Describe the situation and we will route it to the right service.','Popište situaci a zvolíme vhodnou službu.','Опишите ситуацию — этого достаточно, чтобы подобрать формат работы.')[locale]}</small></span>
             </label>
           </div>
         </fieldset>
         <div className="form-grid">{field('name')}{field('email','email')}</div>
       </>:<>
         <div className="form-grid">
           {field('name')}{field('email','email')}{field('phone','tel')}
           <label className="field">{t(locale,'service')}
             <select value={form.service} onChange={e=>update('service',e.target.value)}>
               <option value="">{L('Not sure yet','Ještě nevím','Пока не определился(ась)')[locale]}</option>
               {services.map(s=><option key={s.slug} value={s.slug}>{s.title[locale]}</option>)}
             </select>
           </label>
         </div>
         <div className="form-grid">
           <label className="field">{t(locale,'property')}
             <select value={form.property} onChange={e=>update('property',e.target.value as 'apartment'|'house')}>
               <option value="apartment">{t(locale,'apartment')}</option>
               <option value="house">{t(locale,'house')}</option>
             </select>
           </label>
           {field('area','number')}
           <label className="field full-width">{t(locale,'start')}
             <select value={form.start} onChange={e=>update('start',e.target.value)}>
               {(['exploring','soon','later','future'] as const).map(v=><option key={v} value={v}>{t(locale,v)}</option>)}
             </select>
           </label>
         </div>
       </>}

       <label className="field" htmlFor="form-message">
         {form.mode==='quick'?L('What would you like to change?','Co byste chtěli změnit?','Что вы хотите изменить?')[locale]:t(locale,'message')}
         <textarea id="form-message" name="message" rows={5} maxLength={3000} value={form.message} onChange={e=>update('message',e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message?'error-message':undefined}/>
         {errors.message&&<span className="field-error" id="error-message">{t(locale,'required')}</span>}
       </label>

       {form.mode==='detailed'&&attachable&&<div className="attach-box">
         <label className="checkbox"><input type="checkbox" checked={form.attach} onChange={e=>update('attach',e.target.checked)}/>{t(locale,'attach')}</label>
         {form.attach&&<div className="attached-preview"><strong>{t(locale,'attached')}</strong>
           {attachedProjects.map(p=><p key={p.id}>{p.title[locale]} · {p.area} m²<button type="button" className="text-button" onClick={()=>store.toggle(p.id)}>{t(locale,'remove')} ×</button></p>)}
           {store.estimate&&(validEstimate?<><p>{t(locale,'savedEstimate')}: {store.estimate.input.area} m² · {packageNames[store.estimate.input.package][locale]}</p><Price input={store.estimate.input} locale={locale}/></>:<p>{t(locale,'stale')} <Link href={`/${locale}/my-project`}>{t(locale,'refresh')} →</Link></p>)}
         </div>}
       </div>}

       <p className="demo-disclaimer">{t(locale,'demoForm')}</p>
       {!enabled&&<p className="error-summary" role="alert">{t(locale,'productionOff')}</p>}
       <button type="submit" className="button" disabled={!enabled||status==='submitting'}>{t(locale,status==='submitting'?'submitting':'submit')}<Icon name="arrow"/></button>
       <p className="small-text form-privacy"><Link href={`/${locale}/privacy`}>{t(locale,'privacy')} →</Link></p>
     </form>}
   </div>
 </div>;
}
