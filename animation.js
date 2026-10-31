'use strict';
/* A lightweight, original, no-dependency 2D theatre engine: multi-frame sprites + objects + particles.
   All motion is rendered in-browser from locally packaged WebP sprites and backgrounds. */
(()=>{
const activityNotes={
 study_science:['고대 서책을 펼치고 중요한 공식을 필기합니다.','📖','🪶','✦'],study_etiquette:['예절의 순서를 되풀이해 연습합니다.','🪭','♛','🌸'],
 study_poetry:['시를 읊고 떠오른 문장을 공책에 적습니다.','📜','🪶','♫'],study_paint:['풍경을 바라보며 캔버스에 색을 입힙니다.','🎨','🖌','🌼'],
 study_dance:['박자에 맞추어 발끝을 돌리고 춤을 춥니다.','♫','♪','🌹'],study_theology:['조용히 촛불을 밝히고 기도를 올립니다.','🕯','✝','✦'],
 study_fencing:['표적을 겨누고 연속으로 검을 휘두릅니다.','⚔','🛡','✦'],study_martial:['자세를 낮춰 몸을 단련하고 발을 굴립니다.','🥋','💥','🥊'],
 study_magic:['마법진 위에서 별빛 구체를 소환합니다.','🔮','✧','☄'],study_strategy:['왕국 지도를 펼치고 전술 말을 옮깁니다.','♟','🗺','⚑'],
 study_cuisine:['재료를 저어 향긋한 스튜를 끓입니다.','🥣','🥕','🍲'],study_medicine:['약초를 분류하고 작은 약병을 만듭니다.','🌿','🧪','🍀'],
 work_farm:['곡식 단을 나르며 밭고랑을 부지런히 오갑니다.','🌾','🪣','☀'],work_house:['비질을 하고 먼지를 털어 반짝이게 합니다.','🧹','✨','🫧'],
 work_baby:['아기에게 장난감을 흔들며 웃음을 선물합니다.','🧸','🍼','♡'],work_church:['촛불을 정돈하고 예배당을 청소합니다.','🕯','✝','✦'],
 work_inn:['손님께 차를 따르고 주문을 받습니다.','🍵','☕','♡'],work_market:['진열대를 정돈하고 거래를 마무리합니다.','⚖','🍎','◈'],
 work_hunt:['숲의 흔적을 따라 걸으며 활쏘기를 연습합니다.','🏹','🎯','🍃'],work_library:['서고에서 책을 옮기며 낡은 문서를 정리합니다.','📚','🪶','📖'],
 work_tutor:['어린 학생에게 차근차근 지식을 설명합니다.','📝','✏','📘'],work_salon:['공방에서 꽃다발과 장식을 만듭니다.','💐','🎀','✨'],
 work_guard:['성문 앞을 순찰하고 검을 검점합니다.','🛡','⚔','⚑'],work_archive:['왕실 기록을 펼쳐 목록을 작성합니다.','📜','🖋','♛'],
 rest:['기지개를 켜고 포근한 침대에서 쉬어 갑니다.','☕','💤','♡'],vacation:['맑은 바람을 맞으며 꽃길을 산책합니다.','🌷','🦋','☀'],
 adventure:['지도에 표시된 길을 따라 유적을 탐험합니다.','🗺','⚔','✧'],
 town:['왕도의 시장을 걸으며 새로운 사람들을 만납니다.','🍞','🌸','♫'],
 palace:['자세를 바로 하고 정중히 왕실 인사를 나눕니다.','♛','🌹','✧'],
 relations:['이야기를 나누고 따뜻한 추억을 쌓습니다.','♡','🌼','✨'],
 festival_dance:['무대의 음악을 따라 눈부신 춤을 선보입니다.','♫','🌹','✧'],
 festival_art:['캔버스를 채우고 마지막 붓질을 완성합니다.','🎨','🖌','🌸'],
 festival_cook:['가마솥을 저어 심사위원의 요리를 완성합니다.','🥣','🥕','🍰'],
 shop:['상인과 물건을 살펴보고 물품을 받습니다.','🛍','◈','✧'],
 battle:['무기를 겨누고 위험에 침착하게 맞섭니다.','⚔','✧','💥']
};
const classifications={
 study_science:'write',study_etiquette:'dance',study_poetry:'write',study_paint:'write',study_dance:'dance',study_theology:'pray',study_fencing:'sword',study_martial:'sword',study_magic:'cast',study_strategy:'write',study_cuisine:'cook',study_medicine:'cook',
 work_farm:'work',work_house:'work',work_baby:'work',work_church:'pray',work_inn:'work',work_market:'work',work_hunt:'sword',work_library:'write',work_tutor:'write',work_salon:'cook',work_guard:'sword',work_archive:'write',
 rest:'rest',vacation:'walk',adventure:'walk',town:'walk',palace:'dance',relations:'idle',festival_dance:'dance',festival_art:'write',festival_cook:'cook',shop:'work',battle:'sword'
};
const backgrounds={academy:'academy',palace:'palace',ruins:'ruins',garden:'garden',room:'room',town:'town',arena:'arena'};
const $=s=>document.querySelector(s);
let active=null;
function getSpec(a){const id=a?.id||'rest';const kind=classifications[id]||(a.kind==='study'?'write':a.kind==='work'?'work':'walk');const lines=activityNotes[id]||[`${a?.title||'활동'}에 최선을 다하고 있습니다.`,a?.icon||'✦','✨','♡'];const scene=backgrounds[a?.scene]||({write:'academy',work:'town',sword:'arena',dance:'palace',rest:'room',pray:'palace',cast:'ruins',cook:'room',walk:'town'})[kind]||'room';return {id,title:a?.title||'오늘의 활동',kind,scene,lines,icon:a?.icon||'✦'};}
function stageHTML(spec,index,total,seed){const [caption,p1,p2,p3]=spec.lines;
let sparks='';for(let i=0;i<18;i++){let xx=(i*27+seed*13)%96+2,yy=(i*41+seed*5)%76+8;let dur=(2.6+(i%5)*.45).toFixed(2),del=((i*7%13)*-.25).toFixed(2);sparks+=`<i class="theatre-spark" style="--sx:${xx}%;--sy:${yy}%;--sd:${dur}s;--sl:${del}s">${['✦','·','✧','❈'][i%4]}</i>`}
let list=new Array(total).fill(0).map((_,i)=>`<span class="theatre-pip ${i===index?'active':i<index?'done':''}">${i+1}</span>`).join('');
return `<div class="theatre-backdrop" role="dialog" aria-modal="true" aria-labelledby="theatre-title" aria-describedby="theatre-caption"><div class="theatre-shell">
 <header class="theatre-top"><div><small>✦ A LIVING CHRONICLE · SPRITE THEATRE</small><h2 id="theatre-title">${escapeText(spec.icon)} ${escapeText(spec.title)}</h2></div><div class="theatre-round">${total>1?`${index+1} / ${total} 구간`:'작은 이야기'}<div class="theatre-pips">${list}</div></div></header>
 <div class="theatre-world scene-${spec.kind}" style="background-image:linear-gradient(180deg,#190f2226 2%,#140e21b0 100%),url('assets/${spec.scene}.webp')" aria-label="움직이는 ${escapeText(spec.title)} 스프라이트 장면">
  <div class="theatre-distant" aria-hidden="true">${spec.kind==='cast'?'✦':spec.kind==='pray'?'✝':spec.kind==='rest'?'☾':spec.kind==='sword'?'⚔':'✧'}</div>
  <div class="theatre-particle-field" aria-hidden="true">${sparks}</div>
  <div class="theatre-floor"></div>
  <div class="theatre-prop prop-one" aria-hidden="true">${p1}</div><div class="theatre-prop prop-two" aria-hidden="true">${p2}</div><div class="theatre-prop prop-three" aria-hidden="true">${p3}</div>
  <div class="theatre-actor-wrap" tabindex="0" role="button" aria-label="캐릭터를 터치해 응원하기"><div class="theatre-avatar" style="background-image:url('assets/sprites/${spec.kind}.webp')"></div><span class="theatre-actor-shadow"></span></div>
  <div class="theatre-float" aria-hidden="true"></div><div class="theatre-cue"><b>${escapeText(spec.title)}</b><span id="theatre-caption">${escapeText(caption)}</span></div>
 </div><div class="theatre-meter"><div class="theatre-meter-line"><span></span></div><div class="theatre-narrator">${total===1?'연출이 끝나면 결과 화면으로 돌아옵니다.':'세 구간의 행동을 연속으로 재생합니다.'}</div></div>
 <div class="theatre-controls"><button class="theatre-button alt" data-anim="pause" aria-pressed="false">⏸ 일시정지</button><button class="theatre-button alt" data-anim="speed">⏩ 2배속</button><button class="theatre-button" data-anim="next">${index===total-1?'결과 보기 →':'다음 구간 →'}</button><button class="theatre-button alt" data-anim="skip">전체 건너뛰기</button></div>
 </div></div>`}
function escapeText(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function play(actions,options={}){if(active)return Promise.resolve(false);const scenes=actions.map(getSpec);if(!scenes.length)return Promise.resolve(false);
let root=$('#animation-root');if(!root){root=document.createElement('div');root.id='animation-root';document.body.appendChild(root)}
root.classList.add('active');root.dataset.replaying='1';const state={root,scenes,step:0,elapsed:0,paused:false,speed:1,lastTime:0,raf:0,resolve:null,finished:false,seed:Math.floor(Math.random()*100),duration:options.duration||4100,hideHandler:null,focus:null};active=state;
state.focus=document.activeElement;
// Isolate the stage from keyboard and pointer actions in the game below it.
const blocked=[...document.body.children].filter(el=>el!==root&&el.tagName!=='SCRIPT').map(el=>[el,el.inert]);
blocked.forEach(([el])=>{el.inert=true});
const guard=e=>{if(active===state&&!root.contains(e.target)){e.preventDefault();e.stopImmediatePropagation()}};
document.addEventListener('click',guard,true);
const promise=new Promise(r=>state.resolve=r);
function draw(){const a=state.scenes[state.step];state.root.innerHTML=stageHTML(a,state.step,state.scenes.length,++state.seed);state.elapsed=0;state.lastTime=0;state.root.querySelector('.theatre-actor-wrap')?.focus({preventScroll:true});applyState()}
function applyState(){const w=state.root.querySelector('.theatre-world');if(w)w.style.setProperty('--theatre-speed',state.speed);const pauseBtn=state.root.querySelector('[data-anim="pause"]');if(pauseBtn){pauseBtn.textContent=state.paused?'▶ 이어보기':'⏸ 일시정지';pauseBtn.setAttribute('aria-pressed',String(state.paused));}const speedBtn=state.root.querySelector('[data-anim="speed"]');if(speedBtn)speedBtn.textContent=state.speed===1?'⏩ 2배속':'⏩ 1배속';state.root.classList.toggle('theatre-paused',state.paused);}
function end(){if(state.finished)return;state.finished=true;cancelAnimationFrame(state.raf);document.removeEventListener('visibilitychange',state.hideHandler);document.removeEventListener('click',guard,true);blocked.forEach(([el,wasInert])=>{el.inert=wasInert});root.classList.remove('active');root.removeAttribute('data-replaying');root.innerHTML='';root.onclick=null;root.onkeydown=null;active=null;state.focus?.focus?.({preventScroll:true});state.resolve(true)}
function next(){if(state.step>=state.scenes.length-1){end();return}state.step++;draw()}
function tick(t){if(state.finished)return;if(!state.lastTime)state.lastTime=t;const dt=Math.min(80,t-state.lastTime);state.lastTime=t;if(!state.paused&&!document.hidden){state.elapsed+=dt*state.speed;const bar=state.root.querySelector('.theatre-meter-line span');if(bar)bar.style.width=`${Math.min(100,state.elapsed/state.duration*100)}%`;if(state.elapsed>=state.duration)next()}state.raf=requestAnimationFrame(tick)}
state.hideHandler=()=>{state.lastTime=0;};document.addEventListener('visibilitychange',state.hideHandler);
root.onclick=e=>{if(active!==state)return;const b=e.target.closest('[data-anim]');if(b){const k=b.dataset.anim;if(k==='skip'){end();return}if(k==='next'){next();return}if(k==='pause'){state.paused=!state.paused;applyState();return}if(k==='speed'){state.speed=state.speed===1?2:1;applyState();return}}
if(e.target.closest('.theatre-actor-wrap')){const bubble=root.querySelector('.theatre-float');if(bubble){bubble.textContent=['힘내요! ✦','잘하고 있어요! ♡','반짝! ✧','화이팅!'][Math.floor(Math.random()*4)];bubble.classList.remove('theatre-pop');void bubble.offsetWidth;bubble.classList.add('theatre-pop')}}};
root.onkeydown=e=>{if(active!==state)return;
 if(e.key==='Escape'){e.preventDefault();e.stopPropagation();end()}
 else if(e.key==='Tab'){const items=[...root.querySelectorAll('[tabindex="0"],button')];const i=items.indexOf(document.activeElement);e.preventDefault();items[(i+(e.shiftKey?-1:1)+items.length)%items.length]?.focus()}
 else if((e.key==='Enter'||e.key===' ')&&e.target.closest('.theatre-actor-wrap')){e.preventDefault();e.target.closest('.theatre-actor-wrap').click()}
};
draw();state.raf=requestAnimationFrame(tick);return promise;}
window.StarlightAnimator={play,isPlaying:()=>!!active,getSpec};
})();
