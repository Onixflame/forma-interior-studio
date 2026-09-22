'use client';

import Link from 'next/link';
import {useState} from 'react';
import {services} from '@/lib/content';
import {L,type Locale} from '@/lib/i18n';
import {Icon} from './icons';

type Situation='new'|'refresh'|'finish';

const situations:{id:Situation;title:ReturnType<typeof L>;text:ReturnType<typeof L>;service:string;note:ReturnType<typeof L>}[]=[
  {
    id:'new',
    title:L('I have a new or empty property','Mám nový nebo prázdný prostor','У меня новая квартира или помещение без отделки'),
    text:L('Start with the layout and interior concept before committing to finishes or construction.','Začněte dispozicí a návrhem interiéru ještě před výběrem povrchů nebo realizací.','Сначала стоит продумать планировку и интерьерную концепцию, а уже потом переходить к отделке и ремонту.'),
    service:'interior-design',
    note:L('Start with interior design. A renovation scope can be added once the layout and priorities are agreed.','Začněte návrhem interiéru. Rozsah renovace lze doplnit po schválení dispozice a priorit.','Начните с дизайна интерьера. Объём ремонта можно определить после согласования планировки и приоритетов.'),
  },
  {
    id:'refresh',
    title:L('My home needs a substantial update','Domov potřebuje výraznou změnu','Жилью нужен серьёзный ремонт'),
    text:L('Use a coordinated renovation path when finishes, systems and several rooms need to change together.','Koordinovaná renovace dává smysl, pokud se mění povrchy, rozvody i více místností současně.','Подходит, когда нужно комплексно обновить отделку, несколько помещений и связать все работы в один процесс.'),
    service:'full-renovation',
    note:L('Start with a full-renovation scope, then verify the property before requesting a real quote.','Začněte rozsahem kompletní renovace a před skutečnou nabídkou ověřte stav objektu.','Начните с объёма полного ремонта, а перед реальной сметой проверьте состояние объекта.'),
  },
  {
    id:'finish',
    title:L('The space is finished, but it does not feel complete','Prostor je hotový, ale něco mu chybí','Ремонт уже сделан, но интерьер выглядит незавершённым'),
    text:L('Focus on furniture, lighting, textiles and the final layer instead of reopening the whole renovation.','Zaměřte se na nábytek, světla, textilie a poslední vrstvu místo nové kompletní renovace.','Лучше сосредоточиться на мебели, свете, текстиле и декоре, не затевая новый ремонт.'),
    service:'furnishing',
    note:L('Start with furnishing & styling. Existing pieces can be kept and coordinated with the new selection.','Začněte vybavením a stylingem. Stávající kusy lze zachovat a sladit s novým výběrem.','Начните с комплектации и декора. Существующие предметы можно сохранить и согласовать с новым подбором.'),
  },
];

export function ServiceChooser({locale}:{locale:Locale}){
  const [selected,setSelected]=useState<Situation>('new');
  const current=situations.find(item=>item.id===selected)!;
  const service=services.find(item=>item.slug===current.service)!;

  return <section className="service-chooser" aria-labelledby="service-chooser-title">
    <div className="service-chooser-copy">
      <span className="eyebrow">{L('FIND YOUR STARTING POINT','NAJDĚTE VÝCHOZÍ BOD','С ЧЕГО НАЧАТЬ')[locale]}</span>
      <h2 id="service-chooser-title">{L('Which situation is closest to yours?','Která situace je vám nejbližší?','Какая ситуация ближе к вашей?')[locale]}</h2>
      <p>{L('Choose the situation that matches your space. The recommendation updates on this page.','Vyberte situaci, která odpovídá vašemu prostoru. Doporučení se aktualizuje přímo na této stránce.','Выберите ситуацию, которая подходит вашему объекту. Рекомендация обновится прямо на странице.')[locale]}</p>
    </div>
    <div className="service-chooser-ui">
      <div className="situation-tabs" role="tablist" aria-label={L('Project situation','Situace projektu','Ситуация проекта')[locale]}>
        {situations.map(item=><button key={item.id} type="button" role="tab" aria-selected={selected===item.id} className={selected===item.id?'active':''} onClick={()=>setSelected(item.id)}>
          <strong>{item.title[locale]}</strong>
          <span>{item.text[locale]}</span>
        </button>)}
      </div>
      <div className="service-recommendation" role="tabpanel" aria-live="polite">
        <span className="eyebrow">{L('RECOMMENDED START','DOPORUČENÝ ZAČÁTEK','РЕКОМЕНДУЕМЫЙ СТАРТ')[locale]}</span>
        <h3>{service.title[locale]}</h3>
        <p>{current.note[locale]}</p>
        <div className="service-recommendation-actions">
          <Link className="button" href={`/${locale}/services/${service.slug}`}>{L('See this service','Zobrazit službu','Посмотреть услугу')[locale]}<Icon name="arrow"/></Link>
          <Link className="text-link" href={`/${locale}/contact?mode=quick&service=${service.slug}#request`}>{L('Ask a quick question','Položit krátký dotaz','Задать короткий вопрос')[locale]}<Icon name="arrow"/></Link>
        </div>
      </div>
    </div>
  </section>;
}
