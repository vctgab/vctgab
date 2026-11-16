import { SEASON_STARTS, SEASON_TIME_ZONE } from "./season"
import {
  DARK_MODE,
  DEFAULT_MODE,
  LEGACY_THEME_MAP,
  LEGACY_THEME_STORAGE_KEY,
  MODE_STORAGE_KEY,
  MODES,
  SEASON_STORAGE_KEY,
  SEASONS,
  THEME_COMBOS,
  getThemeColor,
} from "./themes"

/**
 * Script bloqueante do `<head>`: define `data-season` e `data-mode` antes da
 * primeira pintura (sem flash). Ordem, para cada eixo:
 *
 * - estação: escolha salva válida, depois a do calendário brasileiro (hemisfério
 *   sul) na data de hoje em `America/Sao_Paulo`;
 * - modo: escolha salva válida, depois `prefers-color-scheme`.
 *
 * Migra a chave antiga `vg-tema` (D-1105) e atualiza o `<meta name="theme-color">`.
 * Tudo em try/catch: sem armazenamento, valem o calendário e o sistema. É ES5
 * de propósito (roda sem transpilação); `season.test.ts` confere que dá a mesma
 * resposta que `seasonForDate` em todos os dias.
 */
export function themeScript(): string {
  const config = JSON.stringify({
    s: SEASONS.map((s) => s.id),
    m: MODES.map((m) => m.id),
    t: SEASON_STARTS,
    c: Object.fromEntries(
      THEME_COMBOS.map((x) => [x.id, getThemeColor(x.season, x.mode)]),
    ),
    ks: SEASON_STORAGE_KEY,
    km: MODE_STORAGE_KEY,
    kl: LEGACY_THEME_STORAGE_KEY,
    l: LEGACY_THEME_MAP,
    tz: SEASON_TIME_ZONE,
    dm: DARK_MODE,
    lm: DEFAULT_MODE,
  })
  return `(function(C){var d=document.documentElement;d.setAttribute("data-js","");var ls=null;try{ls=window.localStorage}catch(e){}function get(k){try{return ls?ls.getItem(k):null}catch(e){return null}}function put(k,v){try{if(ls)ls.setItem(k,v)}catch(e){}}function del(k){try{if(ls)ls.removeItem(k)}catch(e){}}var se=get(C.ks),mo=get(C.km),old=get(C.kl);if(old!==null){if(Object.prototype.hasOwnProperty.call(C.l,old)&&se===null&&mo===null){se=C.l[old].season;mo=C.l[old].mode;put(C.ks,se);put(C.km,mo)}del(C.kl)}if(C.s.indexOf(se)<0)se=null;if(C.m.indexOf(mo)<0)mo=null;var i;if(!se){var mm=0,dd=0;try{var p=new Intl.DateTimeFormat("en-US",{timeZone:C.tz,month:"numeric",day:"numeric"}).formatToParts(new Date());for(i=0;i<p.length;i++){if(p[i].type==="month")mm=+p[i].value;if(p[i].type==="day")dd=+p[i].value}}catch(e){}if(!mm){var u=new Date(new Date().getTime()-108e5);mm=u.getUTCMonth()+1;dd=u.getUTCDate()}var k=mm*100+dd;se=C.t[0][1];for(i=0;i<C.t.length;i++){if(k>=C.t[i][0])se=C.t[i][1]}}if(!mo){try{mo=matchMedia("(prefers-color-scheme: dark)").matches?C.dm:C.lm}catch(e){mo=C.lm}}d.setAttribute("data-season",se);d.setAttribute("data-mode",mo);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",C.c[se+"-"+mo]||"")})(${config})`
}
