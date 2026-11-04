const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
class Element {
 constructor() { this.textContent=''; this.children=[]; this.attrs={}; this.dataset={}; this.events={}; this.value='8'; this.className=''; this.classList={add:()=>{},remove:()=>{}}; }
 append(...x){this.children.push(...x)} replaceChildren(){this.children=[]} setAttribute(k,v){this.attrs[k]=v} getAttribute(k){return this.attrs[k]} addEventListener(k,f){this.events[k]=f} click(){this.events.click?.({})}
}
const elements=new Map(); const $=id=>{if(!elements.has(id))elements.set(id,new Element()); return elements.get(id)};
const timers=new Map(); let serial=0,now=100; const store=new Map();
const document={getElementById:$,createElement:()=>new Element(),querySelector:$,addEventListener(){}};
const context={document,window:{addEventListener(){}},performance:{now:()=>now},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},setTimeout:f=>{timers.set(++serial,f);return serial},clearTimeout:id=>timers.delete(id),setInterval:()=>++serial,clearInterval(){},console};
vm.createContext(context);vm.runInContext(fs.readFileSync('machine.js','utf8'),context);
const flush=()=>{const jobs=[...timers.values()];timers.clear();jobs.forEach(f=>f())};
assert.equal($('memory-board').children.length,16);
let board=$('memory-board').children;
board[0].click();board[0].click();assert.equal($('moves').textContent,'0');
const different=board.find(b=>b.children[0].textContent!==board[0].children[0].textContent);different.click();assert.equal($('moves').textContent,1);
$('memory-reset').click();flush();assert.equal($('moves').textContent,'0');
board=$('memory-board').children;
const groups={};board.forEach(b=>(groups[b.children[0].textContent]??=[]).push(b));
for(const pair of Object.values(groups)){pair[0].click();pair[1].click()}
assert.equal($('matches').textContent,'8 / 8');assert.match($('memory-status').textContent,/You did it/);assert.equal(store.get('learning-memory-8'),'8');
for(const n of ['6','10']){$('memory-level').value=n;$('memory-level').events.change();assert.equal($('memory-board').children.length,Number(n)*2)}
$('reaction-pad').click();assert.equal($('reaction-pad').dataset.state,'waiting');$('reaction-pad').click();flush();assert.equal($('reaction-pad').dataset.state,'early');
for(let i=0;i<5;i++){$('reaction-pad').click();flush();assert.equal($('reaction-pad').dataset.state,'ready');now+=250;$('reaction-pad').click()}
assert.equal($('reaction-pad').dataset.state,'complete');assert.equal($('reaction-results').children.length,5);assert.match($('reaction-summary').textContent,/Average 250 ms/);
$('reaction-reset').click();assert.equal($('reaction-results').children.length,0);
$('reaction-pad').click();$('reaction-reset').click();flush();assert.equal($('reaction-pad').dataset.state,'idle');
$('switchBtn').click();assert.equal($('switchBtn').attrs['aria-checked'],'true');flush();assert.equal($('switchBtn').attrs['aria-checked'],'false');
vm.runInContext(fs.readFileSync('quotes.js','utf8'),context);assert.equal($('all-quotes').children.length,15);const quote=$('featured-quote').textContent;$('shuffle-quote').click();assert.notEqual($('featured-quote').textContent,quote);
// Every local link and asset resolves; fragment-only anchors stay on the current page.
for(const file of ['index.html','project.html','quotes.html','machine.html','nav.js']) {
 const text=fs.readFileSync(file,'utf8');for(const m of text.matchAll(/(?:href|src)=["']([^"']+)["']/g)){
 const path=m[1].split('#')[0];if(path&&!path.includes(':'))assert.ok(fs.existsSync(path),`${file}: missing ${path}`);
 }
}
console.log('PASS: memory completion, difficulty, duplicate clicks, reset during mismatch, records, reaction false start/5 rounds/reset, machine toggle, 15 quotes/random hero, local links.');
