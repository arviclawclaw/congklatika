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
  const page = await context.newPage(); page.setDefaultTimeout(7000); await page.goto(url,{waitUntil:'domcontentloaded'}); await page.locator('#app').waitFor(); return {context,page};
}
(async()=>{
  const url=await listen();
  const launch={headless:true,args:process.platform==='linux'?['--no-sandbox']:[]};
  if(process.env.CHROMIUM_PATH) launch.executablePath=process.env.CHROMIUM_PATH;
  else if(fs.existsSync('/usr/bin/chromium')) launch.executablePath='/usr/bin/chromium';
  const browser=await chromium.launch(launch),errors=[];
  try {
    const {context,page}=await pageAt(browser,url); page.on('pageerror',e=>errors.push(e.message));
    await page.locator('.nav-link[data-page="learn"]').click();
    await page.evaluate(()=>{state.activeLevel=1;state.levelProgress[1]=['fraction'];state.activeTopic=null;render()});
    const completion=await page.locator('[data-topic="fraction"]').evaluate(el=>({decorative:el.querySelectorAll('.completion-mark').length,status:el.querySelector('.topic-status.done')?.textContent||''}));
    ok(completion.decorative===0&&completion.status.includes('Selesai di level ini')&&(completion.status.match(/✓/g)||[]).length===1,'status materi selesai jelas dengan tepat satu tanda centang');

    for(const level of [1,2,3]) for(const topic of ['addition','subtraction','multiplication','division','fraction']) {
      await page.evaluate(({level,topic})=>{state.page='learn';state.activeLevel=level;state.activeTopic=topic;render()}, {level,topic});
      const guide=await page.locator('.lesson-guide').innerText();
      const example=await page.locator('.worked-example').innerText();
      const diagram=await page.locator('.question-illustration').evaluate(el=>({label:el.querySelector('.question-illustration-heading .eyebrow')?.textContent||'',pits:el.querySelectorAll('.question-pit').length,rows:[...el.querySelectorAll('.question-pit-row')].map(row=>row.querySelectorAll('.question-pit').length),stores:el.querySelectorAll('.question-board-store').length,alt:el.querySelector('.question-board')?.getAttribute('aria-label')||''}));
      ok(guide.includes('Dari benda ke simbol')&&guide.includes('Ringkasan')&&guide.includes('Hubungkan dengan congklak')&&await page.locator('.lesson-guide-bridge li').count()===3,`${topic} Level ${level}: panduan berisi konsep, langkah, rangkuman, dan kaitan papan`);
      ok(example.includes('Contoh terpecahkan')&&await page.locator('.worked-example ol li').count()===3,`${topic} Level ${level}: contoh terpecahkan tersedia`);
      ok(diagram.label.toLowerCase().includes(topic==='addition'?'penjumlahan':topic==='subtraction'?'pengurangan':topic==='multiplication'?'perkalian':topic==='division'?'pembagian':'pecahan')&&diagram.pits===14&&diagram.rows.join('|')==='7|7'&&diagram.stores===2&&diagram.alt.includes('14 lubang kecil'),`${topic} Level ${level}: label sesuai operasi dan diagram berpola 14+2`);
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
    const trainingBoard=await page.evaluate(()=>({pits:document.querySelectorAll('[data-study-pit]').length,traditional:document.querySelectorAll('[data-pit]').length,stores:document.querySelectorAll('.board-shell .store-pit').length,seeds:initialStudyBoard().reduce((a,b)=>a+b,0),mode:playMode}));
    ok(trainingBoard.pits===14&&trainingBoard.traditional===0&&trainingBoard.stores===2&&trainingBoard.seeds===98&&trainingBoard.mode==='learning','mode Belajar menampilkan 14 lubang dan dua lumbung tanpa memakai tombol gerak tradisional');
    await page.locator('[data-study-topic="addition"]').click();
    await page.locator('[data-study-pit="0"]').click();
    ok((await page.locator('.study-question h2').innerText()).includes('menambah 3 biji'),'mengetuk lubang bernomor membuka soal yang memakai jumlah bijinya');
    const answer=await page.evaluate(()=>studyQuestion.answer);
    const wrong=answer===0?1:0;
    await page.locator(`[data-study-answer="${wrong}"]`).click();
    ok(await page.locator('.study-feedback.is-retry').count()===1&&await page.locator('[data-action="study-retry"]').count()===1,'jawaban keliru memberi umpan balik ramah dan tombol mencoba lagi');
    await page.locator('[data-action="study-retry"]').click();
    await page.locator(`[data-study-answer="${answer}"]`).click();
    ok(await page.locator('.study-feedback.is-correct').count()===1,'jawaban benar memberi umpan balik yang jelas');

    const operations=[['subtraction','Pindahkan'],['multiplication','lubang memiliki isi sama'],['division','dibagikan rata'],['fraction','pecahan apa']];
    for(const [topic,phrase] of operations){
      await page.locator(`[data-study-topic="${topic}"]`).click();
      await page.locator('[data-study-pit="9"]').click();
      ok((await page.locator('.study-question h2').innerText()).toLowerCase().includes(phrase.toLowerCase())&&await page.evaluate(()=>studyQuestion.topicId)===topic,`lubang membuka soal interaktif jenis ${topic}`);
      const correct=await page.evaluate(()=>studyQuestion.answer);
      await page.locator(`[data-study-answer="${correct}"]`).click();
      ok(await page.locator('.study-feedback.is-correct').count()===1,`${topic}: jawaban benar dan umpan balik interaktif`);
    }
    const preserved=await page.evaluate(()=>({game:JSON.stringify(state.game),scores:JSON.stringify({pre:state.preScores,post:state.postScores,progress:state.levelProgress})}));
    ok(preserved.game===gameBefore&&preserved.scores===scoresBefore,'latihan tidak mengubah permainan, skor tes, atau progres materi');
    await page.locator('[data-play-mode="traditional"]').click();
    ok(await page.locator('[data-pit]').count()===14&&await page.locator('[data-study-pit]').count()===0&&await page.locator('[data-game-mode]').count()===2,'mode Tradisional tetap menyediakan 14 lubang dan pilihan 2 pemain/Buji');
    await page.locator('[data-pit="0"]').click();
    await page.waitForFunction(()=>state.game&&!state.game.animating,{},{timeout:12000});
    ok(await page.evaluate(()=>state.game.pits.reduce((a,b)=>a+b,0)===98),'satu langkah tradisional tetap berjalan dan menjaga tepat 98 biji');
    await context.close();

    for(const width of [320,360,390]){
      const {context:mobileContext,page:mobile}=await pageAt(browser,url,{viewport:{width,height:840},isMobile:true,hasTouch:true});mobile.on('pageerror',e=>errors.push(e.message));
      await mobile.locator('.bottom-nav [data-bottom-route="learn"]').click();
      const diagrams=await mobile.evaluate(topics=>topics.map(topic=>{state.activeLevel=3;state.activeTopic=topic;render();const el=document.querySelector('.question-illustration'),r=el.getBoundingClientRect();return {topic,overflow:document.documentElement.scrollWidth-innerWidth,left:r.left,right:r.right,pits:el.querySelectorAll('.question-pit').length}}),['addition','subtraction','multiplication','division','fraction']);
      ok(diagrams.every(x=>x.overflow===0&&x.left>=-1&&x.right<=width+1&&x.pits===14),`${width}px: semua ilustrasi mini 14 lubang muat tanpa overflow`);
      await mobile.locator('.bottom-nav [data-bottom-route="play"]').click();
      const traditional=await mobile.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,board:document.querySelector('.board-shell').getBoundingClientRect(),pit:document.querySelector('[data-pit]').getBoundingClientRect().width}));
      ok(traditional.overflow===0&&traditional.board.left>=-1&&traditional.board.right<=width+1&&traditional.pit>=31,`${width}px: papan tradisional terbaca dan target lubang dapat disentuh`);
      await mobile.locator('[data-play-mode="learning"]').click();
      await mobile.locator('[data-study-topic="fraction"]').click();
      await mobile.locator('[data-study-pit="0"]').click();
      const learning=await mobile.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,question:!!document.querySelector('.study-question h2'),target:document.querySelector('[data-study-answer]')?.getBoundingClientRect().height||0}));
      ok(learning.overflow===0&&learning.question&&learning.target>=44,`${width}px: mode Belajar, soal, dan tombol jawaban muat tanpa overflow`);
      await mobileContext.close();
    }
    ok(errors.length===0,`tidak ada JavaScript page error (${errors.join('; ')})`);
    console.log(`PASS learning-mode regression (${checks} checks)`);
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(`FAIL learning-mode regression: ${error.stack||error}`);process.exitCode=1;server.close();});
