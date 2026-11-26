"use strict";
const $=id=>document.getElementById(id);
const patterns=["Interactive Accordion","Interactive Concept Map","Step-by-Step Explorer","Styled Response","Vertical Scroller","Slide Deck","Two-Phase Split","Equation Chain","Layered Reveal"];
const tracks=["Canonical","Companion","Combined"];
const state={subject:null,pattern:"Slide Deck",track:"Canonical",theme:"dark",step:0,open:new Set(),layers:{},video:false};
let catalog=[],units=[],loadId=0;
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const el=(n,q)=>n.querySelector(q)?.textContent.trim()||"";
const direct=(n,q)=>Array.from(n.children).filter(x=>x.tagName===q);
const field=(n,q)=>direct(n,q)[0]?.textContent.trim()||"";
const xml=async path=>{const r=await fetch(path);if(!r.ok)throw Error(path+": HTTP "+r.status);const d=new DOMParser().parseFromString(await r.text(),"application/xml");if(d.querySelector("parsererror"))throw Error("Invalid XML: "+path);return d};
const math=s=>s?'<div class="equation" data-math="'+esc(s)+'"><span class="fallback">'+esc(s)+'</span></div>':"";
const eqs=a=>a.map(math).join("");
const svg=(s)=>'<svg viewBox="0 0 320 150" role="img" aria-label="Schematic diagram">'+s+"</svg>";
const T=(x,y,t,cls="")=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" class="'+cls+'">'+esc(t)+'</text>';
const R=(x,y,w,h)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" class="region"/>';
const L=(x1,y1,x2,y2,dash=false)=>'<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" class="line" '+(dash?'stroke-dasharray="4 3"':'')+'/>';
const P=(x,y,r=4)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" class="point"/>';
const Ell=(x,y,rx,ry)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" class="region"/>';
const node=t=>'<div class="diagram-node">'+esc(t)+'</div>';
function visual(v){if(!v)return "";const n=v.objects,r=v.relationships;let d="";
switch(v.kind){
case "check":d='<div class="check">'+n.map(x=>"<div>"+esc(x)+"</div>").join("")+"</div>";break;
case "flow":d='<div class="flow">'+n.map(node).join('<span class="arrow" aria-hidden="true">→</span>')+"</div>";break;
case "comparison":d='<div class="merge">'+n.map((x,i)=>node(x)+(r[i]? "":"")).join("")+"</div>"+'<div class="relation">'+r.map(esc).join(" · ")+"</div>";break;
case "merge":d='<div class="merge">'+node(n[0])+node(n[1])+'<div class="arr">↘ &nbsp; ↙</div><div class="last">'+esc(n[2])+"</div></div>";break;
case "mapping":{const cols=n.length;let cells=n.map(node).join("");for(let i=0;i<r.length;i++)cells+=node(r[i]);d='<div class="mapping" style="--cols:'+cols+'">'+cells+"</div>";break;}
case "evaluation":d='<div class="stack">'+node(n[0])+'<div class="relation">↓ Evaluate at a</div><div class="mapping" style="--cols:3">'+n.slice(1).map(node).join("")+r.map(x=>node("↓ "+x)).join("")+"</div></div>";break;
case "separation":d=svg(Ell(75,69,47,39)+Ell(245,69,47,39)+P(75,69)+P(245,69)+T(75,57,n[0])+T(245,57,n[1])+T(160,133,"Disjoint neighborhoods","accent"));break;
case "cover":d=svg(Ell(160,75,109,57)+[[-53,-10],[0,-24],[53,-10],[-28,22],[29,22]].map(([x,y])=>Ell(160+x,75+y,48,40)).join("")+T(160,77,n[0])+T(160,142,n[1],"accent"));break;
case "nested":{const outside=n[n.length-1]&&(/1_A|f\?/.test(n[n.length-1]));const labels=outside?n.slice(1,-1):n.slice(1);d=svg(R(4,4,312,142)+T(26,20,n[0])+labels.map((x,i)=>Ell(135,83,105-i*21,55-i*10)+T(135,38+i*18,x,"accent")).join("")+(outside?P(285,85)+T(285,72,n[n.length-1]):""));break;}
case "distance":d=svg(R(4,4,312,142)+T(20,21,n[0])+Ell(105,89,73,40)+T(105,94,n[1])+P(270,42)+T(270,28,"x")+L(174,75,270,42,true)+T(232,91,"Positive distance","accent"));break;
case "ball":d=svg(R(4,4,312,142)+Ell(192,76,61,61)+P(192,76)+T(208,72,n[0])+P(156,94)+T(143,114,n[1])+L(192,76,192,15)+T(213,32,n[2],"accent")+T(192,141,"Invertible ball","accent"));break;
case "convergence":{const xs=[40,125,193,255];d=svg(R(4,4,312,142)+L(40,70,255,70,true)+n.map((x,i)=>P(xs[i],70,i===n.length-1?6:4)+T(xs[i],56,x)).join("")+T(160,117,"Convergence","accent"));break;}
case "spectrum":d=svg(L(17,75,303,75)+L(160,4,160,146)+Ell(160,75,62,62)+[[130,40],[171,98],[143,90],[210,38],[177,56]].map(p=>P(...p)).join("")+L(160,75,210,38)+T(187,64,n[1],"accent")+T(223,29,n[2])+T(145,91,"0"));break;
case "dense":d=svg(R(4,4,312,142)+Array.from({length:35},(_,i)=>P(24+(i%7)*44,30+Math.floor(i/7)*25,2)).join("")+Ell(200,80,37,37)+P(200,80,5)+T(211,72,n[1])+P(183,92)+T(176,108,n[2])+T(236,101,n[3],"accent"));break;
default:d='<div class="stack">'+n.map(node).join("")+"</div>";
}
const notes=v.kind==="mapping"||v.kind==="evaluation"||v.kind==="comparison"?[]:r;
return '<div class="visual">'+d+notes.map(x=>'<p class="relation">'+esc(x)+"</p>").join("")+"</div>";
}
function canonicalFields(u){return [
["Takeaway",'<p class="take">'+esc(u.takeaway)+"</p>"],
["Explanation","<p>"+esc(u.explanation)+"</p>"],
["Equation",math(u.equation)],
["Detail",u.detail?'<p><b>Detail:</b> '+esc(u.detail)+"</p>":""],
["Note",u.note?'<p class="muted"><b>Note:</b> '+esc(u.note)+"</p>":""],
["Foundation",u.foundation?'<p class="muted"><b>Foundation:</b> '+esc(u.foundation)+"</p>":""]
].filter(x=>x[1]);}
function companionFields(u){if(!u.companion)return [["Companion",'<p>No companion unit is available for this step.</p>']];const c=u.companion;return [["Takeaway",'<p class="take">'+esc(c.takeaway)+"</p>"],...c.sections.map(s=>[s.title,'<section class="section"><h3>'+esc(s.title)+"</h3>"+visual(s.visual)+eqs(s.equations)+"<p>"+esc(s.explanation)+"</p></section>"])];}
function title(u,track){return track==="Companion"?u.companion?.title||u.title:u.title}
function take(u,track){return track==="Companion"?u.companion?.takeaway||"":u.takeaway}
function fields(u,track){return track==="Companion"?companionFields(u):canonicalFields(u)}
function heading(u,track){return '<div class="eyebrow">Step '+esc(u.number)+' · '+track+'</div><h2>'+esc(title(u,track))+"</h2>"}
function trackCard(u,track,limit=null,omitTake=false){const f=fields(u,track).filter(x=>!omitTake||x[0]!=="Takeaway");return '<article class="card">'+heading(u,track)+(limit===null?f:f.slice(0,limit)).map(x=>x[1]).join("")+"</article>"}
function group(u,limit=null){if(state.track!=="Combined")return trackCard(u,state.track,limit);return '<div class="combined">'+trackCard(u,"Canonical",limit)+trackCard(u,"Companion",limit)+"</div>"}
function fullRow(u,i,kind="accordion"){const open=state.open.has(i),track=state.track==="Combined"?"Canonical":state.track;const showEq=kind==="equation"||kind==="phase";const label=showEq?esc(title(u,track)):esc(title(u,track))+'<p class="take">'+esc(take(u,track))+"</p>";const body=open?(state.track==="Combined"?'<div class="combined"><div class="stack">'+canonicalFields(u).filter(x=>x[0]!=="Takeaway"||showEq).filter(x=>!showEq||x[0]!=="Equation").map(x=>x[1]).join("")+'</div><div class="stack">'+companionFields(u).map(x=>x[1]).join("")+"</div></div>":fields(u,track).filter(x=>x[0]!=="Takeaway"||showEq).filter(x=>!showEq||track==="Companion"||x[0]!=="Equation").map(x=>x[1]).join("")):"";return '<article id="unit-'+i+'" class="card '+(state.step===i?"active":"")+'"><button class="unit-head" data-toggle="'+i+'" aria-expanded="'+open+'"><span class="n">'+esc(u.number)+'</span><div><b>'+label+'</b></div><span class="chev">'+(open?"⌃":"⌄")+'</span></button>'+(showEq?math(u.equation):"")+body+"</article>"}
function footerButtons(nextLabel="Reveal next"){return '<div class="row between"><div class="row"><button class="primary" data-action="open-next" '+(state.open.size===units.length?"disabled":"")+'>'+nextLabel+'</button><button data-action="reset">Reset</button><button data-action="all">'+(state.open.size===units.length?"Collapse all":"Expand all")+'</button></div><span class="muted">'+state.open.size+" of "+units.length+" open</span></div>"}
function overview(){return '<div class="overview">'+units.map((u,i)=>'<button data-step="'+i+'" aria-pressed="'+(state.step===i)+'">'+esc(u.number+" · "+u.title)+"</button>").join("")+"</div>"}
function graph(){const edges=state.subject.edges||[];if(!edges.length)return '<div class="notice">No concept relationships are specified for this subject. Choose another pattern.</div>';const nodes=units.map((u,i)=>'<button data-step="'+i+'" aria-pressed="'+(state.step===i)+'">'+esc(u.number+" · "+u.title)+"</button>").join("");const linked=edges.filter(([a,b])=>a===state.step||b===state.step);return '<div class="map">'+nodes+'</div><div class="edge-list" aria-label="Relationships of selected node">'+linked.map(([a,b])=>'<span class="edge">'+esc(units[a].number+" ↔ "+units[b].number+" · "+units[a].title+" / "+units[b].title)+"</span>").join("")+"</div>"+group(units[state.step]);}
function renderMath(){if(window.katex)document.querySelectorAll("[data-math]").forEach(e=>{try{window.katex.render(e.dataset.math,e,{displayMode:true,throwOnError:true,strict:"ignore"})}catch(_){}})}
function render(follow=false){if(!units.length)return;state.step=Math.max(0,Math.min(state.step,units.length-1));document.documentElement.dataset.theme=state.theme;document.body.classList.toggle("video",state.video);$("theme").textContent=state.theme==="dark"?"Light theme":"Dark theme";$("exit-video").hidden=!state.video;$("pattern").value=state.pattern;$("tracks").innerHTML=tracks.map(t=>'<button data-track="'+t+'" aria-pressed="'+(t===state.track)+'">'+t+"</button>").join("");$("dots").innerHTML=units.map((u,i)=>'<button class="dot" data-step="'+i+'" aria-label="Step '+esc(u.number)+'" aria-pressed="'+(state.step===i)+'">'+esc(u.number)+"</button>").join("");$("back").disabled=state.step===0;$("next").disabled=state.step===units.length-1;$("counter").textContent=(state.step+1)+" of "+units.length;$("status").innerHTML="";
const u=units[state.step];let h="";
switch(state.pattern){
case "Slide Deck":h='<div class="fixed-slide">'+group(u)+"</div>";break;
case "Step-by-Step Explorer":h=group(u)+'<div class="row"><button data-action="restart">Restart</button><button data-action="next" class="primary" '+(state.step===units.length-1?"disabled":"")+' >Reveal next</button></div>'+overview();break;
case "Interactive Accordion":h=units.map((v,i)=>fullRow(v,i)).join("")+footerButtons();break;
case "Styled Response":h=units.map((v,i)=>'<div id="unit-'+i+'" class="stack">'+group(v)+"</div>").join("");break;
case "Vertical Scroller":h='<div class="scroller" id="inner-scroll"><div class="stack">'+units.map((v,i)=>'<div id="unit-'+i+'" class="stack">'+group(v)+"</div>").join("")+'</div></div><div class="muted">Scroll inside the panel</div>';break;
case "Interactive Concept Map":h=graph();break;
case "Two-Phase Split":{const phases=state.subject.phases;if(!phases){h='<div class="notice">No phase division has been specified.</div>';break;}h=group(units[0])+phases.map((p,i)=>'<section class="phase"><h3>Phase '+(i+1)+" · "+esc(p.label)+"</h3>"+p.steps.map(j=>fullRow(units[j],j,"phase")).join("")+"</section>").join('<div class="connector">↓ Establish the isomorphism</div>')+footerButtons();break;}
case "Equation Chain":h=units.map((v,i)=>(i?'<div class="connector">'+esc(take(v,state.track==="Companion"?"Companion":"Canonical"))+"</div>":"")+fullRow(v,i,"equation")).join("")+footerButtons();break;
case "Layered Reveal":{const key=state.track+":"+state.step,fs=state.track==="Combined"?Math.max(canonicalFields(u).length,companionFields(u).length):fields(u,state.track).length,k=state.layers[key]||0;h='<article class="card"><div class="eyebrow">Step '+esc(u.number)+'</div><h2>'+esc(title(u,state.track))+'</h2><div class="row"><button class="primary" data-action="reveal" '+(k>=fs?"disabled":"")+' >Reveal next</button><button data-action="reveal-all">'+(k>=fs?"Hide all":"Reveal all")+'</button><span class="muted">'+k+" of "+fs+" shown</span></div></article>"+(k?group(u,k):"");break;}
default:h=group(u);
}
$("view").innerHTML=h;renderMath();if(follow){const target=$("unit-"+state.step);if(target)target.scrollIntoView({block:"start",behavior:"instant"});}try{localStorage.setItem("presentation-console",JSON.stringify({pattern:state.pattern,track:state.track,theme:state.theme,step:state.step,subject:state.subject.id}))}catch(_){}
}
function go(i){state.step=Math.max(0,Math.min(i,units.length-1));if(["Interactive Accordion","Two-Phase Split","Equation Chain"].includes(state.pattern))state.open.add(state.step);render(true)}
function setVideo(v){state.video=v;render();if(!v&&document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});}
function action(a){const key=state.track+":"+state.step,u=units[state.step],fs=state.track==="Combined"?Math.max(canonicalFields(u).length,companionFields(u).length):fields(u,state.track).length;
if(a==="next"){go(state.step+1);return}if(a==="restart"){go(0);return}
if(a==="open-next"){const i=units.findIndex((_,j)=>!state.open.has(j));if(i>=0){state.open.add(i);state.step=i;render(true);return}}
if(a==="reset")state.open.clear();
if(a==="all"){if(state.open.size===units.length)state.open.clear();else units.forEach((_,i)=>state.open.add(i))}
if(a==="reveal")state.layers[key]=Math.min(fs,(state.layers[key]||0)+1);
if(a==="reveal-all")state.layers[key]=(state.layers[key]||0)>=fs?0:fs;render();
}
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.track){state.track=b.dataset.track;render();return}if(b.dataset.step!==undefined){go(Number(b.dataset.step));return}if(b.dataset.toggle!==undefined){const i=Number(b.dataset.toggle);state.step=i;if(state.open.has(i))state.open.delete(i);else state.open.add(i);render();return}if(b.dataset.action)action(b.dataset.action);});
$("back").onclick=()=>go(state.step-1);$("next").onclick=()=>go(state.step+1);$("theme").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";render()};$("video").onclick=()=>setVideo(true);$("exit-video").onclick=()=>setVideo(false);$("pattern").onchange=e=>{state.pattern=e.target.value;render()};$("subject").onchange=e=>loadSubject(e.target.value,false);
document.addEventListener("keydown",e=>{if(["INPUT","SELECT","TEXTAREA","BUTTON"].includes(document.activeElement?.tagName))return;if(e.key==="ArrowRight"){e.preventDefault();go(state.step+1)}if(e.key==="ArrowLeft"){e.preventDefault();go(state.step-1)}if(e.key.toLowerCase()==="v")setVideo(!state.video);if(e.key==="Escape"&&state.video)setVideo(false);});
async function loadSubject(id,restore){const ticket=++loadId;try{const s=catalog.find(x=>x.id===id);if(!s)throw Error("Subject unavailable");$("status").textContent="Loading…";const [c,p]=await Promise.all([xml(s.canonical),s.companion?xml(s.companion):null]);if(ticket!==loadId)return;const notes=Object.fromEntries(Array.from(c.querySelectorAll("editorialNotes note")).map(n=>[n.getAttribute("step"),n.textContent.trim()]));const byId=new Map();if(p)for(const u of p.querySelectorAll("unit"))byId.set(u.getAttribute("targetStep"),{title:field(u,"title"),takeaway:field(u,"takeaway"),sections:direct(u,"section").map(v=>{const vi=direct(v,"visual")[0];return {title:field(v,"title"),explanation:field(v,"explanation"),equations:direct(v,"equation").map(e=>e.textContent.trim()),visual:vi?{kind:vi.getAttribute("suggestion"),objects:direct(vi,"object").map(x=>x.textContent.trim()),relationships:direct(vi,"relationship").map(x=>x.textContent.trim())}:null}})});
units=Array.from(c.querySelectorAll("steps step")).map(n=>({id:n.getAttribute("id"),number:n.getAttribute("number"),title:field(n,"title"),takeaway:field(n,"takeaway"),explanation:field(n,"explanation"),equation:field(n,"equation"),detail:field(n,"detail"),foundation:field(n,"foundation"),note:notes[n.getAttribute("number")]||"",companion:byId.get(n.getAttribute("id"))}));if(!units.length)throw Error("No content units");
state.subject=s;if(!restore){state.step=0;state.open.clear();state.layers={}}$("subject").value=id;$("subject-title").textContent=s.title;$("subtitle").textContent=el(c,"metadata subtitle");$("canonical-source").href=s.canonical;$("companion-source").href=s.companion||"#";render()}catch(e){$("status").textContent="Could not load presentation: "+e.message}}
async function init(){try{const r=await fetch("subjects.json");if(!r.ok)throw Error("Subject catalog unavailable");catalog=(await r.json()).subjects;$("subject").innerHTML=catalog.map(s=>'<option value="'+esc(s.id)+'">'+esc(s.title)+"</option>").join("");$("pattern").innerHTML=patterns.map(p=>'<option>'+esc(p)+"</option>").join("");let saved={};try{saved=JSON.parse(localStorage.getItem("presentation-console")||"{}")}catch(_){}if(patterns.includes(saved.pattern))state.pattern=saved.pattern;if(tracks.includes(saved.track))state.track=saved.track;if(saved.theme==="light")state.theme="light";if(Number.isInteger(saved.step))state.step=saved.step;await loadSubject(catalog.some(s=>s.id===saved.subject)?saved.subject:catalog[0].id,true)}catch(e){$("status").textContent=e.message}}
init();