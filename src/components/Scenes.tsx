"use client";

/*
  Cenas 3D (React Three Fiber). Carregadas só no navegador (ver Three.tsx).
  - HeroScene: fotos de projetos flutuando em profundidade; o mouse move a câmera e a rolagem "voa" para dentro.
  - RingScene: projetos num anel 3D que gira com a rolagem e com o arrastar; clique abre o projeto.
  - ArchScene: escultura de arcos (as aberturas em arco dos projetos dela) que acompanha o mouse.
  Cada Canvas pausa quando sai da tela.
*/

import { Image as Photo3D, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { asset } from "@/lib/base-path";

/** aleatório determinístico (mesmo resultado a cada render) */
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Pausa o render quando o canvas não está visível (economiza bateria e GPU). */
function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVis(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, vis] as const;
}

/* =================== TOPO =================== */

type HeroItem = { url: string; pos: [number, number, number]; size: [number, number] };

function HeroRig({ items, scrollRef }: { items: HeroItem[]; scrollRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    // a câmera vem do estado do frame (mexer nela aqui é o padrão do R3F)
    const { camera, pointer } = state;
    const s = scrollRef.current ?? 0;
    const still = reduced();
    // câmera segue o mouse e avança com a rolagem
    camera.position.x = THREE.MathUtils.damp(camera.position.x, still ? 0 : pointer.x * 0.9, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, still ? 0 : pointer.y * 0.55, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 6 - s * 9, 4, dt);
    camera.lookAt(0, 0, -6);
    if (group.current && !still) group.current.rotation.z = Math.sin(performance.now() / 6000) * 0.02;
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={it.url} speed={1 + (i % 3) * 0.3} rotationIntensity={0.15} floatIntensity={0.35}>
          <HoverImage url={it.url} position={it.pos} size={it.size} />
        </Float>
      ))}
    </group>
  );
}

function HoverImage({ url, position, size }: { url: string; position: [number, number, number]; size: [number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  useFrame((_, dt) => {
    const m = ref.current?.material as unknown as { zoom: number; grayscale: number } | undefined;
    if (!m) return;
    m.zoom = THREE.MathUtils.damp(m.zoom, hover ? 1.18 : 1, 4, dt);
    m.grayscale = THREE.MathUtils.damp(m.grayscale, hover ? 0 : 0.12, 4, dt);
  });
  return (
    <Photo3D
      ref={ref}
      url={asset(url)}
      position={position}
      scale={size}
      radius={0.06}
      toneMapped={false}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    />
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 260;
    const rnd = seeded(42);
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (rnd() - 0.5) * 16;
      p[i * 3 + 1] = (rnd() - 0.5) * 9;
      p[i * 3 + 2] = -rnd() * 18 + 3;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current && !reduced()) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.025} color="#e1d3b8" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function HeroScene({ images }: { images: string[] }) {
  const [wrap, vis] = useVisible<HTMLDivElement>();
  const scroll = useRef(0);
  useEffect(() => {
    const on = () => (scroll.current = Math.min(1, window.scrollY / window.innerHeight));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // posições em "túnel": alternando esquerda/direita, cada vez mais fundo
  const items: HeroItem[] = useMemo(
    () =>
      images.map((url, i) => {
        const side = i % 2 ? 1 : -1;
        const z = -0.8 - i * 1.9;
        const wide = i % 3 !== 1;
        return { url, pos: [side * (2.1 + (i % 3) * 0.6), ((i * 37) % 5) * 0.34 - 0.55, z], size: wide ? [3.4, 2.25] : [2.1, 2.8] };
      }),
    [images],
  );
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas frameloop={vis ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#0b0907", 9, 26]} />
        <HeroRig items={items} scrollRef={scroll} />
        <Dust />
      </Canvas>
    </div>
  );
}

/* =================== ANEL DE PROJETOS =================== */

type RingProject = { slug: string; tex: string; title: string };

function Ring({ items, rot, onSelect, onFront }: { items: RingProject[]; rot: React.RefObject<number>; onSelect: (i: number) => void; onFront: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const n = items.length;
  const R = 5.2;
  const last = useRef(-1);
  const [hover, setHover] = useState<number | null>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    const target = rot.current ?? 0;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 4, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, reduced() ? 0 : state.pointer.y * 0.08, 3, dt);
    // qual projeto está de frente
    const a = (((-group.current.rotation.y / (Math.PI * 2)) * n) % n + n) % n;
    const front = Math.round(a) % n;
    if (front !== last.current) {
      last.current = front;
      onFront(front);
    }
  });
  return (
    <group ref={group}>
      {items.map((it, i) => {
        const ang = (i / n) * Math.PI * 2;
        return (
          <group key={it.slug} position={[Math.sin(ang) * R, 0, Math.cos(ang) * R]} rotation={[0, ang, 0]}>
            <Photo3D
              url={asset(it.tex)}
              scale={hover === i ? [2.75, 1.85] : [2.5, 1.68]}
              radius={0.05}
              toneMapped={false}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHover(i);
                document.body.dataset.ringHover = "1";
              }}
              onPointerOut={() => {
                setHover(null);
                delete document.body.dataset.ringHover;
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(i);
              }}
            />
          </group>
        );
      })}
    </group>
  );
}

export function RingScene({ items, onSelect, onFront, rot }: { items: RingProject[]; onSelect: (i: number) => void; onFront: (i: number) => void; rot: React.RefObject<number> }) {
  const [wrap, vis] = useVisible<HTMLDivElement>();
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas frameloop={vis ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0.6, 10.5], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#0b0907", 9, 17]} />
        <Ring items={items} rot={rot} onSelect={onSelect} onFront={onFront} />
      </Canvas>
    </div>
  );
}

/* =================== ESCULTURA DE ARCOS =================== */

function archShape(w: number, h: number, t: number) {
  // arco (porta com topo em semicírculo) com um vão interno
  const r = w / 2;
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.lineTo(-r, h - r);
  s.absarc(0, h - r, r, Math.PI, 0, true);
  s.lineTo(r, 0);
  s.lineTo(-r, 0);
  const ri = r - t;
  const hole = new THREE.Path();
  hole.moveTo(-ri, 0.001);
  hole.lineTo(-ri, h - r);
  hole.absarc(0, h - r, ri, Math.PI, 0, true);
  hole.lineTo(ri, 0.001);
  hole.lineTo(-ri, 0.001);
  s.holes.push(hole);
  return s;
}

function Arches() {
  const group = useRef<THREE.Group>(null);
  const shape = useMemo(() => archShape(1.6, 2.6, 0.22), []);
  const extrude = useMemo(() => ({ depth: 0.28, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 48 }), []);
  useFrame((state, dt) => {
    if (!group.current) return;
    const still = reduced();
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, still ? 0.4 : state.pointer.x * 0.6 + Math.sin(state.clock.elapsedTime * 0.25) * 0.25, 2.5, dt);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, still ? 0 : -state.pointer.y * 0.18, 2.5, dt);
  });
  const tones = ["#6b3a26", "#a0714f", "#d8c3a2"];
  return (
    <group ref={group} position={[0, -1.25, 0]}>
      {tones.map((c, i) => (
        <mesh key={c} position={[(i - 1) * 0.55, 0, -i * 0.7]} castShadow>
          <extrudeGeometry args={[shape, extrude]} />
          <meshStandardMaterial color={c} roughness={0.55} metalness={0.08} />
        </mesh>
      ))}
      <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0.4}>
        <mesh position={[0.15, 1.15, 0.6]}>
          <sphereGeometry args={[0.32, 64, 64]} />
          <meshStandardMaterial color="#e9dcc4" roughness={0.25} metalness={0.15} />
        </mesh>
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#1a1310" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function ArchScene() {
  const [wrap, vis] = useVisible<HTMLDivElement>();
  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas frameloop={vis ? "always" : "never"} shadows dpr={[1, 1.75]} camera={{ position: [0, 0.4, 5.4], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffe2c2" castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-3, 1, 2]} intensity={14} color="#c97b4a" />
        <pointLight position={[2, 2.5, -2]} intensity={8} color="#fff1dc" />
        <Arches />
      </Canvas>
    </div>
  );
}
