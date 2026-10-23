/* HABIT · makehabit.in design prototype. Vanilla JS, hash routes, data from data.js (window.SKU). */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const INK = "#16151C", IVORY = "#F4EFE6";
const rupee = n => "₹" + Math.round(n).toLocaleString("en-IN");
const store = { get(k, d) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch {} } };

// ---------- the real HABIT wordmark ----------
const WM = `<g transform="translate(0,300) scale(0.1,-0.1)" fill="currentColor"><path d="M2483 1873 c-11 -10 -35 -54 -53 -98 -19 -44 -76 -170 -128 -280 -142 -304 -141 -285 -17 -285 102 0 91 -12 180 196 32 74 63 133 69 131 6 -2 42 -73 79 -158 37 -84 73 -157 80 -161 7 -4 49 -8 93 -8 106 0 115 9 78 81 -25 51 -82 172 -205 443 -32 71 -67 135 -76 142 -25 19 -77 17 -100 -3z"/><path d="M1987 1868 c-13 -11 -17 -34 -19 -128 l-3 -115 -127 -3 -127 -3 -3 123 -3 123 -88 3 c-52 2 -94 -2 -102 -8 -18 -15 -18 -625 0 -640 8 -6 49 -10 102 -8 l88 3 5 120 5 120 128 3 127 3 0 -120 c0 -99 3 -120 16 -125 29 -11 160 -6 172 6 17 17 17 629 0 646 -16 16 -149 16 -171 0z"/><path d="M2922 1868 c-9 -9 -12 -95 -12 -325 0 -307 0 -312 21 -324 15 -7 93 -10 253 -7 193 3 238 7 271 21 80 36 115 87 115 170 0 74 -36 125 -108 153 -1 1 15 19 37 41 96 95 48 243 -87 272 -74 15 -474 15 -490 -1z m408 -158 c26 -26 25 -52 -1 -76 -18 -16 -37 -19 -118 -19 l-96 0 -3 44 c-5 70 -4 71 103 71 82 0 98 -3 115 -20z m15 -255 c31 -30 31 -40 0 -71 -24 -24 -30 -25 -127 -22 l-103 3 -3 58 -3 57 106 0 c99 0 107 -2 130 -25z"/><path d="M3622 1868 c-19 -19 -17 -631 2 -647 9 -8 46 -11 103 -9 l88 3 3 319 c2 227 -1 323 -9 332 -15 18 -170 19 -187 2z"/><path d="M3864 1869 c-11 -19 -5 -142 9 -151 6 -4 54 -8 104 -8 l93 0 2 -247 3 -248 88 -3 c57 -2 94 1 103 9 11 9 14 58 14 250 l0 239 100 0 c88 0 100 2 110 19 14 27 13 124 -2 139 -16 16 -614 17 -624 1z"/></g><g transform="translate(0,300) scale(0.1,-0.1)" fill="#FF5A4E"><path d="M2485 1335 c-14 -13 -25 -36 -25 -50 0 -28 40 -75 64 -75 80 0 113 113 41 140 -39 15 -54 12 -80 -15z"/></g>`;
const hm = () => `<svg class="hm" viewBox="144.2 105 311.8 80" role="img" aria-label="HABIT">${WM}</svg>`;
const wm = (w, color = INK) => `<svg viewBox="144.2 105 311.8 80" width="${w}" height="${Math.round(w * 80 / 311.8)}" style="color:${color}" aria-label="HABIT" role="img">${WM}</svg>`;
$$("svg.wm").forEach(s => s.innerHTML = WM);

// ---------- catalogue ----------
const L = {
  inf: { name: "Herbal Infusions", short: "Infusions", hex: "#7B5CFF", fg: "#fff", r: "infusions", line: "Caffeine-free cups for every part of the day." },
  nut: { name: "Nutri-mixes", short: "Nutri-mixes", hex: "#FFE34F", fg: INK, r: "nutri-mixes", line: "Almonds, seeds and real food. One sachet a day." },
  kan: { name: "Kanji", short: "Kanji", hex: "#FF5A4E", fg: INK, r: "kanji", line: "Fermented by time, not by a lab." },
};
// launch price: % off MRP for a one-time buy (subscribe or any box of 3 = 15%)
const LAUNCH = { GE: 0.12, HI: 0.12, BR: 0.12, ST: 0.10, BW: 0.10, GL: 0.10, KE: 0.12, CB: 0.12, CU: 0.10, KJ: 0.10 };
// launch prices end here; every countdown on the site reads this one date
const LAUNCH_END = new Date("2026-11-30T23:59:59+05:30");
const tickCd = () => { const ms = Math.max(0, LAUNCH_END - Date.now()); const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, sc = Math.floor(ms / 1e3) % 60, z = n => String(n).padStart(2, "0"); document.querySelectorAll("[data-cd]").forEach(e => e.textContent = e.dataset.cd === "s" ? `${d}d ${z(h)}h ${z(m)}m` : `${d}d ${z(h)}:${z(m)}:${z(sc)}`); };
setInterval(tickCd, 1000);
const launchStrip = () => `<section class="wrap"><a class="lstrip" href="#shop"><span class="pulse"></span><b>Launch prices</b><span class="ls-t">10–12% off everything · 15% when you subscribe or box any 3</span><span class="lcd">ends in <b data-cd></b></span></a></section>`;
const P = [
  { id: "sore-throat", k: "ST", l: "inf", n: "Sore Throat", img: null, m: "anytime", best: 1, v: [["50 g loose-leaf jar", 699]] },
  { id: "breathe-well", k: "BW", l: "inf", n: "Breathe Well", img: null, m: "morning", v: [["50 g loose-leaf jar", 699]] },
  { id: "golden-elixir", k: "GE", l: "inf", n: "Golden Elixir", img: "golden-elixir", m: "morning", best: 1, v: [["Pouch · 25 sachets", 369], ["Jar · 50 g loose", 589]] },
  { id: "hibiscus", k: "HI", l: "inf", n: "Hibiscus", img: "hibiscus", m: "afternoon", best: 1, v: [["Pouch · 25 sachets", 429], ["Jar · 40 g loose", 649]] },
  { id: "golden-latte", k: "GL", l: "inf", n: "Golden Latte", img: "golden-latte", m: "night", v: [["90 g jar", 799]] },
  { id: "blue-rose", k: "BR", l: "inf", n: "Blue Rose", img: "blue-rose", m: "afternoon", v: [["Pouch · 25 sachets", 389], ["Jar · 25 g loose", 589]] },
  { id: "kesar-elaichi", k: "KE", l: "nut", n: "Kesar Elaichi", img: "kesar-elaichi", m: "morning", best: 1, v: [["15 sachets", 799]] },
  { id: "choco-bliss", k: "CB", l: "nut", n: "Choco Bliss", img: "choco-bliss", m: "morning", best: 1, v: [["15 sachets", 799]] },
  { id: "classic", k: "CU", l: "nut", n: "Classic (Unsweetened)", img: "classic", m: "anytime", v: [["15 sachets", 799]] },
  { id: "kanji", k: "KJ", l: "kan", n: "Kanji", img: "kanji", m: "afternoon", best: 1, v: [["6 × 210 ml bottles", 480]], kanji: 1 },
].map(p => { const off = LAUNCH[p.k] || 0.1; return { ...p, off, v: p.v.map(([lab, mrp]) => [lab, Math.round(mrp * (1 - off)), mrp]), d: (window.SKU || {})[p.k] || {} }; });
const byId = id => P.find(p => p.id === id);
{ const kj = byId("kanji"); if (kj && !(kj.d.dr_note || []).length) kj.d.dr_note = ["Kanji is one of the oldest ferments in a North Indian kitchen: beetroot and carrot left with rai and salt until the water turns a deep ruby.", "We make it the same slow way, with no added cultures, no added sugar and no preservatives. Have a small glass before lunch, every day.", "Draft note · for Dr Aneet to approve before launch."]; }
const img = n => n ? `img/${n}.jpg` : "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const SUB = 0.85, BUNDLE = 0.85, FREE_SHIP = 999, GIFT_AT = 1799;
const NCR = ["110", "120", "121", "122", "201", "124", "131"];
const HABIT_NOT = ["No preservatives", "No artificial thickeners", "No anti-caking agents", "No foaming agents", "No chemical gums", "No amino spiking", "No artificial colour or flavour"];

const photo = (p, cls = "") => p.img
  ? `<img class="${cls}" src="${img(p.img)}" alt="${p.n}" loading="lazy">`
  : `<div class="tile" style="background:${L[p.l].hex};color:${L[p.l].fg}"><span class="mono">Pack shot coming</span><span class="tn">${p.n}</span><span class="ti">${(p.d.label_ingredients || "").replace(/, /g, " · ")}</span></div>`;
const list = v => Array.isArray(v) ? v.map(x => Array.isArray(x) ? x[0] : x) : String(v || "").split(/,\s*| · /).map(x => x.replace(/^and /, "").trim()).filter(Boolean);
const ICONS = "almonds black-pepper butterfly-pea-flowers ceylon-cinnamon chamomile chia-seeds chickpea cocoa elaichi fennel-seeds flax-seeds ginger hibiscus-flowers kesar lakadong-ginger lakadong-turmeric licorice mint mishri peanuts pumpkin-seeds red-rose-flowers salt soybean sunflower-seeds tamarind tulsi".split(" ");
const ALIAS = { turmeric: "lakadong-turmeric", "cinnamon": "ceylon-cinnamon", saunf: "fennel-seeds", "chickpea-flour": "chickpea", "himalayan-pink-salt": "salt", "black-salt": "salt", "sea-salt": "salt", "red-rose-petals": "red-rose-flowers", "rose-petals": "red-rose-flowers", "roasted-besan": "chickpea", "besan": "chickpea", "a-desi-ghee": "desi-ghee", "carrot": "carrots", "rai": "mustard-seeds", "kalonji": "nigella-seeds", "lakadong-ginger": "lakadong-ginger" };
const madeWith = p => { const names = (p.d.label_ingredients ? p.d.label_ingredients.split(/,\s*/) : list(p.d.inside)).filter(n => !/love|blessing/i.test(n)); const seen = new Set(); return names.map(n => { const s = n.toLowerCase().replace(/^pure |a2 /g, "").replace(/[^a-z]+/g, "-").replace(/^-|-$/g, ""); let ic = ICONS.includes(s) ? s : ALIAS[s]; return { n: n.replace(/^./, c => c.toUpperCase()), ic }; }); };
const madeRow = (p, max = 99) => { const m = madeWith(p); const show = m.slice(0, max); return `<div class="made"><div class="made-h"><span>Made with</span><i></i></div><div class="made-r">${show.map(x => `<span class="mw">${x.ic ? `<img src="img/ing/icons/${x.ic}.png" alt="">` : `<b style="background:${L[p.l].hex};color:${L[p.l].fg}">${x.n[0]}</b>`}<span>${x.n}</span></span>`).join("")}${m.length > max ? `<span class="mw more">+${m.length - max} more</span>` : ""}</div></div>`; };
const INGIMG = { CB: 1, HI: 1, BR: 1, GE: 1, KE: 1, CU: 1 };
const ingStrip = p => INGIMG[p.k] ? `<div class="ingstrip"><img src="img/ing/${p.k}.jpg" alt="Illustrated ingredients of ${p.n}" loading="lazy"></div>` : "";
const BENEFITS = {"HI": ["Heart-friendly. African hibiscus has been clinically studied for helping lower both systolic and diastolic blood pressure.", "Steadier blood sugar. Ceylon cinnamon, the true cinnamon, helps improve insulin sensitivity, which makes this a good cup for anyone managing diabetes or their metabolism.", "Loaded with antioxidants. Anthocyanins, polyphenols and vitamin C from the flowers fight free radicals and everyday oxidative stress.", "Anti-inflammatory. The same deep-red anthocyanins help calm low-grade inflammation in the body.", "Zero caffeine, almost zero calories. A guilt-free swap for sweet drinks, at any hour."], "GE": ["Powerfully anti-inflammatory. Lakadong turmeric carries 7–12% curcumin against 2–3% in regular haldi. With ginger, it eases joint stiffness, muscle soreness and chronic low-grade inflammation.", "A gentle daily detox. Turmeric, ginger and tamarind support the liver and help the body cleanse itself.", "Better digestion. Fennel, mint and ginger ease bloating after heavy meals and keep digestion moving.", "Stronger immunity. A warming cup of antioxidant-rich roots and spices for the change of season.", "Supports metabolism. Ginger and cinnamon help keep a sluggish metabolism ticking."], "BR": ["Glow from within. Rose, butterfly pea and hibiscus are rich in antioxidants, anthocyanins and vitamin C, which help skin look brighter and more even.", "Anti-ageing support. The antioxidants protect skin cells from oxidative stress, one of the main drivers of early ageing.", "Anti-inflammatory. Flower polyphenols help calm inflammation that shows up as dullness and puffiness.", "Calming and caffeine free. A soft, floral cup that slows you down."], "MB": ["High in antioxidants. Anthocyanins, catechins and flavonoids from butterfly pea support healthy cells.", "Better digestion. Mint relaxes the digestive tract and eases bloating after meals.", "Calms the mind. Caffeine free, it helps soothe stress, anxiety and mental fatigue.", "Blood sugar and weight support. Helps the body regulate glucose and supports weight management.", "Skin and hair. Supports natural collagen and helps slow premature ageing of skin and hair.", "Anti-inflammatory. Butterfly pea and mint both help calm inflammation."], "SI": ["Deeper, easier sleep. Chamomile contains apigenin, which helps the body relax and drift off.", "Lower stress. Tulsi is an adaptogen that helps the body handle stress and settles a racing mind.", "Soothes the gut. Chamomile, licorice and ginger ease acidity, bloating and an unsettled stomach.", "Anti-inflammatory. Chamomile and ginger both help calm inflammation.", "Caffeine free. Made for the last cup of the day."], "ST": ["Soothes a sore throat. Mulethi coats and calms a raw, scratchy throat and eases hoarseness.", "Fights infection. Ginger, tulsi and true cinnamon are naturally antimicrobial and antiviral.", "Anti-inflammatory. Ginger and tulsi help bring down swelling and irritation in the throat.", "Opens up the airways. Mint and ginger help clear a blocked nose and an early-morning cough.", "Caffeine free. Sip it warm through the day for steady comfort."], "BW": ["Supports easier breathing. Ginger, licorice and kalonji help open the airways and loosen congestion.", "Powerfully anti-inflammatory. Lakadong turmeric with black pepper and ghee is the traditional way to help the body absorb curcumin.", "Calms cough and mucus. Licorice soothes, and kalonji and pepper help clear early-morning mucus.", "Stronger immunity in smog season. Antioxidant-rich spices help the body stay resilient when the air is bad.", "Warming. A deep, peppery cup for grey winter mornings."], "GL": ["A shield for the cold season. Turmeric, ginger, clove and cinnamon are antioxidant, antimicrobial and antiviral, a protective layer against seasonal cold, cough, flu and sore throat.", "Eases aches and joint pain. Lakadong turmeric's anti-inflammatory curcumin helps heal muscle fatigue and reduce joint pain.", "Better absorption. Black pepper and desi ghee help the body take up curcumin.", "Clear mornings. Ginger, clove, cinnamon and pepper drive circulation, open the airways, stop early-morning mucus and prevent bloating.", "Restful sleep. A warm cup of golden milk at night helps the body unwind for deep, pain-free sleep."], "CB": ["Brain power and focus. Cocoa flavanols and theobromine improve blood flow to the brain, helping focus and memory through long study hours and exams.", "Fuel for growth. Complete plant protein from soy and chickpea builds lean muscle, and calcium, magnesium and phosphorus from the seeds support strong bones and teeth.", "Steady energy, no crash. Fibre and omega-3 fats slow digestion, so the mishri gives a steady lift instead of a sugar spike.", "A natural mood lift. Cocoa helps the body release endorphins and serotonin, the feel-good hormones.", "Fewer sick days. Zinc and iron from pumpkin and sunflower seeds work with cocoa's antioxidants to strengthen immunity."], "KE": ["Iron and bone support. The seed and legume base gives plant iron, and saffron supports circulation; calcium, magnesium and phosphorus from chia and flax help keep bones dense.", "Calmer moods, easier periods. Kesar helps lift serotonin, easing PMS-related anxiety and irritability, and elaichi's antispasmodic properties help relax menstrual cramps.", "Less stress, deeper sleep. Elaichi helps lower cortisol, and a warm glass at night is a soothing ritual for restful sleep.", "No more bloating. Elaichi is a traditional digestive that clears gas and improves gut movement.", "Glowing skin and strong hair. Saffron's crocin fights pigmentation and oxidative stress; vitamin E from almonds supports skin elasticity and hair roots."], "CU": ["Complete plant protein. Soy and chickpea with nuts and seeds give a broad range of essential amino acids for muscle repair and daily strength.", "Heart-healthy fats. Chia and flax bring plant omega-3s; sunflower and pumpkin seeds add healthy unsaturated fats.", "Gut support and fullness. High fibre slows digestion, keeps you full longer and feeds the good bacteria in your gut.", "Mineral-rich. Magnesium, calcium, iron and zinc from pumpkin seeds, almonds and chia support bones and immunity.", "Better absorption. A pinch of black pepper's piperine helps the body take up nutrients and good fats.", "Zero added sugar. Fits diabetic, PCOS and low-sugar diets."], "AP": ["Beats the heat. Raw mango, black salt and pink salt replace the electrolytes you lose in an Indian summer, the reason every nani made aam panna for loo season.", "Aids digestion. Jeera, saunf and kala namak are the classic after-lunch digestives.", "Vitamin C. Raw mango is naturally rich in it.", "Cooling. Mint cools the body from the inside."], "KJ": ["Naturally probiotic. Slow lacto-fermentation grows live, good bacteria that support a healthy gut, with no cultures added from a packet.", "Better digestion. A small glass before a meal is the traditional North Indian way to wake up the appetite and ease digestion.", "Stronger immunity. Most of the immune system lives in the gut, and a healthy gut flora helps keep it strong.", "Stamina and circulation. Beetroot's natural nitrates support healthy blood flow.", "Anti-inflammatory kick. Lakadong turmeric, ginger and black pepper in every bottle.", "Light. 18 kcal per 100 ml and no added sugar."], "GA": ["Settles the stomach. Ginger has long been used to ease heaviness, nausea and bloating after a big meal.", "Anti-inflammatory. Real ginger's gingerols help calm inflammation.", "Aids digestion. Ginger and lemongrass get things moving after a heavy meal.", "A better soft drink. Real ginger and lemongrass, no added flavours, no artificial colours."]};
const ing = p => (p.d.ingredients || []).map(x => Array.isArray(x) ? x : [String(x), ""]);

// ---------- state ----------
let cart = store.get("cart", []);
const save = () => { store.set("cart", cart); paintCartCount(); };
const unit = it => { const v = byId(it.id).v[it.v || 0]; return it.sub ? v[2] * SUB : it.bundle ? v[2] * BUNDLE : v[1]; };
const offPct = (now, mrp) => Math.round((1 - now / mrp) * 100);
const totals = () => {
  const mrp = cart.reduce((s, it) => s + byId(it.id).v[it.v || 0][2] * it.q, 0);
  const sub = cart.reduce((s, it) => s + unit(it) * it.q, 0);
  const anySub = cart.some(i => i.sub);
  const ship = sub >= FREE_SHIP || anySub || !cart.length ? 0 : 60;
  return { mrp, sub, save: mrp - sub, ship, total: sub + ship, anySub };
};
function add(id, o = {}) {
  const ex = cart.find(i => i.id === id && (i.v || 0) === (o.v || 0) && !!i.sub === !!o.sub && !!i.bundle === !!o.bundle);
  if (ex) ex.q += o.q || 1; else cart.push({ id, v: o.v || 0, q: o.q || 1, sub: !!o.sub, freq: o.freq || (byId(id).kanji ? "Weekly" : "Every 30 days"), bundle: !!o.bundle });
  save(); toast(o.msg || `${byId(id).n} is in your mix`);
  const n = $("#cartN"); n.classList.add("bump"); setTimeout(() => n.classList.remove("bump"), 300);
}
function paintCartCount() { $("#cartN").textContent = cart.reduce((s, i) => s + i.q, 0); }

// ---------- toast ----------
let tT;
function toast(t) { if ($("#cart").classList.contains("open") || /box|crate|Hamper|Gift set/.test(t) && false) return; $("#toastT").textContent = t; $("#toast").classList.add("on"); clearTimeout(tT); tT = setTimeout(() => $("#toast").classList.remove("on"), 2200); }

// ---------- announcement bar ----------
const ANN_ALL = [
  `Free shipping over <b>₹999</b> · always free on subscriptions`,
  `Build a box of any <b>3</b> · save <b>10%</b>`,
  `<b>Subscribe & save 15%</b> on every product · cancel anytime`,
  `Fresh <b>Kanji</b> bottled this week · check your pincode`,
];
const ANN = [["#16151C", "#fff", `<b>Launch prices end in <span data-cd></span></b> · up to 15% off everything`], ["#7B5CFF", "#fff", `Free shipping on orders over <b>₹999</b>`], ["#FF5A4E", INK, `<b>Subscribe & save 15%</b> on every order · skip anytime`], ["#7B5CFF", "#fff", `100% natural · 0 added colour · 0 artificial flavour`], ["#FFE34F", INK, `Any 3 in a box · <b>save 15%</b>`], ["#7B5CFF", "#fff", `Spend ₹1,799 · <b>free Discovery Set</b>`]];
(() => { const a = $("#ann"); a.innerHTML = ANN.map(([, , t], i) => `<div class="${i ? "off" : ""}">${t}</div>`).join(""); let i = 0; const paint = () => { a.style.background = ANN[i][0]; a.style.color = ANN[i][1]; }; paint(); setInterval(() => { const d = $$("div", a); d[i].classList.add("off"); i = (i + 1) % d.length; d[i].classList.remove("off"); paint(); }, 3200); })();

// ---------- header: hide on scroll down ----------
let lastY = 0;
addEventListener("scroll", () => { const y = scrollY; $("#hdr").classList.toggle("hide", y > lastY && y > 300 && !$("#mega").classList.contains("open")); lastY = y; }, { passive: true });

// ---------- mega menu ----------
const mi = p => `<a class="mi" href="#p-${p.id}"><span class="th">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}</span><span><b>${p.n}</b><small>${rupee(p.v[0][1])} <s>${rupee(p.v[0][2])}</s> · ${Math.round(p.off * 100)}% off</small></span></a>`;
const MEGA = {
  inf: { im: "infusions-banner", line: "Caffeine-free cups you brew. One for every part of the day.", extra: [] },
  nut: { im: "mixes-banner", line: "Almonds, seeds and real food. Stir one sachet into milk.", extra: [["#build-a-box", "Build a box of 3", "Mix lines · save 10%", "nut"]] },
  kan: { im: "kanji", line: "Beetroot and carrot, fermented in small batches. Delivered chilled.", extra: [["#kanji", "How Kanji is made", "Fermented by time, not a lab", "kan"], ["#subscriptions", "Weekly crate", "6 bottles a week · save 15%", "kan"]] },
};
function megaExtra(k) {
  const tileP = (p, sub) => `<a class="mt" href="#p-${p.id}"><span class="mt-ph" style="background:${L[p.l].hex}">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span class="mt-tn" style="color:${L[p.l].fg}">${p.n}</span>`}</span><b>${p.n}</b><small>${sub ? `<s>${rupee(p.v[0][2])}</s> <b style="color:var(--ok)">${rupee(p.v[0][2] * SUB)}</b>` : `${rupee(p.v[0][1])} <s>${rupee(p.v[0][2])}</s>`}</small></a>`;
  if (k === "best") return `<div class="mp-head"><div><span class="mono">What everyone's having</span><h4>Bestsellers</h4><p>The six products people come back for.</p></div><a class="btn btn-ink btn-sm" href="#shop">Shop all →</a></div><div class="mp-grid">${P.filter(p => p.best).slice(0, 6).map(p => tileP(p)).join("")}</div>`;
  if (k === "box") return `<div class="mp-head"><div><span class="mono">Any 3 · 15% off</span><h4>Make your first box</h4><p>Pick any three products from any line. They ship together, 15% off.</p></div><a class="btn btn-ink btn-sm" href="#build-a-box">Start my box →</a></div><div class="mp-split"><div style="max-width:440px;width:100%">${cassette(["golden-elixir", "choco-bliss", "kanji"])}</div><div class="mp-steps"><b>1</b><span>Pick any 3</span><b>2</b><span>15% comes off</span><b>3</b><span>One delivery</span></div></div>`;
  if (k === "subs") return `<div class="mp-head"><div><span class="mono">Save 15% on every order</span><h4>Subscribe & save</h4><p>Free shipping, every time. Skip, pause or cancel anytime from WhatsApp.</p></div><a class="btn btn-ink btn-sm" href="#subscriptions">See how it works →</a></div><div class="mp-grid">${P.filter(p => p.best).slice(0, 5).map(p => tileP(p, true)).join("")}<a class="mt mt-x" href="#subscriptions"><span class="mt-ph" style="background:var(--ok);color:#fff"><span class="mt-tn">Save up to ₹1,400 a year →</span></span><b>Savings calculator</b><small>see your number</small></a></div>`;
  if (k === "gift") { const sets = [["Discovery Set", ["hibiscus", "golden-elixir", "blue-rose"]], ["Morning to Night", ["golden-elixir", "kesar-elaichi", "golden-latte"]], ["Kanji Party Crate", ["kanji", "hibiscus"]]]; return `<div class="mp-head"><div><span class="mono">Ready to send</span><h4>Gift sets</h4><p>Boxes people actually use, with a handwritten note.</p></div><a class="btn btn-ink btn-sm" href="#gifting">All gifts →</a></div><div class="mp-grid g4">${sets.map(([n, ids]) => `<a class="mt" href="#gifting"><span class="mt-ph gset">${ids.map(id => `<img src="${img(byId(id).img)}" alt="">`).join("")}</span><b>${n}</b><small>${ids.length} products</small></a>`).join("")}<a class="mt" href="#hamper"><span class="mt-ph"><img src="${img("hamper")}" alt=""></span><b>Make your own hamper</b><small>3, 5 or 7 items</small></a></div>`; }
  return "";
}
function megaPanel(k) {
  if (!L[k]) return megaExtra(k);
  const l = L[k], m = MEGA[k], items = P.filter(p => p.l === k);
  const tile = p => `<a class="mt" href="#p-${p.id}"><span class="mt-ph" style="background:${l.hex}">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span class="mt-tn" style="color:${l.fg}">${p.n}</span>`}</span><b>${p.n}</b><small>from ${rupee(p.v[0][1])}</small></a>`;
  const xt = ([h, t, s2, c]) => `<a class="mt mt-x" href="${h}"><span class="mt-ph" style="background:${L[c].hex};color:${L[c].fg}"><span class="mt-tn">${t} →</span></span><b>${t}</b><small>${s2}</small></a>`;
  return `<div class="mp-head"><div><span class="mono">${items.length} product${items.length > 1 ? "s" : ""}</span><h4>${l.name}</h4><p>${m.line}</p></div><a class="btn btn-ink btn-sm" href="#${l.r}">Shop all ${l.short} →</a></div>
    <div class="mp-grid">${items.map(tile).join("")}${m.extra.map(xt).join("")}</div>`;
}
$("#mega").innerHTML = `<div class="wrap mega2">
  <div class="mtabs" role="tablist" aria-label="Product lines">
    ${Object.keys(L).map((k, i) => `<button role="tab" class="mtab ${i ? "" : "on"}" data-mtab="${k}" aria-selected="${!i}" style="--c:${L[k].hex};--f:${L[k].fg}"><span class="mtab-img"><img src="${img(MEGA[k].im)}" alt=""></span><span><b>${L[k].name}</b><small>${P.filter(p => p.l === k).length} product${P.filter(p => p.l === k).length > 1 ? "s" : ""}</small></span><i>→</i></button>`).join("")}
    <div class="mlinks">${[["best", "#shop", "Bestsellers"], ["box", "#build-a-box", "Make your first box"], ["subs", "#subscriptions", "Subscribe & save 15%"], ["gift", "#gifting", "Gift sets"]].map(([k, h, t]) => `<a href="${h}" data-mtab="${k}">${t}<i>→</i></a>`).join("")}<a href="#shop">Shop all</a></div>
  </div>
  <div class="mpanel" id="mpanel" role="tabpanel">${megaPanel("inf")}</div></div>`;
const megaSet = k => { $$("[data-mtab]").forEach(b => { const on = b.dataset.mtab === k; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); }); const pnl = $("#mpanel"); pnl.classList.remove("swap"); void pnl.offsetWidth; pnl.innerHTML = megaPanel(k); pnl.classList.add("swap"); };
$$("[data-mtab]").forEach(b => { b.addEventListener("mouseenter", () => !b.classList.contains("on") && megaSet(b.dataset.mtab)); b.addEventListener("focus", () => megaSet(b.dataset.mtab)); if (b.tagName === "BUTTON") b.addEventListener("click", () => megaSet(b.dataset.mtab)); });
const megaOpen = o => { $("#mega").classList.toggle("open", o); $("#shopBtn").setAttribute("aria-expanded", o); };
$("#shopBtn").addEventListener("click", () => megaOpen(!$("#mega").classList.contains("open")));
$("#shopBtn").addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && megaOpen(true));
$("#hdr").addEventListener("mouseleave", () => megaOpen(false));
$("#mega").addEventListener("click", e => e.target.closest("a") && megaOpen(false));

// ---------- mobile menu ----------
$("#mnav").innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span class="logo" style="align-items:flex-start"><span class="hand">Dr Aneet's</span>${wm(104)}</span><button class="icon-btn" id="mclose" aria-label="Close menu">✕</button></div>
  <span class="big">Shop</span>
  <div class="lines">${Object.values(L).map(l => `<a href="#${l.r}" style="background:${l.hex};color:${l.fg}">${l.short}</a>`).join("")}</div>
  <a class="chip" href="#shop" style="align-self:flex-start;margin-bottom:8px">Shop all · bestsellers →</a>
  ${[["#recipes", "Recipes"], ["#club", `${hm()} Club`], ["#hamper", "Make your own hamper"], ["#subscriptions", "Subscriptions"], ["#gifting", "Gifting"], ["#about", "About us"]].map(([h, t]) => `<a class="big" href="${h}">${t}<span>→</span></a>`).join("")}
  <a href="#build-a-box" class="band" style="background:${INK};color:${IVORY};margin-top:18px;display:block"><span class="mono" style="color:#FFE34F">Pick any 3 · save 15%</span><div style="font:900 26px var(--display);margin-top:6px">Build a box of 3 →</div></a>`;
const mnav = o => $("#mnav").classList.toggle("open", o);
$("#burger").addEventListener("click", () => mnav(true));
$("#mnav").addEventListener("click", e => { if (e.target.closest("a") || e.target.id === "mclose") mnav(false); });

// ---------- product card ----------
const card = p => { const [lab, now, mrp] = p.v[0], subP = mrp * SUB; return `<article class="card" style="--c:${L[p.l].hex}">
  <div class="ph"><a href="#p-${p.id}" class="phl" aria-label="${p.n}">${photo(p)}<span class="offb">${Math.round(p.off * 100)}% OFF</span><span class="alt" style="background:${L[p.l].hex}">${madeWith(p).filter(x => x.ic).slice(0, 6).map(x => `<img src="img/ing/icons/${x.ic}.png" alt="">`).join("")}<b style="color:${L[p.l].fg}">${madeWith(p).length} ingredients · nothing artificial</b></span><span class="chip tag"><span class="dot" style="background:${L[p.l].hex}"></span>${L[p.l].short}</span></a></div>
  <div class="bd"><span class="mono k">${lab}</span><h3><a href="#p-${p.id}">${p.n}</a></h3>
  <div class="cprice"><b>${rupee(now)}</b><s>${rupee(mrp)}</s><span class="csave">Save ${rupee(mrp - now)}</span></div>
  <a class="cbest" href="#p-${p.id}"><span class="bv">Best value</span><span>${rupee(subP)} with Subscribe · save ${rupee(mrp - subP)}</span></a>
  <span class="cdl"><span class="pulse"></span>Launch price ends in <b data-cd="s"></b></span>
  <div class="cbtns"><button class="btn btn-sm qa-add" data-add="${p.id}">Add to cart</button><button class="btn btn-sm qa-buy" data-buy="${p.id}">Buy now</button></div></div></article>`; };

// ---------- pages ----------
const words = (s, d = 0) => s.split(" ").map((w, i) => `<span class="w" style="animation-delay:${d + i * 0.07}s">${w}</span>`).join(" ");

const VIDS = [
  { v: "t1", p: "golden-elixir", line: "My 4 pm cup now. I don't miss the third chai." },
  { v: "t3", p: "kanji", line: "Kanji before lunch. My stomach thanks me." },
  { v: "t2", p: "hibiscus", line: "Iced hibiscus all summer. Two ingredients, that's it." },
  { v: "t4", p: "choco-bliss", line: "Kids think it's dessert. It's almonds and seeds." },
  { v: "t5", p: "sore-throat", line: "Six classes a day and my voice lasts." },
];
const vcard = (x, mini) => { const p = byId(x.p); return `<div class="vcard ${mini ? "mini" : ""}" data-vid="${x.v}" role="button" tabindex="0" aria-label="Play review of ${p.n}"><video src="vid/${x.v}.mp4" poster="vid/${x.v}.jpg" muted loop playsinline autoplay preload="none"></video><span class="vplay">▶</span>${mini ? "" : `<span class="vq">"${x.line}"</span>`}<span class="vcta">${mini ? `<button class="vb" data-add="${p.id}" aria-label="Add ${p.n} to cart">+ Add</button>` : `<button class="vb" data-add="${p.id}">Add to cart</button><button class="vb vbuy" data-buy="${p.id}">Buy now</button>`}</span><span class="vprod">${p.img ? `<img class="vth" src="${img(p.img)}" alt="">` : `<span class="vth" style="background:${L[p.l].hex}"></span>`}<span class="vn"><b>${p.n}</b><small>${rupee(p.v[0][1])} <s>${rupee(p.v[0][2])}</s></small></span></span></div>`; };
const vrail = () => `<div class="vrail"><div class="vtrack">${VIDS.concat(VIDS).map(x => vcard(x)).join("")}</div></div><p class="mono k wrap" style="margin-top:8px">Test clips from our own footage · replace with customer videos</p>`;
const STORIES = [
  { l: "inf", p: "hibiscus", kicker: "Herbal Infusions", claim: "2 ingredients. That's the whole list.", call: ["Hibiscus flowers", "Ceylon cinnamon", "Zero caffeine", "No colour added"], cta: ["#infusions", "Shop infusions · from ₹369"] },
  { l: "nut", p: "choco-bliss", kicker: "Nutrition mixes", claim: "32.9 g protein per 100 g. From real food.", call: ["Roasted soy + chana", "Almonds & seeds", "Real cocoa", "1 sachet a day"], cta: ["#nutri-mixes", "Shop nutri-mixes · ₹799"] },
  { l: "kan", p: "kanji", kicker: "Fresh Kanji", claim: "Fermented for days, not in a lab.", call: ["Beetroot + carrot", "No added sugar", "No preservatives", "Naturally probiotic"], cta: ["#kanji", "Check if we deliver to you"], live: "This week's batch · [live] bottles left" },
];
const REEL = [
  { id: "hibiscus", k: "Herbal Infusion", h: ["Two ingredients.", "Ruby-red", "every cup."], s: "Hibiscus flowers and Ceylon cinnamon. Caffeine free, hot or iced.", tag: "Tart · floral · caffeine free" },
  { id: "choco-bliss", k: "Nutri-mix", h: ["Tastes like dessert.", "Made from seeds.", ""], s: "Roasted soy, chana, almonds and real cocoa. 32.9 g protein per 100 g.", tag: "No malt · no gums" },
  { id: "kanji", k: "Fresh Kanji", h: ["Fermented for days,", "not in a lab.", ""], s: "Beetroot and carrot, slow-fermented and bottled fresh.", tag: "No added sugar · 6 × 210 ml" },
  { id: "golden-elixir", k: "Herbal Infusion", h: ["Lakadong turmeric.", "Lakadong ginger.", "That's the cup."], s: "A warm golden infusion for slow mornings. Nothing artificial.", tag: "Earthy · warming" },
  { id: "kesar-elaichi", k: "Nutri-mix", h: ["Real kesar.", "Real elaichi.", "Real almonds."], s: "Stir one sachet into warm milk. 15 sachets a box.", tag: "Kesar · elaichi · almonds" },
];
const reelHero = () => { const R = REEL.map(r => ({ ...r, p: byId(r.id) })).filter(r => r.p); return `
  <section class="wrap rhero" id="rhero" aria-roledescription="carousel" aria-label="Bestsellers">
    <div class="rh-t">
      <span class="mono k">Dr Aneet's ${hm()} · bestsellers</span>
      <div class="rh-stack">${R.map((r, i) => `<div class="rh-s" style="--c:${L[r.p.l].hex};--f:${L[r.p.l].fg}" aria-hidden="${i ? "true" : "false"}"><span class="rh-k"><span class="dot"></span>${r.k} · Bestseller</span><h1><span class="ln">${r.h[0]}</span> <mark>${r.h[1]}</mark>${r.h[2] ? ` <span class="ln">${r.h[2]}</span>` : ""}</h1><p class="sub">${r.s}</p><div class="rh-price"><b class="rp-now">${rupee(r.p.v[0][1])}</b><span class="rp-mrp">${rupee(r.p.v[0][2])}</span><span class="rp-off">${Math.round(r.p.off * 100)}% OFF</span><span class="rp-save">You save ${rupee(r.p.v[0][2] - r.p.v[0][1])}</span></div><span class="rp-cd"><span class="pulse"></span>Launch price ends in <b data-cd="s"></b> · then ${rupee(r.p.v[0][2])}</span><div class="ctas"><a class="btn btn-ink" href="#p-${r.id}">Shop ${r.p.n} at ${rupee(r.p.v[0][1])} →</a><a class="mlink" href="#shop">All bestsellers →</a></div></div>`).join("")}</div>
      <div class="rh-dots" role="tablist">${R.map((r, i) => `<button data-r="${i}" role="tab" aria-label="${r.p.n}" style="--c:${L[r.p.l].hex}"></button>`).join("")}</div>
    </div>
    <div class="reel" id="reel">
      <div class="rbars">${R.map(() => "<i><b></b></i>").join("")}</div>
      <div class="rtop"><span class="rav">${hm()}</span><b>makehabit</b><span class="rpl mono">▶ reel</span></div>
      ${R.map((r, i) => `<a class="rs" href="#p-${r.id}" style="--c:${L[r.p.l].hex}" tabindex="${i ? -1 : 0}"><img src="${img(r.p.img)}" alt="${r.p.n}"><span class="rs-cap"><span><b>${r.p.n}</b><span class="mono">${r.tag}</span></span><span class="rs-go"><s>${rupee(r.p.v[0][2])}</s> ${rupee(r.p.v[0][1])} →</span><span class="roff">Save ${rupee(r.p.v[0][2] - r.p.v[0][1])} · ${Math.round(r.p.off * 100)}% off</span></span></a>`).join("")}
      <button class="rprev" aria-label="Previous"></button><button class="rnext" aria-label="Next"></button>
    </div>
  </section>`; };
function heroReel() {
  const el = $("#rhero"); if (!el) return;
  const ss = $$(".rs", el), ts = $$(".rh-s", el), bars = $$(".rbars i", el), dots = $$(".rh-dots button", el);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; let i = -1, t0 = 0, held = false; const DUR = 4600;
  const show = k => { const prev = i; i = (k + ss.length) % ss.length; t0 = performance.now();
    ss.forEach((x, j) => { x.classList.toggle("on", j === i); x.classList.toggle("was", j === prev && prev !== i); x.tabIndex = j === i ? 0 : -1; });
    ts.forEach((x, j) => { x.classList.toggle("on", j === i); x.setAttribute("aria-hidden", j !== i); });
    dots.forEach((x, j) => { x.classList.toggle("on", j === i); x.setAttribute("aria-selected", j === i); });
    bars.forEach((b, j) => $("b", b).style.width = j < i ? "100%" : "0%"); };
  const tick = now => { if (!document.body.contains(el)) return; if (held || reduce || document.hidden) t0 = now - (Math.min(1, (now - t0) / DUR) * DUR); const p = Math.min(1, (now - t0) / DUR); $("b", bars[i]).style.width = p * 100 + "%"; if (p >= 1) show(i + 1); requestAnimationFrame(tick); };
  $(".rprev", el).onclick = () => show(i - 1); $(".rnext", el).onclick = () => show(i + 1);
  dots.forEach((d, j) => d.onclick = () => show(j));
  const rl = $("#reel"); rl.addEventListener("pointerenter", () => held = true); rl.addEventListener("pointerleave", () => held = false);
  rl.addEventListener("pointerdown", () => held = true); addEventListener("pointerup", () => { if (!rl.matches(":hover")) held = false; });
  show(0); requestAnimationFrame(tick);
}
function home() {
  const best = P.filter(p => p.best);
  return `
  ${reelHero()}
  ${launchStrip()}
  <section class="wrap sec"><div class="sec-h"><h2>Three ways to start.</h2></div>
    <div class="mlines">${[["inf", "golden-elixir"], ["nut", "choco-bliss"], ["kan", "kanji"]].map(([l, im]) => `<a class="mline" href="#${L[l].r}" style="--c:${L[l].hex}"><span class="ml-ph"><img src="${img(im)}" alt=""></span><span class="ml-t"><span class="dot" style="background:${L[l].hex}"></span><b>${L[l].name}</b></span><span class="k">${L[l].line}</span><span class="ml-go">Shop ${L[l].short} →</span></a>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Bestsellers.</h2><a class="mlink" href="#shop">Shop all →</a></div><div class="rail">${best.map(card).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="r5-inf"><a class="r5-link" href="#infusions" aria-label="Shop all herbal infusions"></a><img src="${img("infusions-banner")}" alt="Herbal infusions in warm sunlight">
    <div class="r5-card2"><span class="mono">Herbal Infusions · caffeine free</span><h2>A cup for every part of your day.</h2><p>Pick your moment.</p>
      <div class="dayp">${[["☀", "Morning", "golden-elixir"], ["◐", "Afternoon", "hibiscus"], ["☾", "Night", "golden-latte"]].map(([ic, t, id]) => { const p = byId(id); return `<a class="dp" href="#p-${id}"><img src="${img(p.img)}" alt=""><span><small>${ic} ${t}</small><b>${p.n}</b><em>${rupee(p.v[0][1])} <s>${rupee(p.v[0][2])}</s></em></span><i>→</i></a>`; }).join("")}</div>
      <a class="btn btn-sm r5-all" href="#infusions">All 6 infusions →</a></div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap sec-h"><h2>Real people, real routines.</h2><span class="mono k">tap to watch</span></div>${vrail()}</section>
  <section class="wrap sec" style="padding-top:0"><a class="mnote" href="#about"><p class="hand">I don't want you to try this once. Have it every day for fifteen days, then tell me how you feel.</p><span class="mono k">Dr Aneet · physician, 29 years</span><span class="mlink">Read Dr Aneet's story →</span></a></section>
  <section class="wrap sec" style="padding-top:0"><a class="mclub" href="#club"><div><span class="mono k">${hm()} Club</span><h2>Subscribe once, save every time.</h2><p class="k">15% off every order, free shipping, early drops. Skip or cancel anytime.</p></div><span class="btn btn-ink">See the perks →</span></a></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Day 15 reviews.</h2><span class="mono k">[reviews app]</span></div>${reviews()}</section>`;
}
function stories() {
  const el = $("#story"); if (!el) return;
  const sts = $$(".st", el), bars = $$(".bars i", el); let i = 0, t0 = performance.now(), held = false; const DUR = 4800;
  const show = k => { i = (k + sts.length) % sts.length; t0 = performance.now(); sts.forEach((s, j) => { s.classList.toggle("on", j === i); s.setAttribute("aria-hidden", j !== i); }); bars.forEach((b, j) => $("b", b).style.width = j < i ? "100%" : "0%"); };
  const tick = now => { if (!document.body.contains(el)) return; if (held) t0 += 16; const p = Math.min(1, (now - t0) / DUR); $("b", bars[i]).style.width = p * 100 + "%"; if (p >= 1) show(i + 1); requestAnimationFrame(tick); };
  $(".prev", el).onclick = () => show(i - 1); $(".next", el).onclick = () => show(i + 1);
  el.addEventListener("pointerdown", () => held = true); addEventListener("pointerup", () => held = false);
  show(0); requestAnimationFrame(tick);
}
const cassette = (ids) => { const n = ids.filter(Boolean).length; return `<div class="hbox ${n === 3 ? "done" : ""}"><div class="hbox-top"><span style="display:flex;align-items:center;gap:8px"><span class="hand" style="font-size:28px">Your</span>${wm(78)}<span class="hand" style="font-size:28px">box</span></span><span class="mono">${n}/3 · ${n === 3 ? "15% off unlocked" : "pick " + (3 - n) + " more"}</span></div><div class="hbox-in">${[0, 1, 2].map(k => { const p = ids[k] && byId(ids[k]); return p ? `<div class="hslot" style="background:${L[p.l].hex};color:${L[p.l].fg}">${p.img ? `<img src="${img(p.img)}" alt="">` : ""}<span>${p.n}</span></div>` : `<div class="hslot empty"><span>+</span></div>`; }).join("")}</div></div>`; };
const wrapped = () => `<div style="background:${L.nut.hex};color:${INK};border-radius:24px;padding:22px;max-width:380px;justify-self:center;width:100%;transform:rotate(3deg)"><span class="mono">Habit Wrapped 2026 · sample</span><div style="margin:12px 0 4px">You played Kanji</div><div style="font:900 72px/0.9 var(--display)">212×</div><div style="margin:8px 0 14px">A habit for 94 days straight.</div>${[["Infusions", 68, L.inf.hex], ["Nutri-mixes", 44, IVORY], ["Kanji", 91, L.kan.hex]].map(([n, v, c]) => `<div style="display:flex;align-items:center;gap:10px;margin-top:8px"><span class="mono" style="width:88px">${n}</span><span style="flex:1;height:12px;border-radius:6px;background:rgba(22,21,28,.2);overflow:hidden"><i style="display:block;height:100%;width:${v}%;background:${c}"></i></span></div>`).join("")}</div>`;

const reviews = () => `<div class="rail">${[["Sore Throat · Day 15", "I teach six classes a day. Two weeks in, my voice lasts till the last bell."], ["Kanji · Day 30", "Swapped my 4 pm cold drink for Kanji. Did not expect to like it this much."], ["Choco Bliss · Day 15", "My kids think it's dessert. I know it's almonds and seeds."], ["Golden Latte · Day 21", "It's my 10 pm ritual now. Phone down, cup up."]].map(([t, q]) => `<a class="step revl" href="#p-${(P.find(x => t.startsWith(x.n)) || P[0]).id}" style="margin:0"><span class="mono k">${t}</span><blockquote style="margin:0;font-size:18px;line-height:1.4">"${q}"</blockquote><figcaption class="mono k">Sample review · placeholder</figcaption><span class="slink-go">Shop ${t.split(" ·")[0]} <i>→</i></span></a>`).join("")}</div>`;

function pinBand(full) {
  return `<div class="band split" style="background:${L.kan.hex}">
    <div style="display:flex;flex-direction:column;gap:12px"><span class="mono">Kanji · delivered chilled</span><h2 style="font-size:clamp(34px,8vw,${full ? 72 : 56}px);font-weight:900">Can we bring Kanji to your door?</h2><p style="font-weight:600">Kanji is alive, so it travels cold and close. Pop in your pincode.</p>
      <form class="pin" data-pin><label class="mono" for="pin1" style="position:absolute;left:-9999px">Pincode</label><input id="pin1" inputmode="numeric" maxlength="6" placeholder="Enter pincode" autocomplete="postal-code"><button class="btn btn-ink" type="submit">Check</button></form>
      <p class="pin-res" aria-live="polite">Try 201301 (yes) or 400001 (not yet).</p></div>
    <div class="ph-r" style="max-height:440px"><img src="${img("kanji")}" alt="Kanji bottle with beetroot and carrot"></div></div>`;
}

function shop(line) {
  const l = line ? L[line] : null;
  const list = line ? P.filter(p => p.l === line) : P;
  return `${launchStrip()}${l ? lineHero(line) : `<section class="wrap" style="padding-block:28px 10px"><span class="mono">Shop all · ${P.length} products</span><h1 style="font-size:clamp(44px,11vw,96px);font-weight:900;margin-top:8px">Everything we make.</h1></section>`}
  <section class="wrap sec" style="padding-top:18px">
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;position:sticky;top:72px;z-index:5;background:var(--ivory);padding:8px 0" id="filters">
      ${line ? "" : [["all", "All"], ["inf", "Infusions"], ["nut", "Nutri-mixes"], ["kan", "Kanji"]].map(([k, t], i) => `<button class="chip" data-f="${k}" style="${i ? "" : "background:var(--ink);color:var(--ivory)"}">${k !== "all" ? `<span class="dot" style="background:${L[k].hex}"></span>` : ""}${t}</button>`).join("")}
      ${["morning", "afternoon", "night"].map(m => `<button class="chip" data-m="${m}">${{ morning: "☀", afternoon: "◐", night: "☾" }[m]} ${m}</button>`).join("")}
    </div>
    <div class="grid" id="pgrid">${list.map((p, i) => (i === 4 && !line ? `<a href="#build-a-box" class="card" style="background:${INK};color:${IVORY};padding:18px;justify-content:space-between;min-height:300px"><span class="mono" style="color:${L.nut.hex}">Pick any 3</span><span style="font:900 30px/1 var(--display)">Build a box of 3, save 15%.</span><span class="btn btn-nut btn-sm" style="align-self:flex-start">▶ Start</span></a>` : "") + card(p)).join("")}</div>
  </section>${line ? lineExtra(line) : ""}`;
}

function lineHero(line) {
  const l = L[line];
  const im = { inf: "infusions-banner", nut: "mixes-banner", kan: "kanji" }[line];
  return `<section style="background:${l.hex};color:${l.fg}"><div class="wrap split" style="padding-block:34px">
    <div style="display:flex;flex-direction:column;gap:14px"><span class="mono">${P.filter(p => p.l === line).length} products · from ${rupee(Math.min(...P.filter(p => p.l === line).map(p => p.v[0][1])))}</span><h1 style="font-size:clamp(48px,12vw,110px);font-weight:900;letter-spacing:-.04em;line-height:.9">${words(l.name)}</h1><p style="font-size:18px;font-weight:600;max-width:480px">${l.line}</p></div>
    <div class="ph-r" style="aspect-ratio:${line === "kan" ? "4/5" : "16/11"}"><img src="${img(im)}" alt="${l.name}"></div></div></section>`;
}

function lineExtra(line) {
  if (line === "inf") return `<section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Brew it right.</h2><span class="mono k">5 minutes · no gadgets</span></div><div class="steps">${[["1", "One sachet or a spoon", "1 sachet (or 1–2 g loose) per 150 ml cup."], ["2", "Water just off the boil", "Pour, cover, steep 5 minutes. Watch the colour come."], ["3", "Same time tomorrow", "That's the whole habit. Iced works too."]].map(([n, a, b]) => `<div class="step reveal"><span class="num" style="color:${L.inf.hex}">${n}</span><b style="font:700 20px var(--display)">${a}</b><span class="k">${b}</span></div>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="band split" style="background:${INK};color:${IVORY}"><div style="display:flex;flex-direction:column;gap:12px"><span class="mono" style="color:#B9A2FF">Blue Rose party trick</span><h2 style="font-size:clamp(34px,8vw,60px);font-weight:900">Add lemon. Watch it turn.</h2><p>Butterfly pea shifts from blue to violet when acid hits it. Kids lose it. Adults post it.</p><a class="btn btn-inf" href="#p-blue-rose" style="align-self:flex-start">Shop Blue Rose</a></div><div class="ph-r"><img src="${img("blue-rose")}" alt="Blue Rose infusion"></div></div></section>`;
  if (line === "nut") return `<section class="wrap sec" style="padding-top:0"><div class="band" style="background:${INK};color:${IVORY}"><span class="mono" style="color:${L.nut.hex}">What's not inside</span><h2 style="font-size:clamp(34px,8vw,60px);font-weight:900;margin:10px 0 16px">We wrote the "no" list first.</h2><div class="trust">${HABIT_NOT.map(n => `<span class="chip" style="background:transparent;color:${IVORY};border-color:#3a3943">✕ ${n.replace("No ", "")}</span>`).join("")}</div></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Stir it into anything.</h2></div><div class="steps">${[["Milk", "Warm or cold, 200 ml. Breakfast sorted."], ["Curd or oats", "Stir in a sachet. Done in 10 seconds."], ["Smoothie", "Blend with a banana. Kids won't know."]].map(([a, b], i) => `<div class="step reveal"><span class="num" style="color:${INK};background:${L.nut.hex};align-self:flex-start;border-radius:14px;padding:6px 10px;font-size:34px">${i + 1}</span><b style="font:700 20px var(--display)">${a}</b><span class="k">${b}</span></div>`).join("")}</div></section>`;
  return kanjiStory();
}

function kanjiStory() {
  const k = byId("kanji").d;
  return `<section class="wrap sec" style="padding-top:0">${pinBand(true)}</section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>${(k.statement || [])[0] || "Fermented by time."}</h2><span class="mono k">the slow way</span></div><p style="max-width:680px;font-size:18px;margin-bottom:20px">${(k.statement || [])[1] || ""}</p>
    <div class="band" style="background:${INK};color:${IVORY}"><span class="mono" style="color:#FFB3AC">How a batch becomes Kanji</span><div class="ferm" id="ferm" style="margin-top:16px">${[["Day 0", 18, "#5E1220"], ["Day 1", 34, "#7A1630"], ["Day 2", 52, "#9B1B3C"], ["Day 3", 74, "#C2264A"], ["Bottled", 100, L.kan.hex]].map(([d, h, c]) => `<div data-h="${h}" style="height:8%;background:${c}">${d}</div>`).join("")}</div><p style="margin-top:14px;color:#CFCCD8">Beetroot, carrot, rai, Lakadong turmeric, ginger and hing sit in salted water until good bacteria grow on their own. No packet cultures. Then straight into the cold chain.</p></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="split"><div><div class="sec-h"><h2>What's inside.</h2></div><div class="trust">${list(k.inside).map(x => `<span class="chip">${x}</span>`).join("")}</div><h3 style="font-size:24px;margin:22px 0 10px">What's not.</h3><div class="trust">${list(k.nots).map(x => `<span class="chip" style="background:${INK};color:${IVORY};border-color:${INK}">✕ ${x.replace(/^No /, "")}</span>`).join("")}</div></div>${nutTable(byId("kanji"))}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="band split" style="background:${L.kan.hex}"><div style="display:flex;flex-direction:column;gap:12px"><span class="mono">The weekly crate</span><h2 style="font-size:clamp(34px,8vw,60px);font-weight:900">6 bottles, every week, chilled.</h2><p style="font-weight:600">${rupee(480 * SUB)} a week instead of ${rupee(480)}. Skip a week from WhatsApp. Cancel anytime.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ink" data-crate="Weekly">Start weekly crate</button><button class="btn btn-line" data-crate="Every 2 weeks">Every 2 weeks</button></div></div>${cassette(["kanji", "kanji", "kanji"], true)}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Pour it like this.</h2></div><div class="steps">${(k.recipes || []).slice(0, 3).map((r, i) => `<a class="step reveal slink" href="#r-kanji-${i}"><span class="mono k">${r.tag}</span><b style="font:900 22px/1.05 var(--display)">${r.title}</b><span>${r.intro || ""}</span><span class="slink-go">See the recipe <i>→</i></span></a>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><h2 style="font-size:clamp(30px,7vw,48px);margin-bottom:10px">Kanji, asked and answered.</h2>${(k.faq_extra || []).map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`;
}

function nutTable(p) {
  const n = p.d.nutrition_rows || p.d.nutrition;
  if (!n) return "";
  if (typeof n === "string") return `<div class="step"><span class="mono k">Nutrition, per cup</span><div style="display:flex;flex-wrap:wrap;gap:8px">${n.replace(/^[^:]*:\s*/, "").split(" · ").map(x => `<span class="chip">${x}</span>`).join("")}</div><span class="mono k">${n.split(":")[0]}</span></div>`;
  const hd = p.kanji ? ["Per 100 ml", "Per 210 ml bottle"] : ["Per 100 g", "Per 15 g sachet"];
  return `<div class="tw"><table class="nut"><thead><tr><th>Nutrition</th><th>${hd[0]}</th><th>${hd[1]}</th></tr></thead><tbody>${n.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>`;
}

// ---------- PDP ----------
const FBT = { on: [true, true, true] };
const iconFor = name => { const sl = name.toLowerCase().replace(/^pure |a2 /g, "").replace(/[^a-z]+/g, "-").replace(/^-|-$/g, ""); if (ICONS.includes(sl)) return sl; if (ALIAS[sl]) return ALIAS[sl]; return ICONS.find(i => sl.includes(i) || sl.includes(i.split("-")[0]) && i.split("-")[0].length > 4) || null; };
const NUTV = { mode: 1 };
function nutBlock(p) {
  const n = p.d.nutrition_rows || p.d.nutrition; const l = L[p.l];
  if (!n) return "";
  if (typeof n === "string" && /OWNER TO SUPPLY/i.test(n)) return `<div class="nut2"><div class="ntabs" role="tablist"><button class="on" role="tab" aria-selected="true">Per 100 g</button><button role="tab" aria-selected="false">Per serve</button></div><div class="nrows">${["Energy", "Protein", "Carbohydrate", "of which sugar", "Fat", "Sodium"].map(r => `<div class="nrow"><span>${r}</span><span class="nbar"><i style="width:0"></i></span><b class="k">[from label]</b></div>`).join("")}</div><p class="mono k">Values go in from the final pack label</p></div>`;
  if (typeof n === "string") { const parts = n.replace(/^[^:]*:\s*/, "").split(" · "); return `<div class="nut2"><span class="mono">${n.split(":")[0]}</span><div class="nstats">${parts.map(x => { const m = x.match(/^(.*?)\s([\d.]+\s*\S+)$/); return `<div><b>${m ? m[2] : x}</b><span>${m ? m[1] : ""}</span></div>`; }).join("")}</div><p class="k" style="font-size:14px">Practically nothing but the plant. No sugar, no caffeine.</p></div>`; }
  const hd = p.kanji ? ["Per 100 ml", "Per 210 ml bottle"] : ["Per 100 g", "Per 15 g sachet"];
  const col = NUTV.mode;
  const nums = n.map(r => parseFloat(String(r[col]).replace(/[^\d.]/g, "")) || 0);
  const grams = n.map((r, i) => /\sg$/.test(r[col]) ? nums[i] : 0); const mx = Math.max(...grams, 1);
  return `<div class="nut2"><div class="ntabs" role="tablist">${hd.map((h, i) => `<button role="tab" aria-selected="${col === i + 1}" class="${col === i + 1 ? "on" : ""}" data-nm="${i + 1}">${h}</button>`).join("")}</div>
    <div class="nrows">${n.map((r, i) => `<div class="nrow"><span>${r[0]}</span><span class="nbar"><i style="width:${grams[i] ? Math.max(4, grams[i] / mx * 100) : 0}%;background:${l.hex}"></i></span><b>${r[col]}</b></div>`).join("")}</div>
    <p class="mono k">From the pack label · per serve values rounded</p></div>`;
}
function pdp(id) {
  const p = byId(id); if (!p) return notFound();
  const l = L[p.l], d = p.d;
  const pair = ["inf", "nut", "kan"].filter(k => k !== p.l).map(k => P.find(x => x.l === k && x.best));
  const fb = [p, ...pair]; FBT.ids = fb.map(x => x.id);
  const also = P.filter(x => x.id !== p.id && !pair.includes(x)).sort((a, b) => (b.best || 0) - (a.best || 0)).slice(0, 8);
  const mw = madeWith(p);
  const gal = [photo(p), `<div class="tile" style="background:${l.hex};color:${l.fg};justify-content:center;align-items:center;gap:14px"><div class="icgrid">${mw.filter(x => x.ic).slice(0, 9).map(x => `<img src="img/ing/icons/${x.ic}.png" alt="">`).join("")}</div><span class="tn" style="font-size:22px;text-align:center">${mw.length} ingredients. Nothing artificial.</span></div>`];
  const how = p.kanji ? ["Pour 100 ml, chilled.", "Before lunch, every day."] : p.l === "nut" ? ["1 sachet in 200 ml milk, curd or a smoothie.", "Breakfast, every day."] : ["1 sachet or 1–2 g in 150 ml hot water, 5 min.", { morning: "Every morning.", afternoon: "Every afternoon, hot or iced.", night: "Every night, before bed.", anytime: "Whenever you need it." }[p.m]];
  const cards = (ing(p).length ? ing(p) : mw.map(x => [x.n, ""])).map(([a, b]) => ({ a, b, ic: iconFor(a) }));
  const recs = (window.RECIPES || {})[p.k] || [];
  const vids = VIDS.filter(x => x.p === p.id).concat(VIDS.filter(x => x.p !== p.id)).slice(0, 4);
  return `<section class="wrap"><nav class="mono k" style="padding-top:12px" aria-label="Breadcrumb"><a href="#shop">Shop</a> / <a href="#${l.r}">${l.short}</a> / ${p.n}</nav>
  <div class="pdp">
    <div><div class="gal" id="gal">${gal.map(g => `<div>${g}</div>`).join("")}</div><div class="thumbs">${gal.map((g, i) => `<button data-g="${i}" class="${i ? "" : "on"}" aria-label="Image ${i + 1}">${i === 0 && p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${l.hex}"></span>`}</button>`).join("")}</div></div>
    <div class="buybox" style="display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><span class="chip"><span class="dot" style="background:${l.hex}"></span>${l.name}</span><span class="mono k">★ [rating] · [n] reviews</span></div>
      <h1>${p.n}</h1>
      <div class="pprice" id="pprice" aria-live="polite"></div>
      <p style="font-size:17px">${d.tagline || ""}</p>
      ${madeRow(p)}
      ${p.v.length > 1 ? `<div class="opt" role="group" aria-label="Size">${p.v.map((v, i) => `<button data-v="${i}" class="${i ? "" : "on"}">${v[0]}</button>`).join("")}</div>` : `<span class="mono k">${p.v[0][0]}</span>`}
      <div class="po2" role="radiogroup" aria-label="Purchase option">
        <button class="po on" data-po="once" role="radio" aria-checked="true"><span class="rd"></span><span style="flex:1;display:flex;justify-content:space-between"><b>Buy once</b><b id="ponce"></b></span></button>
        <button class="po" data-po="sub" role="radio" aria-checked="false"><span class="rd"></span><span style="flex:1"><span style="display:flex;justify-content:space-between;gap:8px"><b>Subscribe & save 15% <span class="bv">Best value</span></b><b id="psub"></b></span><span class="k" style="font-size:13px">Free shipping · skip or cancel anytime</span></span></button>
      </div>
      <div style="display:flex;gap:8px"><div class="qty"><button data-q="-1" aria-label="Less">−</button><span id="qn">1</span><button data-q="1" aria-label="More">+</button></div><button class="btn btn-line" id="atc" style="flex:1">Add to cart</button></div>
      <button class="btn btn-ink" id="buynow" style="width:100%;min-height:56px;font-size:17px">Buy now · <span id="bnp"></span></button>
      <a class="boxnudge" href="#build-a-box"><span><b>Make it a box of any 3</b><small>15% off all three · ships together</small></span><i>→</i></a>
      <div class="trust"><span class="chip">UPI & COD</span><span class="chip">Free shipping over ₹999</span><span class="chip">Made by a physician</span></div>
      <div class="vmini"><span class="mono k">Real people, real routines · tap to watch</span><div class="vmtrack">${vids.map(x => vcard(x, true)).join("")}</div></div>
    </div>
  </div></section>
  <section class="wrap"><div class="howsplit"><div><span class="mono k">How to have it</span><b>${how[0]}</b></div><div><span class="mono k">Best time</span><b>${how[1]}</b></div></div></section>
  <div class="pmarq" style="--c:${l.hex};--f:${l.fg}" aria-label="100% natural, 0 added colour, 0 artificial flavour"><div>${Array(2).fill(["100% natural", "0 added colour", "0 artificial flavour", "No preservatives", p.l === "inf" ? "Caffeine free" : p.kanji ? "No added sugar" : "Plant protein", "Made by a physician"].map(t => `<span>${t}</span><i>✦</i>`).join("")).join("")}</div></div>
  <section class="wrap sec" style="padding-bottom:0"><div class="aplus2" style="background:${l.hex};color:${l.fg}">
    ${mw.filter(x => x.ic).slice(0, 6).map((x, i) => `<img class="fl f${i}" src="img/ing/icons/${x.ic}.png" alt="">`).join("")}
    <span class="mono">${p.n} · ${mw.length} ingredients</span><h2>${(d.aplus_hook || [d.tagline])[0]}</h2><p>${(d.aplus_hook || [])[1] || ""}</p></div></section>
  <section class="wrap sec" style="padding-bottom:0"><div class="does" style="--c:${l.hex};--f:${l.fg}">
    <div class="does-h"><span class="mono k">What it does for you</span><h2>${(d.bands || [])[0] || "Why it works."}</h2><p class="k">From Dr Aneet's notes. Food, not medicine: it supports, it doesn't cure.</p></div>
    <ol class="does-l">${(BENEFITS[p.k] || []).map(t => { const m = t.match(/^(.*?\.)\s+(.*)$/); return `<li><b>${m ? m[1].replace(/\.$/, "") : t}</b>${m ? `<span>${m[2]}</span>` : ""}</li>`; }).join("")}</ol></div></section>
  <section class="wrap sec"><div class="sec-h"><h2>What's inside, and why.</h2><span class="mono k">${cards.length} ingredients · all on the front</span></div>
    <ul class="whyl">${cards.map(c => `<li style="--c:${l.hex};--f:${l.fg}">${c.ic ? `<img src="img/ing/icons/${c.ic}.png" alt="">` : `<span class="wi">${c.a[0]}</span>`}<span><b>${c.a}</b><span class="k">${(c.b || "Exactly what it says. Nothing hiding behind it.").split(/(?<=\.)\s/)[0]}</span></span></li>`).join("")}</ul>
    ${p.l === "nut" ? `<div class="notlist"><span class="mono">What's not inside</span>${HABIT_NOT.map(n => `<span class="chip">✕ ${n.replace("No ", "")}</span>`).join("")}</div>${d.allergens ? `<p class="mono" style="margin-top:10px">Allergens: ${d.allergens}</p>` : ""}` : p.kanji ? `<div class="notlist"><span class="mono">What's not inside</span>${list(d.nots).map(n => `<span class="chip">✕ ${n.replace(/^No /, "")}</span>`).join("")}</div>` : ""}</section>
  <section class="wrap sec" style="padding-top:0"><div class="split" style="align-items:stretch">
    <div class="note"><span class="mono">A note from Dr Aneet</span>${(d.dr_note || []).slice(0, 2).map((t, i) => `<p style="margin-top:12px;${i ? "" : "font:700 20px/1.3 var(--display)"}">${t}</p>`).join("")}<p class="hand" style="font-size:44px;margin-top:8px">Dr Aneet</p><div class="advis"><span class="mono" style="font-size:9px">Doctor's advisory</span><b>CONTAINS NOTHING ARTIFICIAL</b></div></div>
    <div><div class="sec-h" style="margin-bottom:12px"><h2 style="font-size:clamp(28px,6vw,44px)">Nutrition.</h2></div><div id="nutwrap">${nutBlock(p)}</div>${(d.dr_note || [])[2] ? `<p class="k" style="margin-top:12px;font-size:14px">${d.dr_note[2]}</p>` : ""}</div></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="fbt"><div class="sec-h" style="margin:0"><h2 style="font-size:clamp(24px,6vw,36px)">Frequently bought together</h2><span class="mono k">all 3 · save 15%</span></div>
    <div class="fbt-r">${fb.map((x, i) => `<label class="fbt-i"><input type="checkbox" data-fbt="${i}" ${FBT.on[i] ? "checked" : ""}><span class="th">${x.img ? `<img src="${img(x.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[x.l].hex}"></span>`}</span><span><b>${i ? "" : "This: "}${x.n}</b><br><small class="k">${L[x.l].short} · ${rupee(x.v[0][1])}</small></span></label>${i < 2 ? `<span class="plus">+</span>` : ""}`).join("")}</div>
    <div class="fbt-b"><span id="fbtT"></span><button class="btn btn-ink" id="fbtGo">Add selected to cart</button></div></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Reviews.</h2><span class="mono k">[reviews app]</span></div>${reviews()}
    <h2 style="font-size:clamp(28px,6vw,44px);margin:40px 0 10px">Asked and answered.</h2>${[["How do I take it?", how.join(" ")], ["Buy once or subscribe?", "Buy once is a single order. Subscribe & save sends it on your schedule at 15% off with free shipping. Skip, pause or cancel anytime from WhatsApp."]].concat(d.faqs_extra || d.faq_extra || []).map(([q, a]) => `<details class="faq"><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>People also bought.</h2><a class="btn btn-line btn-sm" href="#shop">Shop all →</a></div><div class="rail">${also.map(card).join("")}</div></section>
  ${recs.length ? `<section class="wrap recl"><a class="boxnudge" href="#recipes"><span><b>${recs.length} recipes with ${p.n}</b><small>hot, iced and in the kitchen</small></span><i>→</i></a></section><section class="wrap sec pdp-recs" style="padding-top:0"><div class="sec-h"><h2>Recipes with ${p.n}.</h2><a class="btn btn-line btn-sm" href="#recipes">All recipes →</a></div><div class="rail">${recs.map((r, i) => rcard(p, r, i)).join("")}</div></section>` : ""}
  `;
}
const rslug = (p, i) => `r-${p.id}-${i}`;
const rcard = (p, r, i) => `<a class="rc" href="#${rslug(p, i)}" style="--c:${L[p.l].hex};--f:${L[p.l].fg}"><span class="rc-top"><span class="mono">${r.tag || "Recipe"}</span><span class="rc-p"><span class="dot" style="background:${L[p.l].hex}"></span>${p.n}</span></span><b>${r.title}</b><span class="k">${r.intro || ""}</span><span class="rc-go">Make it →</span></a>`;
const RF = { p: "all", t: "all" };
function recipes() {
  const all = P.flatMap(p => ((window.RECIPES || {})[p.k] || []).map((r, i) => ({ p, r, i })));
  const tags = [...new Set(all.map(x => x.r.tag).filter(Boolean))];
  const shown = all.filter(x => (RF.p === "all" || x.p.id === RF.p) && (RF.t === "all" || x.r.tag === RF.t));
  return `<section class="wrap" style="padding-block:24px 6px"><span class="mono">Recipes · ${all.length} ways to make it daily</span><h1 style="font-size:clamp(44px,11vw,96px);font-weight:900;margin-top:8px">Recipes.</h1><p style="font-size:18px;max-width:560px;margin-top:8px">Every recipe is made with something we make. Tap one, then add what it's made with in one tap.</p></section>
  <section class="wrap" style="position:sticky;top:64px;z-index:5;background:var(--ivory);padding-block:10px;display:flex;flex-direction:column;gap:8px">
    <div class="chips-x"><button class="chip ${RF.p === "all" ? "on" : ""}" data-rp="all">All products</button>${P.filter(p => ((window.RECIPES || {})[p.k] || []).length).map(p => `<button class="chip ${RF.p === p.id ? "on" : ""}" data-rp="${p.id}"><span class="dot" style="background:${L[p.l].hex}"></span>${p.n}</button>`).join("")}</div>
    <div class="chips-x"><button class="chip ${RF.t === "all" ? "on" : ""}" data-rt="all">Any style</button>${tags.map(t => `<button class="chip ${RF.t === t ? "on" : ""}" data-rt="${t}">${t}</button>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:14px"><div class="grid rgrid">${shown.map(x => rcard(x.p, x.r, x.i)).join("") || `<p class="k">No recipes match. Try another filter.</p>`}</div></section>`;
}
function recipe(slug) {
  const m = slug.match(/^r-(.+)-(\d+)$/); const p = m && byId(m[1]); const r = p && ((window.RECIPES || {})[p.k] || [])[+m[2]];
  if (!r) return notFound();
  const l = L[p.l], more = ((window.RECIPES || {})[p.k] || []).map((x, i) => [x, i]).filter(([, i]) => i !== +m[2]).slice(0, 3);
  return `<section style="background:${l.hex};color:${l.fg}"><div class="wrap split" style="padding-block:30px">
    <div style="display:flex;flex-direction:column;gap:12px"><nav class="mono" aria-label="Breadcrumb"><a href="#recipes">Recipes</a> / ${p.n}</nav><span class="mono">${r.tag || "Recipe"} · made with ${p.n}</span><h1 style="font-size:clamp(40px,10vw,84px);font-weight:900;line-height:.92">${r.title}</h1><p style="font-size:18px;max-width:520px">${r.intro || ""}</p>${r.src === "claude" ? `<span class="mono" style="opacity:.75">Recipe draft · kitchen-test before publishing</span>` : `<span class="mono" style="opacity:.75">Dr Aneet's recipe</span>`}</div>
    <div class="madewith-card"><span class="mono k">Made with</span><div style="display:flex;gap:12px;align-items:center"><span class="th" style="width:72px;height:72px;border-radius:14px;overflow:hidden;flex:none">${p.img ? `<img src="${img(p.img)}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<span style="display:block;width:100%;height:100%;background:${l.hex}"></span>`}</span><span style="flex:1"><b style="font:900 20px var(--display)">${p.n}</b><br><small class="k">${p.v[0][0]} · ${rupee(p.v[0][1])}</small></span></div><div style="display:flex;gap:8px"><button class="btn btn-line" style="flex:1" data-add="${p.id}">Add to cart</button><button class="btn btn-ink" style="flex:1" data-buy="${p.id}">Buy now</button></div><a class="mono" href="#p-${p.id}" style="text-decoration:underline">See ${p.n} →</a></div></div></section>
  <section class="wrap sec"><div class="split" style="align-items:start"><div><h2 style="font-size:32px;margin-bottom:12px">You'll need</h2><ul class="ul">${(r.ing || []).map(x => `<li>${x}</li>`).join("")}</ul></div><div><h2 style="font-size:32px;margin-bottom:12px">Method</h2><ol class="ol">${(r.method || []).map(x => `<li>${x}</li>`).join("")}</ol></div></div></section>
  ${more.length ? `<section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>More with ${p.n}.</h2><a class="btn btn-line btn-sm" href="#recipes">All recipes →</a></div><div class="rail">${more.map(([x, i]) => rcard(p, x, i)).join("")}</div></section>` : ""}`;
}

function mixtape() {
  return `<section class="wrap" style="padding-block:28px 10px"><span class="mono">Build a box · pick any 3 · save 15%</span><h1 style="font-size:clamp(44px,11vw,96px);font-weight:900;margin-top:8px">Build a box of 3.</h1><p style="font-size:18px;max-width:560px;margin-top:10px">Pick any three products from any line. They ship together at 15% off. Subscribe to the whole box and it's 15% off with free shipping.</p></section>
  <section class="wrap sec" style="padding-top:18px"><div class="split" style="align-items:start">
    <div style="position:sticky;top:84px;display:flex;flex-direction:column;gap:14px" id="mxl">${mixPanel()}</div>
    <div><div class="mono k" style="margin-bottom:10px">Tap a product to add it</div><div class="steps" style="grid-template-columns:1fr">${Object.keys(L).map(k => `<div><h3 style="font-size:20px;margin:10px 0"><span class="dot" style="display:inline-block;background:${L[k].hex};margin-right:8px"></span>${L[k].name}</h3><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${P.filter(p => p.l === k).map(p => `<button class="pick" data-pick="${p.id}"><span class="th">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[k].hex}"></span>`}</span><span><b>${p.n}</b><br><small class="k">${rupee(p.v[0][1])} · ${p.m}</small></span></button>`).join("")}</div></div>`).join("")}</div></div>
  </div></section>`;
}
let mix = [null, null, null];
function mixPanel() {
  const n = mix.filter(Boolean).length;
  const sum = mix.filter(Boolean).reduce((s, id) => s + byId(id).v[0][2], 0);
  return `${cassette(mix, n === 3)}
  ${mix.map((id, i) => `<div class="slot ${id ? "full" : ""}"><span class="n">${i + 1}</span>${id ? `<span style="flex:1"><b>${byId(id).n}</b><br><small class="k">${L[byId(id).l].short} · ${rupee(byId(id).v[0][1])}</small></span><button class="chip" data-unpick="${i}" aria-label="Remove ${byId(id).n}">✕</button>` : `<span class="k">${["Your first pick", "Your second pick", "Your third pick"][i]}</span>`}</div>`).join("")}
  <div class="step" style="padding:16px"><div style="display:flex;justify-content:space-between"><span>Box price</span><span><s class="k">${rupee(sum)}</s> <b>${rupee(sum * BUNDLE)}</b></span></div><div style="display:flex;justify-content:space-between" class="k"><span>Subscribe instead</span><span>${rupee(sum * SUB)} · free shipping</span></div>
  <button class="btn ${n === 3 ? "btn-ink" : ""}" id="mxgo" ${n === 3 ? "" : "disabled"} style="margin-top:10px;width:100%;${n === 3 ? "" : "background:var(--line);color:var(--muted)"}">${n === 3 ? "Add my box to cart" : `Pick ${3 - n} more`}</button>
  <button class="btn btn-line btn-sm" id="mxrep" ${n === 3 ? "" : "disabled"} style="margin-top:8px;width:100%;opacity:${n === 3 ? 1 : .4}">Subscribe to the whole box · save 15%</button></div>`;
}

function club() {
  return `<section style="background:${L.inf.hex};color:#fff"><div class="wrap split" style="padding-block:40px"><div style="display:flex;flex-direction:column;gap:14px"><span class="mono">${hm()} Club</span><h1 style="font-size:clamp(46px,11vw,100px);font-weight:900;line-height:.9">${words("The cult of doing it daily.")}</h1><p style="font-size:18px">No fee, no points maths. Subscribe to any product and you're a member.</p><a class="btn btn-nut" href="#subscriptions" style="align-self:flex-start">See subscriptions →</a></div>${wrapped()}</div></section>
  <section class="wrap sec"><div class="sec-h"><h2>Members get.</h2></div><div class="steps">${[["15% off", "Every order, for as long as you subscribe."], ["Free shipping", "On every repeat order, no minimum."], ["First dibs", "New drops reach members 48 hours early."], ["₹200 / ₹200", "Give a friend ₹200, get ₹200 when they order."], ["Birthday cup", "A free pouch in your birthday month."], ["Habit Wrapped", "Your year of habits, every December."]].map(([a, b], i) => `<div class="step reveal" style="background:${[L.inf.hex, L.nut.hex, L.kan.hex][i % 3]};color:${i % 3 ? INK : "#fff"}"><b style="font:900 30px var(--display)">${a}</b><span>${b}</span></div>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Your streak, your rank.</h2><span class="mono k">ranks unlock with days subscribed</span></div><div class="steps">${[["15", "Member", "Club card + member number"], ["90", "Regular", "Early drops + your name on the sleeve"], ["365", "Lifer", "Club jacket + a call with Dr Aneet"]].map(([d, n, p]) => `<div class="step reveal"><span class="num">${d}<small style="font-size:16px"> days</small></span><b style="font:900 26px var(--display)">${n}</b><span class="k">${p}</span></div>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="band split" style="background:${INK};color:${IVORY}"><div style="display:flex;flex-direction:column;gap:12px"><span class="mono" style="color:${L.nut.hex}">Refer a friend</span><h2 style="font-size:clamp(32px,7vw,56px);font-weight:900">₹200 for them. ₹200 for you.</h2><p>Your link: <b>makehabit.in/r/[your-code]</b></p><button class="btn btn-nut" style="align-self:flex-start" id="copyRef">Copy my link</button></div><div class="note" style="color:${INK}"><span class="mono">Member card · sample</span><div style="font:900 44px var(--display);margin:10px 0">#000214</div><div>Priya · Regular · 94 days subscribed</div></div></div></section>`;
}

const HAMP = { size: 3, items: [], note: "Fifteen days. Then tell me how you feel.", wrap: true };
function hamper() {
  const sum = HAMP.items.reduce((s, id) => s + byId(id).v[0][1], 0) + (HAMP.wrap ? 99 : 0);
  return `<section class="wrap" style="padding-block:28px 10px"><span class="mono">Make your own hamper</span><h1 style="font-size:clamp(44px,11vw,96px);font-weight:900;margin-top:8px">Build a box worth unboxing.</h1></section>
  <section class="wrap sec" style="padding-top:18px"><div class="split" style="align-items:start">
    <div style="display:flex;flex-direction:column;gap:14px;position:sticky;top:84px">
      <div class="band" style="background:${L.nut.hex};padding:20px"><div style="display:grid;grid-template-columns:repeat(${HAMP.size > 3 ? 4 : 3},1fr);gap:8px">${Array.from({ length: HAMP.size }, (_, i) => { const id = HAMP.items[i]; const p = id && byId(id); return `<div style="aspect-ratio:1;border-radius:14px;overflow:hidden;background:${p ? L[p.l].hex : "rgba(22,21,28,.12)"};display:grid;place-items:center;border:2px dashed ${p ? "transparent" : "rgba(22,21,28,.3)"}">${p ? (p.img ? `<img src="${img(p.img)}" alt="${p.n}" style="width:100%;height:100%;object-fit:cover">` : `<b style="font-size:12px;padding:4px;text-align:center">${p.n}</b>`) : `<span class="mono">${i + 1}</span>`}</div>`; }).join("")}</div>
      <div style="background:${IVORY};border-radius:14px;padding:14px;margin-top:12px;transform:rotate(-2deg)"><span class="mono k">gift note</span><p class="hand" style="font-size:30px;line-height:1.1">${HAMP.note.replace(/</g, "&lt;")}</p></div></div>
      <div class="step" style="padding:16px"><div style="display:flex;justify-content:space-between"><b>Total</b><b>${rupee(sum)}</b></div><button class="btn btn-ink" id="hgo" style="margin-top:10px" ${HAMP.items.length === HAMP.size ? "" : "disabled"}>${HAMP.items.length === HAMP.size ? "Add hamper to cart" : `Add ${HAMP.size - HAMP.items.length} more`}</button></div></div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div><span class="mono">1 · Box size</span><div class="opt" style="margin-top:8px">${[3, 5, 7].map(n => `<button data-hs="${n}" class="${HAMP.size === n ? "on" : ""}">${n} items</button>`).join("")}</div></div>
      <div><span class="mono">2 · Fill it</span><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));margin-top:8px">${P.map(p => `<button class="pick" data-hp="${p.id}"><span class="th">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}</span><span><b>${p.n}</b><br><small class="k">${rupee(p.v[0][1])}</small></span></button>`).join("")}</div></div>
      <div><label class="mono" for="hnote">3 · Write the note (we hand-write it)</label><textarea id="hnote" class="field" style="height:90px;padding:12px;margin-top:8px;width:100%;border-radius:14px">${HAMP.note}</textarea></div>
      <label class="tog ${HAMP.wrap ? "on" : ""}" id="hwrap"><i></i>4 · Gift wrap with a wax seal (+₹99)</label>
    </div></div></section>`;
}

function subscriptions() {
  return `<section style="background:${L.inf.hex};color:#fff"><div class="wrap split" style="padding-block:40px"><div style="display:flex;flex-direction:column;gap:14px"><span class="mono" style="color:${L.nut.hex}">Subscriptions</span><h1 style="font-size:clamp(46px,11vw,100px);font-weight:900;line-height:.9">${words("Subscribe & save 15%.")}</h1><p style="font-size:18px">Every product, every line. 15% off, free shipping, and the controls are yours.</p></div>${cassette(["golden-elixir", "kesar-elaichi", "kanji"], true)}</div></section>
  <section class="wrap sec"><div class="steps">${[["1", "Pick anything", "Any product, any line, choose 'Subscribe & save' on the page."], ["2", "Choose your rhythm", "Every 30, 45 or 60 days. Kanji weekly or fortnightly."], ["3", "Skip, swap, stop", "From WhatsApp or your account. No calls, no forms."]].map(([n, a, b]) => `<div class="step reveal"><span class="num" style="color:${[L.inf.hex, L.nut.hex, L.kan.hex][+n - 1]}">${n}</span><b style="font:700 22px var(--display)">${a}</b><span class="k">${b}</span></div>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="band split" style="background:${L.nut.hex}"><div style="display:flex;flex-direction:column;gap:12px"><span class="mono">Savings calculator</span><label for="calcP" style="font-weight:700">If I subscribe to</label><select id="calcP" class="field">${P.map(p => `<option value="${p.id}">${p.n} · ${rupee(p.v[0][1])}</option>`).join("")}</select><label for="calcF" style="font-weight:700">every</label><select id="calcF" class="field"><option value="30">30 days</option><option value="45">45 days</option><option value="60">60 days</option><option value="7">week (Kanji)</option></select></div><div style="text-align:center"><span class="mono">You save in a year</span><div id="calcOut" style="font:900 clamp(56px,14vw,110px)/1 var(--display)">₹0</div><span class="mono">plus free shipping on every order</span></div></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Your controls.</h2><span class="mono k">account page preview</span></div><div class="step" style="max-width:560px"><div style="display:flex;gap:12px;align-items:center"><span class="th" style="width:56px;height:56px;border-radius:12px;overflow:hidden"><img src="${img("golden-elixir")}" alt="" style="width:100%;height:100%;object-fit:cover"></span><span style="flex:1"><b>Golden Elixir · pouch</b><br><small class="k">Next: 18 Nov · every 30 days · ${rupee(369 * SUB)}</small></span></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="chip">Skip next</button><button class="chip">Send now</button><button class="chip">Swap product</button><button class="chip">Change rhythm</button><button class="chip">Pause</button><button class="chip">Cancel</button></div></div></section>`;
}

function gifting() {
  const sets = [["Discovery Set", "One sachet of every infusion. The best first gift.", ["hibiscus", "golden-elixir", "blue-rose"], "[PRICE]"], ["Morning to Night", "Golden Elixir, Kesar Elaichi and Golden Latte.", ["golden-elixir", "kesar-elaichi", "golden-latte"], null], ["Kanji Party Crate", "12 bottles of Kanji and a Hibiscus pouch for the mocktails.", ["kanji", "kanji", "hibiscus"], null]];
  return `<section class="wrap split" style="padding-block:34px"><div style="display:flex;flex-direction:column;gap:14px"><span class="mono">Gifting</span><h1 style="font-size:clamp(46px,11vw,96px);font-weight:900;line-height:.9">${words("Give a habit, not a hamper of sugar.")}</h1><div class="ctas"><a class="btn btn-ink" href="#hamper">Build your own</a><a class="btn btn-line" href="#gift-corp">Corporate gifting</a></div></div><div class="ph-r"><img src="${img("gifting")}" alt="Gift collection"></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="sec-h"><h2>Ready to send.</h2></div><div class="steps">${sets.map(([n, d, ids, pr], i) => { const s = ids.reduce((a, id) => a + byId(id).v[0][1], 0) * (i === 2 ? 1 : 1); return `<div class="step reveal" style="padding:0;overflow:hidden"><div style="display:grid;grid-template-columns:repeat(3,1fr)">${ids.map(id => `<img src="${img(byId(id).img)}" alt="" style="aspect-ratio:1;object-fit:cover;width:100%">`).join("")}</div><div style="padding:18px;display:flex;flex-direction:column;gap:8px"><b style="font:900 24px var(--display)">${n}</b><span class="k">${d}</span><div style="display:flex;justify-content:space-between;align-items:center"><b>${pr || rupee(s * BUNDLE)}</b><button class="btn btn-ink btn-sm" data-set="${ids.join(",")}">Add set</button></div></div></div>`; }).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0" id="gift-corp"><div class="band split" style="background:${L.inf.hex};color:#fff"><div style="display:flex;flex-direction:column;gap:12px"><span class="mono">Corporate gifting</span><h2 style="font-size:clamp(32px,7vw,56px);font-weight:900">Diwali boxes your team will actually use.</h2><p>From 25 boxes. Your logo on the sleeve, a note from Dr Aneet inside.</p></div><form class="note" style="color:${INK};display:flex;flex-direction:column;gap:10px" data-form><label for="gcN" class="mono">Company</label><input id="gcN" class="field"><label for="gcQ" class="mono">How many boxes</label><input id="gcQ" class="field" inputmode="numeric"><label for="gcW" class="mono">WhatsApp</label><input id="gcW" class="field" inputmode="tel"><button class="btn btn-ink" type="submit">Get a quote in 24 hours</button></form></div></section>`;
}

function about() {
  return `<section class="wrap split" style="padding-block:34px"><div style="display:flex;flex-direction:column;gap:14px"><span class="mono">About us</span><h1 style="font-size:clamp(46px,11vw,96px);font-weight:900;line-height:.9">${words("A doctor got tired of the hacks.")}</h1><p style="font-size:18px">Dr Aneet spent 29 years watching processed drinks and miracle powders let her patients down. So she went back to the kitchen: real ingredients, honest labels, one cup a day.</p></div><div class="ph-r" style="background:${L.nut.hex};display:grid;place-items:center;text-align:center;padding:20px"><span class="mono">[Photo: Dr Aneet in her clinic, morning light, speaking to camera]</span></div></section>
  <section class="wrap sec" style="padding-top:0"><div class="steps">${[["Real ingredients", "Every one on the front of the pack. No 'proprietary blends'."], ["Honest claims", "We say what a cup supports, never what it cures."], ["Daily, not drastic", "Small, repeatable, delicious. That's how health actually works."]].map(([a, b], i) => `<div class="step reveal" style="background:${[L.inf.hex, L.nut.hex, L.kan.hex][i]};color:${i ? INK : "#fff"}"><b style="font:900 26px var(--display)">${a}</b><span>${b}</span></div>`).join("")}</div></section>
  <section class="wrap sec" style="padding-top:0"><div class="note"><span class="mono">Liner notes</span><p class="hand" style="margin-top:12px">Good health is a habit, not a hack. Make it a daily one.</p><p class="mono k" style="margin-top:10px">JAAP Enterprises · Noida</p></div></section>`;
}

const CK = { pay: "upi" };
function checkout() {
  const t = totals(), sp = saveParts(t), n = cart.reduce((s, i) => s + i.q, 0);
  const gap = Math.max(0, GIFT_AT - t.sub);
  const have = new Set(cart.map(i => i.id));
  const lines = new Set(cart.map(i => byId(i.id).l)); const crossBest = P.filter(p => !have.has(p.id) && p.best).sort((a, b) => lines.has(a.l) - lines.has(b.l))[0];
  const closer = (gap > 0 && P.filter(p => !have.has(p.id) && p.v[0][1] >= gap).sort((a, b) => a.v[0][1] - b.v[0][1])[0]) || crossBest;
  const sv = subSave();
  const summary = `${cart.map(it => { const p = byId(it.id); return `<div class="ck-line"><span class="th">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}<i>${it.q}</i></span><span style="flex:1;min-width:0"><b>${p.n}</b><br><small class="k">${p.v[it.v][0]}${it.sub ? " · repeats " + it.freq.toLowerCase() : ""}</small></span><span style="text-align:right"><b>${rupee(unit(it) * it.q)}</b>${unit(it) < p.v[it.v][2] ? `<br><s class="k">${rupee(p.v[it.v][2] * it.q)}</s>` : ""}</span></div>`; }).join("")}
    <div class="ck-tot"><div><span>Items</span><span>${rupee(t.mrp)}</span></div>${sp.box ? `<div class="g"><span>Box of 3</span><span>−${rupee(sp.box)}</span></div>` : ""}${sp.launch ? `<div class="g"><span>Launch prices</span><span>−${rupee(sp.launch)}</span></div>` : ""}${sp.sub ? `<div class="g"><span>15% repeat saving</span><span>−${rupee(sp.sub)}</span></div>` : ""}<div class="g"><span>Shipping</span><span>${t.ship ? rupee(t.ship) : "<s>₹60</s> Free"}</span></div><div class="big"><span>To pay</span><span>${rupee(t.total)}</span></div></div>`;
  if (!cart.length) return `<section class="wrap" style="padding-block:60px;text-align:center"><h1 style="font-size:48px">Your cart is empty.</h1><a class="btn btn-ink" href="#shop" style="margin-top:20px">Back to the shop</a></section>`;
  return `<section class="wrap ck">
    <div class="ck-steps"><span class="done">✓ Cart</span><i></i><span class="on">Details</span><i></i><span>Pay</span></div>
    <div class="savehero ck-save"><span class="mono">You're saving on this order</span><b class="sv-big">${rupee(sp.all)}</b><span class="cdl lt"><span class="pulse"></span>Launch prices end in <b data-cd="s"></b></span><div class="sv-chips">${sp.launch ? `<span>Launch prices −${rupee(sp.launch)}</span>` : ""}${sp.sub ? `<span>15% repeat −${rupee(sp.sub)}</span>` : ""}${sp.box ? `<span>Box of 3 −${rupee(sp.box)}</span>` : ""}${sp.ship ? `<span>Free shipping −₹60</span>` : ""}</div></div>
    <div class="ck-grid">
      <div class="ck-main">
        <details class="ck-sum-m"><summary><span>Order summary · ${n} item${n > 1 ? "s" : ""}</span><b>${rupee(t.total)}</b></summary>${summary}</details>
        <form class="ck-card" data-form autocomplete="on">
          <h2>Where should it go?</h2>
          <label for="ckPh">Phone</label><div class="ck-ph"><span>+91</span><input id="ckPh" class="field" inputmode="tel" autocomplete="tel-national" placeholder="98765 43210"></div><small class="k">We'll send a one-time code. Returning? Your address fills in by itself.</small>
          <label for="ckPin">Pincode</label><input id="ckPin" class="field" inputmode="numeric" maxlength="6" autocomplete="postal-code" placeholder="6 digits"><small class="k" id="ckCity">City and state fill in from your pincode.</small>
          <label for="ckN">Full name</label><input id="ckN" class="field" autocomplete="name">
          <label for="ckA">House, street, area</label><input id="ckA" class="field" autocomplete="street-address">
        </form>
        ${sv > 0 ? `<button class="nudge2" data-suball><span class="nd-l"><b>Save ${rupee(sv)} more before you pay</b><small>Have these delivered again every 30 days at 15% off. Skip, pause or cancel anytime from WhatsApp.</small></span><span class="nd-b">Save ${rupee(sv)}</span></button>` : ""}
        ${closer ? `<div class="ck-up"><span class="mono">${gap > 0 ? (closer.v[0][1] >= gap ? `Add this and get a free Discovery Set` : `Add this and you're ${rupee(gap - closer.v[0][1])} from a free Discovery Set`) : "Goes in the same box, no extra shipping"}</span><div class="ck-up-r"><span class="th">${closer.img ? `<img src="${img(closer.img)}" alt="">` : ""}</span><span style="flex:1"><b>${closer.n}</b><br><small class="k">${L[closer.l].short} · ${rupee(closer.v[0][1])}</small></span><button class="btn btn-ink btn-sm" data-ckadd="${closer.id}">Add</button></div>${gap > 0 ? `<div class="prog" style="margin-top:12px"><i style="width:${Math.min(100, t.sub / GIFT_AT * 100)}%"></i><b style="left:100%">🎁</b></div>` : ""}</div>` : ""}
        <div class="ck-card"><h2>Pay</h2>
          ${[["upi", "UPI", "Google Pay, PhonePe, Paytm or any UPI app", "Fastest"], ["card", "Card", "Credit or debit", ""], ["cod", "Cash on delivery", "Pay when it arrives", ""]].map(([k, a, b, tag]) => `<button type="button" class="pay ${CK.pay === k ? "on" : ""}" data-pay="${k}"><span class="rd"></span><span style="flex:1;text-align:left"><b>${a}</b>${tag ? ` <span class="best">${tag}</span>` : ""}<br><small class="k">${b}</small></span></button>`).join("")}
          <div class="ck-pay-ph k">[Razorpay / Shopflo payment step opens here]</div>
        </div>
        <div class="trust" style="justify-content:center"><span class="chip">🔒 Secure payment</span><span class="chip">COD available</span><span class="chip">Cancel repeat orders anytime</span></div>
      </div>
      <aside class="ck-side"><div class="ck-card"><h2>Your order</h2>${summary}</div><div class="note" style="padding-bottom:24px"><p class="hand" style="font-size:30px">Thank you for trying us. Fifteen days, then tell me how you feel.</p><span class="mono k">Dr Aneet</span></div></aside>
    </div>
  </section>
  <div class="ck-bar"><div><b>${rupee(t.total)}</b>${sp.all ? `<small>saving ${rupee(sp.all)}</small>` : ""}</div><a class="btn btn-ink" href="#thanks" id="ckPay">${CK.pay === "cod" ? "Place order" : "Pay"} ${rupee(t.total)} →</a></div>
  <p class="mono k" style="text-align:center;padding:0 16px 120px">Prices include GST · no extra fees at the end</p>`;
}
const thanks = () => `<section class="wrap" style="padding-block:40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px"><div style="width:100%;max-width:340px">${cassette(["golden-elixir", "kesar-elaichi", "kanji"], true)}</div><h1 style="font-size:clamp(40px,10vw,84px);font-weight:900">Order placed. Day 1 is on its way.</h1><p style="font-size:18px;max-width:480px">Day 1 starts when it lands. We'll WhatsApp you the tracking and a reminder on day 1.</p><div class="note" style="max-width:520px;text-align:left"><span class="mono">One tap, same delivery</span><div style="display:flex;gap:12px;align-items:center;margin-top:10px"><img src="${img("kanji")}" alt="" style="width:64px;height:64px;border-radius:12px;object-fit:cover"><span style="flex:1"><b>Add a 6-pack of Kanji</b><br><small class="k">${rupee(480 * 0.85)} · ships with this order</small></span><button class="btn btn-ink btn-sm" data-add="kanji">Add</button></div></div></section>`;
const notFound = () => `<section class="wrap" style="padding-block:60px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:18px"><div style="width:200px;height:200px;border-radius:50%;background:repeating-radial-gradient(circle,#16151C 0 2px,#24232c 2px 5px);display:grid;place-items:center;animation:spin 2s linear infinite"><span style="width:70px;height:70px;border-radius:50%;background:${L.kan.hex}"></span></div><h1 style="font-size:clamp(40px,10vw,80px);font-weight:900">This page doesn't exist.</h1><p>But your habit can. Head back to the shop.</p><a class="btn btn-ink" href="#shop">Back to the shop</a></section>`;

function notes() {
  const rows = (h, r) => `<div class="tw"><table class="spec"><thead><tr>${h.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${r.map(x => `<tr>${x.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return `<section class="wrap sec"><span class="mono">For the Shopify agency</span><h1 style="font-size:clamp(40px,10vw,84px);font-weight:900;margin:8px 0 20px">Design notes.</h1>
  <h2 style="font-size:28px;margin:20px 0 10px">Colour and type</h2>${rows(["Token", "Value", "Use"], [["Ivory", "#F4EFE6", "Page ground"], ["Paper", "#FCFAF6", "Cards"], ["Ink", "#16151C", "Text, buttons, dark bands, footer"], ["Infusions", "#7B5CFF", "Herbal Infusions line"], ["Nutri-mixes", "#FFE34F", "Nutri-mixes line"], ["Kanji", "#FF5A4E", "Kanji line, the seed in the A"], ["Display", "Unbounded 700/900", "Headlines, prices"], ["Body", "Instrument Sans 400–700", "Everything else"], ["Meta", "DM Mono", "Eyebrows, labels"], ["Hand", "Allura (thickened)", "Dr Aneet only"]])}
  <h2 style="font-size:28px;margin:28px 0 10px">Motion spec</h2>${rows(["Moment", "Spec", "Shopify note"], [["First-visit loader", "Spinning record + 0→100 counter, ~1.4 s, then clips up (0.7 s, cubic-bezier .2,.8,.2,1). Once per session.", "Theme snippet + sessionStorage"], ["Page change", "Three line-colour bars wipe up then off, 0.9 s, 60 ms stagger", "Custom JS on internal link click; skip on reduced motion"], ["Hero record (3D)", "three.js disc, spins 0.4 rad/s, tilts with scroll + pointer, three line-colour beads orbit", "Custom Liquid section with three.js; fallback: looping MP4"], ["Headline words", "Rise from 60% below, 0.9 s, 70 ms per word", "CSS keyframes"], ["Cards", "Lift 6 px + 0.4° tilt, image zoom 1.06 over 0.8 s", "CSS"], ["Add to cart", "Cart count springs 1.5×, toast with product thumbnail, 2.2 s", "Cart drawer JS"], ["Cart progress", "Width springs (cubic-bezier .34,1.56,.64,1) 0.7 s; milestone dot fills ink", "Cart drawer"], ["Build a box", "Each slot drops a product photo in with a spring (0.45 s); lid closes at 3/3", "Bundle app + custom section"], ["Spin the record", "4.2 s ease-out spin, lands on a real prize", "Popup app or custom"], ["Header", "Hides on scroll down after 300 px, returns on scroll up", "Theme setting"], ["Reduced motion", "All of the above off", "prefers-reduced-motion"]])}
  <h2 style="font-size:28px;margin:28px 0 10px">Funnel</h2>${rows(["Entry", "Path", "Lever"], [["Meta ad", "Line page or PDP (offer from URL) → sticky add to cart → drawer → 1-page checkout", "Pre-applied code, sticky bar, drawer not page"], ["Home", "Pick your line / Build a box → PDP → drawer", "Box of 3 at 15% off"], ["Any PDP", "Subscribe preselected and clearly labelled → drawer cross-line suggestions", "Subscribe & save 15%, free shipping"], ["Cart drawer", "₹999 free shipping bar → ₹1,799 free Discovery Set → one-tap adds from missing lines", "AOV"], ["Exit / 12 s", "Spin the record (once per visitor) → code by email or WhatsApp", "Capture"], ["Thank-you", "One-tap Kanji add to the same delivery", "Post-purchase AOV"]])}
  <h2 style="font-size:28px;margin:28px 0 10px">Psychology, kept honest</h2>${rows(["Lever", "How we use it", "What we never do (CCPA Dark Patterns Guidelines 2023)"], [["Identity", "'Join the cult of doing it daily', ranks, member numbers", "Confirm-shaming copy on decline buttons"], ["Goal gradient", "Progress bar to free shipping and gift", "Fake countdown timers"], ["Endowment", "A box they build themselves", "Sneaking items into the basket"], ["Reciprocity", "Every spin slice is a real prize", "Rigged or unclear odds"], ["Social proof", "Real reviews, real batch news", "Fake 'X just bought' pop-ups"], ["Commitment", "Subscribe preselected, terms in plain words, cancel from WhatsApp", "Hard-to-cancel subscriptions, drip pricing"]])}
  </section>`;
}

// ---------- cart drawer ----------
const subSave = () => cart.filter(i => !i.sub).reduce((s, i) => s + (unit(i) - byId(i.id).v[i.v][2] * SUB) * i.q, 0);
const saveParts = t => { const launch = cart.filter(i => !i.bundle && !i.sub).reduce((s, i) => { const v = byId(i.id).v[i.v]; return s + (v[2] - v[1]) * i.q; }, 0); const box = cart.filter(i => i.bundle && !i.sub).reduce((s, i) => s + byId(i.id).v[i.v][2] * (1 - BUNDLE) * i.q, 0); const sub = cart.filter(i => i.sub).reduce((s, i) => s + byId(i.id).v[i.v][2] * (1 - SUB) * i.q, 0); const ship = cart.length && t.ship === 0 ? 60 : 0; return { launch, box, sub, ship, all: launch + box + sub + ship }; };
const saveHero = t => { const sp = saveParts(t); return cart.length && sp.all > 0 ? `<div class="savehero"><span class="mono">You're saving</span><b class="sv-big">${rupee(sp.all)}</b><span class="cdl lt"><span class="pulse"></span>Launch prices end in <b data-cd="s"></b></span><div class="sv-chips">${sp.launch ? `<span>Launch prices −${rupee(sp.launch)}</span>` : ""}${sp.sub ? `<span>15% repeat saving −${rupee(sp.sub)}</span>` : ""}${sp.box ? `<span>Box of 3 −${rupee(sp.box)}</span>` : ""}${sp.ship ? `<span>Free shipping −₹60</span>` : ""}${!sp.all ? `<span>Unlock savings below</span>` : ""}</div></div>` : ""; };
const subNudge = t => { const sv = subSave(); return cart.length && sv > 0 ? `<button class="nudge2" data-suball><span class="nd-l"><b>Save ${rupee(sv)} more on this order</b><small>Take 15% off by having these delivered again every 30 days. Skip, pause or cancel anytime from WhatsApp.</small></span><span class="nd-b">Save ${rupee(sv)}</span></button>` : ""; };
function renderCart() {
  const t = totals();
  const lines = new Set(cart.map(i => byId(i.id).l));
  const missing = Object.keys(L).filter(k => !lines.has(k));
  const ups = (missing.length ? missing : ["inf", "nut", "kan"]).map(k => P.find(p => p.l === k && p.best && !cart.some(c => c.id === p.id))).filter(Boolean).slice(0, 2);
  const pct = Math.min(100, (t.sub / GIFT_AT) * 100);
  const toShip = Math.max(0, FREE_SHIP - t.sub), toGift = Math.max(0, GIFT_AT - t.sub);
  $("#cart").innerHTML = `<div class="c-top"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font:900 24px var(--display)">Your mix (${cart.reduce((s, i) => s + i.q, 0)})</b><button class="icon-btn" data-close aria-label="Close cart">✕</button></div>
    <p style="margin-top:10px;font-weight:600">${!cart.length ? "Your tape is empty. Let's fix that." : t.anySub || toShip === 0 ? (toGift ? `Free shipping unlocked. ${rupee(toGift)} more for a free Discovery Set.` : "Free shipping + a free Discovery Set unlocked.") : `${rupee(toShip)} away from free shipping.`}</p>
    <div class="prog" aria-hidden="true"><i style="width:${t.anySub ? Math.max(pct, FREE_SHIP / GIFT_AT * 100) : pct}%"></i><b class="${t.sub >= FREE_SHIP || t.anySub ? "hit" : ""}" style="left:${FREE_SHIP / GIFT_AT * 100}%">🚚</b><b class="${t.sub >= GIFT_AT ? "hit" : ""}" style="left:100%">🎁</b></div></div>
    ${saveHero(t)}${subNudge(t)}<div class="c-items">${cart.length ? cart.map((it, i) => { const p = byId(it.id); return `<div class="ci"><a class="th" href="#p-${p.id}">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}</a><div><b>${p.n}</b><div class="k" style="font-size:13px">${p.v[it.v][0]}${it.bundle && !it.sub ? " · Box of 3 −15%" : ""}</div><button class="tog ${it.sub ? "on" : ""}" data-sub="${i}"><i></i>${it.sub ? `Saving 15% · repeats ${it.freq.toLowerCase()}` : `Save ${rupee((unit(it) - p.v[it.v][2] * SUB) * it.q)} more · repeat every 30 days`}</button><div class="qty" style="height:36px;margin-top:8px"><button data-cq="${i}:-1" aria-label="Less">−</button><span>${it.q}</span><button data-cq="${i}:1" aria-label="More">+</button></div></div><div style="text-align:right"><b>${rupee(unit(it) * it.q)}</b>${unit(it) < p.v[it.v][2] ? `<br><s class="k" style="font-size:13px">${rupee(p.v[it.v][2] * it.q)}</s>` : ""}</div></div>`; }).join("") : `<div style="text-align:center;padding:30px 0">${cassette([null, null, null])}<a class="btn btn-ink" href="#build-a-box" data-close style="margin-top:16px">Build a box of 3</a></div>`}</div>
    ${ups.length && cart.length ? `<div class="c-up"><span class="mono k">Complete your mix · one tap</span><div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">${ups.map(p => `<div class="ci" style="grid-template-columns:48px 1fr auto;align-items:center"><span class="th" style="width:48px;height:48px">${p.img ? `<img src="${img(p.img)}" alt="">` : ""}</span><span><b style="font-size:14px">${p.n}</b><br><small class="k">${L[p.l].short} · ${rupee(p.v[0][1])}</small></span><button class="btn btn-ink btn-sm" data-add="${p.id}">Add</button></div>`).join("")}</div></div>` : ""}
    <div class="c-bot">${cart.length ? `<div style="display:flex;justify-content:space-between;align-items:baseline;font-size:20px;margin-bottom:10px"><b>Total</b><span><s class="k" style="font-size:15px;margin-right:6px">${rupee(t.mrp + (t.ship ? 0 : 60))}</s><b>${rupee(t.total)}</b></span></div><div class="sv-pill">🎉 You save ${rupee(saveParts(t).all)} (${Math.round(saveParts(t).all / (t.mrp + 60) * 100)}%)</div><a class="btn btn-ink" href="#checkout" data-close style="width:100%">Checkout · UPI · COD</a><p class="mono k" style="text-align:center;margin-top:8px">Prices include GST · no surprise fees</p>` : `<a class="btn btn-line" href="#shop" data-close style="width:100%">Browse the shop</a>`}</div>`;
}
function renderSide() {
  let el = $("#cartSide"); if (!el) { el = document.createElement("aside"); el.id = "cartSide"; el.setAttribute("aria-label", "People also bought"); document.body.appendChild(el); }
  const have = new Set(cart.map(i => i.id));
  const picks = P.filter(p => !have.has(p.id)).sort((a, b) => (cart.some(i => byId(i.id).l === a.l) - cart.some(i => byId(i.id).l === b.l)) || ((b.best || 0) - (a.best || 0))).slice(0, 4);
  el.innerHTML = `<span class="mono">People also bought</span>${picks.map((p, i) => `<div class="cs-i" style="--d:${i * 0.07}s;--c:${L[p.l].hex}"><a href="#p-${p.id}" data-close class="cs-th">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}</a><span class="cs-t"><b>${p.n}</b><small>${rupee(p.v[0][1])}</small></span><button class="cs-add" data-add="${p.id}" aria-label="Add ${p.n}">+</button></div>`).join("")}`;
}
const openCart = o => { if (o) { renderCart(); renderSide(); } $("#cart").classList.toggle("open", o); $("#scrim").classList.toggle("on", o); $("#cartSide") && $("#cartSide").classList.toggle("open", o); };
$("#cartBtn").addEventListener("click", () => openCart(true));
$("#scrim").addEventListener("click", () => { openCart(false); spin(false); });

// ---------- spin the record ----------
const PRIZES = [["10% off", "#7B5CFF"], ["Free shipping", "#FFE34F"], ["15% off", "#FF5A4E"], ["Free Discovery Set", "#FCFAF6"], ["12% off", "#7B5CFF"], ["Free shipping", "#FFE34F"]];
function spin(o) {
  const m = $("#spin");
  if (o) {
    const seg = 360 / PRIZES.length;
    m.innerHTML = `<div class="mbox"><span class="mono">First order · one spin per person</span><h2 id="spinT" style="font-size:32px;font-weight:900;margin-top:8px">Spin the record.</h2><p class="k" style="margin-top:6px">Every slice is a real prize. Biggest is 15% off.</p><div class="needle"></div><div class="wheel" id="wheel" style="background:conic-gradient(${PRIZES.map(([, c], i) => `${c} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})">${PRIZES.map(([t], i) => `<span style="transform:rotate(${i * seg + seg / 2 - 90}deg) translate(26%,-50%)">${t}</span>`).join("")}<div class="hole"></div></div><div id="spinOut"><button class="btn btn-ink" id="spinGo" style="width:100%">Spin it</button></div><button class="mono k" style="margin-top:12px;min-height:44px" data-nospin>Not now</button></div>`;
    store.set("spun", true);
  }
  m.classList.toggle("on", o);
}
let spinTimer = setTimeout(() => !store.get("spun", false) && spin(true), 15000);
document.addEventListener("mouseout", e => { if (!e.relatedTarget && e.clientY < 5 && !store.get("spun", false)) spin(true); });

// ---------- micro-interactions ----------
function fly(fromEl, src) {
  if (!fromEl || !src || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = fromEl.getBoundingClientRect(), b = $("#cartBtn").getBoundingClientRect();
  const im = document.createElement("img"); im.src = src; im.className = "flyer";
  Object.assign(im.style, { left: a.left + a.width / 2 - 40 + "px", top: a.top + a.height / 2 - 40 + "px" });
  document.body.appendChild(im);
  requestAnimationFrame(() => { im.style.transform = `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px,${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(.2) rotate(20deg)`; im.style.opacity = ".4"; });
  setTimeout(() => im.remove(), 750);
}
document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn,.add"); if (!b || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  ["#7B5CFF", "#FFE34F", "#FF5A4E", "#7B5CFF", "#FFE34F", "#FF5A4E"].forEach((c, i) => { const d = document.createElement("i"); d.className = "burst"; const ang = i / 6 * Math.PI * 2; d.style.cssText = `left:${r.left + x}px;top:${r.top + y}px;background:${c};--dx:${Math.cos(ang) * 34}px;--dy:${Math.sin(ang) * 34}px`; document.body.appendChild(d); setTimeout(() => d.remove(), 600); });
});
function playVid(id) {
  const x = VIDS.find(v => v.v === id), p = byId(x.p), m = $("#spin");
  m.innerHTML = `<div class="mbox vbox"><button class="icon-btn vclose" data-nospin aria-label="Close video">✕</button><video src="vid/${x.v}.mp4" poster="vid/${x.v}.jpg" autoplay loop playsinline controls></video><div class="vpanel"><span class="mono k">Test clip · customer video goes here</span><p style="font:700 18px/1.3 var(--display)">"${x.line}"</p><div style="display:flex;gap:10px;align-items:center"><span class="th" style="width:56px;height:56px;border-radius:12px;overflow:hidden;flex:none">${p.img ? `<img src="${img(p.img)}" alt="" style="width:100%;height:100%;object-fit:cover">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}</span><span style="flex:1;text-align:left"><b>${p.n}</b><br><small class="k">${rupee(p.v[0][1])} · ${rupee(p.v[0][1] * SUB)} subscribed</small></span></div><div style="display:flex;gap:8px"><button class="btn btn-ink" style="flex:1" data-add="${p.id}" data-nospin>Add to cart</button><a class="btn btn-line" href="#p-${p.id}" data-nospin>View</a></div></div></div>`;
  m.classList.add("on");
}

// ---------- cursor + scroll progress ----------
(() => {
  const bar = document.createElement("div"); bar.id = "sprog"; document.body.appendChild(bar);
  addEventListener("scroll", () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; }, { passive: true });
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("div"); c.id = "cur"; c.innerHTML = "<span></span>"; document.body.appendChild(c);
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; }, { passive: true });
  const loop = () => { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); }; loop();
  document.addEventListener("pointerover", e => {
    const t = e.target.closest("a,button,label,summary,[data-flip],.card,.vcard,input,select,textarea");
    c.className = ""; $("span", c).textContent = "";
    if (!t) return;
    if (t.matches("input,select,textarea")) { c.className = "txt"; return; }
    const card = t.closest(".card,.rc,.lc,a.step,.r5-inf,.vcard");
    if (card && !t.closest("button")) { c.className = "view"; $("span", c).textContent = t.closest(".vcard") ? "Play" : "View"; return; }
    c.className = "hov";
  });
  document.addEventListener("pointerdown", () => c.classList.add("dn")); document.addEventListener("pointerup", () => c.classList.remove("dn"));
})();

// ---------- global clicks ----------
document.addEventListener("click", e => {
  const vb = e.target.closest("[data-vid]"); if (vb && !e.target.closest("[data-add],[data-buy]")) { playVid(vb.dataset.vid); return; }
  if (e.target.closest("[data-intro]")) { e.preventDefault(); intro(true); return; }
  if (e.target.closest("[data-buy]")) { const id = e.target.closest("[data-buy]").dataset.buy; add(id, { msg: "Taking you to checkout" }); location.hash = "checkout"; return; }
  if (e.target.id === "buynow") { add(PD.id, { v: PD.v, q: PD.q, sub: PD.sub, freq: PD.freq, msg: "Taking you to checkout" }); location.hash = "checkout"; return; }
  if (e.target.closest("[data-fbt]")) { const i = +e.target.closest("[data-fbt]").dataset.fbt; FBT.on[i] = e.target.closest("[data-fbt]").checked; paintFbt(); return; }
  if (e.target.id === "fbtGo") { const ids = FBT.ids.filter((_, i) => FBT.on[i]); ids.forEach(id => add(id, { bundle: ids.length === 3, msg: "Added together" })); openCart(true); return; }
  if (e.target.closest("[data-pay]")) { CK.pay = e.target.closest("[data-pay]").dataset.pay; route(true); return; }
  if (e.target.closest("[data-ckadd]")) { add(e.target.closest("[data-ckadd]").dataset.ckadd, { msg: "Added to this order" }); route(true); return; }
  if (e.target.closest("[data-suball]")) { cart.forEach(i => i.sub = true); save(); renderCart(); if (location.hash === "#checkout") route(true); toast("Switched to Subscribe & save"); return; }
  if (e.target.closest("[data-flip]")) { e.target.closest("[data-flip]").classList.toggle("on"); return; }
  if (e.target.closest("[data-nm]")) { NUTV.mode = +e.target.closest("[data-nm]").dataset.nm; $("#nutwrap").innerHTML = nutBlock(byId(PD.id)); return; }
  if (e.target.closest("[data-rp]")) { RF.p = e.target.closest("[data-rp]").dataset.rp; route(true); return; }
  if (e.target.closest("[data-rt]")) { RF.t = e.target.closest("[data-rt]").dataset.rt; route(true); return; }
  const t = e.target.closest("[data-add],[data-close],[data-sub],[data-cq],[data-nospin],#spinGo,[data-f],[data-m],[data-pick],[data-unpick],#mxgo,#mxrep,[data-crate],[data-hs],[data-hp],#hgo,#hwrap,[data-set],#copyRef,[data-spin],[data-g],.opt button[data-v],.po,[data-fq],[data-q],#atc");
  if (!t) return;
  if (t.matches("[data-add]")) { const pp = byId(t.dataset.add); fly(t.closest(".card,.ci,.vpanel,.note,.cs-i") || t, pp.img ? img(pp.img) : null); add(t.dataset.add); if ($("#cart").classList.contains("open")) renderSide(); if ($("#cart").classList.contains("open")) renderCart(); }
  else if (t.matches("[data-close]")) openCart(false);
  else if (t.matches("[data-sub]")) { const it = cart[+t.dataset.sub]; it.sub = !it.sub; save(); renderCart(); }
  else if (t.matches("[data-cq]")) { const [i, d] = t.dataset.cq.split(":").map(Number); cart[i].q += d; if (cart[i].q < 1) cart.splice(i, 1); save(); renderCart(); }
  else if (t.matches("[data-nospin]")) spin(false);
  else if (t.id === "spinGo") {
    const k = Math.floor(Math.random() * PRIZES.length), seg = 360 / PRIZES.length;
    $("#wheel").style.transform = `rotate(${360 * 6 - (k * seg + seg / 2)}deg)`;
    t.disabled = true;
    setTimeout(() => { $("#spinOut").innerHTML = `<div class="step" style="text-align:left"><b style="font:900 26px var(--display)">You got ${PRIZES[k][0]}.</b><span class="k">Where should we send your code?</span><form class="pin" data-form><label for="spinE" style="position:absolute;left:-9999px">Email or WhatsApp</label><input id="spinE" placeholder="Email or WhatsApp" style="font-family:var(--body)"><button class="btn btn-ink" type="submit">Send</button></form><span class="mono k">Code: HABIT-${PRIZES[k][0].replace(/\W/g, "").toUpperCase().slice(0, 8)} · valid 7 days</span></div>`; }, 4300);
  }
  else if (t.matches("[data-spin]")) { e.preventDefault(); spin(true); }
  else if (t.matches("[data-f]")) { $$("#filters [data-f]").forEach(b => b.style.cssText = ""); t.style.cssText = "background:var(--ink);color:var(--ivory)"; filterGrid(t.dataset.f, null); }
  else if (t.matches("[data-m]")) { t.classList.toggle("on"); t.style.cssText = t.classList.contains("on") ? "background:var(--ink);color:var(--ivory)" : ""; filterGrid(null, t.classList.contains("on") ? t.dataset.m : null); }
  else if (t.matches("[data-pick]")) { const i = mix.indexOf(null); if (i < 0) { toast("Your box is full. Remove one first."); return; } mix[i] = t.dataset.pick; paintMix(); }
  else if (t.matches("[data-unpick]")) { mix[+t.dataset.unpick] = null; mix = mix.filter(Boolean).concat([null, null, null]).slice(0, 3); paintMix(); }
  else if (t.id === "mxgo" || t.id === "mxrep") { const rep = t.id === "mxrep"; mix.forEach(id => add(id, { bundle: !rep, sub: rep, msg: "Your box is in the cart" })); mix = [null, null, null]; paintMix(); openCart(true); }
  else if (t.matches("[data-crate]")) { add("kanji", { sub: true, freq: t.dataset.crate, msg: "Weekly Kanji crate added ↻" }); openCart(true); }
  else if (t.matches("[data-hs]")) { HAMP.size = +t.dataset.hs; HAMP.items = HAMP.items.slice(0, HAMP.size); route(true); }
  else if (t.matches("[data-hp]")) { if (HAMP.items.length < HAMP.size) { HAMP.items.push(t.dataset.hp); route(true); } else toast("Box is full. Pick a bigger size."); }
  else if (t.id === "hwrap") { HAMP.wrap = !HAMP.wrap; route(true); }
  else if (t.id === "hgo") { HAMP.items.forEach(id => add(id, { msg: "Hamper added 🎁" })); HAMP.items = []; openCart(true); route(true); }
  else if (t.matches("[data-set]")) { t.dataset.set.split(",").forEach(id => add(id, { bundle: true, msg: "Gift set added 🎁" })); openCart(true); }
  else if (t.id === "copyRef") { navigator.clipboard?.writeText("makehabit.in/r/your-code").then(() => toast("Link copied"), () => toast("Copy: makehabit.in/r/your-code")); }
  else if (t.matches("[data-g]")) { const g = $("#gal"); g.scrollTo({ left: g.clientWidth * +t.dataset.g, behavior: "smooth" }); $$(".thumbs button").forEach(b => b.classList.toggle("on", b === t)); }
  else if (t.matches(".opt button[data-v]")) { PD.v = +t.dataset.v; $$(".opt button[data-v]").forEach(b => b.classList.toggle("on", b === t)); paintPrice(); }
  else if (t.matches("[data-fq]")) { e.stopPropagation(); PD.freq = t.dataset.fq; $$("[data-fq]").forEach(b => b.classList.toggle("on", b === t)); $$("[data-fq]").forEach(b => b.style.background = b === t ? "var(--ink)" : ""); $$("[data-fq]").forEach(b => b.style.color = b === t ? "var(--ivory)" : ""); }
  else if (t.matches(".po")) { PD.sub = t.dataset.po === "sub"; setTimeout(paintPrice); $$(".po").forEach(b => { b.classList.toggle("on", b === t); b.setAttribute("aria-checked", b === t); }); }
  else if (t.matches("[data-q]")) { PD.q = Math.max(1, PD.q + +t.dataset.q); $("#qn").textContent = PD.q; paintPrice(); }
  else if (t.id === "atc") { const pp = byId(PD.id); fly($("#gal"), pp.img ? img(pp.img) : null); add(PD.id, { v: PD.v, q: PD.q, sub: PD.sub, freq: PD.freq }); openCart(true); }
});
document.addEventListener("submit", e => {
  const f = e.target; e.preventDefault();
  if (f.matches("[data-pin]")) {
    const v = $("input", f).value.trim(), r = f.parentElement.querySelector(".pin-res") || f.nextElementSibling;
    if (!/^\d{6}$/.test(v)) { r.className = "pin-res no"; r.textContent = "That needs 6 digits."; return; }
    const ok = NCR.some(p => v.startsWith(p));
    r.className = "pin-res " + (ok ? "ok" : "no");
    r.innerHTML = ok ? `✓ Yes! Kanji reaches ${v} chilled, tomorrow 9 am–1 pm. Everything else in 2–3 days.` : `Not yet for Kanji at ${v}. Infusions and nutri-mixes ship there in 3–5 days. <button class="mono" style="text-decoration:underline" type="button" onclick="this.textContent='We\\'ll WhatsApp you ✓'">Tell me when Kanji arrives</button>`;
  } else { toast("Sent ✓ (design prototype)"); }
});
const FL = { l: "all", m: null };
function filterGrid(line, moment) {
  if (line !== null) FL.l = line; else FL.m = moment;
  if (moment && line === null) $$("#filters [data-m]").forEach(b => { if (b.dataset.m !== moment) { b.classList.remove("on"); b.style.cssText = ""; } });
  const base = location.hash.slice(1);
  const lineLock = { infusions: "inf", "nutri-mixes": "nut", kanji: "kan" }[base];
  const l = lineLock || FL.l;
  $("#pgrid").innerHTML = P.filter(p => (l === "all" || p.l === l) && (!FL.m || p.m === FL.m || p.m === "anytime")).map(card).join("") || `<p class="k">Nothing here yet.</p>`;
}
function paintMix() { const m = $("#mxl"); if (m) m.innerHTML = mixPanel(); $$("[data-pick]").forEach(b => b.classList.toggle("sel", mix.includes(b.dataset.pick))); }

// PDP local state
const PD = { id: null, v: 0, q: 1, sub: false, freq: "Every 30 days" };
function paintPrice() { const p = byId(PD.id); const [, b, m] = p.v[PD.v]; const cur = PD.sub ? m * SUB : b; $("#psub").innerHTML = `${rupee(m * SUB)} <s class="k" style="font-weight:500">${rupee(m)}</s>`; $("#ponce").innerHTML = `${rupee(b)} <s class="k" style="font-weight:500">${rupee(m)}</s>`; const pp = $("#pprice"); if (pp) pp.innerHTML = `<b>${rupee(cur)}</b><s>MRP ${rupee(m)}</s><span class="offc">${offPct(cur, m)}% off</span><span class="savec">You save ${rupee(m - cur)}${PD.sub ? " + free shipping" : ""}</span><span class="pdl"><span class="pulse"></span>Launch price ends in <b data-cd></b><span>· then ${rupee(m)}</span></span>`; tickCd(); const bn = $("#bnp"); if (bn) bn.textContent = rupee(cur * PD.q); renderSatc(); paintFbt(); }
function paintFbt() { const el = $("#fbtT"); if (!el || !FBT.ids) return; const ids = FBT.ids.filter((_, i) => FBT.on[i]); const mrp = ids.reduce((s, id) => s + byId(id).v[0][2], 0), now = ids.length === 3 ? mrp * BUNDLE : ids.reduce((s, id) => s + byId(id).v[0][1], 0); el.innerHTML = `Total <s class="k">${rupee(mrp)}</s> <b>${rupee(now)}</b> <span class="savec">save ${rupee(mrp - now)}</span>`; }
function renderSatc() { const p = byId(PD.id); $("#satc").innerHTML = `<span class="th">${p.img ? `<img src="${img(p.img)}" alt="">` : `<span style="display:block;width:100%;height:100%;background:${L[p.l].hex}"></span>`}</span><span style="flex:1;min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.n}</b>${(() => { const v = p.v[PD.v], cur = PD.sub ? v[2] * SUB : v[1]; return `<small class="sv"><b>${rupee(cur)}</b> <s>${rupee(v[2])}</s> <em>save ${rupee(v[2] - cur)}</em></small>`; })()}</span><button class="btn btn-ink btn-sm" onclick="document.getElementById('buynow').click()">Buy now</button>`; }

// ---------- 3D hero record ----------
let three = null;
function hero3D() {
  const el = $("#stage"); if (!el || !window.THREE) return;
  const T = THREE, W = el.clientWidth, H = el.clientHeight;
  const r = new T.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(2, devicePixelRatio)); r.setSize(W, H); el.prepend(r.domElement);
  const s = new T.Scene(), cam = new T.PerspectiveCamera(35, W / H, 0.1, 50); cam.position.set(0, 0, 7.2);
  s.add(new T.AmbientLight(0xffffff, 0.75)); const dl = new T.DirectionalLight(0xffffff, 0.9); dl.position.set(3, 4, 5); s.add(dl);
  const c = document.createElement("canvas"); c.width = c.height = 1024; const g = c.getContext("2d");
  const paint = () => { g.fillStyle = "#16151C"; g.fillRect(0, 0, 1024, 1024); for (let i = 200; i < 512; i += 6) { g.strokeStyle = i % 12 ? "#22212a" : "#2c2b35"; g.lineWidth = 3; g.beginPath(); g.arc(512, 512, i, 0, 7); g.stroke(); } g.fillStyle = "#FF5A4E"; g.beginPath(); g.arc(512, 512, 190, 0, 7); g.fill(); g.fillStyle = "#16151C"; g.textAlign = "center"; g.font = "64px Allura"; g.fillText("Dr Aneet's", 512, 450); g.font = "900 96px Unbounded"; g.fillText("HABIT", 512, 560); g.font = "500 26px 'DM Mono'"; g.fillText("ON REPEAT · SIDE A", 512, 620); g.fillStyle = "#F4EFE6"; g.beginPath(); g.arc(512, 512, 14, 0, 7); g.fill(); };
  paint(); const tex = new T.CanvasTexture(c); document.fonts && document.fonts.ready.then(() => { paint(); tex.needsUpdate = true; });
  const disc = new T.Mesh(new T.CylinderGeometry(2, 2, 0.06, 96), [new T.MeshStandardMaterial({ color: 0x16151c, roughness: .35, metalness: .3 }), new T.MeshStandardMaterial({ map: tex, roughness: .3, metalness: .2 }), new T.MeshStandardMaterial({ color: 0x16151c })]);
  disc.rotation.x = Math.PI / 2; const grp = new T.Group(); grp.add(disc); s.add(grp);
  const beads = ["#7B5CFF", "#FFE34F", "#FF5A4E"].map((h, i) => { const m = new T.Mesh(new T.SphereGeometry(0.28, 32, 32), new T.MeshStandardMaterial({ color: h, roughness: .4 })); s.add(m); return m; });
  let px = 0, py = 0; const mv = e => { const b = el.getBoundingClientRect(); px = ((e.clientX - b.left) / b.width - .5); py = ((e.clientY - b.top) / b.height - .5); };
  addEventListener("pointermove", mv);
  let raf, t0 = performance.now();
  const loop = now => { const t = (now - t0) / 1000; const sc = Math.min(1, scrollY / 600);
    disc.rotation.y = t * 0.4; grp.rotation.x = -0.35 + py * .4 + sc * 0.9; grp.rotation.y = px * .6 - sc * .3; grp.position.y = -sc * 0.6;
    beads.forEach((b, i) => { const a = t * 0.7 + i * 2.094; b.position.set(Math.cos(a) * 2.6, Math.sin(a * 1.3) * .5 + .2, Math.sin(a) * 1.2); });
    r.render(s, cam); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  three = () => { cancelAnimationFrame(raf); removeEventListener("pointermove", mv); r.dispose(); };
}

// ---------- footer ----------
$("#foot").innerHTML = `<div class="wrap fz">
  <section class="fz-join">
    <div class="fz-jl">
      <span class="mono fz-live"><i></i>[live] people joined this week</span>
      <h2>Join the <span class="fz-hl">${hm()} Club.</span></h2>
      <p>Free to join. You get Dr Aneet's weekly notes, first dibs on new drops, and <b>10% off your first order</b>, sent the second you're in.</p>
      <div class="fz-perks"><span style="--c:#7B5CFF">15% off every repeat</span><span style="--c:#FFE34F">48 h early drops</span><span style="--c:#FF5A4E">₹200 per friend</span><span style="--c:#7B5CFF">Birthday cup</span><span style="--c:#FFE34F">Habit Wrapped</span></div>
    </div>
    <form class="fz-form" id="fzForm" data-club>
      <div class="fz-tabs" role="tablist"><button type="button" class="on" data-fzt="wa" role="tab" aria-selected="true">WhatsApp</button><button type="button" data-fzt="em" role="tab" aria-selected="false">Email</button></div>
      <label for="fzIn" class="mono" id="fzLab">Your WhatsApp number</label>
      <div class="fz-row"><input id="fzIn" class="field" inputmode="tel" placeholder="+91 98765 43210" autocomplete="tel"><button class="btn btn-nut" type="submit">I'm in →</button></div>
      <small>One note a week. No spam, leave anytime.</small>
      <div class="fz-done" hidden><b>You're in. Welcome to the club.</b><span class="mono">Member #000[live] · code HABIT10 is on its way</span><a class="btn btn-nut btn-sm" href="#shop">Use my 10% now →</a></div>
    </form>
  </section>
  <section class="fz-start"><span class="mono">Start your first 15 days</span><div class="fz-lines">${Object.keys(L).map(k => { const p = P.find(x => x.l === k && x.best); return `<a class="fz-ln" href="#${L[k].r}" style="--c:${L[k].hex};--f:${L[k].fg}"><img src="${img(p.img)}" alt=""><span><b>${L[k].short}</b><small>from ${rupee(Math.min(...P.filter(x => x.l === k).map(x => x.v[0][1])))}</small></span><i>→</i></a>`; }).join("")}<a class="fz-ln fz-box" href="#build-a-box"><span><b>Can't choose?</b><small>Any 3 · save 15%</small></span><i>→</i></a></div></section>
  <section class="fz-cols">
    ${[["Shop", [["#shop", "Shop all"], ["#shop", "Bestsellers"], ["#infusions", "Herbal Infusions"], ["#nutri-mixes", "Nutri-mixes"], ["#kanji", "Kanji"], ["#build-a-box", "Build a box of 3"]]],
       ["The Club", [["#club", `${hm()} Club perks`], ["#subscriptions", "Subscribe & save 15%"], ["#club", "Refer a friend · ₹200"], ["#club", "Habit Wrapped"], ["#", "Spin the record", "spin"]]],
       ["Learn", [["#recipes", "Recipes"], ["#about", "Dr Aneet's story"], ["#home", "Read every label"], ["#kanji", "How Kanji is made"], ["#notes", "Design notes (agency)"]]],
       ["Help", [["#", "Track my order"], ["#", "WhatsApp us"], ["#", "Shipping & delivery"], ["#", "FAQs"], ["#gifting", "Corporate gifting"], ["#home", "Replay the opening", "intro"]]]].map(([h, ls]) => `<div><b class="fz-h">${h}</b>${ls.map(([u, t, x]) => `<a href="${u}"${x === "spin" ? " data-spin" : x === "intro" ? " data-intro" : ""}><span>${t}</span><i>→</i></a>`).join("")}</div>`).join("")}
  </section>
  <section class="fz-comm"><div class="fz-ch"><span class="mono">The club, in real kitchens</span><b>Post your cup with <span>#DailyHABIT</span></b><small>We repost one member every day.</small></div><div class="fz-grid">${["hibiscus", "kanji", "choco-bliss", "golden-latte", "golden-elixir", "kesar-elaichi"].map((im, i) => `<a href="#p-${im}" class="fz-g" style="--r:${(i % 2 ? 1 : -1) * (1 + i % 3)}deg"><img src="${img(im)}" alt=""><span>Day ${[3, 15, 42, 9, 120, 27][i]}</span></a>`).join("")}</div></section>
  <section class="fz-end">
    <div class="fz-sig"><span class="hand">Dr Aneet's</span><svg class="giant-wm" viewBox="144.2 105 311.8 80" role="img" aria-label="HABIT" style="color:#F4EFE6">${WM}</svg></div>
    <div class="fz-legal"><span class="mono">Make it a daily habit</span><span class="mono">JAAP Enterprises · Noida · FSSAI [licence no.]</span><span class="mono">Privacy · Terms · Refunds</span></div>
  </section></div>`;
document.addEventListener("click", e => {
  const t = e.target.closest("[data-fzt]"); if (!t) return;
  const wa = t.dataset.fzt === "wa"; $$("[data-fzt]").forEach(b => { b.classList.toggle("on", b === t); b.setAttribute("aria-selected", b === t); });
  $("#fzLab").textContent = wa ? "Your WhatsApp number" : "Your email"; const i = $("#fzIn"); i.type = wa ? "tel" : "email"; i.inputMode = wa ? "tel" : "email"; i.placeholder = wa ? "+91 98765 43210" : "you@email.com";
});
document.addEventListener("submit", e => {
  if (!e.target.matches("[data-club]")) return; e.preventDefault(); e.stopImmediatePropagation();
  const f = e.target; $(".fz-row", f).hidden = true; $("small", f).hidden = true; $(".fz-done", f).hidden = false;
  const r = f.getBoundingClientRect();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) for (let k = 0; k < 18; k++) { const d = document.createElement("i"); d.className = "burst"; const ang = k / 18 * Math.PI * 2; d.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + 40}px;background:${["#7B5CFF", "#FFE34F", "#FF5A4E"][k % 3]};--dx:${Math.cos(ang) * 120}px;--dy:${Math.sin(ang) * 80}px;width:10px;height:10px`; document.body.appendChild(d); setTimeout(() => d.remove(), 650); }
}, true);

// ---------- router ----------
const ROUTES = { recipes, home, shop: () => shop(), infusions: () => shop("inf"), "nutri-mixes": () => shop("nut"), kanji: () => shop("kan"), "build-a-box": mixtape, club, hamper, subscriptions, gifting, about, checkout, thanks, notes };
let first = true;
function route(stay) {
  const h = (location.hash || "#home").slice(1);
  const render = () => {
    if (three) { three(); three = null; }
    const v = $("#view");
    v.innerHTML = h.startsWith("r-") ? recipe(h) : h.startsWith("p-") ? pdp(h.slice(2)) : (ROUTES[h] || (h === "gift-corp" ? gifting : notFound))();
    $$(".nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + h));
    $("#satc").classList.remove("show");
    if (!stay) scrollTo(0, 0);
    if (h === "home") heroReel();
    if (h.startsWith("p-") && byId(h.slice(2))) { Object.assign(PD, { id: h.slice(2), v: 0, q: 1, sub: false, freq: byId(h.slice(2)).kanji ? "Weekly" : "Every 30 days" }); paintPrice(); $("[data-fq]") && ($("[data-fq]").style.cssText += ";background:var(--ink);color:var(--ivory)"); const io = new IntersectionObserver(([en]) => $("#satc").classList.toggle("show", matchMedia("(max-width: 760px)").matches || (!en.isIntersecting && en.boundingClientRect.top < 0))); io.observe($("#atc")); }
    document.body.classList.toggle("focus", h === "checkout");
    if (h === "checkout") { const pin = $("#ckPin"); if (pin) pin.oninput = () => { const v = pin.value; $("#ckCity").innerHTML = /^\d{6}$/.test(v) ? (NCR.some(x => v.startsWith(x)) ? "✓ Noida, Uttar Pradesh" : "✓ City and state found") : "City and state fill in from your pincode."; }; }
    if (h === "build-a-box") paintMix();
    if (h === "subscriptions") { const c = () => { const p = byId($("#calcP").value), f = +$("#calcF").value; $("#calcOut").textContent = rupee((p.v[0][1] - p.v[0][2] * SUB) * (365 / f) + (365 / f) * 60 * (p.v[0][1] < FREE_SHIP ? 1 : 0)); }; $("#calcP").onchange = c; $("#calcF").onchange = c; c(); }
    if (h === "hamper") $("#hnote").oninput = e => { HAMP.note = e.target.value; $(".hand", $("#view").querySelector(".band")).textContent = HAMP.note; };
    const fe = $("#ferm"); if (fe) { const go = () => $$("div", fe).forEach((d, i) => setTimeout(() => d.style.height = d.dataset.h + "%", i * 220)); new IntersectionObserver(([en], o) => { if (en.isIntersecting) { go(); o.disconnect(); } }).observe(fe); }
    tickCd(); $$("#view img").forEach(im => { if (im.complete) im.classList.add("ld"); else im.addEventListener("load", () => im.classList.add("ld"), { once: true }); });
    $$("#view > section").slice(0, 3).forEach((sec, k) => { sec.classList.remove("enter"); void sec.offsetWidth; sec.style.setProperty("--k", k); sec.classList.add("enter"); });
    const io2 = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io2.unobserve(en.target); } }), { rootMargin: "0px 0px -10% 0px" });
    $$(".reveal").forEach(el => { if (el.getBoundingClientRect().top > innerHeight) io2.observe(el); });
    if (!stay) $("#view").focus({ preventScroll: true });
  };
  if (first || stay || matchMedia("(prefers-reduced-motion: reduce)").matches) { render(); first = false; return; }
  const w = $("#wipe"); const lk = h.startsWith("p-") && byId(h.slice(2)) ? byId(h.slice(2)).l : { infusions: "inf", "nutri-mixes": "nut", kanji: "kan" }[h];
  const cols = lk ? [L[lk].hex, L[lk].hex, L[lk].hex] : ["#7B5CFF", "#FFE34F", "#FF5A4E"];
  $$("i", w).forEach((b, k) => b.style.background = cols[k]);
  let lab = $("b", w); if (!lab) { lab = document.createElement("b"); w.appendChild(lab); }
  lab.innerHTML = h.startsWith("p-") && byId(h.slice(2)) ? byId(h.slice(2)).n : h.startsWith("r-") ? "Recipe" : ({ home: "", shop: "The shop", infusions: "Infusions", "nutri-mixes": "Nutri-mixes", kanji: "Kanji", recipes: "Recipes", club: `${hm()} Club`, hamper: "Your hamper", subscriptions: "Subscribe & save", gifting: "Gifting", about: "Dr Aneet", checkout: "Checkout", "build-a-box": "Build a box" }[h] ?? "");
  lab.style.color = "#16151C";
  w.classList.remove("go"); void w.offsetWidth; w.classList.add("go"); setTimeout(render, 400);
}
addEventListener("hashchange", () => route());

// ---------- loader ----------
function intro(force) {
  const ld = $("#loader") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "loader" }));
  if (!force && /^(p-|r-|checkout|thanks)/.test(location.hash.slice(1))) { ld.remove(); return; }
  if (!force && matchMedia("(prefers-reduced-motion: reduce)").matches) { ld.remove(); return; }
  const frames = [["inf", "golden-elixir", "Brew."], ["nut", "kesar-elaichi", "Stir."], ["kan", "kanji", "Pour."]];
  ld.className = "intro"; ld.removeAttribute("aria-hidden");
  ld.innerHTML = frames.map(([l, im, w], i) => `<div class="if" style="background:${L[l].hex};color:${L[l].fg};animation-delay:${i * 0.42}s"><img src="${img(im)}" alt=""><b>${w}</b></div>`).join("") + `<div class="iend"><span class="hand">Dr Aneet's</span>${wm(240)}<span class="mono">herbs · seeds · ferments · every day</span></div><div class="ibar"><i></i><span class="mono" id="ipct">0%</span></div><button class="mono iskip">Skip</button>`;
  const done = () => { ld.classList.add("out"); setTimeout(() => ld.remove(), 700); };
  const t0 = performance.now(); const tick = () => { const p = Math.min(100, Math.round((performance.now() - t0) / 27)); const el = $("#ipct"); if (el) { el.textContent = p + "%"; if (p < 100 && document.body.contains(el)) requestAnimationFrame(tick); } }; requestAnimationFrame(tick);
  const tm = setTimeout(done, 2900);
  $(".iskip", ld).onclick = () => { clearTimeout(tm); done(); };
}
addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches(".vcard")) { e.preventDefault(); e.target.click(); } });
addEventListener("pointerdown", e => { const b = e.target.closest(".btn,.vb,.add,.po,.pill"); if (!b) return; const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2; const sp = document.createElement("span"); sp.className = "rip"; sp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`; b.appendChild(sp); setTimeout(() => sp.remove(), 650); });
intro(false);
paintCartCount();
route();
})();
