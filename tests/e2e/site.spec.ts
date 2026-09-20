import {test,expect} from '@playwright/test';
test('project to estimate to saved collection to honest demo enquiry',async({page})=>{
 const bad:string[]=[];page.on('pageerror',error=>bad.push(error.message));const posts:string[]=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 await page.goto('/en/projects/the-oak-residence/');await page.getByRole('button',{name:'Save project',exact:true}).click();await expect(page.getByRole('button',{name:'Project saved',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Estimate a similar renovation',exact:true}).click();await expect(page.locator('#full-area')).toHaveValue('86');await page.locator('#full-area').fill('70');
 await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('radio',{name:/Complete/}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'See my estimate',exact:true}).click();
 await expect(page.locator('.price')).toHaveAttribute('data-low','63000');await expect(page.locator('.price')).toHaveAttribute('data-high','84000');await page.getByRole('button',{name:'Save estimate',exact:true}).click();
 await page.locator('header').getByLabel('Language',{exact:true}).selectOption('cs');await expect(page).toHaveURL(/\/cs\/estimate/);await expect(page.locator('html')).toHaveAttribute('lang','cs');await expect(page.locator('.price')).toHaveAttribute('data-low','63000');
 await page.locator('header').getByLabel('Jazyk',{exact:true}).selectOption('ru');await expect(page.locator('.price')).toHaveAttribute('data-low','63000');await page.locator('header').getByLabel('Язык',{exact:true}).selectOption('en');
 await page.getByRole('link',{name:'Discuss my estimate',exact:true}).click();await page.getByRole('checkbox',{name:'Include my saved projects and estimate'}).check();await expect(page.locator('.attached-preview')).toContainText('The Oak Residence');
 await page.getByLabel('Your name',{exact:true}).fill('Sample Visitor');await page.getByLabel('Email address',{exact:true}).fill('wrong');await page.getByLabel('Tell us about your space',{exact:true}).fill('Sample brief for a considered home.');await page.getByRole('button',{name:'Send project request'}).click();await expect(page.getByText('Enter a valid email address.')).toBeVisible();await expect(page.getByLabel('Your name',{exact:true})).toHaveValue('Sample Visitor');
 await page.locator('header').getByLabel('Language',{exact:true}).selectOption('ru');await expect(page.locator('#form-name')).toHaveValue('Sample Visitor');await page.locator('header').getByLabel('Язык',{exact:true}).selectOption('en');await page.getByLabel('Email address',{exact:true}).fill('sample@example.com');await page.getByRole('button',{name:'Send project request'}).click();await expect(page.getByRole('heading',{name:'Request received — demo mode.'})).toBeVisible();expect(posts).toEqual([]);
 const stored=await page.evaluate(()=>localStorage.getItem('forma-project-v1'));expect(stored).not.toContain('Sample Visitor');expect(stored).not.toContain('sample@example.com');expect(stored).not.toContain('Sample brief');
 await page.goto('/en/my-project/');await expect(page.locator('.project-card')).toHaveCount(1);await expect(page.locator('.price')).toHaveAttribute('data-high','84000');await page.reload();await expect(page.locator('.price')).toHaveAttribute('data-low','63000');expect(bad).toEqual([]);
});
test('catalogue filters, zero results and browser history',async({page})=>{await page.goto('/en/projects/');await expect(page.locator('.project-card')).toHaveCount(4);await page.getByLabel('Property type',{exact:true}).selectOption('house');await expect(page.locator('.project-card')).toHaveCount(1);await page.getByLabel('Floor area',{exact:true}).selectOption('compact');await expect(page.locator('.empty-state')).toBeVisible();await page.goBack();await expect(page.locator('.project-card')).toHaveCount(1);await page.goForward();await expect(page.locator('.empty-state')).toBeVisible();await page.getByRole('button',{name:'Reset filters'}).click();await expect(page.locator('.project-card')).toHaveCount(4);await page.goto('/en/projects/?style=unknown&size=bad&property=invalid');await expect(page.locator('.project-card')).toHaveCount(4);});
test('gallery arrows, escape and focus restoration',async({page})=>{await page.goto('/en/projects/the-oak-residence/');const open=page.getByRole('button',{name:'Open image gallery: The whole space'});await open.click();await expect(page.locator('dialog.lightbox')).toBeVisible();await page.keyboard.press('ArrowRight');await expect(page.locator('.lightbox-bottom p')).toContainText('2 / 2');await page.keyboard.press('Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('dialog'))).toBeTruthy();await page.keyboard.press('Escape');await expect(page.locator('dialog.lightbox')).not.toBeVisible();await expect(open).toBeFocused();});
test('mobile menu, theme and responsive layout',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/en/');await page.getByRole('button',{name:'Open menu'}).click();const menu=page.locator('dialog.mobile-menu');await expect(menu).toBeVisible();await menu.getByLabel('Appearance').selectOption('dark');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');const darkOption=menu.getByLabel('Appearance').locator('option[value=\"dark\"]');await expect(darkOption).toHaveCSS('color','rgb(244, 240, 232)');await expect(darkOption).toHaveCSS('background-color','rgb(34, 37, 33)');await menu.getByLabel('Language').selectOption('ru');await page.getByRole('button',{name:'Открыть меню'}).click();await expect(menu).toBeVisible();await expect(menu.getByLabel('Оформление')).toHaveValue('dark');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Открыть меню'})).toBeFocused();for(const width of [320,360,390,768,1024,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}});
test('system theme follows changes; explicit selection persists; manual area',async({page})=>{await page.emulateMedia({colorScheme:'dark'});await page.goto('/en/estimate/');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.locator('header').getByLabel('Appearance').selectOption('dark');await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.locator('#full-area').fill('151');await expect(page.getByRole('button',{name:'Continue',exact:true})).toBeDisabled();await expect(page.getByRole('link',{name:'Request an individual scope'})).toBeVisible();await expect(page.locator('.price')).toHaveCount(0);});
test('corrupt and blocked storage do not break selection',async({page})=>{await page.addInitScript(()=>localStorage.setItem('forma-project-v1','{broken'));await page.goto('/en/projects/');await page.getByRole('button',{name:'Save project',exact:true}).first().click();await page.locator('.saved-nav').click();await expect(page.locator('.project-card')).toHaveCount(1);await page.getByRole('button',{name:'Clear my project'}).click();await expect(page.locator('.project-card')).toHaveCount(0);});
test('storage refusal keeps in-memory behavior',async({page})=>{await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked')};Storage.prototype.setItem=()=>{throw new Error('blocked')};});await page.goto('/en/projects/');await page.getByRole('button',{name:'Save project',exact:true}).first().click();await page.locator('.saved-nav').click();await expect(page.locator('.project-card')).toHaveCount(1);await expect(page.getByRole('status')).toContainText('Browser storage is unavailable');});
test('static deep URLs, all locales, original and web images, 404',async({page,request})=>{for(const locale of ['en','cs','ru']){for(const path of ['projects/the-oak-residence/','journal/how-to-define-your-renovation-scope/','services/interior-design/']){const r=await page.goto(`/${locale}/${path}`);expect(r?.status()).toBe(200);await page.reload();await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('lang',locale);expect(await page.locator('main img').evaluateAll(imgs=>imgs.every(i=>(i as HTMLImageElement).complete&&(i as HTMLImageElement).naturalWidth>0))).toBeTruthy();}}for(const folder of ['oak-residence','quiet-city','soft-light-studio','courtyard-home'])for(const role of ['cover','detail']){expect((await request.get(`/images/projects/${folder}/${role}.png`)).status()).toBe(200);expect((await request.get(`/images/projects/${folder}/${role}-768.webp`)).status()).toBe(200);}for(const path of ['/en/projects/not-a-project/','/xx/','/missing/']){const r=await page.goto(path);expect(r?.status()).toBe(404);await expect(page.locator('h1')).toContainText('This space is still imagined.');}});


test('layout smoke across locales and common viewports',async({page})=>{
 const routes=['','projects/','estimate/','services/','process/','about/','journal/','contact/'];
 for(const width of [390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const locale of ['en','cs','ru']){
   for(const route of routes){
    const response=await page.goto(`/${locale}/${route}`);
    expect(response?.status(),`${locale}/${route} @ ${width}px`).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    const overflow=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,body:document.body.scrollWidth,viewport:innerWidth}));
    expect(Math.max(overflow.doc,overflow.body),`horizontal overflow at ${locale}/${route} @ ${width}px`).toBeLessThanOrEqual(overflow.viewport+1);
   }
  }
 }
});

test('key editorial blocks stay composed on desktop',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/ru/estimate/');
 const title=await page.locator('.page-heading-grid h1').boundingBox();
 const description=await page.locator('.page-heading-grid p').boundingBox();
 expect(title).not.toBeNull();expect(description).not.toBeNull();
 if(title&&description)expect(title.x+title.width).toBeLessThanOrEqual(description.x+1);
 await page.goto('/ru/');
 await expect(page.locator('.hero-copy')).toBeVisible();
 await expect(page.locator('.hero-carousel')).toBeVisible();
 await expect(page.locator('.manifesto-strip')).toHaveCount(0);
});

test('localized names and calmer editorial hierarchy',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('/ru/projects/the-oak-residence/');
 await expect(page.getByRole('heading',{level:1,name:'Дубовая резиденция'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Материалы, подобранные для проекта.'})).toBeVisible();
 await expect(page.getByText('Диалог фактур.')).toHaveCount(0);
 await page.goto('/ru/estimate/');
 await expect(page.getByRole('heading',{level:1,name:'Бюджет ремонта'})).toBeVisible();
 await expect(page.getByRole('radio',{name:/Полный/})).toBeVisible();
 await page.goto('/ru/services/');
 await expect(page.locator('.services-masthead h1')).toHaveText('Услуги');
 await expect(page.locator('.service-card-page')).toHaveCount(3);
 const masthead=await page.locator('.services-masthead').boundingBox();
 const firstService=await page.locator('.service-card-page').first().boundingBox();
 expect(masthead).not.toBeNull();expect(firstService).not.toBeNull();
 if(masthead&&firstService)expect(firstService.y-(masthead.y+masthead.height)).toBeLessThan(60);
 await page.goto('/ru/journal/');
 await expect(page.locator('.journal-masthead h1')).toHaveText('Журнал');
 await expect(page.locator('.journal-feature')).toBeVisible();
 await expect(page.locator('.journal-card')).toHaveCount(2);
 await page.goto('/ru/');
 await expect(page.locator('.saved-nav span')).toHaveCount(0);
});

test('final CTA opens genuinely different contact modes',async({page})=>{
 await page.goto('/ru/about/');
 const cta=page.locator('.final-cta');
 const brief=cta.getByRole('link',{name:/Заполнить подробный бриф/});
 const quick=cta.getByRole('link',{name:/Коротко описать задачу/});
 await expect(brief).toHaveAttribute('href','/ru/contact?mode=detailed#request');
 await expect(quick).toHaveAttribute('href','/ru/contact?mode=quick#request');
 await brief.click();
 await expect(page).toHaveURL(/\/ru\/contact\?mode=detailed#request/);
 await expect(page.locator('.contact-form-head')).toContainText('БРИФ ПРОЕКТА');
 await expect(page.getByLabel('Площадь',{exact:true})).toBeVisible();
 await page.goto('/ru/about/');
 await page.locator('.final-cta').getByRole('link',{name:/Коротко описать задачу/}).click();
 await expect(page).toHaveURL(/\/ru\/contact\?mode=quick#request/);
 await expect(page.locator('.contact-form-head')).toContainText('БЫСТРЫЙ СТАРТ');
 await expect(page.locator('.contact-intent-grid')).toBeVisible();
 await expect(page.getByLabel('Площадь',{exact:true})).toHaveCount(0);
});

test('services guide visitors by situation and use service-specific FAQ',async({page})=>{
 await page.goto('/ru/services/');
 await expect(page.locator('.service-chooser')).toBeVisible();
 await expect(page.locator('.service-recommendation h3')).toHaveText('Дизайн интерьера');
 await page.getByRole('tab',{name:/Жилью нужен серьёзный ремонт/}).click();
 await expect(page.locator('.service-recommendation h3')).toHaveText('Ремонт под ключ');
 await page.getByRole('tab',{name:/Ремонт уже сделан/}).click();
 await expect(page.locator('.service-recommendation h3')).toHaveText('Комплектация и декор');
 await expect(page.locator('.service-compare-row')).toHaveCount(4);
 await page.goto('/ru/services/interior-design/');
 await expect(page.locator('.faqs')).toContainText('Что я получу по итогам дизайн-проекта?');
 await expect(page.locator('.faqs')).not.toContainText('Онлайн-калькулятор показывает окончательную смету?');
 await page.goto('/ru/services/full-renovation/');
 await expect(page.locator('.faqs')).toContainText('Онлайн-калькулятор показывает окончательную смету?');
});

test('project cases have in-page navigation and preview image controls',async({page})=>{
 await page.goto('/ru/projects/the-oak-residence/');
 const nav=page.locator('.project-anchor-nav');
 await expect(nav).toBeVisible();
 await expect(nav.getByRole('link',{name:'Материалы'})).toHaveAttribute('href','#materials');
 await nav.getByRole('link',{name:'Материалы'}).click();
 await expect(page.locator('#materials')).toBeInViewport();
 await page.goto('/ru/projects/');
 const first=page.locator('.project-card').first();
 await expect(first.locator('.card-image-controls')).toBeVisible();
 await expect(first.locator('.card-image-controls span')).toHaveText('1 / 2');
 await first.locator('.card-image-arrow').last().click();
 await expect(first.locator('.card-image-controls span')).toHaveText('2 / 2');
});

test('saving a project gives a short visible confirmation',async({page})=>{
 await page.goto('/ru/projects/');
 await page.getByRole('button',{name:'Сохранить проект',exact:true}).first().click();
 await expect(page.locator('.save-toast')).toContainText('Добавлено в «Мой проект»');
 await expect(page.locator('.save-toast')).toBeVisible();
});
