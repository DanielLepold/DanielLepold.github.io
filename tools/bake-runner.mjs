// Bake a running point cloud from a skinned glTF character.
// Usage: node bake.mjs <model.glb> <clipName> <out.bin> [N] [F]
import fs from 'node:fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const [, , glbPath, clipName, outPath, nArg, fArg] = process.argv;
const N = Number(nArg ?? 2400);
const F = Number(fArg ?? 20);

let seed = 1234567;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

const buf = fs.readFileSync(glbPath);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

new GLTFLoader().parse(
  ab,
  '',
  (gltf) => {
    const scene = gltf.scene;
    const clip = gltf.animations.find((a) => a.name === clipName);
    if (!clip) throw new Error('clip not found');
    const mixer = new THREE.AnimationMixer(scene);
    mixer.clipAction(clip).play();

    const meshes = [];
    scene.traverse((o) => o.isSkinnedMesh && (!process.env.MESH || o.name === process.env.MESH) && meshes.push(o));
    console.log('meshes', meshes.map((m) => `${m.name}:${m.geometry.attributes.position.count}`).join(', '));
    console.log('clip duration', clip.duration.toFixed(3));

    // ── uniform surface samples ──
    // 1) many area-weighted candidates on all meshes, in bind pose (T-pose)
    // 2) farthest-point sampling down to N, so overlapping meshes (joint pieces
    //    under the skin) never produce denser patches
    scene.updateMatrixWorld(true);
    const tris = [];
    let total = 0;
    meshes.forEach((m, mi) => {
      const pos = m.geometry.attributes.position;
      const idx = m.geometry.index;
      const cnt = idx ? idx.count : pos.count;
      const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
      for (let t = 0; t < cnt; t += 3) {
        const a = idx ? idx.getX(t) : t, b = idx ? idx.getX(t + 1) : t + 1, c = idx ? idx.getX(t + 2) : t + 2;
        A.fromBufferAttribute(pos, a).applyMatrix4(m.matrixWorld);
        B.fromBufferAttribute(pos, b).applyMatrix4(m.matrixWorld);
        C.fromBufferAttribute(pos, c).applyMatrix4(m.matrixWorld);
        const area = B.clone().sub(A).cross(C.clone().sub(A)).length() / 2;
        total += area;
        tris.push({ mi, a, b, c, cum: total, A: A.clone(), B: B.clone(), C: C.clone() });
      }
    });
    const M = Math.max(30000, N * 20);
    const cand = [];
    for (let k = 0; k < M; k++) {
      const r = rnd() * total;
      let lo = 0, hi = tris.length - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (tris[mid].cum < r) lo = mid + 1; else hi = mid; }
      const tr = tris[lo];
      let u = rnd(), v = rnd();
      if (u + v > 1) { u = 1 - u; v = 1 - v; }
      const wa = 1 - u - v;
      const p = tr.A.clone().multiplyScalar(wa).addScaledVector(tr.B, u).addScaledVector(tr.C, v);
      cand.push({ mi: tr.mi, a: tr.a, b: tr.b, c: tr.c, wa, wb: u, wc: v, p });
    }
    // drop candidates hidden inside the body: joint pieces that sit under the skin.
    // A candidate on a non-skin mesh is "inside" when axis rays in at least 5 of the
    // 6 directions hit the skin mesh (the skin is not watertight, so not all 6).
    const skinIdx = meshes.findIndex((m) => /surface|body|skin/i.test(m.name));
    if (skinIdx >= 0 && meshes.length > 1) {
      const skinTris = tris.filter((t) => t.mi === skinIdx);
      let lo = Infinity, hi = -Infinity;
      for (const c of cand) { lo = Math.min(lo, c.p.y); hi = Math.max(hi, c.p.y); }
      const h = (hi - lo) / 160;
      const ax = ['x', 'y', 'z'];
      const grids = [0, 1, 2].map((k) => {
        const [u, v] = ax.filter((_, i) => i !== k);
        const g = new Map();
        for (const t of skinTris) {
          const us = [t.A[u], t.B[u], t.C[u]], vs = [t.A[v], t.B[v], t.C[v]];
          for (let i = Math.floor(Math.min(...us) / h); i <= Math.floor(Math.max(...us) / h); i++)
            for (let j = Math.floor(Math.min(...vs) / h); j <= Math.floor(Math.max(...vs) / h); j++) {
              const key = i + ',' + j;
              if (!g.has(key)) g.set(key, []);
              g.get(key).push(t);
            }
        }
        return { k: ax[k], u, v, g };
      });
      const blocked = (p) => {
        let n = 0;
        for (const { k, u, v, g } of grids) {
          const list = g.get(Math.floor(p[u] / h) + ',' + Math.floor(p[v] / h)) || [];
          let plus = false, minus = false;
          for (const t of list) {
            // 2D barycentric in the (u, v) plane
            const x1 = t.A[u], y1 = t.A[v], x2 = t.B[u], y2 = t.B[v], x3 = t.C[u], y3 = t.C[v];
            const det = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
            if (Math.abs(det) < 1e-12) continue;
            const l1 = ((y2 - y3) * (p[u] - x3) + (x3 - x2) * (p[v] - y3)) / det;
            const l2 = ((y3 - y1) * (p[u] - x3) + (x1 - x3) * (p[v] - y3)) / det;
            const l3 = 1 - l1 - l2;
            if (l1 < 0 || l2 < 0 || l3 < 0) continue;
            const hit = l1 * t.A[k] + l2 * t.B[k] + l3 * t.C[k];
            if (hit > p[k]) plus = true; else minus = true;
            if (plus && minus) break;
          }
          n += (plus ? 1 : 0) + (minus ? 1 : 0);
        }
        return n;
      };
      const before = cand.length;
      for (let i = cand.length - 1; i >= 0; i--) if (cand[i].mi !== skinIdx && blocked(cand[i].p) >= 5) cand.splice(i, 1);
      console.log('hidden candidates removed', before - cand.length, 'of', before);
    }
    const Mc = cand.length;
    const minD = new Float64Array(Mc).fill(Infinity);
    const samples = [];
    let next = Math.floor(rnd() * Mc);
    for (let k = 0; k < N; k++) {
      const s0 = cand[next];
      samples.push(s0);
      let best = -1, bestD = -1;
      for (let i = 0; i < Mc; i++) {
        const q = cand[i].p;
        const d = (q.x - s0.p.x) ** 2 + (q.y - s0.p.y) ** 2 + (q.z - s0.p.z) ** 2;
        if (d < minD[i]) minD[i] = d;
        if (minD[i] > bestD) { bestD = minD[i]; best = i; }
      }
      next = best;
    }
    console.log('candidates', Mc, 'samples', samples.length);

    // ── manual linear-blend skinning (position + normal) ──
    const skin = (m, i, boneMats) => {
      const g = m.geometry.attributes;
      const M = new THREE.Matrix4().set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      for (let k = 0; k < 4; k++) {
        const w = g.skinWeight.getComponent(i, k);
        if (!w) continue;
        const bm = boneMats[g.skinIndex.getComponent(i, k)].elements;
        for (let e = 0; e < 16; e++) M.elements[e] += bm[e] * w;
      }
      const final = new THREE.Matrix4().multiplyMatrices(m.matrixWorld, m.bindMatrixInverse).multiply(M).multiply(m.bindMatrix);
      const p = new THREE.Vector3().fromBufferAttribute(g.position, i).applyMatrix4(final);
      const n = new THREE.Vector3().fromBufferAttribute(g.normal, i).applyMatrix3(new THREE.Matrix3().getNormalMatrix(final)).normalize();
      return [p, n];
    };

    const jointNames = ['Head', 'LeftArm', 'RightArm', 'LeftForeArm', 'RightForeArm', 'LeftHand', 'RightHand',
      'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot'];
    const findBone = (n) => {
      let b = null;
      scene.traverse((o) => { if (o.isBone && o.name.replace(/^mixamorig:?/, '') === n) b = o; });
      return b;
    };
    const jointBones = jointNames.map(findBone);
    const hips = findBone('Hips');
    if (jointBones.some((b) => !b) || !hips) throw new Error('bone missing: ' + jointNames.filter((n, i) => !jointBones[i]));

    const frames = [];
    for (let f = 0; f < F; f++) {
      mixer.setTime((f / F) * clip.duration);
      scene.updateMatrixWorld(true);
      const hp = hips.getWorldPosition(new THREE.Vector3());
      const cache = meshes.map(() => new Map());
      const boneMatsPer = meshes.map((m) => m.skeleton.bones.map((b, k) => new THREE.Matrix4().multiplyMatrices(b.matrixWorld, m.skeleton.boneInverses[k])));
      const P = [], Nn = [];
      for (const s of samples) {
        const get = (i) => {
          let v = cache[s.mi].get(i);
          if (!v) { v = skin(meshes[s.mi], i, boneMatsPer[s.mi]); cache[s.mi].set(i, v); }
          return v;
        };
        const [pa, na] = get(s.a), [pb, nb] = get(s.b), [pc, nc] = get(s.c);
        const p = pa.clone().multiplyScalar(s.wa).addScaledVector(pb, s.wb).addScaledVector(pc, s.wc);
        const n = na.clone().multiplyScalar(s.wa).addScaledVector(nb, s.wb).addScaledVector(nc, s.wc).normalize();
        P.push(p); Nn.push(n);
      }
      const J = jointBones.map((b) => b.getWorldPosition(new THREE.Vector3()));
      frames.push({ hp, P, N: Nn, J });
    }
    console.log('hips x/z drift', frames.map((f) => `${f.hp.x.toFixed(1)}/${f.hp.z.toFixed(1)}`).join(' '));

    // ── normalise: remove horizontal root motion, ground at -0.85, height ~1.7, face +x ──
    let minY = Infinity, maxY = -Infinity;
    for (const fr of frames) for (const p of fr.P) { minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
    const s = 1.68 / (maxY - minY);
    const tf = (v, fr) => {
      const x = (v.x - fr.hp.x) * s, z = (v.z - fr.hp.z) * s, y = (v.y - minY) * s - 0.85;
      return [z, y, -x]; // rotate so the runner faces +x
    };
    const tn = (n) => [n.z, n.y, -n.x];

    const pos = new Int16Array(F * N * 3), nrm = new Int8Array(F * N * 3), jnt = new Int16Array(F * jointNames.length * 3);
    const Q = 32767 / 1.5;
    frames.forEach((fr, f) => {
      fr.P.forEach((p, k) => {
        const [x, y, z] = tf(p, fr), [a, b, c] = tn(fr.N[k]);
        const o = (f * N + k) * 3;
        pos[o] = Math.round(x * Q); pos[o + 1] = Math.round(y * Q); pos[o + 2] = Math.round(z * Q);
        nrm[o] = Math.round(a * 127); nrm[o + 1] = Math.round(b * 127); nrm[o + 2] = Math.round(c * 127);
      });
      fr.J.forEach((j, k) => {
        const [x, y, z] = tf(j, fr);
        const o = (f * jointNames.length + k) * 3;
        jnt[o] = Math.round(x * Q); jnt[o + 1] = Math.round(y * Q); jnt[o + 2] = Math.round(z * Q);
      });
    });

    const header = new Uint16Array([N, F, jointNames.length, Math.round(clip.duration * 1000)]);
    const pad = nrm.byteLength % 2 ? new Uint8Array(1) : new Uint8Array(0);
    fs.writeFileSync(outPath, Buffer.concat([header, pos, nrm, pad, jnt].map((a) => Buffer.from(a.buffer, a.byteOffset, a.byteLength))));
    console.log('wrote', outPath, fs.statSync(outPath).size, 'bytes');
  },
  (e) => { console.error('load error', e); process.exit(1); },
);
