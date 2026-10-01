/* cinema.js — tomadas guiadas pela rolagem (carregado depois de motion.js; não roda em reduced).
 *
 * Cada tomada é uma timeline GSAP amarrada à rolagem (scrub) que TERMINA no quadro estático aprovado
 * ("rest"): parar a rolagem em qualquer ponto nunca deixa nada preso escondido, e pausar leva
 * tudo direto ao quadro final.
 * Regras mantidas: só transform/opacity em camadas-folha; a fita (.flow__fita) e seus ancestrais
 * nunca são tocados; o hero começa no quadro estático (nada acima da dobra depende de JS).
 */
(function () {
  "use strict";
  var gsap = window.gsap, ST = window.ScrollTrigger, M = window.YMotion;
  var root = document.documentElement;
  if (!gsap || !ST || !M || root.dataset.motion === "reduced") return;

  var shots = [];               // { st, tl, rest }
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var vw = function (n) { return Math.min(window.innerWidth, 1600) * n / 100; };
  var below = function (el) { return el.getBoundingClientRect().top >= window.innerHeight; };
  var paused = function () { return M.paused || root.dataset.motion === "paused"; };

  function shot(cfg, build, rest) {
    var tl = gsap.timeline({ defaults: { ease: "none" } });
    build(tl);
    // no quadro final (rest = 1) os alvos voltam à renderização normal (sem transform/opacity inline);
    // ao rolar de volta, o scrub reaplica os valores.
    var clean = function () {
      if (rest !== 1) return;
      tl.getChildren(true, true, false).forEach(function (t) {
        t.targets().forEach(function (el) { if (!el.dataset.loop) gsap.set(el, { clearProps: "transform,opacity" }); });
      });
    };
    var st = ST.create(Object.assign({ animation: tl, scrub: 0.9, invalidateOnRefresh: true,
      onUpdate: function (self) { if (self.progress === 1 && tl.progress() === 1) clean(); },
      onLeave: function () { gsap.delayedCall(1, function () { if (tl.progress() === 1) clean(); }); } }, cfg));
    var s = { st: st, tl: tl, rest: rest };
    shots.push(s);
    return s;
  }

  /* ------------------------------------------------ 1. HERO — mergulho no gelo (pin) */
  var hero = $(".s-hero"), title = $(".s-hero__title"), cena = $(".s-hero__cena");
  if (hero && title && cena) {
    // hero mais baixo que a tela (celular): segurar deixaria tela vazia -> mergulho durante a saída, sem pin
    var tall = hero.offsetHeight >= window.innerHeight * 0.7;
    shot(tall ? { trigger: hero, start: "top top", end: function () { return "+=" + Math.round(window.innerHeight * 0.9); }, pin: true, pinSpacing: true, anticipatePin: 1 }
              : { trigger: hero, start: "top top", end: "bottom top" },
      function (tl) {
        // 0–60%: o título sobe e se abre, a câmera aproxima; 60–100%: a cena enche a tela e sai por cima
        tl.to(title, { scale: 1.45, y: -vw(9), opacity: 0, ease: "power2.in", duration: 0.6 }, 0)
          .to(cena, { scale: 1.5, y: -vw(6), ease: "power1.inOut", duration: 1 }, 0); // termina grande e visível: a rolagem leva embora
      }, 0);   // repouso = início (quadro estático)
  }

  /* ------------------------------------------------ 2. PRATOS — varredura do bambu + pratos sobem da câmera */
  var pratos = $(".s-pratos"), bambu = $(".s-pratos__bambu"), pcena = $(".s-pratos__cena");
  if (pratos && bambu && pcena) {
    if (below(pratos)) {
      gsap.set(bambu, { x: -vw(16), y: vw(4) });
      gsap.set(pcena, { y: vw(16), scale: 0.78, opacity: 0 });
    }
    shot({ trigger: pratos, start: "top bottom", end: "top 25%" }, function (tl) {
      tl.fromTo(bambu, { x: -vw(16), y: vw(4) }, { x: 0, y: 0, ease: "power2.out", duration: 1 }, 0)
        .fromTo(pcena, { y: vw(16), scale: 0.78, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: "power3.out", duration: 1 }, 0.1);
    }, 1);
    if (M.startLoop) M.startLoop(bambu);
  }

  /* ------------------------------------------------ 3. BEBIDAS — drinks sobem com peso */
  var beb = $(".s-bebidas"), bcena = $(".s-bebidas__cena");
  if (beb && bcena) {
    if (below(beb)) gsap.set(bcena, { y: vw(14), scale: 0.92, opacity: 0 });
    shot({ trigger: beb, start: "top bottom", end: "top 25%" }, function (tl) {
      tl.fromTo(bcena, { y: vw(14), scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, ease: "power3.out", duration: 1 }, 0);
    }, 1);
  }

  // citações: palavra a palavra, saindo de uma máscara (o texto continua inteiro no HTML)
  $$(".s-bebidas__quote blockquote p").forEach(function (p) {
    if (!below(p)) return;
    var original = p.innerHTML;
    var words = p.textContent.split(/(\s+)/);
    p.textContent = "";
    words.forEach(function (w) {
      if (/^\s+$/.test(w)) { p.appendChild(document.createTextNode(w)); return; }
      var o = document.createElement("span"), i = document.createElement("span");
      o.className = "w"; i.className = "wi"; i.textContent = w; o.appendChild(i); p.appendChild(o);
    });
    var inner = $$(".wi", p);
    gsap.set(inner, { yPercent: 110 });
    ST.create({ trigger: p, start: "top 82%", once: true, onEnter: function () {
      gsap.to(inner, { yPercent: 0, duration: paused() ? 0 : 0.9, ease: "power3.out", stagger: paused() ? 0 : 0.018,
        onComplete: function () { p.innerHTML = original; } });   // quadro final = texto original (mesma quebra de linha)
    } });
    p.__words = inner;
  });

  // nota: contador 0 → 4,3 e 0 → 2.722
  var nota = $(".s-bebidas__nota");
  if (nota && below(nota)) {
    var n1 = $("strong", nota), n2 = $("span", nota), t2 = n2.textContent;
    var obj = { a: 0, b: 0 };
    n1.textContent = "0,0"; n2.textContent = t2.replace("2.722", "0");
    ST.create({ trigger: nota, start: "top 85%", once: true, onEnter: function () {
      gsap.to(obj, { a: 4.3, b: 2722, duration: paused() ? 0 : 1.6, ease: "power2.out", onUpdate: function () {
        n1.textContent = obj.a.toFixed(1).replace(".", ",");
        n2.textContent = t2.replace("2.722", Math.round(obj.b).toLocaleString("pt-BR"));
      } });
    } });
  }

  /* ------------------------------------------------ 4. LOCAL — afastamento revela o corredor */
  var local = $(".s-local"), limg = $(".s-local__foto img"), info = $$(".s-local__info > *"), end = $(".s-local__end");
  if (local && limg) {
    var parts = info.concat(end ? [end] : []);
    if (below(local)) {
      gsap.set(limg, { scale: 1.35, opacity: 0.25 });
      gsap.set(parts, { y: 36, opacity: 0 });
    }
    shot({ trigger: local, start: "top bottom", end: "bottom bottom" }, function (tl) {
      tl.fromTo(limg, { scale: 1.35, opacity: 0.25 }, { scale: 1, opacity: 1, ease: "power2.out", duration: 1 }, 0)
        .fromTo(parts, { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.45, stagger: 0.08 }, 0.35);
    }, 1);
  }

  /* ------------------------------------------------ pausa: tudo direto ao quadro final */
  function freeze(p) {
    shots.forEach(function (s) {
      if (p) { s.st.disable(false); s.tl.progress(s.rest); }
      else { s.st.enable(); s.st.refresh(); }
    });
    if (p) $$(".wi").forEach(function (w) { gsap.set(w, { yPercent: 0 }); });   // pausado: palavras visíveis
  }
  document.addEventListener("ymotion:pause", function (e) { freeze(e.detail.paused); });
  if (paused()) freeze(true);

  M.cinema = shots;
  window.addEventListener("load", function () { ST.refresh(); });
  ST.refresh();
  root.dataset.cinemaReady = "1";
})();
