
const form=document.getElementById('form');
const fields=['General','Red Dot','2x Scope','4x Scope','Sniper Scope','Free Look'];
let current=null;
function generate(e){
if(e)e.preventDefault();
if(!form.reportValidity())return;
const brand=document.getElementById("brand").value.trim();
const model=document.getElementById("model").value.trim();
const ram=Number(document.getElementById("ram").value);
const fingers=Number(document.getElementById("fingers").value);
const style=document.getElementById("style").value;
if(!model){document.getElementById("model").focus();return;}
const key=(brand+" "+model).toLowerCase().replace(/[^a-z0-9]/g,"");
let hash=2166136261;
for(let i=0;i<key.length;i++)hash=Math.imul(hash^key.charCodeAt(i),16777619)>>>0;
const brandKey=brand.toLowerCase();
let brandOffset=brandKey.includes("iphone")||brandKey.includes("apple")?3:brandKey.includes("samsung")?2:brandKey.includes("tecno")?-1:brandKey.includes("infinix")?1:brandKey.includes("xiaomi")||brandKey.includes("redmi")||brandKey.includes("poco")?2:brandKey.includes("itel")?-3:brandKey.includes("oppo")||brandKey.includes("vivo")||brandKey.includes("realme")?1:0;
let base=(ram<=3?172:ram<=4?180:ram<=6?187:ram<=8?192:196)+brandOffset+(hash%19)-9;
base+=fingers===2?-8:fingers===3?-3:fingers===4?2:fingers===5?4:5;
if(style==="rush")base+=7;
if(style==="precision")base-=9;
const tweaks=[];let seed=hash;
for(let i=0;i<6;i++){seed=(Math.imul(seed^(i+1),2246822519)+3266489917)>>>0;tweaks.push(seed%9-4);}
const vals=[base+tweaks[0],base-5+tweaks[1],base-16+tweaks[2],base-31+tweaks[3],base-(style==="precision"?83:76)+tweaks[4],base-24+tweaks[5]].map(v=>Math.max(0,Math.min(200,Math.round(v))));
current={brand,model,ram,fingers,style,fields,vals};
document.getElementById("empty").classList.add("hidden");
document.getElementById("output").classList.remove("hidden");
document.getElementById("grid").innerHTML=fields.map((name,i)=>`<div class="stat"><span>${name.toUpperCase()}</span><input aria-label="${name}" type="number" min="0" max="200" value="${vals[i]}" data-index="${i}"></div>`).join("");
document.getElementById("summary").textContent=brand+" "+model+" • "+ram+" GB RAM • "+fingers+" fingers • "+document.getElementById("style").selectedOptions[0].text;
}
function getText(){
if(!current)return '';
const vals=[...document.querySelectorAll('#grid input')].map(i=>i.value);
return 'PYTHON XIT SENZI - SENSITIVITY PROFILE\nPhone: '+current.brand+' '+current.model+'\nRAM: '+current.ram+' GB\nFingers: '+current.fingers+'\nStyle: '+current.style+'\n\n'+fields.map((f,i)=>f+': '+vals[i]).join('\n')+'\n\nSuggested starting values. Adjust after testing in-game.';
}
form.addEventListener('submit',generate);
document.getElementById('reset').addEventListener('click',()=>{
form.reset();current=null;
document.getElementById('output').classList.add('hidden');
document.getElementById('empty').classList.remove('hidden');
});
document.getElementById('copy').addEventListener('click',async()=>{
try{await navigator.clipboard.writeText(getText());alert('Settings copied!')}
catch(e){prompt('Copy your settings below:',getText())}
});
document.getElementById('download').addEventListener('click',()=>{
const blob=new Blob([getText()],{type:'text/plain'});
const url=URL.createObjectURL(blob);const a=document.createElement('a');
a.href=url;a.download='python-xit-senzi-settings.txt';a.click();
setTimeout(()=>URL.revokeObjectURL(url),1000);
});
