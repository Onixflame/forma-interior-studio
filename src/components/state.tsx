'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { defaults, normalizeInput, PRICING_VERSION, type EstimateInput } from '@/lib/pricing';
import { projects } from '@/lib/content';
export type SavedEstimate = { input:EstimateInput; version:string; date:string };
export type FormDraft = { name:string; email:string; phone:string; message:string; service:string; mode:'quick'|'detailed'; area:string; property:'apartment'|'house'; start:string; attach:boolean };
const emptyForm:FormDraft = {name:'',email:'',phone:'',message:'',service:'',mode:'quick',area:'70',property:'apartment',start:'exploring',attach:false};
type Store = { ids:string[]; toggle:(id:string)=>void; draft:EstimateInput; setDraft:(v:EstimateInput)=>void; estimate:SavedEstimate|null; saveEstimate:(v:EstimateInput)=>void; clear:()=>void; ready:boolean; unavailable:boolean; notes:string; setNotes:(v:string)=>void; form:FormDraft; setForm:(v:FormDraft)=>void };
const Context = createContext<Store|null>(null);
export function ProjectProvider({children}:{children:ReactNode}) {
 const [ids,setIds]=useState<string[]>([]),[draft,setDraft]=useState<EstimateInput>(defaults),[estimate,setEstimate]=useState<SavedEstimate|null>(null),[ready,setReady]=useState(false),[unavailable,setUnavailable]=useState(false),[notes,setNotes]=useState(''),[form,setForm]=useState<FormDraft>(emptyForm);
 useEffect(()=>{try{const raw=localStorage.getItem('forma-project-v1');if(raw){const data=JSON.parse(raw);if(data.schema===1){setIds(Array.isArray(data.ids)?[...new Set<string>(data.ids.filter((id:unknown)=>typeof id==='string'&&projects.some(p=>p.id===id)))].slice(0,12):[]);if(data.draft&&typeof data.draft==='object')setDraft(normalizeInput(data.draft));if(data.estimate?.input&&typeof data.estimate.version==='string'&&typeof data.estimate.date==='string'&&!Number.isNaN(Date.parse(data.estimate.date)))setEstimate({input:normalizeInput(data.estimate.input),version:data.estimate.version,date:data.estimate.date});}}}catch{setUnavailable(true);}setReady(true);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem('forma-project-v1',JSON.stringify({schema:1,ids,draft,estimate}));}catch{setUnavailable(true);}},[ids,draft,estimate,ready]);
 return <Context.Provider value={{ids,draft,setDraft,estimate,ready,unavailable,notes,setNotes,form,setForm,toggle:(id)=>setIds(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id].slice(0,12)),saveEstimate:(input)=>setEstimate({input,version:PRICING_VERSION,date:new Date().toISOString()}),clear:()=>{setIds([]);setEstimate(null);setDraft(defaults);setNotes('');setForm(emptyForm);},}}>{children}</Context.Provider>;
}
export function useProject(){const store=useContext(Context);if(!store)throw new Error('ProjectProvider missing');return store;}
