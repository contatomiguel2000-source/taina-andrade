"use client";

import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/* ---------- rolagem suave (Lenis) + barra de progresso no topo ---------- */
export function SmoothScroll() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const setBar = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    if (reduced()) {
      window.addEventListener("scroll", setBar, { passive: true });
      return () => window.removeEventListener("scroll", setBar);
    }
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
    window.__lenis = lenis;
    lenis.on("scroll", setBar);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return <div ref={bar} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-wine" style={{ transform: "scaleX(0)" }} aria-hidden />;
}

/* ---------- cursor próprio: ponto + anel; mostra o texto de data-cursor ---------- */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hot, setHot] = useState(false);
  useEffect(() => {
    if (!finePointer()) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    // o texto do cursor é recalculado ao mover o mouse e também ao rolar (o elemento embaixo do mouse muda)
    const check = () => {
      const t = document.elementFromPoint(x, y) as HTMLElement | null;
      const c = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(c?.dataset.cursor ?? "");
      setHot(!c && !!t?.closest("a,button,[role=button],summary,input,label"));
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      check();
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", check, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", check);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[90] hidden [@media(pointer:fine)]:block" aria-hidden>
        <span className={`block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine transition-opacity ${label ? "opacity-0" : "opacity-100"}`} />
      </div>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[90] hidden [@media(pointer:fine)]:block" aria-hidden>
        <span
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[0.78rem] font-medium leading-tight text-cream transition-[width,height,background-color,border-color] duration-300 ease-out ${
            label ? "h-24 w-24 bg-wine" : hot ? "h-12 w-12 border border-accent bg-wine/10" : "h-8 w-8 border border-cream/30"
          }`}
        >
          <span className={`max-w-[4.5rem] transition-opacity duration-200 ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
        </span>
      </div>
    </>
  );
}

/* ---------- títulos: palavras sobem de dentro de uma máscara (trecho entre *asteriscos* sai em itálico serifado) ---------- */
export function Split({ text, as = "h2", className = "", delay = 0 }: { text: string; as?: "h1" | "h2" | "h3" | "p"; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  let k = 0;
  const parts = text.split("*").map((chunk, pi) =>
    chunk
      .split(" ")
      .filter(Boolean)
      .map((w) => {
        const i = k++;
        return (
          <span key={`${pi}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-top">
            <span
              className={`inline-block transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] ${pi % 2 ? "t-serif pr-[0.06em]" : ""}`}
              style={{ transform: shown ? "none" : "translateY(110%) rotate(4deg)", transitionDelay: `${delay + i * 60}ms` }}
            >
              {w}
            </span>
            &nbsp;
          </span>
        );
      }),
  );
  const Tag = as;
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text.replace(/\*/g, "")}>
      <span aria-hidden>{parts}</span>
    </Tag>
  );
}

/* ---------- botão magnético: o elemento é puxado na direção do mouse ---------- */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
      }}
      onPointerLeave={() => ref.current && (ref.current.style.transform = "")}
    >
      {children}
    </span>
  );
}

/* ---------- faixa corrida que acelera, inverte e inclina com a velocidade da rolagem ---------- */
export function VelocityMarquee({ items, className = "" }: { items: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let x = 0, last = window.scrollY, dir = 1, skew = 0, raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const v = y - last;
      last = y;
      if (v !== 0) dir = v > 0 ? 1 : -1;
      x -= dir * (0.6 + Math.min(Math.abs(v), 60) * 0.35);
      skew += (Math.max(-12, Math.min(12, v * 0.4)) - skew) * 0.12;
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translateX(${x}px) skewX(${-skew}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((s) => (
              <span key={s} className="t-serif group flex items-center px-4 text-[clamp(2.6rem,6vw,5.2rem)] leading-tight text-[#c8c7c1] transition-colors duration-300 hover:text-ink">
                {s}
                <span className="ml-8 inline-block text-[0.5em] text-accent transition-transform duration-500 group-hover:rotate-[360deg]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- seção que escurece ao entrar na tela ---------- */
export function InkSection({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDark(e.isIntersecting), { rootMargin: "-40% 0px -40% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} id={id} data-dark={dark} className={`group/ink transition-colors duration-700 ${dark ? "bg-night text-cream" : "bg-paper text-ink"} ${className}`}>
      {children}
    </section>
  );
}

/* ---------- imagem que se revela (cortina de baixo para cima + zoom saindo) ---------- */
export function RevealImage({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  // observa o contêiner externo: o clip-path do interno zeraria a área visível e o observer nunca dispararia
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      <div
        className="absolute inset-0 overflow-hidden transition-[clip-path] duration-[1.4s] ease-[cubic-bezier(0.77,0,0.18,1)]"
        style={{ clipPath: shown ? "inset(0 0 0 0 round 6px)" : "inset(100% 0 0 0 round 6px)", transitionDelay: `${delay}ms` }}
      >
        <div className="absolute inset-0 transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: shown ? "none" : "scale(1.25)", transitionDelay: `${delay}ms` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
