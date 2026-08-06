import{S as f}from"./store-Cr00HOVh.js";import"https://esm.sh/@supabase/supabase-js@2";document.addEventListener("DOMContentLoaded",async()=>{await f.init();const y=document.getElementById("starfield"),v=window.innerWidth<700?60:130;for(let t=0;t<v;t++){const e=document.createElement("span");e.className="star";const s=1+Math.random()*1.8;e.style.width=s+"px",e.style.height=s+"px",e.style.left=Math.random()*100+"%",e.style.top=Math.random()*100+"%",e.style.setProperty("--s-min",(.1+Math.random()*.25).toFixed(2)),e.style.setProperty("--s-dx",(Math.random()*30-15).toFixed(1)+"px"),e.style.setProperty("--s-dy",(-(20+Math.random()*40)).toFixed(1)+"px");const a=(2+Math.random()*4).toFixed(1),n=(18+Math.random()*22).toFixed(1);e.style.animation=`starTwinkle ${a}s ease-in-out infinite, starDrift ${n}s ease-in-out infinite alternate`,e.style.animationDelay=`${(-Math.random()*10).toFixed(1)}s, ${(-Math.random()*10).toFixed(1)}s`,y.appendChild(e)}function l(t){return String(t||"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const m="evolution-cup",x=f.get("ic7_major_tours",{}),o=Object.assign({name:"Evolution Cup",teams:"10 Teams",desc:"A season-long league format that tests squad depth over knockout nerves."},x[m]||{});if(document.getElementById("tourName").textContent=o.name,document.getElementById("tourDesc").textContent=o.desc,document.getElementById("tourTeams").textContent=o.teams,document.title=o.name+"  -  IC7 Iconic Sevens",o.tourLogo){const t=document.getElementById("tourLogoWrap"),e=document.getElementById("tourLogoImg");t&&e&&(e.src=o.tourLogo,t.style.display="block")}if(o.champion){const t=document.querySelector(".tourpage-meta-row");if(t){const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.gap="4px";const s=o.champLogo?`<div style="width:24px;height:24px;border-radius:50%;background-image:url('${o.champLogo}');background-size:cover;background-position:center;border:1px solid var(--red);box-shadow: 0 0 10px rgba(225,29,72,0.3);"></div>`:"";e.innerHTML=`<span>Current Champion</span><b style="display:flex;align-items:center;gap:8px;color:#fff;">${s}${l(o.champion)}</b>`,t.appendChild(e)}}if(o.shieldWinner){const t=document.querySelector(".tourpage-meta-row");if(t){const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.gap="4px";const s=o.shieldLogo?`<div style="width:24px;height:24px;border-radius:50%;background-image:url('${o.shieldLogo}');background-size:cover;background-position:center;border:1px solid #f59e0b;box-shadow: 0 0 10px rgba(245,158,11,0.3);"></div>`:'<span style="font-size:18px;line-height:1;">🛡️</span>';e.innerHTML=`<span style="color:var(--ink-faint);">Shield Winner</span><b style="display:flex;align-items:center;gap:8px;color:#f59e0b;">${s}${l(o.shieldWinner)}</b>`,t.appendChild(e)}}["standings","scorers","assists","glove","shield"].forEach(t=>{const e=t+"Img",s=document.getElementById(t+"ImgWrap"),a=document.getElementById(t+"Img"),n=document.getElementById("empty_"+t);o&&o[e]?(s&&a&&(a.src=o[e],s.hidden=!1),n&&(n.hidden=!0)):(s&&(s.hidden=!0),n&&(n.hidden=!1))});function i(t,e,s=0){const a=f.get("ic7_tour_"+m+"_"+t,[]),n=document.getElementById("tb_"+t),d=document.getElementById("empty_"+t);if(n){if(!a.length){d.hidden=!1,n.innerHTML="";return}d.hidden=!0,n.innerHTML=a.map((c,p)=>{const r=e.map((h,w)=>{const u=l(c[h]||"");return w===s&&c.logo?`<td><div style="display:flex;align-items:center;gap:10px;"><img src="${c.logo}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;border:1px solid var(--red);box-shadow:0 0 8px rgba(225,29,72,0.4);flex:none;"><span>${u}</span></div></td>`:"<td>"+u+"</td>"}).join("");return'<tr><td class="rank">'+String(p+1).padStart(2,"0")+"</td>"+r+"</tr>"}).join("")}}i("standings",["team","played","won","points"]),i("scorers",["player","team","goals","matches"]),i("assists",["player","team","assists","matches"]),i("glove",["player","team","cleanSheets","matches"]),i("shield",["player","team","season","matches"]);function g(){const t=f.get("ic7_tour_"+m+"_winners",[]),e=document.getElementById("winnersSection"),s=document.getElementById("winnersList");if(!s||!e)return;e.hidden=!1;const a=t.length?t:[{season:"SEASON 1",player:"IL CAPITANO",logo:""},{season:"SEASON 2",player:"ICONIC SHIELD",logo:""}];s.innerHTML=a.map((n,d)=>{const c=l(n.season||`SEASON ${d+1}`),p=l(n.player||"CHAMPION");let r="";if(n.logo)r=`<div class="evo-tc-trophy-badge"><img class="evo-tc-trophy-img" src="${n.logo}" alt="${p}"></div>`;else if(d===0)r=`<div class="evo-tc-trophy-badge">
            <svg class="evo-tc-anchor-shield" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff"/>
                  <stop offset="40%" stop-color="#b0b5bc"/>
                  <stop offset="70%" stop-color="#78808a"/>
                  <stop offset="100%" stop-color="#3a4048"/>
                </linearGradient>
                <radialGradient id="ballGold" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fff5d1"/>
                  <stop offset="50%" stop-color="#ffd700"/>
                  <stop offset="100%" stop-color="#996515"/>
                </radialGradient>
              </defs>
              <!-- Outer Anchor Frame -->
              <path d="M100 10 L165 40 V110 C165 155 100 195 100 195 C100 195 35 155 35 110 V40 Z" fill="url(#silverGrad)" stroke="#222" stroke-width="3"/>
              <!-- Inner Cutout -->
              <path d="M100 25 L150 50 V105 C150 142 100 175 100 175 C100 175 50 142 50 105 V50 Z" fill="#120e10" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
              <!-- Anchor Flukes -->
              <path d="M35 110 C35 150 70 180 100 180 C130 180 165 150 165 110 M100 45 V175 M70 120 H130" stroke="url(#silverGrad)" stroke-width="12" fill="none" stroke-linecap="round"/>
              <!-- Crown Ball -->
              <circle cx="100" cy="45" r="14" fill="url(#ballGold)" stroke="#fff" stroke-width="1.5"/>
              <!-- Name Banner -->
              <rect x="52" y="90" width="96" height="24" rx="2" fill="#000" stroke="url(#silverGrad)" stroke-width="1.5"/>
              <text x="100" y="106" text-anchor="middle" font-family="Cinzel,serif" font-size="11" font-weight="900" fill="#fff" letter-spacing="1">IL CAPITANO</text>
            </svg>
          </div>`;else if(d===1)r=`<div class="evo-tc-trophy-badge">
            <svg class="evo-tc-dragon-shield" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="goldPlate" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#fffdf0"/>
                  <stop offset="35%" stop-color="#ffd700"/>
                  <stop offset="75%" stop-color="#d4af37"/>
                  <stop offset="100%" stop-color="#553a08"/>
                </radialGradient>
              </defs>
              <!-- Gold Shield Disc -->
              <circle cx="100" cy="110" r="82" fill="url(#goldPlate)" stroke="#111" stroke-width="4"/>
              <circle cx="100" cy="110" r="72" fill="#180508" stroke="#ffd700" stroke-width="2"/>
              <!-- Text Ring -->
              <path id="textArc" d="M35 110 A65 65 0 1 1 165 110" fill="none"/>
              <text font-family="Cinzel,serif" font-size="11" font-weight="900" fill="#ffd700" letter-spacing="3"><textPath href="#textArc" startOffset="50%" text-anchor="middle">ICONIC SHIELD</textPath></text>
              <!-- Red Dragon Emblem Silhouette -->
              <path d="M100 65 C115 65 130 75 125 95 C120 115 140 120 135 140 C130 155 110 155 100 140 C90 155 70 155 65 140 C60 120 80 115 75 95 C70 75 85 65 100 65 Z" fill="#e11d48" stroke="#ffd700" stroke-width="1.5"/>
              <circle cx="100" cy="172" r="3" fill="#ffd700"/>
              <circle cx="70" cy="160" r="2.5" fill="#ffd700"/>
              <circle cx="130" cy="160" r="2.5" fill="#ffd700"/>
            </svg>
          </div>`;else{const h=p.charAt(0).toUpperCase();r=`<div class="evo-tc-trophy-badge"><div class="evo-tc-default-crest"><span>${l(h)}</span></div></div>`}return`<div class="evo-tc-bay reveal in-view">
        <div class="evo-tc-spotlight"></div>
        <div class="evo-tc-podium-ring"></div>
        ${r}
        <div class="evo-tc-plinth">
          <div class="evo-tc-plinth-season">${c}</div>
          <div class="evo-tc-plinth-title">CHAMPIONS</div>
          <div class="evo-tc-plinth-name">${p}</div>
          <div class="evo-tc-plinth-star">★ ★ ★</div>
        </div>
      </div>`}).join("")}g(),window.addEventListener("ic7_store_updated",()=>{i("standings",["team","played","won","points"]),i("scorers",["player","team","goals","matches"]),i("assists",["player","team","assists","matches"]),i("glove",["player","team","cleanSheets","matches"]),i("shield",["player","team","season","matches"]),g()})});
