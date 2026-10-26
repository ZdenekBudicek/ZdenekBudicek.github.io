import{c8 as j,c9 as L}from"./index-DzIWm1pR.js";const M=(e,n,t=0)=>new Intl.NumberFormat(n==="en"?"en-US":"cs-CZ",{minimumFractionDigits:t,maximumFractionDigits:t}).format(e),s=(e,n,t=0)=>`${M(e,n,t)} USD`,u=(e,n,t=1,i=!0)=>`${i&&e>0?"+":e<0?"−":""}${M(Math.abs(e),n,t)} %`;function F(e){const n=e.tables.positions.filter(o=>o.ticker!=="CASH"&&o.shares>1e-9&&e.prices[o.ticker]),t=o=>o.shares*e.prices[o.ticker].price,i=e.tables.positions.find(o=>o.ticker==="CASH")?.shares??0,h=n.reduce((o,r)=>o+t(r),0)+i,p=n.reduce((o,r)=>o+r.shares*(e.prices[r.ticker].prevClose??e.prices[r.ticker].price),0)+i,y=[...n].sort((o,r)=>e.prices[r.ticker].changePct-e.prices[o.ticker].changePct),g=y[0],w=y[y.length-1],c=e.today.slice(0,4),l=[...e.tables.transactions].sort((o,r)=>o.executed_at.localeCompare(r.executed_at)),d=l.filter(o=>o.executed_at.startsWith(c)),b=d.filter(o=>o.side==="BUY"),v=d.filter(o=>o.side==="SELL"),z=o=>o.shares*o.price_usd,k=[...b].sort((o,r)=>z(r)-z(o))[0],A=new Map,N=new Date(Date.parse(`${e.today}T00:00:00Z`)-730*864e5).toISOString().slice(0,10);let P=0,x=0,q=0;for(const o of l){const r=A.get(o.ticker)??[];if(A.set(o.ticker,r),o.side==="BUY"){r.push({qty:o.shares,price:o.price_usd});continue}let m=o.shares,f=-(o.fee_usd??0);for(;m>1e-9&&r.length;){const $=r[0],S=Math.min(m,$.qty);f+=S*(o.price_usd-$.price),$.qty-=S,m-=S,$.qty<=1e-9&&r.shift()}o.executed_at.slice(0,10)<N||(q+=f,o.executed_at.startsWith(c)?P+=f:x+=f)}const O=o=>e.tables.price_history.filter(r=>r.symbol===o),E=e.tables.benchmark_history.filter(o=>o.symbol==="SPX");return{today:{changePct:p>0?(h/p-1)*100:0,...g?{up:{ticker:g.ticker,pct:e.prices[g.ticker].changePct}}:{},...w?{down:{ticker:w.ticker,pct:e.prices[w.ticker].changePct}}:{}},trades:{buys:b.length,buyUsd:b.reduce((o,r)=>o+z(r),0),sells:v.length,sellUsd:v.reduce((o,r)=>o+z(r),0),...k?{largest:{ticker:k.ticker,usd:z(k)}}:{}},realized:{total:q,thisYear:P,lastYear:x},weight:o=>{const r=n.find(m=>m.ticker===o);return r&&h>0?t(r)/h*100:0},price:o=>e.prices[o]?.price??0,move:(o,r)=>{const m=O(o),f=E;if(m.length<=r||f.length<=r)return null;const $=m[m.length-1].close,S=m[m.length-1-r].close,C=f[f.length-1].close_value,D=f[f.length-1-r].close_value;return{pct:($/S-1)*100,spx:(C/D-1)*100}}}}function U(e,n){const t=n.price("MSFT"),h=[["Pesimistický","Bear",.78,8,34,24],["Základní","Base",1.24,14,37,30],["Optimistický","Bull",1.52,18,39,34]].map(([p,y,g,w,c,l])=>{const d=(g**.5-1)*100;return a(e,`• **${p}:** ${s(t*g,e)}, ročně ${u(d,e)} (tržby ${u(w,e,0)} ročně, marže ${c} %, P/E ${l})`,`• **${y}:** ${s(t*g,e)}, ${u(d,e)} a year (revenue ${u(w,e,0)} a year, margin ${c}%, P/E ${l})`)});return[a(e,"Ocenění a kde může být cena za 2 roky","Valuation and where the price could be in 2 years"),a(e,`Akcie dnes stojí ${s(t,e)}.`,`The share trades at ${s(t,e)}.`),a(e,"P/E je 33 (pětiletý medián 32), tedy zhruba průměrně vůči vlastní historii.","The P/E is 33 (5-year median 32), about average against its own history."),a(e,`Analytici: 52 z 58 doporučuje koupit, 6 držet, 0 prodat; průměrný cíl na 12 měsíců je ${s(t*1.13,e)} (${s(t*.85,e)} – ${s(t*1.4,e)}), tedy ${u(13,e)}.`,`Analysts: 52 of 58 rate it buy, 6 hold, 0 sell; the mean 12-month target is ${s(t*1.13,e)} (${s(t*.85,e)} – ${s(t*1.4,e)}), ${u(13,e)}.`),a(e,`Model férové hodnoty Trackory vychází na ${s(t*1.06,e)} (${u(6,e)}), opatrněji než analytici.`,`The Trackora fair value model gives ${s(t*1.06,e)} (${u(6,e)}), more cautious than analysts.`),a(e,"Dnešní cena počítá s růstem tržeb zhruba 15 % ročně v prvních dvou letech.","Today's price assumes revenue growth of about 15% a year for two years."),a(e,"Scénáře vycházejí z tržeb a marže podle analytiků a z P/E podle růstu, který firmě ještě zbývá (nad dnešní P/E počítají jen s polovinou přecenění):","The scenarios use analysts' revenue and margin and a P/E for the growth still ahead (above today's P/E, only half of that re-rating):"),...h,a(e,"Jsou to modelové scénáře, ne předpověď ani doporučení.","These are model scenarios, not a forecast or advice.")].join(`
`)}const V={cs:"Ukázková odpověď: data i zprávy jsou v demu smyšlené.",en:"Demo answer: data and news are invented in the demo."},a=(e,n,t)=>e==="en"?t:n,W=[{key:"today",question:j.today,trace:{cs:["Pozice","Souhrn portfolia","Zprávy"],en:["Holdings","Portfolio summary","News"]},text:(e,n)=>{const{changePct:t,up:i,down:h}=n.today,p=[a(e,`**Shrnutí:** Portfolio je dnes ${Math.abs(t)<.3?"zhruba beze změny":t>0?"v plusu":"v minusu"}, ${u(t,e,2)}.`,`**Summary:** The portfolio is ${Math.abs(t)<.3?"roughly flat":t>0?"up":"down"} today, ${u(t,e,2)}.`)];return i&&p.push(a(e,`• **Nejvíc roste ${i.ticker}, ${u(i.pct,e,2)}:** k pohybu najdeš ukázkové zprávy v detailu akcie.`,`• **${i.ticker} rises the most, ${u(i.pct,e,2)}:** sample news is in the stock detail.`)),h&&h.ticker!==i?.ticker&&p.push(a(e,`• **Nejvíc klesá ${h.ticker}, ${u(h.pct,e,2)}:** pohyb je v rámci běžného kolísání posledních týdnů.`,`• **${h.ticker} falls the most, ${u(h.pct,e,2)}:** the move is within its usual swings of recent weeks.`)),p.push(a(e,"Zdroje: Trackora – pozice a dnešní ceny.","Sources: Trackora – holdings and today's prices.")),p.join(`

`)}},{key:"trades",question:j.trades,trace:{cs:["Obchody"],en:["Trades"]},text:(e,n)=>{const t=n.trades;return[a(e,`Letos jsi nakoupil za **${s(t.buyUsd,e)}** v ${t.buys} obchodech a prodal za **${s(t.sellUsd,e)}** v ${t.sells} obchodech.`,`This year you bought **${s(t.buyUsd,e)}** in ${t.buys} trades and sold **${s(t.sellUsd,e)}** in ${t.sells} trades.`),...t.largest?[a(e,`Největší nákup: ${t.largest.ticker}, ${s(t.largest.usd,e)}.`,`Largest purchase: ${t.largest.ticker}, ${s(t.largest.usd,e)}.`)]:[],a(e,"Zdroje: Trackora – obchody.","Sources: Trackora – trades.")].join(`

`)}},{key:"realized",question:j.realized,trace:{cs:["Realizované výsledky"],en:["Realized results"]},text:(e,n)=>{const t=n.realized;return[a(e,`Za posledních 24 měsíců jsi realizoval ${t.total>=0?"zisk":"ztrátu"} **${s(Math.abs(t.total),e)}**.`,`Over the last 24 months you realized a ${t.total>=0?"profit":"loss"} of **${s(Math.abs(t.total),e)}**.`),a(e,`• letos: ${s(t.thisYear,e)}
• předtím: ${s(t.lastYear,e)}`,`• this year: ${s(t.thisYear,e)}
• before: ${s(t.lastYear,e)}`),a(e,"Prodeje se párují s nejstaršími nákupy (FIFO); je to před daní – daňový pohled je na stránce Daně.","Sales are matched with the oldest purchases (FIFO); this is before tax – the Taxes page shows the tax view."),a(e,"Zdroje: Trackora – realizované výsledky.","Sources: Trackora – realized results.")].join(`

`)}},{key:"buy",question:j.buy,trace:{cs:["Cena","Názor analytiků","Férová hodnota","Historie ocenění","Zprávy","Pozice"],en:["Price","Analyst view","Fair value","Valuation history","News","Holdings"]},text:(e,n)=>{const t=n.price("NVDA"),i=n.weight("NVDA");return[a(e,`**Analytici**
Průměrná cílová cena je ${s(t*1.12,e)} (rozpětí ${s(t*.82,e)} – ${s(t*1.42,e)}), 38 ze 44 analytiků doporučuje koupit.`,`**Analysts**
The average target is ${s(t*1.12,e)} (range ${s(t*.82,e)} – ${s(t*1.42,e)}); 38 of 44 analysts rate it buy.`),a(e,`**Ocenění**
Férová hodnota z modelů Trackory je ${s(t*.97,e)} při ceně ${s(t,e)}. P/E je nad svým pětiletým mediánem.`,`**Valuation**
Trackora's model fair value is ${s(t*.97,e)} against a price of ${s(t,e)}. The P/E is above its five-year median.`),a(e,`**Rizika**
NVDA tvoří ${u(i,e,1,!1)} tvého portfolia; model je citlivý na předpoklad růstu.`,`**Risks**
NVDA is ${u(i,e,1,!1)} of your portfolio; the model is sensitive to the growth assumption.`),a(e,`**Můj názor**
Za současnou cenu to podle mě není výhodný nákup ani přepálená cena – je zhruba férová. Ve velkém bych nepřikupoval; dává smysl počkat na lepší cenu nebo přikupovat po menších částech. Byznys vypadá zdravě: v posledním vykázaném roce je ziskový (73 mld. USD) a vydělává hotovost (volný cash flow 61 mld. USD).${i>=15?" Pozice už je velká část tvého portfolia, takže bych další nákup zvažoval hlavně z pohledu rizika.":""}
Cena vůči ocenění: zhruba férová, bez výrazné slevy. Jistota: střední.
Co by závěr změnilo: cena pod ${s(t*.82,e)} nebo výrazně lepší výsledky.
Je to můj názor z dostupných dat, ne investiční doporučení – rozhodnutí je na tobě.`,`**My view**
At the current price this is neither a bargain nor overpriced – it is about fair. I would not add a lot; waiting for a better price or adding in small steps makes sense. The business looks healthy: profitable in the latest reported year (USD 73B) and generating cash (free cash flow USD 61B).${i>=15?" The position is already a large part of your portfolio, so I would weigh another purchase mainly on risk.":""}
Price vs valuation: about fair, no real discount. Confidence: medium.
What would change it: a price below ${s(t*.82,e)} or clearly better results.
This is my view from the available data, not investment advice – the decision is yours.`)].join(`

`)}},{key:"move",question:j.move,trace:{cs:["Historie ceny","Podobné firmy","Zprávy","Výsledky hospodaření"],en:["Price history","Peers","News","Earnings"]},text:(e,n)=>{const t=n.move("PLTR",5),i=(t?.pct??0)>=0,h=t?a(e,`**Co se stalo**
Za posledních 5 obchodních dní se cena PLTR změnila o ${u(t.pct,e)}, index S&P 500 o ${u(t.spx,e)}.`,`**What happened**
Over the last 5 trading days PLTR changed ${u(t.pct,e)}, the S&P 500 ${u(t.spx,e)}.`):"",p=i?a(e,`• **Nová vládní zakázka:** Firma získala víceletou zakázku na analýzu dat; investoři čekají stabilní příjmy.
• **Vyšší výhled tržeb:** Vedení zvedlo celoroční výhled díky poptávce po AI platformě.`,`• **New government contract:** The company won a multi-year data-analytics contract; investors expect steady revenue.
• **Higher revenue outlook:** Management raised its full-year outlook on demand for its AI platform.`):a(e,`• **Vybírání zisků:** Investoři po silném růstu prodávali dražší technologické akcie.
• **Obavy z ocenění:** Analytici upozorňují, že akcie je drahá vůči tržbám.`,`• **Profit-taking:** Investors sold pricier tech stocks after a strong run.
• **Valuation worries:** Analysts point out the stock is expensive relative to sales.`);return[a(e,`**Shrnutí:** ${i?"Růst táhnou hlavně zprávy přímo o firmě.":"Pokles je spíš vybírání zisků po předchozím růstu."}`,`**Summary:** ${i?"The rise is driven mainly by company news.":"The fall looks like profit-taking after an earlier run."}`),h,`${a(e,"**Proč se to pravděpodobně děje**","**Why it is likely happening**")}
${p}`,a(e,"Jde o pravděpodobné důvody podle zpráv, ne o prokázané příčiny.","These are likely drivers based on the news, not proven causes.")].filter(Boolean).join(`

`)}},{key:"scenarios",question:j.scenarios,trace:{cs:["Výkazy","Férová hodnota","Názor analytiků","Informace o firmě z webu","Zprávy"],en:["Financials","Fair value","Analyst view","Company research","News"]},text:(e,n)=>[a(e,"**Shrnutí:** Microsoft roste hlavně díky cloudu Azure a AI v kancelářském softwaru. Ocenění je slušné, ne levné: další růst ceny stojí na tom, jestli se investice do AI promítnou do tržeb.","**Summary:** Microsoft grows mainly on Azure cloud and AI in its office software. The valuation is fair, not cheap: further gains depend on AI spending turning into revenue."),a(e,`O firmě
• **Software a cloud:** Microsoft prodává Office, Windows a hlavně cloud Azure, ze kterého dnes plyne největší část růstu. Většina tržeb se opakuje každý rok.`,`About the company
• **Software and cloud:** Microsoft sells Office, Windows and above all the Azure cloud, which now brings most of the growth. Most revenue recurs every year.`),a(e,`Co může táhnout růst
• **AI v Azure a Office:** Firmy platí za AI nástroje navíc, takže roste tržba na zákazníka.
• **Výdaje firem na cloud:** Přesun firemních systémů do cloudu ještě zdaleka neskončil.`,`What could drive growth
• **AI in Azure and Office:** Companies pay extra for AI tools, lifting revenue per customer.
• **Cloud spending:** Moving business systems to the cloud is far from over.`),a(e,`Slabiny a rizika
• **Drahé investice do AI:** Datová centra stojí desítky miliard ročně; pokud se nevrátí, tlačí na marže.
• **Regulace:** Úřady v USA i EU hlídají sílu firmy v cloudu a softwaru.`,`Weaknesses and risks
• **Costly AI investment:** Data centres cost tens of billions a year; if they do not pay back, margins suffer.
• **Regulation:** US and EU regulators watch its power in cloud and software.`),U(e,n),a(e,`Jak to vidím
Microsoft má jednu z nejsilnějších pozic v technologiích a růst cloudu s AI je reálný. Cena už ale počítá s tím, že investice do AI vyjdou; základní scénář je proto rozumný, dobrý výsledek hlavně závisí na maržích.
Je to úvaha nad zprávami a čísly výše, ne investiční doporučení.`,`How I see it
Microsoft holds one of the strongest positions in tech and the cloud-plus-AI growth is real. The price already assumes AI spending pays off, so the base case is reasonable; a good outcome mostly depends on margins.
This is a reading of the news and figures above, not investment advice.`),a(e,`Na co se dívat
• Příští výsledky hospodaření a tempo růstu Azure.
• Kolik firem platí za AI nástroje v Office.`,`What to watch
• Next earnings and Azure growth.
• How many companies pay for the AI tools in Office.`)].join(`

`)},{key:"analysis",question:j.analysis,trace:{cs:["Informace o firmě z webu","Klíčové ukazatele","Zprávy"],en:["Company research","Key metrics","News"]},text:e=>a(e,`**Shrnutí:** ASML je jediný výrobce nejpokročilejších litografických strojů na čipy; silná pozice, ale závislost na cyklu polovodičů.

O firmě
• **Stroje na výrobu čipů:** ASML vyrábí litografické systémy, bez kterých nejde vyrobit nejmodernější čipy.

Co může táhnout růst
• **Technologický náskok:** V nejpokročilejší litografii nemá ASML konkurenci, a výrobci čipů tak nemají alternativu.

Slabiny a rizika
• **Exportní omezení:** Vývozní pravidla omezují prodeje do Číny.
• **Cyklus polovodičů:** Když výrobci čipů škrtají investice, objednávky strojů padají.

Jak to vidím
Dlouhodobě má ASML jednu z nejlepších pozic v technologiích. Krátkodobě bude kolísat s investicemi výrobců čipů a s politikou exportu.
Je to úvaha nad zprávami a čísly výše, ne investiční doporučení.`,`**Summary:** ASML is the only maker of the most advanced chip lithography machines; a strong position, but tied to the semiconductor cycle.

About the company
• **Chip-making machines:** ASML builds lithography systems without which the most advanced chips cannot be made.

What could drive growth
• **Technology lead:** ASML has no competitor in the most advanced lithography, so chipmakers have no alternative.

Weaknesses and risks
• **Export limits:** Export rules restrict sales to China.
• **Chip cycle:** When chipmakers cut investment, machine orders fall.

How I see it
Long term, ASML holds one of the best positions in tech. Short term it will swing with chipmakers' spending and export policy.
This is a reading of the news and figures above, not investment advice.`)},{key:"web",question:j.web,trace:{cs:["Vyhledávání na webu"],en:["Web search"]},text:e=>a(e,`**Odpověď:** Nižší sazby akciím obvykle pomáhají, protože budoucí zisky mají dnes vyšší hodnotu a úvěry zlevní. Záleží ale na tom, proč Fed sazby snižuje – kvůli slábnoucí ekonomice mohou zisky firem naopak klesat.

Podrobnosti
• **Levnější peníze:** Nejvíc pomáhají nižší sazby růstovým a zadluženým firmám.
• **Proč Fed snižuje:** Trhy rostou hlavně tehdy, když snížení přijde bez recese.`,`**Answer:** Lower rates usually help stocks: future profits are worth more today and borrowing gets cheaper. It depends on why the Fed cuts, though – a cut for a weakening economy can come with falling profits.

Details
• **Cheaper money:** Lower rates help growth and indebted companies most.
• **Why the Fed cuts:** Markets rise mainly when a cut comes without a recession.`)}],_={cs:"V demo verzi je chat vypnutý – asistent tu jen ukazuje, co umí, na předpřipravených otázkách. Vyber si některou z nabídky. S vlastním účtem odpovídá na cokoli o tvém portfoliu, akciích a investicích.",en:"In the demo the chat is switched off – the assistant only shows what it can do on prepared questions. Pick one from the list. With your own account it answers anything about your portfolio, stocks and investing."},T=e=>e.normalize("NFC").trim().toLowerCase();function Z(e){const n=T(e);return W.find(t=>T(t.question.cs)===n||T(t.question.en)===n)}const I=(e,n)=>new Promise((t,i)=>{const h=()=>i(n.reason??new DOMException("Aborted","AbortError"));if(n.aborted)return h();const p=setTimeout(()=>{n.removeEventListener("abort",y),t()},e),y=()=>{clearTimeout(p),h()};n.addEventListener("abort",y,{once:!0})});function H(e={}){const n=e.delayMs??350,t=[],i=new Map;let h=0;const p=()=>`dddddddd-dddd-4ddd-8ddd-${String(++h).padStart(12,"0")}`,y=()=>new Date().toISOString();let g=null;const w=()=>g??=F(L());return{async*stream(c,l){const d=c.lang==="en"?"en":"cs",b=Z(c.question);let v=t.find(k=>k.id===c.threadId);v||(v={id:p(),title:c.question.slice(0,120),updatedAt:y(),messages:[]},t.unshift(v)),yield{type:"meta",requestId:c.requestId,threadId:v.id,remainingToday:null},yield{type:"status",text:d==="en"?"Reading the sample data…":"Čtu ukázková data…"},await I(n,l),b&&(yield{type:"trace",items:b.trace[d].map(k=>({label:k,state:"ok"}))}),await I(n,l),b?.key==="scenarios"&&!i.has(c.requestId)&&(yield{type:"status",text:d==="en"?"Writing the company analysis…":"Píšu rozbor firmy…"},await I(n*3,l));const z=i.get(c.requestId)??(b?`${b.text(d,w())}

${V[d]}`:_[d]);if(!i.has(c.requestId)){i.set(c.requestId,z);const k=v.messages.length,A=d;v.messages.push({id:p(),requestId:c.requestId,seq:k+1,role:"user",content:c.question,lang:A,createdAt:y()},{id:p(),requestId:c.requestId,seq:k+2,role:"assistant",content:z,lang:A,createdAt:y()}),v.updatedAt=y()}yield{type:"answer",text:z,links:[],verified:!0},yield{type:"done",requestId:c.requestId,persisted:!0,outcome:"ok"}},async threads(){return t.map(({id:c,title:l,updatedAt:d})=>({id:c,title:l,updatedAt:d}))},async history(c){const l=t.find(d=>d.id===c);if(!l)throw new Error("Not found");return{thread:{id:l.id,title:l.title,updatedAt:l.updatedAt},messages:l.messages.map(d=>({...d}))}},async remove(c){const l=t.findIndex(d=>d.id===c);l>=0&&t.splice(l,1)}}}export{W as DEMO_QUESTIONS,H as createReplayTransport,Z as demoAnswer};
