/* Trivox hero: animated tech circuit lines (canvas)
   - PCB-style traces with travelling data pulses
   - a light scan that sweeps across the traces
   - tap / touch / mouse sends extra signals through the nearest traces
   - lighter on phones (fewer traces, capped pixel ratio, 30fps), paused off-screen */
(function () {
  var hero = document.querySelector('.hero');
  var cv = document.getElementById('tech');
  if (!hero || !cv || !cv.getContext) return;

  var ctx = cv.getContext('2d');
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var W = 0, H = 0, dpr = 1, mobile = false, g = 40;
  var routes = [], nodes = [], extra = [], ripples = [];
  var dim, bright, sprites = {};
  var visible = true, rafId = 0, last = 0, t = 0;
  var ptr = { x: -999, y: -999, on: false, spawnAt: 0 };
  var LABELS = ['200 OK', 'TLS', 'CDN', '98/100', '+64%', 'SEO', 'API', '<1s', 'GZIP', 'H3'];
  var COL = { c: '103,232,249', v: '167,139,250', p: '240,171,252' };

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var x = Math.imul(seed ^ seed >>> 15, 1 | seed);
      x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x;
      return ((x ^ x >>> 14) >>> 0) / 4294967296;
    };
  }

  function makeSprite(rgb) {
    var s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(.18, 'rgba(' + rgb + ',.95)');
    gr.addColorStop(.5, 'rgba(' + rgb + ',.28)');
    gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, s, s);
    return c;
  }
  sprites.c = makeSprite(COL.c); sprites.v = makeSprite(COL.v); sprites.p = makeSprite(COL.p);

  function snap(v) { return Math.round(v / g) * g; }

  /* ---------- build the traces ---------- */
  function build() {
    var r = hero.getBoundingClientRect();
    W = Math.max(320, Math.round(r.width)); H = Math.max(480, Math.round(r.height));
    mobile = W < 760;
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
    g = mobile ? 24 : 40;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';

    var rand = rng(mobile ? 7 : 11 + Math.round(W / 200));
    routes = []; nodes = []; extra = [];
    var count = mobile ? 9 : Math.max(10, Math.min(18, Math.round(W * H / 80000)));
    var keep = mobile ? { x0: W * .17, x1: W * .83, y0: H * .16, y1: H * .97 } : null;

    function inKeep(x, y) { return keep && x > keep.x0 && x < keep.x1 && y > keep.y0 && y < keep.y1; }

    for (var n = 0, tries = 0; n < count && tries < count * 8; tries++) {
      var edge = Math.floor(rand() * 4), x, y, dx = 0, dy = 0;
      if (mobile) { edge = [0, 0, 1, 2, 2, 3, 1, 3][Math.floor(rand() * 8)]; }
      if (edge === 0) { x = snap(rand() * W); y = 0; dy = 1; }            /* from top, going down */
      else if (edge === 1) { x = W; y = snap(H * (.08 + rand() * .84)); dx = -1; } /* from right */
      else if (edge === 2) { x = snap(rand() * W); y = H; dy = -1; }      /* from bottom, going up */
      else { x = 0; y = snap(H * (.08 + rand() * .84)); dx = 1; }          /* from left */
      if (mobile && (edge === 0 || edge === 2)) { x = rand() < .5 ? snap(rand() * W * .15) + g : W - snap(rand() * W * .15) - g; }
      var pts = [[x, y]], steps = mobile ? 4 + Math.floor(rand() * 3) : 4 + Math.floor(rand() * 5), ok = true;
      for (var s = 0; s < steps; s++) {
        var len = g * (2 + Math.floor(rand() * (mobile ? 4 : 6)));
        x += dx * len; y += dy * len;
        if (x < -2 || x > W + 2 || y < -2 || y > H + 2) { x = Math.max(0, Math.min(W, x)); y = Math.max(0, Math.min(H, y)); pts.push([x, y]); break; }
        if (inKeep(x, y)) { break; }
        pts.push([x, y]);
        /* 45 degree jog, sometimes a 90 degree turn */
        var side = rand() < .5 ? -1 : 1, k = g * (1 + Math.floor(rand() * 2));
        var jx = dx ? dx : side, jy = dy ? dy : side;
        if (rand() < .72) {
          x += jx * k; y += jy * k;
          if (x < 0 || x > W || y < 0 || y > H || inKeep(x, y)) { break; }
          pts.push([x, y]);
        }
        if (rand() < .3) { var ndx = dy ? side : 0, ndy = dx ? side : 0; dx = ndx; dy = ndy; }
      }
      if (pts.length < 3) continue;
      var cum = [0], total = 0;
      for (var i = 1; i < pts.length; i++) {
        total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); cum.push(total);
      }
      var hue = ['c', 'v', 'c', 'p'][Math.floor(rand() * 4)];
      var route = {
        pts: pts, cum: cum, total: total, hue: hue,
        label: rand() < (mobile ? .35 : .55) ? LABELS[Math.floor(rand() * LABELS.length)] : '',
        pulses: []
      };
      var np = mobile ? 1 : 1 + (rand() < .5 ? 1 : 0);
      for (var q = 0; q < np; q++) {
        route.pulses.push({
          s: -rand() * total, v: (mobile ? 90 : 120) + rand() * (mobile ? 70 : 120),
          tail: mobile ? 70 : 110, wait: 0
        });
      }
      routes.push(route); n++;
      for (i = 0; i < pts.length; i++) {
        var end = i === pts.length - 1;
        nodes.push({ x: pts[i][0], y: pts[i][1], end: end, r: routes.length - 1, i: i, ph: rand() * 6.28 });
      }
    }
    renderBase();
    if (reduce) drawStatic();
  }

  function renderBase() {
    function layer(bright_) {
      var c = document.createElement('canvas');
      c.width = cv.width; c.height = cv.height;
      var x = c.getContext('2d');
      x.scale(dpr, dpr);
      x.lineJoin = 'round'; x.lineCap = 'round';
      routes.forEach(function (rt) {
        var rgb = COL[rt.hue];
        x.beginPath();
        rt.pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); });
        if (bright_) {
          x.strokeStyle = 'rgba(' + rgb + ',.95)'; x.lineWidth = 1.7;
          x.shadowColor = 'rgba(' + rgb + ',.9)'; x.shadowBlur = 8;
        } else {
          x.strokeStyle = 'rgba(' + rgb + ',.26)'; x.lineWidth = 1.1; x.shadowBlur = 0;
        }
        x.stroke(); x.shadowBlur = 0;
        /* bend dots */
        x.fillStyle = 'rgba(' + rgb + ',' + (bright_ ? .95 : .4) + ')';
        for (var i = 1; i < rt.pts.length - 1; i += 2) {
          x.beginPath(); x.arc(rt.pts[i][0], rt.pts[i][1], bright_ ? 2.4 : 1.8, 0, 6.3); x.fill();
        }
        /* end pad */
        var e = rt.pts[rt.pts.length - 1];
        x.strokeStyle = 'rgba(' + rgb + ',' + (bright_ ? .95 : .55) + ')'; x.lineWidth = 1.3;
        x.beginPath(); x.arc(e[0], e[1], 5, 0, 6.3); x.stroke();
        x.beginPath(); x.arc(e[0], e[1], 1.8, 0, 6.3); x.fillStyle = 'rgba(' + rgb + ',' + (bright_ ? 1 : .7) + ')'; x.fill();
        if (rt.label) {
          x.font = '600 ' + (mobile ? 9 : 10.5) + 'px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
          x.fillStyle = 'rgba(' + rgb + ',' + (bright_ ? .95 : .55) + ')';
          var left = e[0] > W * .5, off = 10;
          x.textAlign = left ? 'right' : 'left';
          x.fillText(rt.label, e[0] + (left ? -off : off), e[1] + 3.5);
        }
      });
      return c;
    }
    dim = layer(false); bright = layer(true);
  }

  /* ---------- helpers ---------- */
  function pointAt(rt, s) {
    s = Math.max(0, Math.min(rt.total, s));
    for (var i = 1; i < rt.cum.length; i++) {
      if (s <= rt.cum[i]) {
        var a = rt.pts[i - 1], b = rt.pts[i], k = (s - rt.cum[i - 1]) / (rt.cum[i] - rt.cum[i - 1] || 1);
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      }
    }
    return rt.pts[rt.pts.length - 1];
  }

  function drawPulse(rt, s, tail, dir, alpha) {
    var head = pointAt(rt, s);
    var spr = sprites[rt.hue], rgb = COL[rt.hue];
    var steps = 9;
    for (var k = steps; k >= 1; k--) {
      var a = pointAt(rt, s - dir * tail * (k - 1) / steps), b = pointAt(rt, s - dir * tail * k / steps);
      ctx.strokeStyle = 'rgba(' + rgb + ',' + (alpha * (1 - k / (steps + 1)) * .9).toFixed(3) + ')';
      ctx.lineWidth = 2.2 * (1 - k / (steps + 2)) + .4;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    var sz = mobile ? 20 : 26;
    ctx.globalAlpha = alpha;
    ctx.drawImage(spr, head[0] - sz / 2, head[1] - sz / 2, sz, sz);
    ctx.globalAlpha = 1;
  }

  function nearestNode(x, y, max) {
    var best = null, bd = max * max;
    for (var i = 0; i < nodes.length; i++) {
      var dx = nodes[i].x - x, dy = nodes[i].y - y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = nodes[i]; }
    }
    return best;
  }

  function fire(x, y, count) {
    /* send signals both ways through the closest traces */
    var picked = {}, c = 0;
    for (var tries = 0; tries < 24 && c < count; tries++) {
      var nd = nearestNode(x + (Math.random() - .5) * 90 * tries / 6, y + (Math.random() - .5) * 90 * tries / 6, mobile ? 220 : 260);
      if (!nd || picked[nd.r]) continue;
      picked[nd.r] = 1; c++;
      var rt = routes[nd.r], s0 = rt.cum[nd.i];
      extra.push({ r: nd.r, s: s0, dir: 1, v: 320, tail: 90, life: 1 });
      extra.push({ r: nd.r, s: s0, dir: -1, v: 320, tail: 90, life: 1 });
    }
    if (extra.length > 40) extra.splice(0, extra.length - 40);
  }

  /* ---------- frame ---------- */
  function frame(ts) {
    rafId = 0;
    if (!visible || document.hidden) { last = 0; return; }
    rafId = requestAnimationFrame(frame);
    var minGap = mobile ? 32 : 16;
    if (ts - last < minGap) return;
    var dt = last ? Math.min((ts - last) / 1000, .06) : .016;
    last = ts; t += dt;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(dim, 0, 0, W, H);

    /* scan sweep: desktop moves sideways, phones sweep downward */
    var period = mobile ? 6.5 : 8.5, ph = (t % period) / period;
    var strips = 9;
    if (mobile) {
      var bh = H * .26, by = (ph * 1.4 - .2) * H;
      for (var i = 0; i < strips; i++) {
        var a = Math.pow(Math.sin(Math.PI * (i + .5) / strips), 1.6) * .95, sy = by + bh * i / strips, sh = bh / strips + .5;
        if (sy + sh < 0 || sy > H) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(bright, 0, sy * dpr, cv.width, sh * dpr, 0, sy, W, sh);
      }
    } else {
      var bw = W * .2, bx = (ph * 1.4 - .2) * W;
      for (i = 0; i < strips; i++) {
        a = Math.pow(Math.sin(Math.PI * (i + .5) / strips), 1.6) * .95;
        var sx = bx + bw * i / strips, sw = bw / strips + .5;
        if (sx + sw < 0 || sx > W) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(bright, sx * dpr, 0, sw * dpr, cv.height, sx, 0, sw, H);
      }
    }
    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    /* ambient pulses */
    for (var r = 0; r < routes.length; r++) {
      var rt = routes[r];
      for (var p = 0; p < rt.pulses.length; p++) {
        var pu = rt.pulses[p];
        if (pu.wait > 0) { pu.wait -= dt; continue; }
        pu.s += pu.v * dt;
        if (pu.s > rt.total + pu.tail) { pu.s = -Math.random() * 120; pu.wait = .4 + Math.random() * 2.2; continue; }
        if (pu.s > 0) drawPulse(rt, pu.s, pu.tail, 1, Math.min(1, pu.s / 40, (rt.total + pu.tail - pu.s) / 60 + .15));
      }
    }

    /* signals sent by touch / mouse */
    for (var e = extra.length - 1; e >= 0; e--) {
      var ex = extra[e], rr = routes[ex.r];
      ex.s += ex.dir * ex.v * dt;
      if (ex.s < -ex.tail || ex.s > rr.total + ex.tail) { extra.splice(e, 1); continue; }
      if (ex.s >= 0 && ex.s <= rr.total) drawPulse(rr, ex.s, ex.tail, ex.dir, 1);
    }

    /* blinking nodes + pointer proximity glow */
    for (i = 0; i < nodes.length; i++) {
      var nd = nodes[i];
      if (!nd.end && i % 2) continue;
      var blink = .5 + .5 * Math.sin(t * 2 + nd.ph), boost = 0;
      if (ptr.on) {
        var d = Math.hypot(nd.x - ptr.x, nd.y - ptr.y);
        if (d < 150) boost = 1 - d / 150;
      }
      var al = (nd.end ? .35 + .4 * blink : .12 + .12 * blink) + boost * .8;
      var sz = (nd.end ? 22 : 12) + boost * 24;
      ctx.globalAlpha = Math.min(1, al);
      ctx.drawImage(sprites[routes[nd.r].hue], nd.x - sz / 2, nd.y - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;

    /* tap ripples */
    for (i = ripples.length - 1; i >= 0; i--) {
      var rp = ripples[i]; rp.age += dt;
      var k = rp.age / .9;
      if (k >= 1) { ripples.splice(i, 1); continue; }
      ctx.strokeStyle = 'rgba(103,232,249,' + (.7 * (1 - k)).toFixed(3) + ')';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(rp.x, rp.y, 8 + k * 120, 0, 6.3); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';

    /* gentle idle signal so the hero never looks stuck */
    if (!ptr.on && Math.random() < dt * .35) {
      var rd = routes[Math.floor(Math.random() * routes.length)];
      if (rd) { extra.push({ r: routes.indexOf(rd), s: 0, dir: 1, v: 260, tail: 100, life: 1 }); }
    }
  }

  function drawStatic() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(dim, 0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    routes.forEach(function (rt, i) { if (i % 2 === 0) drawPulse(rt, rt.total * .55, 100, 1, .9); });
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- interaction ---------- */
  function local(e) {
    var r = hero.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  if (!reduce) {
    hero.addEventListener('pointermove', function (e) {
      var p = local(e); ptr.x = p.x; ptr.y = p.y; ptr.on = true;
      var now = performance.now();
      if (now - ptr.spawnAt > 420) { ptr.spawnAt = now; fire(p.x, p.y, 1); }
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { ptr.on = false; }, { passive: true });
    hero.addEventListener('pointerdown', function (e) {
      var p = local(e); ptr.x = p.x; ptr.y = p.y; ptr.on = true;
      ripples.push({ x: p.x, y: p.y, age: 0 });
      fire(p.x, p.y, 3);
      clearTimeout(ptr.off); ptr.off = setTimeout(function () { ptr.on = false; }, 700);
    }, { passive: true });
  }

  /* ---------- lifecycle ---------- */
  function start() { if (!rafId && !reduce) { last = 0; rafId = requestAnimationFrame(frame); } }

  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (visible) start();
  }, { rootMargin: '60px' }).observe(hero);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });

  var rz;
  function rebuild() {
    clearTimeout(rz);
    rz = setTimeout(function () {
      var r = hero.getBoundingClientRect();
      if (Math.abs(r.width - W) < 2 && Math.abs(r.height - H) < 60) return; /* ignore phone address-bar jitter */
      build();
    }, 180);
  }
  if (window.ResizeObserver) new ResizeObserver(rebuild).observe(hero); else addEventListener('resize', rebuild);

  build();
  start();
})();

/* spotlight + typing terminal line */
(function(){
  var hero=document.querySelector('.hero'),tt=document.getElementById('tt');
  if(!hero)return;
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,raf=0,px=0,py=0;
  function mv(e){var r=hero.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;hero.classList.add('lit');
    if(!raf)raf=requestAnimationFrame(function(){raf=0;hero.style.setProperty('--sx',px+'px');hero.style.setProperty('--sy',py+'px')})}
  if(!reduce){hero.addEventListener('pointermove',mv,{passive:true});hero.addEventListener('pointerdown',mv,{passive:true});
    hero.addEventListener('pointerleave',function(){hero.classList.remove('lit')},{passive:true});
    hero.addEventListener('pointerup',function(e){if(e.pointerType==='touch')setTimeout(function(){hero.classList.remove('lit')},900)},{passive:true})}
  if(!tt)return;
  var cmds=['deploy --site --speed 98/100','seo audit --target rank #1','track leads --growth +38%','scale --team --weekly-sprints'],ci=0,k=0,dir=1,wait=0;
  if(reduce){tt.textContent=cmds[0];return}
  var vis=true;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(hero);
  setInterval(function(){
    if(!vis||document.hidden)return;
    if(wait>0){wait--;return}
    k+=dir;tt.textContent=cmds[ci].slice(0,k);
    if(dir>0&&k>=cmds[ci].length){dir=-1;wait=18}
    else if(dir<0&&k<=0){dir=1;ci=(ci+1)%cmds.length;wait=4}
  },55);
})();

/* mobile quick-contact bar: appears after the hero */
(function(){
  var b=document.getElementById('mbar'),hero=document.querySelector('.hero');
  if(!b||!hero)return;
  var t=0;function u(){t=0;var show=scrollY>hero.offsetHeight*.7;b.classList.toggle('show',show);
    var ct=document.getElementById('contact');if(ct){var r=ct.getBoundingClientRect();if(r.top<innerHeight*.5&&r.bottom>0)b.classList.remove('show')}}
  addEventListener('scroll',function(){if(!t){t=1;requestAnimationFrame(u)}},{passive:true});u();
})();
