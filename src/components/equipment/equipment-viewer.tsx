'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BRAND } from '@/domain/brand';

function labelTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = '#36d17f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#04140b';
  ctx.font = 'bold 54px Arial';
  ctx.fillText(text, 32, 94);
  ctx.font = '22px Arial';
  ctx.fillText('PET inteligente', 34, 126);
  return new THREE.CanvasTexture(canvas);
}

function webglSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function EquipmentViewer() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    let renderer: THREE.WebGLRenderer | null = null;
    let ok = true;

    try {
      if (!webglSupported()) throw new Error('WebGL indisponivel');
      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#071114');
      const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.set(4, 3.2, 6);
      camera.lookAt(0, 1.2, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.shadowMap.enabled = true;
      host.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight('#dff9ef', 1.4);
      scene.add(ambient);
      const key = new THREE.DirectionalLight('#ffffff', 2.4);
      key.position.set(5, 6, 4);
      key.castShadow = true;
      scene.add(key);
      const rim = new THREE.PointLight('#36c7d0', 9, 10);
      rim.position.set(-3, 2, -2);
      scene.add(rim);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(3.6, 96),
        new THREE.MeshStandardMaterial({ color: '#0d1f22', roughness: .72, metalness: .08 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 3.1, 1.35),
        new THREE.MeshStandardMaterial({ color: '#eef5f1', roughness: .38, metalness: .08 })
      );
      body.position.y = 1.55;
      body.castShadow = true;
      body.receiveShadow = true;
      scene.add(body);

      const header = new THREE.Mesh(
        new THREE.BoxGeometry(2.25, .48, 1.4),
        new THREE.MeshStandardMaterial({ map: labelTexture(BRAND.name), roughness: .4 })
      );
      header.position.set(0, 2.96, .04);
      header.castShadow = true;
      scene.add(header);

      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(1.28, .32, .08),
        new THREE.MeshStandardMaterial({ color: '#071114', roughness: .25, metalness: .18 })
      );
      slot.position.set(0, 2.05, .71);
      scene.add(slot);

      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.06, .58, .08),
        new THREE.MeshStandardMaterial({ color: '#08242a', emissive: '#0a5860', emissiveIntensity: .45 })
      );
      screen.position.set(0, 1.44, .72);
      scene.add(screen);

      const windowMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.46, .76, .08),
        new THREE.MeshPhysicalMaterial({ color: '#d7ffff', roughness: .1, transmission: .35, transparent: true, opacity: .5 })
      );
      windowMesh.position.set(0, .76, .72);
      scene.add(windowMesh);

      const compactor = new THREE.Mesh(
        new THREE.BoxGeometry(1.32, .18, 1.03),
        new THREE.MeshStandardMaterial({ color: '#24343a', metalness: .55, roughness: .28 })
      );
      compactor.position.set(0, .82, .06);
      scene.add(compactor);

      const bottleMaterial = new THREE.MeshPhysicalMaterial({ color: '#9df2ff', transparent: true, opacity: .55, roughness: .05, transmission: .3 });
      const bottles: THREE.Mesh[] = [];
      for (let i = 0; i < 10; i += 1) {
        const bottle = new THREE.Mesh(new THREE.CapsuleGeometry(.065, .36, 6, 12), bottleMaterial);
        bottle.position.set(-.62 + (i % 5) * .31, .38 + Math.floor(i / 5) * .13, .42);
        bottle.rotation.z = (i % 2 ? -.8 : .7);
        bottles.push(bottle);
        scene.add(bottle);
      }

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, .28, 1.58),
        new THREE.MeshStandardMaterial({ color: '#1b2d32', roughness: .42, metalness: .14 })
      );
      base.position.y = .14;
      base.castShadow = true;
      scene.add(base);

      const rings = new THREE.Group();
      for (let i = 0; i < 3; i += 1) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.78 + i * .32, .006, 8, 96),
          new THREE.MeshBasicMaterial({ color: i === 1 ? '#f3b35b' : '#36c7d0', transparent: true, opacity: .42 - i * .08 })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = .035 + i * .002;
        rings.add(ring);
      }
      scene.add(rings);

      const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const renderOnce = () => renderer && renderer.render(scene, camera);

      const animate = () => {
        frame = requestAnimationFrame(animate);
        body.rotation.y = Math.sin(Date.now() / 3200) * .08;
        header.rotation.y = body.rotation.y;
        slot.rotation.y = body.rotation.y;
        screen.rotation.y = body.rotation.y;
        windowMesh.rotation.y = body.rotation.y;
        compactor.rotation.y = body.rotation.y;
        base.rotation.y = body.rotation.y;
        rings.rotation.z += .002;
        bottles.forEach((bottle, index) => {
          bottle.rotation.y += .01 + index * .0005;
        });
        renderOnce();
      };

      if (reduceMotion) {
        renderOnce();
      } else {
        animate();
      }

      const resize = () => {
        if (!host || !renderer) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener('resize', resize);

      return () => {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        renderer?.dispose();
        if (renderer && renderer.domElement.parentNode === host) {
          host.removeChild(renderer.domElement);
        }
      };
    } catch (error) {
      console.warn('[EcoPlastic] falha ao iniciar o 3D', error);
      if (frame) cancelAnimationFrame(frame);
      renderer?.dispose();
      ok = false;
    }

    if (!ok) {
      // Falha de WebGL/3D: cai para o poster estatico. Caso de erro pontual, nao re-render em cascata.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
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
