/* motion.js — núcleo de movimento do site (script clássico; funciona em file://).
 *
 * Carregado pelo bootstrap inline do index.html DEPOIS do load ou na primeira interação.
 * Sem este arquivo o site é 100% visível e estático (nada acima da dobra depende de JS).
 *
 * Regras (CLAUDE.md / pedido de motion):
 *  - Só transform e opacity, e só nas camadas-folha marcadas com data-*.
 *  - A fita de água (.flow__fita) e seus ancestrais (.flow, main, body) NUNCA recebem
 *    transform/filter/opacity — nada aqui seleciona esses elementos.
 *  - Modos (html[data-motion]): full | reduced (só fade 200ms) | paused (congela; retoma).
 *  - Qualidade (html[data-quality]): high | low (low: sem loops, parallax pela metade, sem Lenis).
 *
 * Atributos:
 *  data-reveal[="up|fade|left|right|zoom"]  entrada ao atingir 35% de visibilidade
 *  data-reveal-group="nome"             itens do grupo que entram juntos são defasados
 *  data-reveal-delay="0.2"              atraso extra (s)
 *  data-parallax="0.08"                 fator 0,05–0,10; deslocamento máx. 24px; 0 no centro da tela
 *  data-parallax-mode="exit"            0 no topo da página; só se move ao sair (hero)
 *  data-loop="float|sway"               flutuação contínua sutil (só full + high, só na tela)
 *  data-loop-amp="5"                    amplitude (px para float, graus para sway)
 */
(function () {
  "use strict";
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var root = document.documentElement;
  if (!gsap) { root.dataset.motionReady = "sem-gsap"; return; }
  if (ST) gsap.registerPlugin(ST);

  var mode = root.dataset.motion || "full";       // full | reduced | paused
  var quality = root.dataset.quality || "high";   // high | low
  var MAXPX = 24, STAGGER = 0.12, EASE = "power3.out";

  var state = { reveals: [], parallax: [], loops: [], lenis: null, userPaused: mode === "paused", hiddenPaused: false };
  window.YMotion = state;

  /* ---------------------------------------------------------------- Lenis */
  if (mode === "full" && quality === "high" && window.Lenis) {
    state.lenis = new window.Lenis({ lerp: 0.075, anchors: true, autoRaf: false, smoothWheel: true, syncTouch: false });
    if (ST) state.lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { state.lenis && state.lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------------------------------------------------------------- reveal */
  var FROM = {
    up: { y: 32, x: 0, scale: 1 }, fade: { y: 0, x: 0, scale: 1 },
    left: { x: -40, y: 0, scale: 1 }, right: { x: 40, y: 0, scale: 1 },
    zoom: { x: 0, y: 0, scale: 1.06 }
  };
  var reveals = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  function show(el, instant) {
    if (el.__revealed) return;
    el.__revealed = true;
    var delay = parseFloat(el.dataset.revealDelay || 0) + (el.__stagger || 0);
    if (instant || state.userPaused) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      startLoop(el);
      return;
    }
    if (mode === "reduced") {
      gsap.to(el, { opacity: 1, duration: 0.2, delay: Math.min(delay, 0.2), ease: "none", overwrite: "auto" });
      return;
    }
    var dur = 0.6 + Math.min(0.3, (el.offsetHeight || 0) / 2000); // 600–900ms: peças maiores, mais lentas
    gsap.to(el, {
      opacity: 1, x: 0, y: 0, scale: 1, duration: el.dataset.reveal === "zoom" ? 1.1 : dur, delay: delay, ease: EASE, overwrite: "auto",
      onComplete: function () {
        if (!el.dataset.loop && !el.dataset.parallax) gsap.set(el, { clearProps: "transform,opacity" }); // repouso sem camada extra
        startLoop(el);
      }
    });
  }

  // Esconde SÓ o que está inteiramente abaixo da tela neste instante.
  // O que já está visível (ou acima) nunca é escondido: nada acima da dobra depende de JS.
  reveals.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top >= window.innerHeight && !state.userPaused) {
      var f = FROM[el.dataset.reveal] || FROM.up;
      gsap.set(el, mode === "reduced" ? { opacity: 0 } : { opacity: 0, x: f.x, y: f.y, scale: f.scale });
      el.__hidden = true;
      state.reveals.push(el);
    } else {
      el.__revealed = true;
    }
  });

  function enough(entry) {
    var vh = window.innerHeight;
    return entry.isIntersecting &&
      (entry.intersectionRatio >= 0.35 || entry.intersectionRect.height >= 0.35 * vh);
  }
  var io = new IntersectionObserver(function (entries) {
    var batch = entries.filter(enough).map(function (e) { return e.target; })
      .sort(function (a, b) { return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
    var groupIdx = {};
    batch.forEach(function (el) {
      var g = el.dataset.revealGroup || ("_" + batch.indexOf(el));
      groupIdx[g] = (groupIdx[g] || 0);
      el.__stagger = groupIdx[g] * STAGGER;
      groupIdx[g]++;
      io.unobserve(el);
      show(el);
    });
  }, { threshold: [0, 0.35, 0.6] });
  state.reveals.forEach(function (el) { io.observe(el); });

  // Trava de segurança: navegação rápida (âncora, fim da página, voltar) nunca deixa nada preso escondido.
  function sweep() {
    var vh = window.innerHeight;
    state.reveals.forEach(function (el) {
      if (el.__revealed) return;
      var r = el.getBoundingClientRect();
      if (r.bottom <= 0) show(el, true);                       // passou direto por ele
      else if (r.top < vh && r.bottom > 0 && (Math.min(r.bottom, vh) - Math.max(r.top, 0)) > 0.35 * Math.min(r.height, vh)) show(el);
    });
  }
  var sweepT;
  window.addEventListener("scroll", function () { clearTimeout(sweepT); sweepT = setTimeout(sweep, 120); }, { passive: true });
  window.addEventListener("resize", sweep);
  window.addEventListener("hashchange", function () { setTimeout(sweep, 50); });

  /* ---------------------------------------------------------------- parallax */
  var paraScale = quality === "low" ? 0.5 : 1;
  if (ST && mode !== "reduced") {
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var f = Math.min(0.10, Math.max(0.05, parseFloat(el.dataset.parallax) || 0.08)) * paraScale;
      var exit = el.dataset.parallaxMode === "exit";
      // yPercent é um canal separado do "y" usado pela entrada e pela flutuação: não brigam.
      // pixel inteiro (sem reamostragem borrada) e zona morta de ±1px no repouso
      var last = null;
      var setY = function (px) {
        px = Math.abs(px) < 1.5 ? 0 : Math.round(px);
        if (px === last) return; last = px;
        gsap.set(el, { yPercent: px / (el.offsetHeight || 1) * 100 }); // só yPercent: não toca no "y" da entrada/flutuação
      };
      var trig = exit ? (el.closest("section") || el) : el;   // saída: conta desde o 1º pixel de rolagem da seção
      var st = ST.create({
        trigger: trig,
        start: exit ? "top top" : "top bottom",
        end: "bottom top",
        onUpdate: function (self) {
          var span = exit ? trig.offsetHeight : window.innerHeight + el.offsetHeight;
          var d = exit ? self.progress * span : (self.progress - 0.5) * span;
          setY(-Math.max(-MAXPX, Math.min(MAXPX, d * f)));
        }
      });
      state.parallax.push({ el: el, st: st, factor: f });
      if (state.userPaused) st.disable(false);
    });
  }

  /* ---------------------------------------------------------------- loops */
  var loopsOn = mode !== "reduced" && quality === "high";
  var loopIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var L = e.target.__loop; if (!L) return;
      L.visible = e.isIntersecting;
      applyLoop(L);
    });
  });
  function applyLoop(L) {
    var run = L.visible && !state.userPaused && !state.hiddenPaused;
    if (run && L.tween.paused()) L.tween.resume();
    else if (!run && !L.tween.paused()) L.tween.pause();
  }
  function startLoop(el) {
    if (!loopsOn || !el.dataset.loop || el.__loop) return;
    var kind = el.dataset.loop, amp = parseFloat(el.dataset.loopAmp || (kind === "sway" ? 1.2 : 5));
    var dur = 5.5 + Math.random() * 1.5;
    var tween = kind === "sway"
      ? gsap.fromTo(el, { rotation: -amp / 2 }, { rotation: amp / 2, duration: dur, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true })
      : gsap.fromTo(el, { y: 0 }, { y: -amp, duration: dur, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
    var L = el.__loop = { el: el, kind: kind, tween: tween, visible: false };
    state.loops.push(L);
    loopIO.observe(el);
  }
  state.startLoop = startLoop;
  // Elementos com loop que já estavam visíveis (sem entrada) começam a flutuar agora.
  document.querySelectorAll("[data-loop]").forEach(function (el) { if (el.__revealed) startLoop(el); });

  /* ---------------------------------------------------------------- pausa */
  function setPaused(p, reason) {
    if (reason === "user") {
      state.userPaused = p;
      root.dataset.motion = p ? "paused" : mode === "paused" ? "full" : mode;
      if (mode === "paused" && !p) { mode = "full"; }
      try { localStorage.setItem("y-motion", p ? "paused" : "full"); } catch (e) {}
    } else state.hiddenPaused = p;
    var frozen = state.userPaused || state.hiddenPaused;
    state.loops.forEach(applyLoop);
    state.parallax.forEach(function (P) { frozen ? P.st.disable(false) : P.st.enable(); });
    if (state.lenis) frozen && state.userPaused ? state.lenis.stop() : state.lenis.start();
    if (state.userPaused) state.reveals.forEach(function (el) {                 // pausado: nada fica escondido
      if (!el.__revealed) { gsap.killTweensOf(el); el.__revealed = false; show(el, true); }
      else gsap.getTweensOf(el).forEach(function (t) { if (!t.repeat()) t.progress(1); });
    });
    if (!state.userPaused && reason === "user") sweep();
    document.dispatchEvent(new CustomEvent("ymotion:pause", { detail: { paused: state.userPaused } }));
  }
  state.pause = function () { setPaused(true, "user"); };
  state.resume = function () { setPaused(false, "user"); };
  state.toggle = function () { setPaused(!state.userPaused, "user"); };
  Object.defineProperty(state, "paused", { get: function () { return state.userPaused; } });
  document.addEventListener("visibilitychange", function () { setPaused(document.hidden, "hidden"); });

  /* ---------------------------------------------------------------- debug p/ testes */
  state.info = function () {
    return {
      mode: mode, quality: quality, lenis: !!state.lenis, paused: state.userPaused,
      reveals: state.reveals.length, hidden: state.reveals.filter(function (e) { return !e.__revealed; }).length,
      parallax: state.parallax.length,
      loops: state.loops.map(function (L) { return { cls: L.el.className, kind: L.kind, running: !L.tween.paused() }; })
    };
  };

  /* ---------------------------------------------------------------- botão de pausa (WCAG 2.2.2)
   * O botão está no HTML e o bootstrap cuida do desenho e do clique; aqui só o rótulo compacto. */
  var btn = document.querySelector(".motion-toggle");
  if (btn) {
    var syncSmall = function () { btn.querySelector(".motion-toggle__txt").classList.toggle("sr-only", window.innerWidth < 768 || window.innerHeight < 500); };
    window.addEventListener("resize", syncSmall); syncSmall();
  }

  if (state.userPaused) setPaused(true, "user");
  sweep();
  root.dataset.motionReady = "1";
  document.dispatchEvent(new CustomEvent("ymotion:ready"));
})();
