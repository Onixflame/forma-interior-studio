'use client';
import {useEffect,useRef,useState} from 'react';
import {L,type Locale} from '@/lib/i18n';
import {detectSupportLanguage,getSupportReply,type SupportLanguage} from '@/lib/demo-chat';
import {Icon} from './icons';

type Message={id:number;from:'user'|'assistant';text:string;language:SupportLanguage};
const ui={
 title:L('FORMA support','Podpora FORMA','Поддержка FORMA'),
 subtitle:L('Demo assistant · no real operator','Ukázkový asistent · bez skutečného operátora','Демо-помощник · без реального оператора'),
 open:L('Open support chat','Otevřít chat podpory','Открыть чат поддержки'),
 close:L('Close support chat','Zavřít chat podpory','Закрыть чат поддержки'),
 placeholder:L('Write a message…','Napište zprávu…','Напишите сообщение…'),
 send:L('Send','Odeslat','Отправить'),
 note:L('Demo only. Messages stay in this browser.','Pouze demo. Zprávy zůstávají v tomto prohlížeči.','Только демо. Сообщения остаются в этом браузере.'),
 welcome:L('Hello! I’m the FORMA demo assistant. Write in English, Czech, or Russian.','Dobrý den! Jsem ukázkový asistent FORMA. Napište česky, anglicky nebo rusky.','Здравствуйте! Я демонстрационный помощник FORMA. Напишите по-русски, по-чешски или по-английски.'),
};

export function SupportChat({locale}:{locale:Locale}){
 const [open,setOpen]=useState(false),[value,setValue]=useState(''),[typing,setTyping]=useState(false);
 const [messages,setMessages]=useState<Message[]>([{id:1,from:'assistant',text:ui.welcome[locale],language:locale}]);
 const nextId=useRef(2),timer=useRef<ReturnType<typeof setTimeout>|null>(null),endRef=useRef<HTMLDivElement>(null),inputRef=useRef<HTMLInputElement>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 useEffect(()=>{if(open){endRef.current?.scrollIntoView({block:'nearest'});setTimeout(()=>inputRef.current?.focus(),0);}},[open,messages,typing]);
 function submit(e:React.FormEvent){
  e.preventDefault();const text=value.trim();if(!text||typing)return;
  const language=detectSupportLanguage(text);setMessages(old=>[...old,{id:nextId.current++,from:'user',text,language}]);setValue('');setTyping(true);
  timer.current=setTimeout(()=>{setMessages(old=>[...old,{id:nextId.current++,from:'assistant',text:getSupportReply(text,language),language}]);setTyping(false);},420);
 }
 return <div className={`support-chat ${open?'is-open':''}`}>
  {open&&<section className="support-panel" role="dialog" aria-label={ui.title[locale]}>
   <header className="support-head"><div><strong>{ui.title[locale]}</strong><span>{ui.subtitle[locale]}</span></div><button type="button" className="icon-button" onClick={()=>setOpen(false)} aria-label={ui.close[locale]}><Icon name="close"/></button></header>
   <div className="support-messages" aria-live="polite">{messages.map(message=><div className={`support-message ${message.from}`} key={message.id}><span>{message.text}</span></div>)}{typing&&<div className="support-message assistant support-typing" aria-label="typing"><span>•••</span></div>}<div ref={endRef}/></div>
   <form className="support-form" onSubmit={submit}><input ref={inputRef} value={value} maxLength={600} onChange={e=>setValue(e.target.value)} placeholder={ui.placeholder[locale]} aria-label={ui.placeholder[locale]}/><button type="submit" className="button small" disabled={!value.trim()||typing}>{ui.send[locale]}</button></form>
   <p className="support-note">{ui.note[locale]}</p>
  </section>}
  <button type="button" className="support-launcher" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?ui.close[locale]:ui.open[locale]}><span className="support-dot" aria-hidden="true"/>{open?<Icon name="close"/>:<span>{L('Chat','Chat','Чат')[locale]}</span>}</button>
 </div>;
}
