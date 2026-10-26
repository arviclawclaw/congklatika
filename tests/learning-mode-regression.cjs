#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
let checks = 0;
function ok(value, label) { assert.ok(value, label); checks++; console.log(`PASS ${label}`); }
function mime(file) { return ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.json':'application/json'})[path.extname(file)] || 'application/octet-stream'; }
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(ROOT, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(ROOT + path.sep) && file !== path.join(ROOT, 'index.html')) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404).end('Not found'); return; } res.writeHead(200, {'content-type':mime(file),'cache-control':'no-store'}).end(data); });
});
async function listen() { await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); return `http://127.0.0.1:${server.address().port}/`; }
async function pageAt(browser, url, options={}) {
  const context = await browser.newContext({viewport:{width:1280,height:900},...options});
  const page = await context.newPage(); page.setDefaultTimeout(7000); await page.goto(url,{waitUntil:'domcontentloaded'}); await page.locator('#app').waitFor(); if(await page.locator('.profile-modal').count()){await page.locator('#profile-name').fill('Teman');await page.locator('[data-profile-character=\"buji\"]').click();await page.locator('#profile-form [type=\"submit\"]').click();await page.locator('.profile-modal').waitFor({state:'detached'})} return {context,page};
}
(async()=>{
  const url=await listen();
  const launch={headless:true,args:process.platform==='linux'?['--no-sandbox']:[]};
  if(process.env.CHROMIUM_PATH) launch.executablePath=process.env.CHROMIUM_PATH;
  else if(fs.existsSync('/usr/bin/chromium')) launch.executablePath='/usr/bin/chromium';
  const browser=await chromium.launch(launch),errors=[];
  try {
    const {context,page}=await pageAt(browser,url); page.on('pageerror',e=>errors.push(e.message));
    const starAvatar=await page.evaluate(()=>{const originalCharacter=state.character;state.character='bintang';state.page='profile';render();const avatar=document.querySelector('.profile-avatar'),style=getComputedStyle(avatar),result={emoji:avatar.textContent.trim(),background:style.backgroundColor,border:style.borderColor,label:document.querySelector('.profile-card p')?.textContent||''};state.character=originalCharacter;state.page='home';render();return result});
    ok(starAvatar.emoji==='⭐'&&starAvatar.background==='rgb(36, 74, 54)'&&starAvatar.border==='rgb(244, 212, 127)'&&starAvatar.label.includes('Bintang'),'ikon profil Bintang tetap sama dan kini memiliki latar gelap serta bingkai kontras');
    await page.locator('.nav-link[data-page="learn"]').click();
    await page.evaluate(()=>{state.activeLevel=1;state.levelProgress[1]=['fraction'];state.activeTopic=null;render()});
    const completion=await page.locator('[data-topic="fraction"]').evaluate(el=>({decorative:el.querySelectorAll('.completion-mark').length,status:el.querySelector('.topic-status.done')?.textContent||'',check:getComputedStyle(el.querySelector('.topic-status.done'),':before').content}));
    ok(completion.decorative===0&&completion.status.includes('Selesai di level ini')&&completion.check.replace(/["']/g,'')==='✓'&&(completion.status.match(/✓/g)||[]).length===0,'status materi selesai menampilkan tepat satu tanda centang');

    for(const level of [1,2,3]) for(const topic of ['addition','subtraction','multiplication','division','fraction','number-pattern']) {
      await page.evaluate(({level,topic})=>{state.page='learn';state.activeLevel=level;state.activeTopic=topic;render()}, {level,topic});
      const guide=await page.locator('.lesson-guide').innerText();
      const example=await page.locator('.worked-example').innerText();
      const diagram=await page.locator('.question-illustration').evaluate(el=>({label:el.querySelector('.question-illustration-heading .eyebrow')?.textContent||'',pits:el.querySelectorAll('.question-pit').length,rows:[...el.querySelectorAll('.question-pit-row')].map(row=>row.querySelectorAll('.question-pit').length),stores:el.querySelectorAll('.question-board-store').length,alt:el.querySelector('.question-board')?.getAttribute('aria-label')||''}));
      ok((topic==='number-pattern'?guide.toLowerCase().includes('selisih'):guide.includes('Dari benda ke simbol'))&&guide.includes('Ringkasan')&&guide.includes('Hubungkan dengan congklak')&&await page.locator('.lesson-guide-bridge li').count()===3,`${topic} Level ${level}: panduan berisi konsep, langkah, rangkuman, dan kaitan papan`);
      ok(example.includes('Contoh terpecahkan')&&await page.locator('.worked-example ol li').count()===3,`${topic} Level ${level}: contoh terpecahkan tersedia`);
      if(topic==='number-pattern'&&level===1)ok(example.includes('pola tambah 2')&&example.includes('5 + 2 = 7'),'materi pola bilangan tetap menjelaskan aturan tambah 2 dengan contoh');
      ok(diagram.label.toLowerCase().includes(topic==='addition'?'penjumlahan':topic==='subtraction'?'pengurangan':topic==='multiplication'?'perkalian':topic==='division'?'pembagian':topic==='fraction'?'pecahan':'pola bilangan')&&diagram.pits===14&&diagram.rows.join('|')==='7|7'&&diagram.stores===2&&diagram.alt.includes('14 lubang kecil'),`${topic} Level ${level}: label sesuai operasi dan diagram berpola 14+2`);
    }
    const maxMaterialNumber=await page.evaluate(()=>{
      const text=JSON.stringify({lessonGuides,levelChallenges,quizBanks,quizExtras});
      return Math.max(...(text.match(/\d+/g)||[]).map(Number));
    });
    ok(maxMaterialNumber<100,`semua angka materi dan bank soal di bawah 100 (terbesar ${maxMaterialNumber})`);

    await page.locator('.nav-link[data-page="play"]').click();
    const desktopWidth=await page.locator('.board-shell').evaluate(el=>el.getBoundingClientRect().width);
    ok(desktopWidth>830,'papan tradisional sedikit lebih lebar pada desktop');
    const gameBefore=await page.evaluate(()=>JSON.stringify(state.game));
    const scoresBefore=await page.evaluate(()=>JSON.stringify({pre:state.preScores,post:state.postScores,progress:state.levelProgress}));
    await page.locator('[data-play-mode="learning"]').click();
    const trainingBoard=await page.evaluate(()=>({pits:document.querySelectorAll('[data-study-pit]').length,traditional:document.querySelectorAll('[data-pit]').length,stores:document.querySelectorAll('.board-shell .store-pit').length,seeds:studyRound.pits.reduce((a,b)=>a+b,0),smallPits:[0,1,2,3,4,5,6,8,9,10,11,12,13,14].map(i=>studyRound.pits[i]),storesEmpty:studyRound.pits[7]===0&&studyRound.pits[15]===0,mode:playMode}));
    ok(trainingBoard.pits===14&&trainingBoard.traditional===0&&trainingBoard.stores===2&&trainingBoard.seeds===98&&trainingBoard.smallPits.every(n=>n>0)&&new Set(trainingBoard.smallPits).size>1&&trainingBoard.storesEmpty&&trainingBoard.mode==='learning','mode Belajar memulai ronde acak dengan 14 lubang berisi dan tepat 98 biji');
    await page.locator('[data-study-topic="addition"]').click();
    await page.locator('[data-study-pit="0"]').click();
    ok((await page.locator('.study-question-modal h2').innerText()).includes('menambah 3 biji')&&await page.locator('.study-question-modal[role="dialog"][aria-modal="true"]').count()===1,'mengetuk lubang membuka popup soal aksesibel dengan jumlah biji lubang');
    const first=await page.evaluate(()=>({count:studyRound.pits[0],answer:studyQuestion.answer}));
    await page.locator(`[data-study-answer="${first.answer===0?1:0}"]`).click();
    await page.locator('.study-question-modal').waitFor({state:'detached'});
    const wrongResult=await page.evaluate(()=>({right:studyRound.pits[7],left:studyRound.pits[15],pit:studyRound.pits[0],selected:studyRound.selected[0],count:studyRound.answered,total:studyRound.pits.reduce((a,b)=>a+b,0),modal:!!document.querySelector('.study-question-modal')}));
    ok(wrongResult.left===first.count&&wrongResult.right===0&&wrongResult.pit===0&&wrongResult.selected&&wrongResult.count===1&&wrongResult.total===98&&!wrongResult.modal,'jawaban salah menutup popup otomatis, menandai lubang, dan memindahkan seluruh bijinya ke lumbung Buji kiri');
    await page.locator('[data-study-pit="1"]').click();
    const second=await page.evaluate(()=>({count:studyRound.pits[1],answer:studyQuestion.answer}));
    await page.locator(`[data-study-answer="${second.answer}"]`).click();
    await page.locator('.study-question-modal').waitFor({state:'detached'});
    const rightResult=await page.evaluate(()=>({right:studyRound.pits[7],left:studyRound.pits[15],pit:studyRound.pits[1],selected:studyRound.selected[1],count:studyRound.answered,total:studyRound.pits.reduce((a,b)=>a+b,0)}));
    ok(rightResult.right===second.count&&rightResult.left===first.count&&rightResult.pit===0&&rightResult.selected&&rightResult.count===2&&rightResult.total===98,'jawaban benar masuk ke lumbung pemain kanan dan biji tetap terhitung tepat');

    const operations=[['subtraction','Pindahkan'],['multiplication','lubang memiliki isi sama'],['division','dibagikan rata'],['fraction','pecahan apa'],['number-pattern','Urutan biji:']];
    const used=new Set([0,1]);
    for(const [operationIndex,[topic,phrase]] of operations.entries()){
      await page.locator(`[data-study-topic="${topic}"]`).click();
      const pitIndex=9+operationIndex;used.add(pitIndex);
      await page.locator(`[data-study-pit="${pitIndex}"]`).click();
      const questionText=await page.locator('.study-question-modal h2').innerText();
      const patternValid=topic!=='number-pattern'||await page.evaluate(i=>{const q=studyQuestion,n=studyRound.pits[i];return q.prompt===`Urutan biji: ${n}, ${n+2}, ${n+4}, … Berapa bilangan berikutnya?`&&!q.prompt.toLowerCase().includes('bertambah')&&q.answer===1&&q.options.map(Number).join(',')===[n+5,n+6,n+7].join(',')},pitIndex);
      ok(questionText.toLowerCase().includes(phrase.toLowerCase())&&await page.evaluate(()=>studyQuestion.topicId)===topic&&patternValid,`lubang membuka popup soal interaktif jenis ${topic}${topic==='number-pattern'?' dengan sequence dan jawaban/distraktor yang benar tanpa petunjuk aturan':''}`);
      const before=await page.evaluate(i=>({count:studyRound.pits[i],answer:studyQuestion.answer,right:studyRound.pits[7],left:studyRound.pits[15]}),pitIndex);
      await page.locator(`[data-study-answer="${before.answer}"]`).click();
      await page.locator('.study-question-modal').waitFor({state:'detached'});
      const after=await page.evaluate(i=>({right:studyRound.pits[7],left:studyRound.pits[15],pit:studyRound.pits[i],selected:studyRound.selected[i],total:studyRound.pits.reduce((a,b)=>a+b,0)}),pitIndex);
      ok(after.right===before.right+before.count&&after.left===before.left&&after.pit===0&&after.selected&&after.total===98,`${topic}: feedback singkat lalu biji dipindahkan tanpa kehilangan hitungan`);
    }
    for(const pitIndex of [2,3,4,5,6,8,14]){
      await page.locator(`[data-study-pit="${pitIndex}"]`).click();
      const pick=await page.evaluate(i=>({count:studyRound.pits[i],answer:studyQuestion.answer,round:studyRound.answered}),pitIndex);
      const correct=pick.round%2===0,answer=correct?pick.answer:(pick.answer===0?1:0);
      await page.locator(`[data-study-answer="${answer}"]`).click();
      await page.locator('.study-question-modal').waitFor({state:'detached'});
      used.add(pitIndex);
      const accounting=await page.evaluate(()=>({left:studyRound.pits[15],right:studyRound.pits[7],pits:[0,1,2,3,4,5,6,8,9,10,11,12,13,14].map(i=>studyRound.pits[i]),selected:studyRound.selected.filter(Boolean).length,total:studyRound.pits.reduce((a,b)=>a+b,0)}));
      ok(accounting.selected===used.size&&accounting.total===98&&accounting.pits.filter(n=>n===0).length===used.size&&accounting.left+accounting.right+accounting.pits.reduce((a,b)=>a+b,0)===98,`lubang ${pitIndex} selesai dipilih satu kali dan konservasi biji tetap 98`);
    }
    const complete=await page.evaluate(()=>({stores:[studyRound.pits[15],studyRound.pits[7]],selected:studyRound.selected.filter(Boolean).length,pits:[0,1,2,3,4,5,6,8,9,10,11,12,13,14].map(i=>studyRound.pits[i]),total:studyRound.pits.reduce((a,b)=>a+b,0),progress:document.querySelector('.study-progress-card h2')?.textContent||'',disabled:[...document.querySelectorAll('[data-study-pit]')].filter(el=>el.disabled).length}));
    ok(complete.selected===14&&complete.pits.every(n=>n===0)&&complete.stores[0]+complete.stores[1]===98&&complete.total===98&&complete.progress.includes('semua lubang')&&complete.disabled===14,'14 lubang habis dipilih tepat sekali; lumbung kiri dan kanan bersama menyimpan 98 biji');
    await page.locator('[data-study-pit="0"]').click({force:true});
    ok(await page.locator('.study-question-modal').count()===0,'lubang yang sudah dipilih tidak dapat dimainkan ulang');
    await page.locator('[data-action="study-reset"]').click();
    ok(await page.evaluate(()=>studyRound.answered===0&&studyRound.pits.reduce((a,b)=>a+b,0)===98&&studyRound.pits[7]===0&&studyRound.pits[15]===0),'tombol ronde baru mengacak kembali 98 biji tanpa mengubah aturan congklak');
    await page.locator('[data-play-mode="traditional"]').click();
    ok(await page.locator('[data-pit]').count()===14&&await page.locator('[data-study-pit]').count()===0&&await page.locator('[data-game-mode]').count()===2,'mode Tradisional tetap menyediakan 14 lubang dan pilihan 2 pemain/Buji');
    await page.locator('[data-pit="0"]').click();
    await page.waitForFunction(()=>state.game&&!state.game.animating,{},{timeout:12000});
    ok(await page.evaluate(()=>state.game.pits.reduce((a,b)=>a+b,0)===98),'satu langkah tradisional tetap berjalan dan menjaga tepat 98 biji');
    await context.close();

    for(const width of [320,360,390]){
      const {context:mobileContext,page:mobile}=await pageAt(browser,url,{viewport:{width,height:840},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));
      await mobile.locator('.bottom-nav [data-bottom-route="learn"]').click();
      const diagrams=await mobile.evaluate(topics=>topics.map(topic=>{state.activeLevel=3;state.activeTopic=topic;render();const el=document.querySelector('.question-illustration'),r=el.getBoundingClientRect();return {topic,overflow:document.documentElement.scrollWidth-innerWidth,left:r.left,right:r.right,pits:el.querySelectorAll('.question-pit').length}}),['addition','subtraction','multiplication','division','fraction','number-pattern']);
      ok(diagrams.every(x=>x.overflow===0&&x.left>=-1&&x.right<=width+1&&x.pits===14),`${width}px: semua ilustrasi mini 14 lubang muat tanpa overflow`);
      await mobile.locator('.bottom-nav [data-bottom-route="play"]').click();
      const traditional=await mobile.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,board:document.querySelector('.board-shell').getBoundingClientRect(),pit:document.querySelector('[data-pit]').getBoundingClientRect().width}));
      ok(traditional.overflow===0&&traditional.board.left>=-1&&traditional.board.right<=width+1&&traditional.pit>=31,`${width}px: papan tradisional terbaca dan target lubang dapat disentuh`);
      await mobile.locator('[data-play-mode="learning"]').click();
      await mobile.locator('[data-study-topic="fraction"]').click();
      await mobile.locator('[data-study-pit="0"]').click();
      const learning=await mobile.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,question:!!document.querySelector('.study-question-modal[role="dialog"][aria-modal="true"] h2'),target:document.querySelector('[data-study-answer]')?.getBoundingClientRect().height||0,dialog:document.querySelector('.study-question-modal')?.getBoundingClientRect(),viewport:innerWidth}));
      ok(learning.overflow===0&&learning.question&&learning.target>=44&&learning.dialog.left>=0&&learning.dialog.right<=learning.viewport,`${width}px: popup Belajar dan target jawaban muat pada layar ponsel tanpa overflow`);
      await mobile.locator('[data-study-answer]').first().focus();await mobile.keyboard.press('Tab');
      ok(await mobile.evaluate(()=>document.activeElement.matches('[data-study-answer]')),'Tab tetap berada pada satu pilihan radio yang menjadi fokus popup');
      await mobile.locator('[data-study-answer]').first().press('Escape');
      ok(await mobile.locator('.study-question-modal').count()===1,'Escape tidak membuang soal yang sedang dikerjakan');
      await mobile.locator('[data-study-answer]').first().press('ArrowRight');await mobile.locator('.study-question-modal').waitFor({state:'detached'});
      ok(await mobile.evaluate(()=>studyRound.answered===1&&studyRound.pits[7]>0&&studyRound.pits.reduce((a,b)=>a+b,0)===98),`${width}px: keyboard memilih jawaban, menutup soal otomatis, dan menjaga jumlah biji`);
      await mobileContext.close();
    }
    ok(errors.length===0,`tidak ada JavaScript page error (${errors.join('; ')})`);
    console.log(`PASS learning-mode regression (${checks} checks)`);
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(`FAIL learning-mode regression: ${error.stack||error}`);process.exitCode=1;server.close();});
