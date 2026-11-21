// 3D cutaway petrol engines (4-stroke + 2-stroke). Everything is a pure function of time.
(function () {
  const T = THREE;
  const R = 0.7, L = 2.0, HEAD = 3.45, BORE = 0.88;
  const HALF0 = Math.PI / 2, HALF = Math.PI; // back half of revolved parts

  // ---------- materials ----------
  const M = {
    alu: new T.MeshStandardMaterial({ color: 0x8796a8, metalness: 0.6, roughness: 0.45 }),
    aluDark: new T.MeshStandardMaterial({ color: 0x6d7d8f, metalness: 0.6, roughness: 0.5, side: T.DoubleSide }),
    bore: new T.MeshStandardMaterial({ color: 0xb8c4d0, metalness: 0.85, roughness: 0.22, side: T.DoubleSide }),
    cut: new T.MeshStandardMaterial({ color: 0xc23a1c, metalness: 0.05, roughness: 0.7, side: T.DoubleSide }),
    piston: new T.MeshStandardMaterial({ color: 0xe3e7ec, metalness: 0.85, roughness: 0.2, side: T.DoubleSide }),
    ring: new T.MeshStandardMaterial({ color: 0x3b4450, metalness: 0.9, roughness: 0.3 }),
    rod: new T.MeshStandardMaterial({ color: 0x8aa0b8, metalness: 0.9, roughness: 0.28 }),
    crank: new T.MeshStandardMaterial({ color: 0x34475e, metalness: 0.85, roughness: 0.42 }),
    valve: new T.MeshStandardMaterial({ color: 0xd2d6dc, metalness: 0.95, roughness: 0.18 }),
    spring: new T.MeshStandardMaterial({ color: 0xf2b632, metalness: 0.7, roughness: 0.35 }),
    cam: new T.MeshStandardMaterial({ color: 0x46c2ff, metalness: 0.6, roughness: 0.3 }),
    ceramic: new T.MeshStandardMaterial({ color: 0xf4f1ea, metalness: 0.0, roughness: 0.35 }),
    hex: new T.MeshStandardMaterial({ color: 0xa9b3bd, metalness: 1.0, roughness: 0.25 }),
    oil: new T.MeshStandardMaterial({ color: 0xc8901a, metalness: 0.2, roughness: 0.15, transparent: true, opacity: 0.85 }),
    pipe: new T.MeshStandardMaterial({ color: 0x5a6675, metalness: 0.8, roughness: 0.35, side: T.DoubleSide }),
    pipeIn: new T.MeshStandardMaterial({ color: 0x2f7fd1, metalness: 0.5, roughness: 0.35, side: T.DoubleSide }),
  };

  // ---------- helpers ----------
  function slab(pts, depth, capMat, sideMat) {
    const s = new T.Shape(pts.map((p) => new T.Vector2(p[0], p[1])));
    const g = new T.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 24 });
    g.translate(0, 0, -depth);
    return new T.Mesh(g, [capMat || M.cut, sideMat || M.alu]);
  }
  function rect(x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; }
  function backPipe(r, len, mat) { // half pipe along x, back half
    const g = new T.CylinderGeometry(r, r, len, 32, 1, true, HALF0, HALF);
    const m = new T.Mesh(g, mat);
    m.rotation.z = Math.PI / 2;
    return m;
  }
  function lathe(points, mat, half) {
    const g = new T.LatheGeometry(points.map((p) => new T.Vector2(p[0], p[1])), 48, half ? HALF0 : 0, half ? HALF : Math.PI * 2);
    return new T.Mesh(g, mat);
  }
  function capShape(pts, mat) { // section face at z=0 for revolved parts, both sides
    const grp = new T.Group();
    for (const sgn of [1, -1]) {
      const s = new T.Shape(pts.map((p) => new T.Vector2(sgn * p[0], p[1])));
      const m = new T.Mesh(new T.ShapeGeometry(s), mat);
      m.position.z = 0.002;
      grp.add(m);
    }
    return grp;
  }
  function glowTex(inner, outer) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(0.35, outer); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }
  const TEX_FIRE = glowTex("rgba(255,255,230,1)", "rgba(255,150,30,0.8)");
  const TEX_SPARK = glowTex("rgba(255,255,255,1)", "rgba(140,200,255,0.9)");
  const TEX_SMOKE = glowTex("rgba(150,155,165,0.75)", "rgba(110,115,125,0.35)");
  const TEX_MIX = glowTex("rgba(150,220,255,1)", "rgba(40,140,255,0.7)");
  function sprite(tex, add) {
    const m = new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: add ? T.AdditiveBlending : T.NormalBlending });
    return new T.Sprite(m);
  }
  function pinY(th, l) { const a = th * Math.PI / 180; l = l || L; return R * Math.cos(a) + Math.sqrt(l * l - R * R * Math.sin(a) * Math.sin(a)); }
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  function lerpPath(pts, u) { // polyline interpolation
    const n = pts.length - 1, f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
    return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k), lerp(pts[i][2] || 0, pts[i + 1][2] || 0, k)];
  }
  function valveLift(phi, s, e) { if (phi < s || phi > e) return 0; return Math.sin((phi - s) / (e - s) * Math.PI); }

  // ---------- shared moving parts ----------
  function buildCrank(g) {
    const crank = new T.Group();
    const web = new T.Shape();
    web.moveTo(0.3, 0); web.lineTo(0.3, R);
    web.absarc(0, R, 0.3, 0, Math.PI, false);
    web.lineTo(-0.3, 0);
    web.absarc(0, 0, 0.82, Math.PI + 0.25, 2 * Math.PI - 0.25, false);
    web.lineTo(0.3, 0);
    const wg = new T.ExtrudeGeometry(web, { depth: 0.16, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 24 });
    for (const z of [0.3, -0.46]) { const w = new T.Mesh(wg, M.crank); w.position.z = z; crank.add(w); }
    const pin = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.62, 32), M.valve); pin.rotation.x = Math.PI / 2; pin.position.set(0, R, 0); crank.add(pin);
    const main = new T.Mesh(new T.CylinderGeometry(0.26, 0.26, 2.3, 32), M.valve); main.rotation.x = Math.PI / 2; main.position.z = -0.75; crank.add(main);
    // drive gear / flywheel at the back
    const fw = new T.Mesh(new T.CylinderGeometry(1.05, 1.05, 0.18, 64), M.crank); fw.rotation.x = Math.PI / 2; fw.position.z = -1.55; crank.add(fw);
    g.add(crank);
    return crank;
  }
  function buildRod(g, len) {
    const s = new T.Shape();
    s.absarc(0, 0, 0.36, -Math.PI / 2 - 1.2, Math.PI / 2 + 1.2 - Math.PI * 2 + Math.PI * 2, true);
    const sh = new T.Shape();
    sh.moveTo(-0.17, len); sh.absarc(0, len, 0.22, Math.PI, 0, true); // small end top half
    sh.lineTo(0.13, len - 0.15); sh.lineTo(0.22, 0.25);
    sh.absarc(0, 0, 0.36, 0.9, Math.PI - 0.9 + Math.PI * 2 - Math.PI * 2, true);
    sh.absarc(0, 0, 0.36, Math.PI - 0.9, 0.9 - Math.PI * 2 + Math.PI * 2, false);
    sh.lineTo(-0.13, len - 0.15); sh.lineTo(-0.17, len);
    const bodyShape = new T.Shape();
    bodyShape.moveTo(-0.22, 0.15); bodyShape.lineTo(-0.12, len - 0.12); bodyShape.lineTo(0.12, len - 0.12); bodyShape.lineTo(0.22, 0.15); bodyShape.lineTo(-0.22, 0.15);
    const rod = new T.Group();
    const opt = { depth: 0.24, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 24 };
    const body = new T.Mesh(new T.ExtrudeGeometry(bodyShape, opt), M.rod); body.position.z = -0.12; rod.add(body);
    const big = new T.Mesh(new T.TorusGeometry(0.29, 0.1, 16, 40), M.rod); big.scale.z = 1.6; rod.add(big);
    const small = new T.Mesh(new T.TorusGeometry(0.17, 0.07, 16, 32), M.rod); small.position.y = len; small.scale.z = 1.8; rod.add(small);
    g.add(rod);
    return rod;
  }
  function buildPiston(g, len) {
    const p = new T.Group();
    const crown = new T.Mesh(new T.CylinderGeometry(BORE, BORE, 0.32, 48), M.piston); crown.position.y = -0.16; p.add(crown);
    const skirt = new T.Mesh(new T.CylinderGeometry(BORE - 0.01, BORE - 0.01, len - 0.32, 48, 1, true), M.piston); skirt.position.y = -0.32 - (len - 0.32) / 2; p.add(skirt);
    for (const y of [-0.08, -0.17, -0.26]) { const r = new T.Mesh(new T.TorusGeometry(BORE + 0.003, 0.018, 8, 64), M.ring); r.rotation.x = Math.PI / 2; r.position.y = y; p.add(r); }
    const wp = new T.Mesh(new T.CylinderGeometry(0.13, 0.13, 1.7, 24), M.valve); wp.rotation.x = Math.PI / 2; wp.position.y = -0.45; p.add(wp);
    g.add(p);
    return p;
  }
  function buildPlug(g, yBase) {
    const plug = new T.Group();
    plug.add(lathe([[0, 0], [0.07, 0], [0.07, 0.35], [0.16, 0.35], [0.16, 0.55], [0.12, 0.6], [0.1, 1.05], [0.06, 1.12], [0.05, 1.3], [0, 1.3]].map(p => [p[0], p[1]]), M.ceramic));
    const hx = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.2, 6), M.hex); hx.position.y = 0.42; plug.add(hx);
    const th = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.32, 16), M.hex); th.position.y = 0.16; plug.add(th);
    const cap = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.16, 16), M.hex); cap.position.y = 1.36; plug.add(cap);
    plug.position.y = yBase;
    g.add(plug);
    return plug;
  }
  function particles(g, n, tex, add, size) {
    const arr = [];
    for (let i = 0; i < n; i++) { const s = sprite(tex, add); s.scale.setScalar(size); s.visible = false; g.add(s); arr.push(s); }
    return arr;
  }
  function flow(arr, path, amount, t, speed, size, phase, grow) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
      const u = (((t * speed + i / n + (phase || 0)) % 1) + 1) % 1;
      const p = lerpPath(path, u);
      const s = arr[i];
      const jitter = Math.sin(i * 12.9898) * 0.08;
      s.position.set(p[0] + jitter * 0.3, p[1] + jitter, p[2] + Math.cos(i * 7.1) * 0.25);
      const a = amount * Math.sin(u * Math.PI);
      s.visible = a > 0.02;
      s.material.opacity = Math.min(1, a * 1.3);
      s.scale.setScalar(size * (grow ? (0.5 + u * grow) : 1));
    }
  }

  // ---------- 4-stroke ----------
  function build4(scene) {
    const g = new T.Group(); scene.add(g);
    const E = { type: "4s", g };
    // cylinder barrel with round fins (revolved back half)
    const prof = [[BORE, 0.9], [1.18, 0.9]];
    for (let i = 0; i < 6; i++) { const y = 1.15 + i * 0.38; prof.push([1.18, y], [1.62, y + 0.02], [1.62, y + 0.14], [1.18, y + 0.16]); }
    prof.push([1.18, HEAD], [BORE, HEAD]);
    g.add(lathe(prof.concat([[BORE, 0.9]]), M.alu, true));
    g.add(lathe([[BORE, 0.9], [BORE, HEAD]], M.bore, true));
    g.add(capShape(prof, M.cut));
    // cylinder head with ports (slab)
    const D = 1.7;
    g.add(slab([[-1.75, 4.4], [1.75, 4.4], [1.75, 4.12], [0.62, 4.12], [0.22, HEAD], [-0.22, HEAD], [-0.62, 4.12], [-1.75, 4.12]], D));
    g.add(slab([[0.7, HEAD], [1.75, HEAD], [1.75, 3.76], [0.92, 3.76]], D));
    g.add(slab([[-0.7, HEAD], [-0.92, 3.76], [-1.75, 3.76], [-1.75, HEAD]], D));
    // port channel back walls
    g.add(slab([[-1.75, 3.76], [-0.92, 3.76], [-0.7, HEAD], [-0.22, HEAD], [-0.62, 4.12], [-1.75, 4.12]], 0.12, M.aluDark, M.aluDark)).position.z = -0.9;
    g.add(slab([[1.75, 3.76], [0.92, 3.76], [0.7, HEAD], [0.22, HEAD], [0.62, 4.12], [1.75, 4.12]], 0.12, M.aluDark, M.aluDark)).position.z = -0.9;
    // cam box (U shape)
    g.add(slab([[-1.3, 4.4], [-1.3, 5.75], [1.3, 5.75], [1.3, 4.4], [1.12, 4.4], [1.12, 5.57], [-1.12, 5.57], [-1.12, 4.4]], 1.4));
    g.add(slab(rect(-1.12, 4.4, 1.12, 5.57), 0.1, M.aluDark, M.aluDark)).position.z = -1.3;
    // crankcase
    const cc = new T.Shape();
    cc.moveTo(-0.9, 0.9); cc.lineTo(-1.7, 0.9); cc.lineTo(-1.7, -0.8); cc.quadraticCurveTo(-1.7, -1.7, -0.8, -1.7); cc.lineTo(0.8, -1.7); cc.quadraticCurveTo(1.7, -1.7, 1.7, -0.8);
    cc.lineTo(1.7, 0.9); cc.lineTo(0.9, 0.9); cc.lineTo(0.9, 0.66); cc.lineTo(1.45, 0.66); cc.lineTo(1.45, -0.7); cc.quadraticCurveTo(1.45, -1.45, 0.7, -1.45);
    cc.lineTo(-0.7, -1.45); cc.quadraticCurveTo(-1.45, -1.45, -1.45, -0.7); cc.lineTo(-1.45, 0.66); cc.lineTo(-0.9, 0.66); cc.lineTo(-0.9, 0.9);
    const ccg = new T.ExtrudeGeometry(cc, { depth: 1.9, bevelEnabled: false, curveSegments: 24 }); ccg.translate(0, 0, -1.9);
    g.add(new T.Mesh(ccg, [M.cut, M.alu]));
    const back = slab(rect(-1.7, -1.7, 1.7, 0.9), 0.12, M.aluDark, M.aluDark); back.position.z = -1.9; g.add(back);
    const oil = new T.Mesh(new T.BoxGeometry(2.9, 0.32, 1.75), M.oil); oil.position.set(0, -1.29, -0.88); g.add(oil);
    // manifolds
    const inPipe = backPipe(0.17, 1.4, M.pipeIn); inPipe.position.set(-2.45, 3.94, 0); g.add(inPipe);
    const exPipe = backPipe(0.17, 1.6, M.pipe); exPipe.position.set(2.55, 3.94, 0); g.add(exPipe);
    // carburettor box on intake
    const carb = slab(rect(-3.5, 3.6, -3.15, 4.3), 0.7, M.cut, M.pipeIn); g.add(carb);
    // moving parts
    E.crank = buildCrank(g);
    E.rod = buildRod(g, L);
    E.piston = buildPiston(g, 1.1);
    E.valves = [];
    for (const x of [-0.45, 0.45]) {
      const v = new T.Group();
      v.add(lathe([[0, 0], [0.25, 0], [0.25, 0.04], [0.07, 0.2], [0.05, 0.3], [0.05, 1.42], [0, 1.42]], M.valve));
      const tap = new T.Mesh(new T.CylinderGeometry(0.19, 0.19, 0.14, 32), M.hex); tap.position.y = 1.43; v.add(tap);
      v.position.set(x, HEAD, 0); g.add(v);
      // spring (helix)
      const pts = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2 * 5; pts.push(new T.Vector3(Math.cos(a) * 0.14, i / 120, Math.sin(a) * 0.14)); }
      const sp = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 240, 0.022, 8, false), M.spring);
      sp.position.set(x, 4.4, 0); g.add(sp);
      // cam
      const cs = new T.Shape(); for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; const r = 0.2 + 0.26 * Math.pow(Math.max(0, Math.cos(a + Math.PI / 2)), 3); const px = Math.cos(a) * r, py = Math.sin(a) * r; i ? cs.lineTo(px, py) : cs.moveTo(px, py); }
      const cg = new T.ExtrudeGeometry(cs, { depth: 0.3, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }); cg.translate(0, 0, -0.15);
      const cam = new T.Mesh(cg, M.cam); cam.position.set(x, 5.07, 0); g.add(cam);
      const shaft = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1.5, 16), M.valve); shaft.rotation.x = Math.PI / 2; shaft.position.set(x, 5.07, -0.6); g.add(shaft);
      E.valves.push({ v, sp, cam });
    }
    E.plug = buildPlug(g, 4.1);
    // gas, fire, particles
    E.gasMat = new T.MeshBasicMaterial({ color: 0x46aaff, transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide });
    E.gas = new T.Mesh(new T.CylinderGeometry(BORE - 0.02, BORE - 0.02, 1, 48, 1, false), E.gasMat); g.add(E.gas);
    E.fire = sprite(TEX_FIRE, true); E.fire.position.set(0, 3.25, 0.2); g.add(E.fire);
    E.spark = sprite(TEX_SPARK, true); E.spark.position.set(0, 3.42, 0.05); g.add(E.spark);
    E.light = new T.PointLight(0xff9a3c, 0, 9, 1.5); E.light.position.set(0, 3.1, 0.6); g.add(E.light);
    E.inP = particles(g, 26, TEX_MIX, true, 0.22);
    E.exP = particles(g, 22, TEX_SMOKE, false, 0.36);
    E.smoke = particles(g, 16, TEX_SMOKE, false, 0.5);
    return E;
  }

  // ---------- 2-stroke ----------
  const P2 = { EXT: 2.42, EXB: 1.86, TRT: 2.16, TRB: 1.82, INT: 1.72, INB: 1.3, LEN: 1.3 };
  function build2(scene) {
    const g = new T.Group(); scene.add(g);
    const E = { type: "2s", g };
    const D = 1.6;
    // left wall + transfer passage
    g.add(slab(rect(-1.2, P2.TRT, -0.9, HEAD), D));
    g.add(slab(rect(-1.2, 0.95, -0.9, P2.TRB), D));
    g.add(slab([[-1.95, 0.35], [-1.95, 2.42], [-0.9, 2.42], [-0.9, 2.16], [-1.2, 2.16], [-1.68, 2.16], [-1.68, 0.35]], D)); // outer passage wall
    E.trMat = new T.MeshBasicMaterial({ color: 0x46aaff, transparent: true, opacity: 0.25, depthWrite: false });
    const trFill = new T.Mesh(new T.ShapeGeometry(new T.Shape([[-1.68, 0.35], [-1.68, 2.16], [-1.2, 2.16], [-1.2, 0.95], [-1.35, 0.95], [-1.35, 0.35]].map(p => new T.Vector2(p[0], p[1])))), E.trMat);
    trFill.position.z = -0.4; g.add(trFill);
    // right wall with exhaust + inlet ports
    g.add(slab(rect(0.9, P2.EXT, 1.2, HEAD), D));
    g.add(slab(rect(0.9, P2.INT, 1.2, P2.EXB), D));
    g.add(slab(rect(0.9, 0.95, 1.2, P2.INB), D));
    // fins on the outside
    for (let i = 0; i < 5; i++) { const y = 2.55 + i * 0.18; g.add(slab(rect(1.2, y, 1.6, y + 0.08), D)); g.add(slab(rect(-2.3, y, -1.95, y + 0.08), D)); }
    // head
    g.add(slab(rect(-1.95, HEAD, 1.6, 3.95), D));
    // bore back half
    g.add(lathe([[BORE, 0.95], [BORE, HEAD]], M.bore, true));
    // crankcase
    g.add(slab([[-1.35, -1.45], [1.35, -1.45], [1.35, 0.95], [0.9, 0.95], [0.9, 0.75], [1.12, 0.75], [1.12, -1.22], [-1.12, -1.22], [-1.12, 0.35], [-1.35, 0.35]], 1.9));
    g.add(slab([[-1.35, 0.95], [-1.35, 0.95], [-0.9, 0.95], [-0.9, 0.75], [-1.12, 0.75], [-1.12, 0.95]], 1.9));
    const back = slab(rect(-1.95, -1.45, 1.6, 0.95), 0.12, M.aluDark, M.aluDark); back.position.z = -1.9; g.add(back);
    E.ccMat = new T.MeshBasicMaterial({ color: 0x46aaff, transparent: true, opacity: 0.2, depthWrite: false });
    const ccFill = new T.Mesh(new T.ShapeGeometry(new T.Shape(rect(-1.12, -1.22, 1.12, 0.95).map(p => new T.Vector2(p[0], p[1])))), E.ccMat); ccFill.position.z = -1.75; g.add(ccFill);
    // pipes
    const exPipe = backPipe(0.27, 1.8, M.pipe); exPipe.position.set(2.1, 2.14, 0); g.add(exPipe);
    const inPipe = backPipe(0.2, 1.4, M.pipeIn); inPipe.position.set(1.9, 1.51, 0); g.add(inPipe);
    g.add(slab(rect(2.6, 1.15, 3.0, 1.9), 0.7, M.cut, M.pipeIn));
    // moving parts
    E.crank = buildCrank(g);
    E.rod = buildRod(g, L);
    E.piston = buildPiston(g, P2.LEN);
    E.plug = buildPlug(g, 3.75);
    E.gasMat = new T.MeshBasicMaterial({ color: 0x46aaff, transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide });
    E.gas = new T.Mesh(new T.CylinderGeometry(BORE - 0.02, BORE - 0.02, 1, 48), E.gasMat); g.add(E.gas);
    E.fire = sprite(TEX_FIRE, true); E.fire.position.set(0, 3.25, 0.2); g.add(E.fire);
    E.spark = sprite(TEX_SPARK, true); E.spark.position.set(0, 3.42, 0.05); g.add(E.spark);
    E.light = new T.PointLight(0xff9a3c, 0, 9, 1.5); E.light.position.set(0, 3.1, 0.6); g.add(E.light);
    E.inP = particles(g, 20, TEX_MIX, true, 0.2);
    E.trP = particles(g, 22, TEX_MIX, true, 0.2);
    E.exP = particles(g, 22, TEX_SMOKE, false, 0.36);
    E.smoke = particles(g, 18, TEX_SMOKE, false, 0.6);
    return E;
  }

  // ---------- update ----------
  const C_BLUE = new T.Color(0x46aaff), C_DENSE = new T.Color(0x7a6cff), C_HOT = new T.Color(0xfff1a8), C_FIRE = new T.Color(0xff7a1a), C_RED = new T.Color(0xc0392b), C_SMOKE = new T.Color(0x8d96a3);
  const tmp = new T.Color();
  function setGas(E, top, col, a, additive) {
    const h = Math.max(0.01, HEAD - top);
    E.gas.scale.y = h; E.gas.position.y = top + h / 2;
    E.gasMat.color.copy(col); E.gasMat.opacity = a;
    E.gasMat.blending = additive ? T.AdditiveBlending : T.NormalBlending;
  }
  function moveCommon(E, theta, len) {
    const a = theta * Math.PI / 180;
    const py = pinY(theta), top = py + 0.45;
    const cx = R * Math.sin(a), cy = R * Math.cos(a);
    E.crank.rotation.z = -a;
    E.piston.position.y = top;
    E.rod.position.set(cx, cy, 0);
    E.rod.rotation.z = Math.atan2(-(0 - cx), py - cy);
    return { top, py };
  }
  function burn(E, f, s) {
    E.fire.material.opacity = f; E.fire.visible = f > 0.01; E.fire.scale.setScalar(0.6 + 2.2 * (1 - f) * f + 1.2 * f);
    E.spark.visible = s > 0; E.spark.material.opacity = s; E.spark.scale.setScalar(0.5 + 0.3 * s);
    E.light.intensity = 9 * f + 3 * s;
  }
  function update4(E, theta, t, opt) {
    opt = opt || {};
    const { top } = moveCommon(E, theta);
    const phi = ((theta % 720) + 720) % 720;
    const li = valveLift(phi, -10, 190) + valveLift(phi, 710, 730);
    const le = valveLift(phi, 530, 730);
    const lifts = [li, le], peaks = [90, 630];
    E.valves.forEach((o, i) => {
      const lift = lifts[i] * 0.24;
      o.v.position.y = HEAD - lift;
      o.sp.scale.y = (0.43 - lift) / 1.0 * 1.0 + 0.0; o.sp.scale.y = Math.max(0.1, 0.45 - lift);
      o.sp.position.y = 4.4;
      o.cam.rotation.z = -((phi - peaks[i]) / 2) * Math.PI / 180;
    });
    let col = C_BLUE, a = 0.3, f = 0, s = 0, add = false;
    if (phi < 180) { a = 0.18 + 0.22 * phi / 180; }
    else if (phi < 360) { const k = (phi - 180) / 180; col = tmp.copy(C_BLUE).lerp(C_DENSE, k); a = 0.4 + 0.35 * k; }
    else if (phi < 540) { const k = (phi - 360) / 180; col = k < 0.2 ? tmp.copy(C_HOT).lerp(C_FIRE, k / 0.2) : tmp.copy(C_FIRE).lerp(C_RED, (k - 0.2) / 0.8); a = 0.72 - 0.4 * k; add = k < 0.5; f = phi < 420 ? 1 - (phi - 360) / 60 : 0; s = phi < 368 ? 1 : 0; }
    else { const k = (phi - 540) / 180; col = C_SMOKE; a = 0.5 - 0.35 * k; }
    setGas(E, top, col, a, add);
    burn(E, f, s);
    const inPath = [[-3.2, 3.94, 0], [-1.8, 3.94, 0], [-0.75, 3.94, 0], [-0.45, 3.6, 0], [-0.2, top + 0.15, 0.2]];
    const exPath = [[0.2, top + 0.2, 0.2], [0.45, 3.6, 0], [0.8, 3.94, 0], [2.0, 3.94, 0], [3.3, 3.94, 0]];
    flow(E.inP, inPath, li, t, 0.9, 0.22);
    flow(E.exP, exPath, le, t, 0.9, 0.34);
    const sm = opt.smoke || 0;
    flow(E.smoke, [[3.3, 3.94, 0], [4.2, 4.3, 0], [5.0, 5.0, 0]], sm * le, t, 0.5, 0.6, 0, 2.2);
    return phi;
  }
  function update2(E, theta, t, opt) {
    opt = opt || {};
    const { top } = moveCommon(E, theta);
    const th = ((theta % 360) + 360) % 360;
    const exOpen = clamp((P2.EXT - top) / (P2.EXT - P2.EXB));
    const trOpen = clamp((P2.TRT - top) / (P2.TRT - P2.TRB));
    const bottom = top - P2.LEN;
    const inOpen = clamp((bottom - P2.INB) / (P2.INT - P2.INB));
    let col = C_BLUE, a = 0.3, f = 0, s = 0, add = false;
    if (th < 180) {
      if (exOpen <= 0) { const k = th / 60; col = k < 0.3 ? tmp.copy(C_HOT).lerp(C_FIRE, k / 0.3) : C_FIRE; a = 0.72 - 0.15 * Math.min(1, k); add = true; f = th < 50 ? 1 - th / 50 : 0; s = th < 10 ? 1 : 0; }
      else if (trOpen <= 0) { col = tmp.copy(C_FIRE).lerp(C_SMOKE, exOpen); a = 0.55; }
      else { col = tmp.copy(C_SMOKE).lerp(C_BLUE, trOpen); a = 0.45; }
    } else {
      if (exOpen > 0) { col = tmp.copy(C_BLUE).lerp(C_SMOKE, 0.25); a = 0.4; }
      else { const k = (th - 180) / 180; col = tmp.copy(C_BLUE).lerp(C_DENSE, k); a = 0.4 + 0.4 * k; }
    }
    setGas(E, top, col, a, add);
    burn(E, f, s);
    const ccA = th < 180 ? 0.15 + 0.35 * (th / 180) : 0.5 - 0.3 * ((th - 180) / 180) + 0.12 * inOpen;
    E.ccMat.opacity = ccA; E.trMat.opacity = 0.15 + 0.5 * trOpen;
    flow(E.exP, [[0.3, 2.1, 0.2], [1.1, 2.14, 0], [2.0, 2.14, 0], [3.0, 2.14, 0]], exOpen, t, 1.0, 0.36);
    flow(E.inP, [[2.9, 1.51, 0], [1.6, 1.51, 0], [0.95, 1.51, 0], [0.5, 0.9, 0.3], [0.2, 0.2, 0.4]], inOpen, t, 0.9, 0.2);
    flow(E.trP, [[-0.6, 0.0, 0.5], [-1.5, 0.6, 0], [-1.5, 1.9, 0], [-1.05, 2.0, 0], [-0.2, 2.6, 0.3]], trOpen, t, 1.0, 0.2);
    const sm = opt.smoke || 0;
    flow(E.smoke, [[3.0, 2.14, 0], [3.9, 2.5, 0.1], [4.8, 3.3, 0.2]], sm * Math.max(exOpen, 0.6), t, 0.45, 0.7, 0, 2.6);
    return { th, exOpen, trOpen, inOpen };
  }

  // ---------- stage ----------
  function makeEnv(renderer) {
    const pm = new T.PMREMGenerator(renderer);
    const env = new T.Scene();
    const box = new T.Mesh(new T.BoxGeometry(30, 20, 30), new T.MeshBasicMaterial({ color: 0x1b2f4a, side: T.BackSide }));
    env.add(box);
    const panel = (c, x, y, z, w, h, ry, rx) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.y = ry || 0; m.rotation.x = rx || 0; env.add(m); };
    panel(0xffffff, 0, 9.5, 0, 14, 6, 0, Math.PI / 2);
    panel(0x9fd8ff, -14, 3, 0, 10, 6, Math.PI / 2);
    panel(0xffd9a0, 14, 2, 4, 8, 5, -Math.PI / 2);
    panel(0x6fa8ff, 0, 2, -14, 16, 4, 0);
    const rt = pm.fromScene(env, 0.04);
    return rt.texture;
  }
  function createStage(canvas, W, H) {
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(W, H, false);
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.setClearColor(0x000000, 0);
    const scene = new T.Scene();
    scene.environment = makeEnv(renderer);
    scene.add(new T.HemisphereLight(0xbfe3ff, 0x0b1d33, 0.35));
    const key = new T.DirectionalLight(0xffffff, 1.25); key.position.set(6, 10, 8); scene.add(key);
    const rim = new T.DirectionalLight(0x5fc8ff, 1.3); rim.position.set(-8, 4, -6); scene.add(rim);
    const fill = new T.DirectionalLight(0xffc98a, 0.45); fill.position.set(-4, -2, 8); scene.add(fill);
    // floor
    const grid = new T.GridHelper(60, 60, 0x2d5b8a, 0x1a3554); grid.position.y = -1.9; grid.material.transparent = true; grid.material.opacity = 0.55; scene.add(grid);
    const shadowTex = glowTex("rgba(0,0,0,0.55)", "rgba(0,0,0,0.3)");
    const shadowMat = new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    scene.fog = new T.Fog(0x0b1d33, 16, 38);
    const camera = new T.PerspectiveCamera(32, W / H, 0.1, 100);
    const e4 = build4(scene), e2 = build2(scene);
    for (const e of [e4, e2]) { const sh = new T.Mesh(new T.PlaneGeometry(6, 4), shadowMat); sh.rotation.x = -Math.PI / 2; sh.position.y = -1.88; e.g.add(sh); }
    return { renderer, scene, camera, e4, e2, W, H };
  }
  window.Engine3D = { createStage, update4, update2, pinY, HEAD, P2 };
})();
