'use strict';
// Статическая анкета: ответы хранятся только в памяти вкладки и передаются,
// только если посетитель сам подтвердит отправку в Telegram или MAX.
(() => {
  const TG_PERSONAL = 'helen_zukova';
  const MAX_PERSONAL = 'https://max.ru/u/f9LHodD0cOK-BUh8pOX4TepOoqHfVI5nIlJVYGdp6SrD3JClT3jyDaALXKU';
  const interestChoices = [
    ['house_build','Построить дом с подрядчиком'],['ready_house','Купить готовый загородный дом'],
    ['plot','Купить земельный участок'],['newbuild','Купить квартиру в новостройке'],
    ['sell','Продать недвижимость'],['unsure','Сравниваю разные варианты']
  ];
  const aimChoices = [
    ['bigger','Больше пространства и удобства'],['family','Улучшить условия для семьи'],
    ['country','Жить за городом, ближе к природе'],['change','Переехать в другой район или город'],
    ['investment','Инвестиция / сдача в аренду'],['other','Другая задача / пока не решил(а)']
  ];
  const budgetChoices = [['under5','До 5 млн ₽'],['5-8','5–8 млн ₽'],['8-12','8–12 млн ₽'],['12-20','12–20 млн ₽'],['20plus','Более 20 млн ₽'],['unknown','Пока не определился(ась)']];
  const payChoices = [['cash','Свои средства'],['family','Семейная ипотека'],['mortgage','Другая ипотека'],['sale','Сначала продать имеющееся жильё'],['mixed','Несколько источников'],['unknown','Нужна помощь с вариантами оплаты']];
  const timingChoices = [['now','Как можно скорее'],['1-3','В ближайшие 1–3 месяца'],['3-6','Через 3–6 месяцев'],['6plus','Через полгода или позже'],['explore','Пока изучаю возможности']];
  const priorityChoices = [['price','Бюджет и расходы'],['plan','Удобная планировка'],['location','Расположение и транспорт'],['family','Школы, сады и окружение'],['quality','Качество строительства'],['land','Участок, природа, приватность'],['timing','Сроки переезда'],['safety','Документы и безопасность']];
  const store = {
    interest:'',location:'',aim:'',budget:'',payment:'',timing:'',priorities:[],details:'',name:'',phone:'',
    landStatus:'',floors:'',houseArea:'',bedrooms:'',office:'',garage:'',houseExtras:[],materials:'',finish:'',
    plotSize:'',plotUtilities:[],flatRooms:'',flatFinish:'',saleType:'',planChoice:'',archStyle:''
  };
  const floorsChoices = [['1','Один этаж — всё рядом'],['2','Два этажа — больше зонирования'],['any','Пока не знаю / рассмотрю оба варианта']];
  const areaChoices = [['small','До 90 м²'],['medium','90–120 м²'],['large','120–150 м²'],['xl','150–190 м²'],['xxl','Более 190 м²'],['any','Пока не определились']];
  const bedroomChoices = [['2','Две спальни'],['3','Три спальни'],['4','Четыре и больше'],['any','Пока не знаю']];
  const officeChoices = [['yes','Да, отдельный кабинет'],['flex','Можно совместить с гостевой'],['no','Нет, не нужен'],['any','Пока не знаю']];
  const garageChoices = [['built','Да, встроенный / пристроенный'],['separate','Да, отдельно стоящий'],['canopy','Достаточно навеса'],['parking','Открытая парковка'],['any','Пока не решил(а)']];
  const extraChoices = [['terrace','Терраса'],['laundry','Постирочная'],['pantry','Кладовая'],['wardrobe','Гардеробная'],['boiler','Котельная'],['bath2','Второй санузел'],['guest','Гостевая спальня'],['bathhouse','Баня / сауна'],['none','Ничего дополнительного']];
  const plotStatusChoices = [['have','Участок уже есть'],['need','Нужно подобрать участок'],['choosing','Присматриваюсь к участкам'],['any','Пока не решил(а)']];
  const materialsChoices = [['blocks','Газобетон / блоки'],['brick','Кирпич / керамика'],['frame','Каркасная технология'],['wood','Брус / дерево'],['unknown','Хочу сравнить технологии']];
  const finishChoices = [['shell','Коробка / без отделки'],['whitebox','Предчистовая отделка'],['turnkey','Под ключ, чтобы можно было жить'],['any','Нужна помощь в выборе']];
  const archStyleChoices = [
    ['contemporary','Современный минималистичный дом'],
    ['barnhouse','Барнхаус'],
    ['scandinavian','Скандинавский дом'],
    ['cottage','Классический коттедж'],
    ['family2','Просторный двухэтажный дом с гаражом'],
    ['unsure','Пока не знаю / хочу сравнить']
  ];
  const houseStyles = [
    {id:'contemporary', title:'Современный минималистичный дом', note:'Чистые линии, светлый фасад, ощущение простора', img:'assets/style-contemporary.webp'},
    {id:'barnhouse', title:'Барнхаус', note:'Лаконичная форма, тёмный фасад, большие окна', img:'assets/style-barnhouse.webp'},
    {id:'scandinavian', title:'Скандинавский дом', note:'Светлый фасад, дерево, спокойный тёплый образ', img:'assets/style-scandinavian.webp'},
    {id:'cottage', title:'Классический коттедж', note:'Уютный семейный стиль, крыльцо и мягкая классика', img:'assets/style-cottage.webp'},
    {id:'family2', title:'Просторный двухэтажный дом с гаражом', note:'Для большой семьи, больше зонирования и хранения', img:'assets/style-family-two-story.webp'}
  ];
  const flatRoomsChoices = [['studio','Студия'],['1','1 комната'],['2','2 комнаты'],['3','3 комнаты'],['4','4 и более комнат'],['any','Пока не определились']];
  const saleTypeChoices = [['flat','Квартира'],['house','Дом'],['plot','Земельный участок'],['other','Другой объект']];
  const landSizeChoices = [['under6','До 6 соток'],['6-10','6–10 соток'],['10-15','10–15 соток'],['15plus','Более 15 соток'],['any','Пока не знаю']];
  const utilityChoices = [['electric','Электричество'],['gas','Газ'],['water','Водоснабжение'],['road','Хорошая дорога'],['internet','Интернет'],['any','Нужна консультация']];

  // Каждая схема — иллюстрация для обсуждения пожеланий, а не рабочий проект,
  // реальное предложение подрядчика или планировка конкретного продаваемого дома.
  const R = (label,x,y,w,h) => ({label,x,y,w,h});
  const layouts = {
    one2:[[
      R('Кухня-\nгостиная',0,0,7,5),R('Спальня 1',7,0,5,3),R('Спальня 2',7,3,5,3),
      R('С/у',0,5,3,3),R('Прихожая',3,5,4,3),R('Хоз.',7,6,5,2)
    ]],
    one3:[[
      R('Кухня-\nгостиная',0,0,7,4),R('Спальня 1',7,0,5,3),R('Спальня 2',7,3,5,3),
      R('Спальня 3',0,4,4,4),R('С/у',4,4,3,2),R('Холл',4,6,5,2),R('Тех.',9,6,3,2)
    ]],
    one3office:[[
      R('Кухня-\nгостиная',0,0,7,4),R('Спальня 1',7,0,5,3),R('Спальня 2',7,3,5,3),
      R('Спальня 3',0,4,4,4),R('Кабинет',4,4,4,2),R('С/у',4,6,4,2),R('Холл',8,6,4,2)
    ]],
    one3garage:[[
      R('Гараж',0,0,4,5),R('Кухня-\nгостиная',4,0,5,4),R('Спальня 1',9,0,3,4),
      R('Спальня 2',0,5,4,3),R('Спальня 3',4,4,4,4),R('Кабинет',8,4,4,2),R('С/у, холл',8,6,4,2)
    ]],
    two3:[[
      R('Кухня-\nгостиная',0,0,7,5),R('Холл',7,0,5,3),R('С/у',7,3,5,2),R('Прихожая',0,5,5,3),R('Хоз. зона',5,5,7,3)
    ],[
      R('Спальня 1',0,0,6,4),R('Спальня 2',6,0,6,4),R('Спальня 3',0,4,5,4),R('С/у',5,4,3,4),R('Холл',8,4,4,4)
    ]],
    two3office:[[
      R('Кухня-\nгостиная',0,0,7,5),R('Кабинет',7,0,5,3),R('С/у',7,3,5,2),R('Прихожая',0,5,5,3),R('Холл',5,5,7,3)
    ],[
      R('Спальня 1',0,0,6,4),R('Спальня 2',6,0,6,4),R('Спальня 3',0,4,5,4),R('С/у',5,4,3,4),R('Холл',8,4,4,4)
    ]],
    two4:[[
      R('Кухня-\nгостиная',0,0,7,5),R('Спальня 4',7,0,5,3),R('С/у',7,3,5,2),R('Прихожая',0,5,5,3),R('Холл',5,5,7,3)
    ],[
      R('Спальня 1',0,0,6,4),R('Спальня 2',6,0,6,4),R('Спальня 3',0,4,5,4),R('С/у',5,4,3,4),R('Холл',8,4,4,4)
    ]],
    two4office:[[
      R('Кухня-\nгостиная',0,0,7,5),R('Кабинет',7,0,5,3),R('С/у',7,3,5,2),R('Прихожая',0,5,5,3),R('Холл',5,5,7,3)
    ],[
      R('Спальня 1',0,0,6,4),R('Спальня 2',6,0,6,4),R('Спальня 3',0,4,5,4),R('Спальня 4',5,4,4,4),R('С/у, холл',9,4,3,4)
    ]],
    two4garage:[[
      R('Гараж',0,0,4,5),R('Кухня-\nгостиная',4,0,8,4),R('Кабинет',4,4,4,4),R('С/у, холл',8,4,4,4),R('Прихожая',0,5,4,3)
    ],[
      R('Спальня 1',0,0,6,4),R('Спальня 2',6,0,6,4),R('Спальня 3',0,4,5,4),R('Спальня 4',5,4,4,4),R('С/у, холл',9,4,3,4)
    ]],
    two5garage:[[
      R('Гараж',0,0,4,5),R('Кухня-\nгостиная',4,0,8,4),R('Кабинет',4,4,4,4),R('С/у, холл',8,4,4,4),R('Прихожая',0,5,4,3)
    ],[
      R('Спальня 1',0,0,4,4),R('Спальня 2',4,0,4,4),R('Спальня 3',8,0,4,4),R('Спальня 4',0,4,4,4),R('Спальня 5',4,4,4,4),R('С/у, холл',8,4,4,4)
    ]]
  };
  const plans = [
    {id:'h076',title:'Тёплый минимум',area:76,stories:1,beds:2,office:false,garage:false,template:'one2',short:'Две спальни и общая кухня-гостиная'},
    {id:'h091',title:'Для семьи',area:91,stories:1,beds:3,office:false,garage:false,template:'one3',short:'Три спальни, всё на одном уровне'},
    {id:'h108',title:'Семейный комфорт',area:108,stories:1,beds:3,office:true,garage:false,template:'one3office',short:'Три спальни и кабинет'},
    {id:'h118',title:'Компактные два этажа',area:118,stories:2,beds:3,office:false,garage:false,template:'two3',short:'Отдельная тихая зона на втором этаже'},
    {id:'h136',title:'Работа из дома',area:136,stories:2,beds:3,office:true,garage:false,template:'two3office',short:'Кабинет внизу, спальни наверху'},
    {id:'h148',title:'Просторный одноэтажный',area:148,stories:1,beds:3,office:true,garage:false,template:'one3office',short:'Большая общая зона и кабинет'},
    {id:'h161',title:'Большая семья',area:161,stories:2,beds:4,office:false,garage:false,template:'two4',short:'Четыре спальни и два уровня'},
    {id:'h178',title:'Дом с гаражом',area:178,stories:1,beds:3,office:true,garage:true,template:'one3garage',short:'Одноэтажный дом с местом для машины'},
    {id:'h189',title:'Всё предусмотрели',area:189,stories:2,beds:4,office:true,garage:false,template:'two4office',short:'Кабинет и четыре спальни'},
    {id:'h214',title:'Простор с гаражом',area:214,stories:2,beds:4,office:true,garage:true,template:'two4garage',short:'Гараж, кабинет и четыре спальни'},
    {id:'h242',title:'Для большой семьи',area:242,stories:2,beds:5,office:true,garage:true,template:'two5garage',short:'Пять спален, кабинет и гараж'}
  ];
  let planExpanded=false;
  let step=0;
  const form=document.getElementById('quiz-form');
  const question=document.getElementById('quiz-question');
  const error=document.getElementById('quiz-error');
  const back=document.getElementById('back-btn');
  const next=document.getElementById('next-btn');
  const progress=document.getElementById('quiz-progress');
  const progressFill=document.getElementById('quiz-progress-fill');
  const result=document.getElementById('quiz-result');
  const resultText=document.getElementById('result-text');
  const status=document.getElementById('result-status');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label=(opts,v)=>opts.find(o=>o[0]===v)?.[1] || 'Не указано';
  const isHome=()=>['house_build','ready_house'].includes(store.interest);
  const isSale=()=>store.interest==='sell';
  function getSteps(){
    // Для домов сначала интересная часть — комнаты и планировки, затем финансы и сроки.
    if(isHome()){
      const s=['interest','location'];
      if(store.interest==='house_build')s.push('landStatus');
      s.push('floors','houseArea','bedrooms','office','garage','planChoice','archStyle','houseExtras',
        'aim','budget','payment','timing');
      if(store.interest==='house_build')s.push('materials','finish');
      return [...s,'priorities','details','contact'];
    }
    const s=['interest','location','aim','budget','payment','timing'];
    if(store.interest==='plot')s.push('plotSize','plotUtilities');
    else if(store.interest==='newbuild')s.push('flatRooms','flatFinish');
    else if(isSale())s.push('saleType');
    return [...s,'priorities','details','contact'];
  }
  function field(title,id,hint='',max=180){return `<label class="quiz-field" for="${id}"><span>${title}</span><input id="${id}" type="text" value="${esc(store[id])}" maxlength="${max}" placeholder="${esc(hint)}" autocomplete="off"></label>`;}
  function optionHTML(opts,key,multiple=false,max=null){
    return `<fieldset class="option-list${opts.length>4?' two-col':''}" aria-label="Варианты ответа">${opts.map(([v,t])=>{
      const checked=(multiple?store[key].includes(v):store[key]===v);
      return `<label class="option-label"><input type="${multiple?'checkbox':'radio'}" name="${key}" value="${esc(v)}" ${checked?'checked':''}><span class="option-body"><span class="option-bullet" aria-hidden="true"></span>${esc(t)}</span></label>`;
    }).join('')}</fieldset>${max?`<p class="selection-note">Можно выбрать до ${max} вариантов.</p>`:''}`;
  }
  function floorSVG(plan){
    const fl=layouts[plan.template];
    const unitX=23.5,unitY=20;
    const panelW=12*unitX, panelH=8*unitY, side=20, gap=23, top=30;
    const vw=side*2+panelW*fl.length+gap*(fl.length-1),vh=205;
    let body='';
    fl.forEach((rooms,i)=>{
      const shift=side+i*(panelW+gap);
      body+=`<text x="${shift+2}" y="17" class="floor-caption">${fl.length===1?'СХЕМА ЭТАЖА':i===0?'1 ЭТАЖ':'2 ЭТАЖ'}</text>`;
      rooms.forEach((room,index)=>{
        const x=shift+room.x*unitX,y=top+room.y*unitY,w=room.w*unitX,h=room.h*unitY;
        const colour=['#e1ece3','#f3e7dc','#e7ecf0','#f3efdf','#e9e7ef'][index%5];
        const lines=room.label.split('\n');
        const font=room.w<4?'8.2':'10';
        body+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${colour}" stroke="#58725c" stroke-width="2"/>`;
        lines.forEach((t,k)=>{body+=`<text x="${x+w/2}" y="${y+h/2+(k-(lines.length-1)/2)*12+3}" text-anchor="middle" class="room-name" font-size="${font}">${esc(t)}</text>`;});
      });
      body+=`<rect x="${shift}" y="${top}" width="${panelW}" height="${panelH}" fill="none" stroke="#375b47" stroke-width="3"/>`;
    });
    return `<svg class="plan-drawing" viewBox="0 0 ${vw} ${vh}" role="img" aria-label="Условная схема: ${esc(plan.area)} м², ${plan.stories===1?'один этаж':'два этажа'}, ${plan.beds} спальни"><style>.floor-caption{font:700 13px Arial,sans-serif;fill:#426d55;letter-spacing:1.1px}.room-name{font-family:Arial,sans-serif;fill:#33463b;font-weight:600}</style>${body}</svg>`;
  }
  function planScore(p){
    let s=0;
    if(store.floors==='any'||!store.floors) s+=1;
    else s+=p.stories===Number(store.floors)?9:-4;
    const ar=store.houseArea;
    if(ar==='any'||!ar) s+=2;
    else {
      const ranges={small:[0,90],medium:[90,120],large:[120,150],xl:[150,190],xxl:[190,10000]};
      const [lo,hi]=ranges[ar]||[0,10000];
      s+=(p.area>lo&&p.area<=hi)?12:-Math.min(7,Math.abs(p.area-(lo+Math.min(hi,250))/2)/12);
    }
    if(store.bedrooms&&store.bedrooms!=='any') s+=p.beds>=Number(store.bedrooms)?4:-3;
    if(store.office==='yes')s+=p.office?5:-4;
    if(store.office==='no')s+=p.office?0:2;
    if(store.garage==='built')s+=p.garage?7:-3;
    if(store.garage==='parking'||store.garage==='canopy')s+=p.garage?0:2;
    return s;
  }
  function planCard(p,index){
    const selected=store.planChoice===p.id;
    const tags=[`${p.area} м²`,p.stories===1?'1 этаж':'2 этажа',`${p.beds} спален`,...(p.office?['кабинет']:[]),...(p.garage?['гараж']:[])];
    return `<label class="plan-card${selected?' is-picked':''}"><input type="radio" name="planChoice" value="${p.id}" ${selected?'checked':''}><span class="plan-card-content"><span class="plan-card-drawing">${floorSVG(p)}</span><span class="plan-card-copy"><span class="plan-card-top">ИДЕЯ ${String(index+1).padStart(2,'0')} <span class="plan-card-tick" aria-hidden="true">${selected?'✓':'○'}</span></span><strong>${esc(p.title)}</strong><span class="plan-card-desc">${esc(p.short)}</span><span class="plan-tags">${tags.map(x=>`<span>${esc(x)}</span>`).join('')}</span><span class="plan-card-pick">${selected?'Выбрана ✓':'Выбрать эту идею →'}</span></span></span></label>`;
  }
  function drawPlans(){
    const candidates=[...plans].sort((a,b)=>planScore(b)-planScore(a)||a.area-b.area);
    const shown=planExpanded?candidates:candidates.slice(0,4);
    return `<div class="plan-library"><div class="plan-library-title"><span>Планировки по вашему запросу</span><small>Сначала показываем наиболее близкие по площади и пожеланиям.</small></div><div class="plan-grid">${shown.map((p,i)=>planCard(p,i)).join('')}</div><button class="plans-expand" id="plans-expand" type="button">${planExpanded?'Свернуть подборку ↑':`Посмотреть все ${plans.length} идей планировок ↓`}</button><label class="plan-skip"><input type="radio" name="planChoice" value="custom" ${store.planChoice==='custom'?'checked':''}><span>Хочу индивидуальную планировку — обсудим с Еленой</span></label><label class="plan-skip"><input type="radio" name="planChoice" value="none" ${store.planChoice==='none'?'checked':''}><span>Пока не готов(а) выбрать</span></label><p class="plan-disclaimer"><strong>Важно:</strong> это схематичные идеи планировок, а не готовые проекты подрядчиков или реальные объявления. Площади ориентировочные, в вариантах с гаражом площадь дана как общая концепция. Перед строительством необходимо разработать проект с точными размерами и инженерными решениями.</p></div>`;
  }
  function render(){
    const steps=getSteps(),id=steps[step];
    if(!id){step=0;return render();}
    document.getElementById('step-label').textContent=`Вопрос ${step+1} из ${steps.length}`;
    document.getElementById('quiz-estimate').textContent=steps.length>12?'≈ 6–8 минут':'≈ 3–4 минуты';
    progress.setAttribute('aria-valuemax',steps.length);
    progress.setAttribute('aria-valuenow',step+1);
    progressFill.style.width=`${((step+1)/steps.length)*100}%`;
    back.disabled=step===0;
    next.innerHTML=step===steps.length-1?'Посмотреть заявку <span aria-hidden="true">→</span>':'Продолжить <span aria-hidden="true">→</span>';
    error.textContent='';
    let title='',help='',content='';
    switch(id){
      case 'interest':title='Какой вопрос с недвижимостью сейчас стоит перед вами?';help='Выберите то, что ближе всего к вашей ситуации.';content=optionHTML(interestChoices,id);break;
      case 'location':title=isSale()?'Где находится ваша недвижимость?':'В каком городе или районе рассматриваете недвижимость?';help='Дома и участки — преимущественно Свердловская область, новостройки — вся Россия.';content=field('Район или город','location','Например: Среднеуральск, Екатеринбург или пока не решили');break;
      case 'aim':title=isSale()?'Что планируете после продажи?':'Что для вас важнее всего изменить?';help='Это поможет понять, зачем вам новый дом или квартира.';content=optionHTML(aimChoices,id);break;
      case 'budget':title=isSale()?'Какую стоимость объекта предполагаете?':'На какой общий бюджет ориентируетесь?';help=isHome()?'Укажите ориентир на дом, участок и работы вместе, если это актуально. Все расходы уточним отдельно.':'Если бюджет пока неясен — это нормально.';content=optionHTML(budgetChoices,id);break;
      case 'payment':title=isSale()?'Связана ли продажа с покупкой нового жилья?':'Как планируете оплачивать покупку?';help='Возможность ипотеки и её условия уточним отдельно.';content=optionHTML(isSale()?[['cash','Хочу только продать'],['sale','Затем планирую покупку'],['mixed','Покупка и продажа одновременно'],['unknown','Пока не знаю']]:payChoices,id);break;
      case 'timing':title=isSale()?'Когда хотите продать?':'Когда планируете переехать или начать строительство?';help='Даже примерный срок поможет правильно построить план действий.';content=optionHTML(timingChoices,id);break;
      case 'landStatus':title='У вас уже есть земельный участок?';help='Для строительства это один из первых важных вопросов.';content=optionHTML(plotStatusChoices,id);break;
      case 'floors':title='Сколько этажей хотите в своём доме?';help='Один этаж удобен без лестниц, два могут помочь разделить общие и личные зоны. Необязательно решать прямо сейчас.';content=optionHTML(floorsChoices,id);break;
      case 'houseArea':title='Какая площадь дома вам ближе?';help='Если сомневаетесь, ориентируйтесь на количество помещений. Ниже покажу подходящие идеи планировок.';content=optionHTML(areaChoices,id);break;
      case 'bedrooms':title='Сколько отдельных спален необходимо?';help='Считайте именно спальни, без кухни-гостиной. Гостевую и кабинет обсудим дополнительно.';content=optionHTML(bedroomChoices,id);break;
      case 'office':title='Нужен ли отдельный кабинет?';help='Если работаете из дома, иногда стоит предусмотреть тихое место заранее.';content=optionHTML(officeChoices,id);break;
      case 'garage':title='Что делать с парковкой и гаражом?';help='Встроенный гараж, отдельный гараж, навес или просто место для машины — это разные решения по цене и участку.';content=optionHTML(garageChoices,id);break;
      case 'houseExtras':title='Что ещё важно предусмотреть в доме?';help='Отметьте нужные помещения и элементы. Можно выбрать несколько.';content=optionHTML(extraChoices,id,true);break;
      case 'planChoice':title='Какая планировка вам нравится?';help='Выберите концепцию. Площади и расположение комнат здесь условные: это отправная точка для разговора, а не готовый строительный проект.';content=drawPlans();break;
      case 'archStyle':title='Какой внешний образ дома вам ближе?';help='Можно выбрать архитектурный стиль, который вам визуально нравится. Это поможет мне предложить более подходящие варианты домов и подрядчиков.';content=drawStyles();break;
      case 'materials':title='Какой материал дома рассматриваете?';help='Выбор зависит от участка, проекта, бюджета и требований к дому. Если не знаете — сравним варианты.';content=optionHTML(materialsChoices,id);break;
      case 'finish':title='В каком состоянии хотите получить дом?';help='Состав отделки и работ обязательно уточняется в договоре с подрядчиком.';content=optionHTML(finishChoices,id);break;
      case 'plotSize':title='Какую площадь участка хотите?';help='Учитывайте место под дом, парковку, отдых и сад.';content=optionHTML(landSizeChoices,id);break;
      case 'plotUtilities':title='Какие коммуникации на участке особенно важны?';help='Можно выбрать несколько. Фактическую возможность подключения нужно будет проверить.';content=optionHTML(utilityChoices,id,true);break;
      case 'flatRooms':title='Какую квартиру хотите?';help='Начнём с количества комнат, а потом подберём подходящие планировки.';content=optionHTML(flatRoomsChoices,id);break;
      case 'flatFinish':title='Какая отделка квартиры предпочтительнее?';help='Варианты и их состав отличаются у застройщиков.';content=optionHTML(finishChoices,id);break;
      case 'saleType':title='Что именно собираетесь продать?';help='Для каждого типа объекта свои особенности подготовки.';content=optionHTML(saleTypeChoices,id);break;
      case 'priorities':title='Что для вас особенно важно?';help='Выберите до трёх главных приоритетов.';content=optionHTML(priorityChoices,id,true,3);break;
      case 'details':title='Что ещё мне стоит знать о вашем запросе?';help='Здесь можно написать о семье, количестве машин, питомцах, любимом стиле, требованиях к участку или другой важной детали.';content=`<label class="quiz-field" for="details"><span>Дополнительные пожелания (по желанию)</span><textarea id="details" rows="5" maxlength="1200" placeholder="Расскажите немного о своей ситуации…">${esc(store.details)}</textarea><small>Не указывайте паспортные данные или другую лишнюю личную информацию.</small></label>`;break;
      case 'contact':title='Как можно к вам обращаться?';help='Оставлять имя и телефон необязательно. Если отправите ответы в мессенджер, я смогу ответить там.';content=`<label class="quiz-field" for="name"><span>Имя (по желанию)</span><input id="name" type="text" value="${esc(store.name)}" maxlength="80" placeholder="Например: Мария" autocomplete="name"></label><label class="quiz-field" for="phone"><span>Телефон (по желанию)</span><input id="phone" type="tel" value="${esc(store.phone)}" maxlength="40" placeholder="+7 …" autocomplete="tel"><small>Только если хотите, чтобы я вам позвонила.</small></label>`;break;
    }
    question.innerHTML=`<span class="tiny-label">ДОМ С ЖУКОВОЙ / ${isHome()&&step>=6?'ПРОЕКТИРУЕМ ВАШ ДОМ':'ВАША ИСТОРИЯ'}</span><h2 id="quiz-heading">${title}</h2><p class="prompt-help">${help}</p>${content}`;
    question.querySelectorAll('input[type=text],input[type=tel],textarea').forEach(el=>el.addEventListener('input',()=>store[el.id]=el.value));
    question.querySelectorAll('input[type=radio]').forEach(el=>el.addEventListener('change',()=>{
      store[id]=el.value;error.textContent='';
      if(id==='planChoice'){
        question.querySelectorAll('.plan-card').forEach(card=>{
          const inp=card.querySelector('input');const yes=inp.checked;
          card.classList.toggle('is-picked',yes);
          card.querySelector('.plan-card-tick').textContent=yes?'✓':'○';
          card.querySelector('.plan-card-pick').textContent=yes?'Выбрана ✓':'Выбрать эту идею →';
        });
      }
      if(id==='archStyle'){
        question.querySelectorAll('.style-card').forEach(card=>{
          const inp=card.querySelector('input');const yes=inp.checked;
          card.classList.toggle('is-picked',yes);
          card.querySelector('.style-card-tick').textContent=yes?'✓':'○';
          card.querySelector('.style-card-pick').textContent=yes?'Стиль выбран ✓':'Выбрать этот стиль →';
        });
      }
    }));
    question.querySelectorAll('input[type=checkbox]').forEach(el=>el.addEventListener('change',()=>{
      const vals=[...question.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value);
      if(id==='priorities'&&vals.length>3){el.checked=false;error.textContent='Выберите не больше трёх приоритетов.';return;}
      if(id==='houseExtras'){
        if(el.value==='none'&&el.checked){question.querySelectorAll('input[type=checkbox]').forEach(x=>{if(x!==el)x.checked=false;});}
        else if(el.checked){const none=question.querySelector('input[value=none]');if(none)none.checked=false;}
      }
      store[id]=[...question.querySelectorAll('input[type=checkbox]:checked')].map(x=>x.value);
      error.textContent='';
    }));
    const expand=document.getElementById('plans-expand');
    if(expand)expand.addEventListener('click',()=>{
      planExpanded=!planExpanded;
      // сохраним выбранный ответ и позицию перед отрисовкой обновлённой галереи
      render();
      document.getElementById('plans-expand')?.scrollIntoView({block:'nearest'});
    });
  }

  function drawStyles(){
    const cards=houseStyles.map(style=>`<label class="style-card${store.archStyle===style.id?' is-picked':''}">
      <input type="radio" name="archStyle" value="${style.id}" ${store.archStyle===style.id?'checked':''}>
      <span class="style-card-content">
        <span class="style-card-image-wrap"><img class="style-card-image" src="${style.img}" alt="${style.title}"></span>
        <span class="style-card-copy">
          <span class="style-card-top"><span>СТИЛЬ ДОМА</span><span class="style-card-tick">${store.archStyle===style.id?'✓':'○'}</span></span>
          <strong>${style.title}</strong>
          <span class="style-card-desc">${style.note}</span>
          <span class="style-card-pick">${store.archStyle===style.id?'Стиль выбран ✓':'Выбрать этот стиль →'}</span>
        </span>
      </span>
    </label>`).join('');
    return `<div class="style-library"><div class="plan-library-title"><span>Визуально тоже важно</span><small>Эти изображения помогают понять, какой внешний облик дома вам ближе. Это не конкретные объекты, а стилистические ориентиры для подбора.</small></div><div class="style-grid">${cards}</div><label class="plan-skip"><input type="radio" name="archStyle" value="unsure" ${store.archStyle==='unsure'?'checked':''}><span><strong>Пока не знаю.</strong><br>Хочу сначала понять бюджет, планировку и варианты.</span></label></div>`;
  }

  function valid(){
    const id=getSteps()[step];
    const optional=['location','houseExtras','planChoice','archStyle','plotUtilities','details','contact'];
    if(!optional.includes(id) && !store[id]){error.textContent='Выберите ответ, чтобы продолжить.';return false;}
    if(id==='priorities'&&!store.priorities.length){error.textContent='Выберите хотя бы один приоритет.';return false;}
    return true;
  }
  function resultMessage(){
    const rows=[
      'Здравствуйте, Елена! Я прошёл(прошла) анкету на сайте «Дом с Жуковой».',
      '', 'МОЙ ЗАПРОС',
      `Интересует: ${label(interestChoices,store.interest)}`,
      `Город / район: ${store.location.trim()||'Пока не решил(а)'}`,
      `Цель: ${label(aimChoices,store.aim)}`,
      `Бюджет: ${label(budgetChoices,store.budget)}`,
      `Оплата / планы: ${label(isSale()?[['cash','Только продажа'],['sale','Продажа, затем покупка'],['mixed','Покупка и продажа одновременно'],['unknown','Пока не знаю']]:payChoices,store.payment)}`,
      `Сроки: ${label(timingChoices,store.timing)}`
    ];
    if(isHome()){
      rows.push('', 'ПОЖЕЛАНИЯ К ДОМУ');
      if(store.interest==='house_build')rows.push(`Участок: ${label(plotStatusChoices,store.landStatus)}`);
      rows.push(`Этажность: ${label(floorsChoices,store.floors)}`,
        `Площадь: ${label(areaChoices,store.houseArea)}`,
        `Спальни: ${label(bedroomChoices,store.bedrooms)}`,
        `Кабинет: ${label(officeChoices,store.office)}`,
        `Гараж / парковка: ${label(garageChoices,store.garage)}`,
        `Дополнительно: ${store.houseExtras.length?store.houseExtras.map(x=>label(extraChoices,x)).join('; '):'Не указано'}`);
      const selected=plans.find(p=>p.id===store.planChoice);
      rows.push(`Выбранная идея планировки: ${selected?`${selected.title} (№ ${selected.id.replace('h','')}, ≈ ${selected.area} м², ${selected.stories} этаж(а), ${selected.beds} спален${selected.office?', кабинет':''}${selected.garage?', гараж':''})`:store.planChoice==='custom'?'Нужна индивидуальная планировка':'Не выбрана'}`);
      rows.push(`Внешний стиль дома: ${label(archStyleChoices,store.archStyle)}`);
      if(store.interest==='house_build')rows.push(`Материал: ${label(materialsChoices,store.materials)}`,`Отделка: ${label(finishChoices,store.finish)}`);
    }
    if(store.interest==='plot')rows.push(`Размер участка: ${label(landSizeChoices,store.plotSize)}`,`Коммуникации: ${store.plotUtilities.map(x=>label(utilityChoices,x)).join('; ')||'Не указаны'}`);
    if(store.interest==='newbuild')rows.push(`Комнат: ${label(flatRoomsChoices,store.flatRooms)}`,`Отделка: ${label(finishChoices,store.flatFinish)}`);
    if(isSale())rows.push(`Тип объекта: ${label(saleTypeChoices,store.saleType)}`);
    rows.push('',`Главное: ${store.priorities.map(x=>label(priorityChoices,x)).join('; ')}`,`Пожелания: ${store.details.trim()||'Не указаны'}`,`Имя: ${store.name.trim()||'Не указано'}`);
    if(store.phone.trim())rows.push(`Телефон: ${store.phone.trim()}`);
    rows.push('','Хочу обсудить варианты и дальнейшие шаги. Спасибо!');
    return rows.join('\n');
  }
  function showResult(){
    form.hidden=true;
    document.querySelector('.quiz-topbar').hidden=true;
    progress.hidden=true;
    result.hidden=false;
    const message=resultMessage();
    resultText.value=message;
    const tgButton=document.getElementById('send-tg');
    // Передаём текст через буфер, а не длинную ссылку с ?text:
    // Telegram WebView и внешние клиенты могут по-разному открывать такие ссылки.
    tgButton.href=`https://t.me/${TG_PERSONAL}`;
    tgButton.textContent='Скопировать заявку и открыть Telegram ↗';
    // MAX share-ссылка открывает список получателей. Нам нужен личный чат.
    const maxButton=document.getElementById('send-max');
    maxButton.href=MAX_PERSONAL;
    maxButton.textContent='Скопировать заявку и открыть чат в MAX ↗';
    const shareNote=document.querySelector('.share-note');
    if(shareNote)shareNote.textContent='В MAX откроется личная страница Елены. Вставьте скопированный текст заявки в сообщение и отправьте его. Если браузер не скопировал текст автоматически, вернитесь сюда и нажмите «Скопировать заявку». Сообщения не отправляются автоматически.';
    status.textContent='';
    result.scrollIntoView({behavior:'smooth',block:'start'});
  }
  form.addEventListener('submit',ev=>{
    ev.preventDefault();
    if(!valid())return;
    if(step<getSteps().length-1){step++;render();}else showResult();
  });
  back.addEventListener('click',()=>{if(step){step--;render();}});
  document.getElementById('restart-btn').addEventListener('click',()=>{
    result.hidden=true;form.hidden=false;document.querySelector('.quiz-topbar').hidden=false;progress.hidden=false;
    step=0;render();question.scrollIntoView({behavior:'smooth',block:'start'});
  });
  document.getElementById('copy-btn').addEventListener('click',async()=>{
    const value=resultText.value;
    try{
      if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(value);
      else{resultText.focus();resultText.select();if(!document.execCommand('copy'))throw new Error('copy unavailable');}
      status.textContent='Заявка скопирована. Откройте чат Елены, вставьте текст и отправьте сообщение.';
    }catch(e){resultText.focus();resultText.select();status.textContent='Выделила текст заявки — скопируйте его вручную и вставьте в чат Елены.';}
  });
  document.getElementById('send-max').addEventListener('click',()=>{
    // Событие происходит по нажатию пользователя. Ссылку не блокируем: она
    // сразу открывает личный контакт Елены, а не список получателей MAX.
    const value=resultText.value;
    let copied=false;
    try{
      resultText.focus({preventScroll:true});
      resultText.select();
      copied=document.execCommand('copy');
      if(copied)resultText.setSelectionRange(0,0);
    }catch(e){/* Доступ к буферу зависит от настроек браузера. */}
    if(copied){
      status.textContent='Заявка скопирована. Перейдите в личный чат MAX, вставьте сообщение и отправьте его.';
    }else if(navigator.clipboard&&window.isSecureContext){
      navigator.clipboard.writeText(value).then(()=>{
        status.textContent='Заявка скопирована. Вставьте её в личный чат MAX и отправьте.';
      }).catch(()=>{
        status.textContent='Если текст не скопировался, вернитесь сюда и нажмите «Скопировать заявку».';
      });
      status.textContent='Открываю личный чат в MAX. Если текст не скопировался, вернитесь и нажмите «Скопировать заявку».';
    }else{
      status.textContent='Открываю личный чат в MAX. Если текст не скопировался, вернитесь и нажмите «Скопировать заявку».';
    }
  });
  document.getElementById('send-tg').addEventListener('click',()=>{
    const value=resultText.value;
    // Копирование выполняется во время пользовательского нажатия.
    let copied=false;
    try{
      resultText.focus({preventScroll:true});
      resultText.select();
      copied=document.execCommand('copy');
      if(copied)resultText.setSelectionRange(0,0);
    }catch(e){/* Встроенный браузер может не разрешать execCommand */ }
    if(copied){
      status.textContent='Заявка скопирована. Вставьте её в личный чат Елены в Telegram и нажмите «Отправить».';
    }else if(navigator.clipboard&&window.isSecureContext){
      status.textContent='Открываю чат Елены. Если текст не скопировался, вернитесь сюда и нажмите «Скопировать заявку».';
      navigator.clipboard.writeText(value).then(()=>{
        status.textContent='Заявка скопирована. Вставьте её в Telegram и отправьте сообщение.';
      }).catch(()=>{
        status.textContent='Автоматическое копирование заблокировано. Вернитесь и нажмите «Скопировать заявку».';
      });
    }else{
      status.textContent='Открываю личный чат Елены в Telegram. Если текст не скопировался, вернитесь и нажмите «Скопировать заявку».';
    }
  });
  const initial=new URLSearchParams(location.search).get('interest');
  if(interestChoices.some(o=>o[0]===initial))store.interest=initial;
  render();
})();
