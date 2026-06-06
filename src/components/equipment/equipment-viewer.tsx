'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { BRAND } from '@/domain/brand';

type Tier = 'high' | 'medium' | 'low';

interface TierConfig {
  dpr: number;
  shadow: number; // 0 = off
  bloom: number; // resolution scale, 0 = off
  smaa: boolean;
  dof: boolean;
  bottles: number;
  transmission: boolean;
}

const TIERS: Record<Tier, TierConfig> = {
  high: { dpr: 2, shadow: 2048, bloom: 1, smaa: true, dof: true, bottles: 10, transmission: true },
  medium: { dpr: 1.5, shadow: 1024, bloom: 0.5, smaa: true, dof: false, bottles: 6, transmission: true },
  low: { dpr: 1, shadow: 0, bloom: 0, smaa: false, dof: false, bottles: 4, transmission: false }
};

function readQualityOverride(): Tier | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('q');
    const value = (fromUrl || window.localStorage.getItem('ecoplastic:q') || '').toLowerCase();
    if (value === 'high' || value === 'medium' || value === 'low') {
      if (fromUrl) window.localStorage.setItem('ecoplastic:q', value);
      return value;
    }
  } catch {}
  return null;
}

function pickTier(gl: WebGLRenderingContext | WebGL2RenderingContext): Tier {
  const override = readQualityOverride();
  if (override) return override;
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|microsoft basic|software/i.test(renderer)) return 'low';
    if (/rtx|geforce gtx|radeon rx|radeon pro|apple m\d|arc a\d/i.test(renderer)) return 'high';
    if (/intel|hd graphics|uhd graphics|iris|mali|adreno|powervr/i.test(renderer)) return 'medium';
  } catch {}
  return 'medium';
}

function webglSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

function brandLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#3ee08c');
    grad.addColorStop(1, '#1f9f5a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#04140b';
    ctx.font = '700 108px Inter, Arial, sans-serif';
    ctx.fillText(BRAND.name, 56, 170);
    ctx.font = '500 44px Inter, Arial, sans-serif';
    ctx.globalAlpha = 0.78;
    ctx.fillText('PET inteligente', 60, 232);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function screenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#04171a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#36d17f';
    ctx.fillRect(0, 0, canvas.width, 70);
    ctx.fillStyle = '#04140b';
    ctx.font = '700 38px Inter, Arial, sans-serif';
    ctx.fillText(BRAND.name, 22, 50);
    ctx.fillStyle = '#7ef0b6';
    ctx.font = '600 26px Inter, Arial, sans-serif';
    ctx.fillText('PET reciclado hoje', 24, 132);
    ctx.fillStyle = '#eafff4';
    ctx.font = '800 96px Inter, Arial, sans-serif';
    ctx.fillText('12,4 kg', 22, 230);
    // barra de progresso
    ctx.fillStyle = '#0c3a3f';
    ctx.fillRect(24, 280, 592, 26);
    ctx.fillStyle = '#36c7d0';
    ctx.fillRect(24, 280, 430, 26);
    ctx.fillStyle = '#5fe0a0';
    ctx.font = '600 24px Inter, Arial, sans-serif';
    ctx.fillText('meta mensal 72%', 24, 344);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function radialAlphaTexture(inner: string, outer: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 126);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function EquipmentViewer() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let sceneForCleanup: THREE.Scene | null = null;
    let disposed = false;
    const disposables: Array<{ dispose: () => void }> = [];
    const cleanups: Array<() => void> = [];

    const teardown = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {}
      });
      cleanups.length = 0;
      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {}
      });
      disposables.length = 0;
      if (sceneForCleanup) {
        const seen = new Set<unknown>();
        const texKeys = ['map', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'normalMap', 'aoMap', 'clearcoatMap'] as const;
        sceneForCleanup.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.geometry && !seen.has(mesh.geometry)) {
            seen.add(mesh.geometry);
            mesh.geometry.dispose();
          }
          const material = mesh.material;
          const mats = Array.isArray(material) ? material : material ? [material] : [];
          mats.forEach((mat) => {
            if (seen.has(mat)) return;
            seen.add(mat);
            const record = mat as unknown as Record<string, { isTexture?: boolean; dispose?: () => void } | undefined>;
            texKeys.forEach((key) => {
              const tex = record[key];
              if (tex && tex.isTexture && !seen.has(tex)) {
                seen.add(tex);
                tex.dispose?.();
              }
            });
            mat.dispose();
          });
        });
        sceneForCleanup = null;
      }
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
        renderer = null;
      }
    };

    try {
      if (!webglSupported()) throw new Error('WebGL indisponivel');

      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false });
      const tier = pickTier(renderer.getContext());
      const cfg = TIERS[tier];
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.dpr));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.shadowMap.enabled = cfg.shadow > 0;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      sceneForCleanup = scene;
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(3.7, 2.8, 5.1);

      // IBL procedural (RoomEnvironment) -> reflexos realistas, sem rede.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envRT = pmrem.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.7;
      (roomEnv as { dispose?: () => void }).dispose?.();
      pmrem.dispose();
      disposables.push({ dispose: () => envRT.dispose() });

      const model = new THREE.Group();
      scene.add(model);

      // Materiais premium (PBR).
      const shellMat = new THREE.MeshPhysicalMaterial({ color: '#f4f8f5', roughness: 0.3, metalness: 0, clearcoat: 0.85, clearcoatRoughness: 0.1, envMapIntensity: 1.0 });
      const metalMat = new THREE.MeshStandardMaterial({ color: '#2a3a40', roughness: 0.34, metalness: 0.95, envMapIntensity: 1.15 });
      const darkMat = new THREE.MeshStandardMaterial({ color: '#0a1417', roughness: 0.5, metalness: 0.4, envMapIntensity: 0.8 });
      const acrylicMat = cfg.transmission
        ? new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0, transmission: 1, ior: 1.46, thickness: 0.4, clearcoat: 1, clearcoatRoughness: 0.04, attenuationColor: new THREE.Color('#bdeef0'), attenuationDistance: 1.5, envMapIntensity: 1 })
        : new THREE.MeshPhysicalMaterial({ color: '#cdeef2', roughness: 0.12, metalness: 0, transparent: true, opacity: 0.42, envMapIntensity: 1 });
      const screenMat = new THREE.MeshStandardMaterial({ color: '#02100f', emissive: new THREE.Color('#ffffff'), emissiveMap: screenTexture(), emissiveIntensity: 2.4, roughness: 0.4, metalness: 0 });
      const labelMat = new THREE.MeshStandardMaterial({ map: brandLabelTexture(), roughness: 0.42, metalness: 0, envMapIntensity: 0.6 });
      [shellMat, metalMat, darkMat, acrylicMat, screenMat, labelMat].forEach((m) => disposables.push(m));

      // Corpo / shell.
      const body = new THREE.Mesh(new RoundedBoxGeometry(2.2, 3.1, 1.35, 4, 0.07), shellMat);
      body.position.y = 1.55;
      body.castShadow = true;
      body.receiveShadow = true;
      model.add(body);

      // Recuo de painel frontal (seam).
      const panelInset = new THREE.Mesh(new RoundedBoxGeometry(1.74, 2.2, 0.06, 3, 0.04), darkMat);
      panelInset.position.set(0, 1.5, 0.66);
      model.add(panelInset);

      // Header com a marca.
      const header = new THREE.Mesh(new RoundedBoxGeometry(2.26, 0.5, 1.4, 3, 0.06), labelMat);
      header.position.set(0, 2.98, 0.02);
      header.castShadow = true;
      model.add(header);

      // Slot de entrada do PET: abertura escura recuada + moldura metalica.
      const holeMat = new THREE.MeshStandardMaterial({ color: '#03090b', roughness: 0.95, metalness: 0 });
      disposables.push(holeMat);
      const slotHole = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.32, 0.06), holeMat);
      slotHole.position.set(0, 2.3, 0.63);
      model.add(slotHole);
      const slotBar = (w: number, h: number, x: number, y: number) => {
        const b = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.12, 2, 0.025), metalMat);
        b.position.set(x, y, 0.7);
        model.add(b);
      };
      slotBar(1.5, 0.07, 0, 2.49);
      slotBar(1.5, 0.07, 0, 2.11);
      slotBar(0.07, 0.45, -0.715, 2.3);
      slotBar(0.07, 0.45, 0.715, 2.3);

      // Tela com moldura (bezel).
      const bezel = new THREE.Mesh(new RoundedBoxGeometry(1.22, 0.74, 0.1, 3, 0.04), darkMat);
      bezel.position.set(0, 1.74, 0.69);
      model.add(bezel);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.6), screenMat);
      screen.position.set(0, 1.74, 0.752);
      model.add(screen);

      // Janela acrilica (mostra as garrafas).
      const windowFrame = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.92, 0.1, 3, 0.05), metalMat);
      windowFrame.position.set(0, 0.92, 0.68);
      model.add(windowFrame);
      const windowGlass = new THREE.Mesh(new RoundedBoxGeometry(1.34, 0.78, 0.12, 3, 0.04), acrylicMat);
      windowGlass.position.set(0, 0.92, 0.71);
      model.add(windowGlass);

      // Hopper / compactador metalico.
      const compactor = new THREE.Mesh(new RoundedBoxGeometry(1.34, 0.2, 1.04, 3, 0.04), metalMat);
      compactor.position.set(0, 0.86, 0.04);
      compactor.castShadow = true;
      model.add(compactor);

      // Plinto / base chanfrada.
      const base = new THREE.Mesh(new RoundedBoxGeometry(2.45, 0.3, 1.6, 4, 0.05), metalMat);
      base.position.y = 0.16;
      base.castShadow = true;
      base.receiveShadow = true;
      model.add(base);

      // Dispenser lateral (portinhola para o staff retirar o PET prensado).
      const seamMat = new THREE.MeshStandardMaterial({ color: '#0a1417', roughness: 0.7, metalness: 0.35, envMapIntensity: 0.8 });
      const doorMat = new THREE.MeshPhysicalMaterial({ color: '#e9eff1', roughness: 0.4, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.16, envMapIntensity: 0.9 });
      disposables.push(seamMat, doorMat);
      const doorSeam = new THREE.Mesh(new RoundedBoxGeometry(0.05, 1.5, 1.0, 3, 0.04), seamMat);
      doorSeam.position.set(1.1, 1.02, 0);
      model.add(doorSeam);
      const sideDoor = new THREE.Mesh(new RoundedBoxGeometry(0.1, 1.36, 0.88, 3, 0.05), doorMat);
      sideDoor.position.set(1.12, 1.02, 0);
      sideDoor.castShadow = true;
      model.add(sideDoor);
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.56, 14), metalMat);
      handle.position.set(1.19, 1.02, 0.3);
      model.add(handle);

      // Chao de estudio (levemente reflexivo) + gradiente radial.
      const floorTex = radialAlphaTexture('rgba(30,90,96,0.55)', 'rgba(3,9,11,1)');
      floorTex.colorSpace = THREE.SRGBColorSpace;
      disposables.push(floorTex);
      const floorMat = new THREE.MeshPhysicalMaterial({ map: floorTex, roughness: 0.3, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.2, envMapIntensity: 0.6 });
      disposables.push(floorMat);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(7, 96), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
      disposables.push(floor.geometry);

      // Sombra de contato macia (fake AO disc).
      const contactTex = radialAlphaTexture('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)');
      disposables.push(contactTex);
      const contactMat = new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false, toneMapped: false });
      disposables.push(contactMat);
      const contact = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), contactMat);
      contact.rotation.x = -Math.PI / 2;
      contact.position.y = 0.02;
      scene.add(contact);
      disposables.push(contact.geometry);

      // Luzes: 3 pontos cinematograficos + IBL.
      scene.add(new THREE.AmbientLight('#dff4ff', 0.12));
      const key = new THREE.DirectionalLight('#fff3e0', 1.5);
      key.position.set(4.5, 6, 4);
      if (cfg.shadow > 0) {
        key.castShadow = true;
        key.shadow.mapSize.set(cfg.shadow, cfg.shadow);
        key.shadow.camera.near = 1;
        key.shadow.camera.far = 22;
        key.shadow.camera.left = -3.2;
        key.shadow.camera.right = 3.2;
        key.shadow.camera.top = 3.6;
        key.shadow.camera.bottom = -1;
        key.shadow.bias = -0.0003;
        key.shadow.normalBias = 0.03;
        key.shadow.radius = 4;
      }
      scene.add(key);
      const fill = new THREE.DirectionalLight('#cfe9ff', 0.5);
      fill.position.set(-4, 3, 5);
      scene.add(fill);
      const rimCyan = new THREE.DirectionalLight('#36c7d0', 1.5);
      rimCyan.position.set(-4, 3.5, -4);
      scene.add(rimCyan);
      const rimAmber = new THREE.DirectionalLight('#f3b35b', 1.2);
      rimAmber.position.set(4, 2.4, -4.5);
      scene.add(rimAmber);

      // Pos-processamento.
      const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const useComposer = cfg.bloom > 0 || cfg.smaa;
      let composer: EffectComposer | null = null;
      let bloomPass: UnrealBloomPass | null = null;
      if (useComposer) {
        const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: tier === 'high' ? 4 : 0 });
        composer = new EffectComposer(renderer, rt);
        composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.dpr));
        composer.setSize(width, height);
        composer.addPass(new RenderPass(scene, camera));
        if (cfg.bloom > 0) {
          bloomPass = new UnrealBloomPass(new THREE.Vector2(width * cfg.bloom, height * cfg.bloom), 0.18, 0.4, 2.2);
          composer.addPass(bloomPass);
        }
        if (cfg.smaa) composer.addPass(new SMAAPass());
        composer.addPass(new OutputPass());
        disposables.push({ dispose: () => composer?.dispose() });
        if (bloomPass) disposables.push({ dispose: () => bloomPass?.dispose() });
      }

      // Controles (drag) + auto-orbita.
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1.4, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.minDistance = 3.6;
      controls.maxDistance = 9.5;
      controls.minPolarAngle = 0.6;
      controls.maxPolarAngle = Math.PI / 2.05;
      controls.autoRotate = false;
      controls.update();
      disposables.push({ dispose: () => controls.dispose() });

      let renderRequested = true;
      controls.addEventListener('change', () => { renderRequested = true; });

      const renderOnce = () => {
        if (!renderer) return;
        if (composer) composer.render();
        else renderer.render(scene, camera);
      };

      const clock = new THREE.Clock();
      let visible = true;
      const fpsSamples: number[] = [];
      let demotions = 0;

      // Render sob demanda: estatico por padrao (sem auto-rotacao). So
      // redesenha quando o usuario arrasta/zoom (OrbitControls com damping) ou
      // quando algo pede um novo frame (resize / degradacao).
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const dt = clock.getDelta();
        const moved = controls.update();
        if (!moved && !renderRequested) return;
        renderRequested = false;
        renderOnce();

        // Guard de FPS: so enquanto renderiza (interacao); degrada sem travar.
        if (dt > 0 && dt < 1) {
          fpsSamples.push(1 / dt);
          if (fpsSamples.length >= 50) {
            const avg = fpsSamples.reduce((s, v) => s + v, 0) / fpsSamples.length;
            fpsSamples.length = 0;
            if (avg < 30 && demotions < 2) {
              demotions += 1;
              if (bloomPass && bloomPass.enabled) bloomPass.enabled = false;
              else if (renderer) {
                renderer.shadowMap.enabled = false;
                scene.traverse((o) => {
                  const light = o as THREE.DirectionalLight;
                  if (light.isDirectionalLight) light.castShadow = false;
                });
              }
              renderRequested = true;
            }
          }
        }
      };

      const resize = () => {
        if (!renderer || !host) return;
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer?.setSize(w, h);
        renderRequested = true;
        renderOnce();
      };
      window.addEventListener('resize', resize);
      cleanups.push(() => window.removeEventListener('resize', resize));

      const start = () => {
        if (!frame && visible && !reduceMotion && !disposed) animate();
      };
      const stop = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      };

      // Pausa fora da tela / aba oculta.
      const io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      }, { threshold: 0.05 });
      io.observe(host);
      cleanups.push(() => io.disconnect());

      const onVisibility = () => {
        if (document.hidden) stop();
        else start();
      };
      document.addEventListener('visibilitychange', onVisibility);
      cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

      // Estatico por padrao: renderiza um frame e deixa o usuario girar (drag).
      // reduce-motion nao inicia o loop (start e no-op); o frame estatico fica.
      renderOnce();
      start();

      return () => {
        disposed = true;
        teardown();
      };
    } catch (error) {
      console.warn('[EcoPlastic] falha ao iniciar o 3D', error);
      teardown();
      if (!disposed) {
        setFailed(true);
      }
    }
  }, []);

  if (failed) {
    return (
      <div className="viewer-fallback" role="img" aria-label={`${BRAND.name} Station — visualizacao 3D indisponivel`}>
        <div>
          <strong>{BRAND.name} Station</strong>
          <p>Visualizacao 3D indisponivel neste dispositivo. Veja as especificacoes ao lado ou abra o &quot;Protótipo 3D completo&quot; abaixo.</p>
        </div>
      </div>
    );
  }

  return <div ref={hostRef} className="viewer-host" />;
}
