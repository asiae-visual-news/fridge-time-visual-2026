const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],ns='http://www.w3.org/2000/svg';
function svgEl(t,a){const e=document.createElementNS(ns,t);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));return e}function clamp(v){return Math.max(0,Math.min(1,v))}
const microbes=[];for(let i=0;i<22;i++){let a=i/22*Math.PI*2,start=[290+Math.cos(a)*175,210+Math.sin(a)*112],end=[153+(i*71%300),147+(i*43%161)];const el=svgEl('circle',{r:4.4,fill:'#f2d197',cx:start[0],cy:start[1]});$('.microbes').append(el);microbes.push({el,start,end})}
const melonDots=[];for(let i=0;i<6;i++){let el=svgEl('circle',{r:4.5,cx:175,cy:294,fill:'#f8dea5',stroke:'#314032','stroke-width':1});$('.melon-dots').append(el);melonDots.push(el)}
const bugs=[];for(let i=0;i<17;i++){let x=342+(i*47%131),y=91+(i*31%127);if((x-410)**2+(y-155)**2>7400){x=380+i*3;y=130+i*2}let el=svgEl('rect',{x,y,width:15,height:6,rx:3,fill:'#efd199',transform:`rotate(${i*31} ${x} ${y})`});$('.listeria').append(el);bugs.push(el)}
const phaseLabels={beef:['표면의 오염','분쇄','내부로 섞임'],melon:['껍질의 오염','칼을 따라','과육으로 이동'],ham:['오염 가능성','냉장 보관','증식 가능']};
Object.entries(phaseLabels).forEach(([id,labels])=>$('#'+id+' .process-strip').innerHTML=labels.map(x=>'<span>'+x+'</span>').join('<b>→</b>'));
const mobileFrames=[];
$$('.chapter').forEach(chapter=>{
  const original=chapter.querySelector('.visual-inner');
  chapter.querySelectorAll('.step').forEach(step=>{
    const stage=Number(step.dataset.stage);
    if(stage>1)return;
    const frame=original.cloneNode(true);frame.className='mobile-step-visual';
    frame.querySelector('.diagram-note')?.remove();
    frame.querySelector('.process-strip')?.removeAttribute('aria-hidden');
    step.querySelector('h2').after(frame);
    mobileFrames.push({frame,stage,food:chapter.id});
  });
  chapter.classList.add('has-mobile-visuals');
});
function paintMobile(h){
 if(innerWidth>767)return;
 mobileFrames.forEach(({frame,stage,food})=>{
  const r=frame.getBoundingClientRect();if(r.bottom< -100||r.top>h+100)return;
  const q=reduced?1:clamp((h*.92-r.top)/(Math.min(r.height,h)*.82));
  const flow=stage===1?q:0,minced=stage===1?clamp(q*1.5):0,mechanism=stage===1?1:(food==='beef'?q:0);
  frame.style.setProperty('--flow',flow);frame.style.setProperty('--minced',minced);frame.style.setProperty('--mechanism',mechanism);
  if(food==='beef')frame.querySelectorAll('.microbes circle').forEach((el,i)=>{let {start,end}=microbes[i];el.setAttribute('cx',start[0]+(end[0]-start[0])*minced);el.setAttribute('cy',start[1]+(end[1]-start[1])*minced)});
  if(food==='melon'){let path=frame.querySelector('.route-base'),length=path.getTotalLength();frame.querySelectorAll('.melon-dots circle').forEach((el,i)=>{let pt=path.getPointAtLength(clamp(flow*1.18-i*.065)*length);el.setAttribute('cx',pt.x);el.setAttribute('cy',pt.y);el.style.opacity=flow>.02?'1':'0';});}
  if(food==='ham')frame.querySelectorAll('.listeria rect').forEach((el,i)=>el.style.opacity=i<3?'.95':clamp((flow-i/24)*3));
 });
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,chapters=$$('.chapter'),discoveries=$$('.discovery');let pending=false;
function render(){pending=false;const h=innerHeight,intro=$('#intro').getBoundingClientRect(),op=reduced?1:clamp(-intro.top/(h*.48));document.documentElement.style.setProperty('--open',op.toFixed(4));$('.intro').classList.toggle('is-open',op>.8);$('.progress i').style.width=clamp(scrollY/(document.documentElement.scrollHeight-h))*100+'%';discoveries.forEach(c=>{let r=c.getBoundingClientRect(),p=reduced?1:clamp((h*.55-r.top)/(h*.8));c.style.setProperty('--focus',p.toFixed(4));});chapters.forEach(c=>{let r=c.getBoundingClientRect(),p=reduced?.5:clamp(-r.top/(r.height-h)),flow=clamp((p-.14)/.45),minced=clamp((p-.06)/.31),mechanism=reduced?1:clamp((p-.04)/.14)*clamp((1.04-p)/.25);c.style.setProperty('--p',p.toFixed(4));c.style.setProperty('--minced',minced.toFixed(4));c.style.setProperty('--flow',flow.toFixed(4));c.style.setProperty('--mechanism',mechanism.toFixed(4));if(c.id==='beef')microbes.forEach(({el,start,end})=>{el.setAttribute('cx',start[0]+(end[0]-start[0])*minced);el.setAttribute('cy',start[1]+(end[1]-start[1])*minced)});if(c.id==='melon'){const route=$('.melon-route .route-base'),length=route.getTotalLength();melonDots.forEach((el,i)=>{let q=clamp(flow*1.18-i*.065),pt=route.getPointAtLength(q*length);el.setAttribute('cx',pt.x);el.setAttribute('cy',pt.y);el.style.opacity=flow>.02?'1':'0';});}if(c.id==='ham')bugs.forEach((el,i)=>el.style.opacity=i<3?'.95':clamp((flow-i/24)*3));});paintMobile(h);}
function request(){if(!pending){pending=true;requestAnimationFrame(render)}}addEventListener('scroll',request,{passive:true});addEventListener('resize',request);render();
const review={beef:['다짐육 · 구입 후 냉장 보관','1~2일 이내','구입 후 1~2일 안에 먹기 어렵다면 냉동 보관하세요.'],melon:['구매 후 냉장 보관','4℃ 이하','손질 시점을 모른다면 오래 보관하지 말고 가능한 한 빨리 드세요.'],ham:['포장 뜯은 가공육 · 정육점에서 썰어준 고기','3~5일 이내','점액질·곰팡이·불쾌한 냄새가 있다면 폐기하세요.']};$$('.food-tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.food-tabs button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let [t,v,d]=review[b.dataset.food];$('#review-title').textContent=t;$('#review-value').textContent=v;$('#review-desc').textContent=d;}));
if(parent!==window){const sendHeight=()=>parent.postMessage({type:'asiae-visual-height',height:document.documentElement.scrollHeight},'*');new ResizeObserver(sendHeight).observe(document.body);addEventListener('load',sendHeight)}
