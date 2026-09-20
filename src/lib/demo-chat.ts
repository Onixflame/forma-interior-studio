export type SupportLanguage='en'|'cs'|'ru';

const czechWords=/\b(ahoj|dobr(?:y|ý)\s+den|prosim|prosím|dekuji|děkuji|potrebuji|potřebuji|chtel|chtěl|chtela|chtěla|chci|mohu|muzu|můžu|kolik|cena|stoj|rozpocet|rozpočet|odhad|byt|dum|dům|rekonstrukce|interier|interiér|vybaveni|vybavení|termin|termín|kdy|cesky|česky)\b/i;

export function detectSupportLanguage(message:string):SupportLanguage{
 const text=message.trim();
 if(/[А-Яа-яЁё]/.test(text))return 'ru';
 if(/[ěščřžýáíéúůťďňó]/i.test(text)||czechWords.test(text))return 'cs';
 return 'en';
}

const patterns={
 greeting:/(hello|hi|hey|good\s+(morning|afternoon|evening)|ahoj|dobr(?:y|ý)\s+den|привет|здравств|добрый\s+(день|вечер|утро))/i,
 price:/(price|cost|budget|estimate|pricing|cena|stoj|rozpocet|rozpočet|odhad|цена|стои|бюджет|смет|расч[её]т)/i,
 timeline:/(when|time|timeline|start|availability|term[ií]n|kdy|za[cč][ií]t|dostupnost|срок|когда|нача|время|доступн)/i,
 human:/(human|person|manager|call|phone|contact|agent|clov[eě]k|mana[zž]er|telefon|kontakt|zavolat|менедж|человек|оператор|связ|телефон|позвон)/i,
 services:/(renovation|interior|furnishing|service|rekonstrukce|interi[eé]r|vybaven[ií]|slu[zž]b|ремонт|дизайн|интерьер|комплект|услуг)/i,
};

const replies={
 en:{
  greeting:'Hello! I’m FORMA’s demo assistant. Ask me about services, an indicative budget, timing, or the next step.',
  price:'For an indicative budget, use the renovation estimator. In a real enquiry, a project manager would review the brief before confirming any price.',
  timeline:'Timing depends on the project scope. In a real enquiry, the studio would confirm availability after reviewing your brief.',
  human:'This is a portfolio demo, so no real agent is connected. The phone number shown on the contact page is fictional and no message leaves this browser.',
  services:'FORMA presents three demo services: full renovation, interior design, and furnishing. Tell me which one you are considering.',
  fallback:'Thanks — I’ve noted your message. This is a portfolio demo, so nothing is sent to a real support team. You can ask about price, timing, services, or the next step.',
 },
 cs:{
  greeting:'Dobrý den! Jsem ukázkový asistent FORMA. Můžete se zeptat na služby, orientační rozpočet, termín nebo další postup.',
  price:'Orientační rozpočet si můžete spočítat v kalkulátoru renovace. U skutečné poptávky by projektový manažer nejprve prošel zadání a teprve potom potvrdil cenu.',
  timeline:'Termín závisí na rozsahu projektu. U skutečné poptávky by studio po prostudování zadání potvrdilo svou dostupnost.',
  human:'Toto je portfoliové demo, takže zde není připojen skutečný operátor. Telefon na kontaktní stránce je fiktivní a žádná zpráva neopouští tento prohlížeč.',
  services:'FORMA v této ukázce nabízí tři služby: kompletní renovaci, návrh interiéru a vybavení. Napište mi, která vás zajímá.',
  fallback:'Děkuji — zprávu jsem zaznamenal. Jde o portfoliové demo, takže se nic neposílá skutečné podpoře. Můžete se zeptat na cenu, termín, služby nebo další postup.',
 },
 ru:{
  greeting:'Здравствуйте! Я демонстрационный помощник FORMA. Можете спросить об услугах, примерном бюджете, сроках или следующем шаге.',
  price:'Примерный бюджет можно посмотреть в калькуляторе ремонта. В реальной заявке менеджер сначала изучил бы бриф и только потом подтвердил стоимость.',
  timeline:'Сроки зависят от объёма проекта. В реальной заявке студия подтвердила бы доступные даты после изучения брифа.',
  human:'Это портфолио-демо, поэтому реальный оператор к чату не подключён. Телефон на странице контактов вымышленный, а сообщения не покидают браузер.',
  services:'В демо FORMA представлены три услуги: полный ремонт, дизайн интерьера и комплектация. Напишите, что именно вас интересует.',
  fallback:'Спасибо — сообщение принято. Это портфолио-демо, поэтому оно не отправляется реальной службе поддержки. Можно спросить о цене, сроках, услугах или следующем шаге.',
 },
} as const;

export function getSupportReply(message:string,language:SupportLanguage=detectSupportLanguage(message)){
 const text=message.trim();
 const intent=(Object.keys(patterns) as Array<keyof typeof patterns>).find(key=>patterns[key].test(text));
 return replies[language][intent||'fallback'];
}
