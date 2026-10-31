"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { expertise, faq, nav, philosophy, projects, steps, studio, testimonials, videos, whatsappLink } from "@/lib/data";
import { asset } from "@/lib/base-path";
import { wrap } from "@/lib/ui";
import { IconInstagram, IconPlus, IconRight, IconStar, IconWhatsapp } from "./Icons";
import { Magnetic, RevealImage } from "./FX";
import { useHistoryLayer } from "./Nav";
import { HeroScene, RingScene, useWebGL } from "./Three";

/* ---------- utilitários ---------- */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(clamp((window.innerHeight - r.top) / (r.height + window.innerHeight)));
    };
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p] as const;
}

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setV(true), io.disconnect()), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, v] as const;
}

/** Esc fecha, rolagem travada e janela ligada ao histórico (voltar do celular fecha). */
function useLayer(open: boolean, close: () => void, extra?: (e: KeyboardEvent) => void) {
  useHistoryLayer(open, close);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      extra?.(e);
    };
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", k);
    };
  }, [open, close, extra]);
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="pill border border-cream/25 text-cream hover:bg-cream hover:text-night">
      ← Voltar
    </button>
  );
}

/** Botão em pílula com círculo e seta (como no Casa Interior). */
export function PillLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  const ext = href.startsWith("http");
  return (
    <Magnetic strength={0.2}>
      <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`pill group gap-3 py-1.5 pl-5 pr-1.5 ${dark ? "bg-night text-cream" : "bg-cream text-night"}`}>
        <span>{children}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-[-45deg] ${dark ? "bg-cream text-night" : "bg-night text-cream"}`}>
          <IconRight />
        </span>
      </a>
    </Magnetic>
  );
}

/* ---------- cabeçalho ---------- */
export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useLayer(open, close);
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (y > 500 && y > last + 2) setHidden(true);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header className={`tone-dark fixed inset-x-0 top-0 z-50 bg-transparent transition-transform duration-500 ${hidden && !open ? "-translate-y-full" : ""}`}>
        <div className={`${wrap} flex h-[4.5rem] items-center justify-between`}>
          <a href="#inicio" data-no-back onClick={close} className="pill gap-2.5 bg-night/95 py-1.5 pl-2 text-[0.8rem] font-medium tracking-[0.04em] text-cream">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-linen">
              <Image src={asset("/img/logo-grafite.png")} alt="" width={12} height={14} unoptimized className="h-3.5 w-auto" />
            </span>
            TAINÁ ANDRADE
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="pill gap-3 bg-night/95 text-[0.8rem] text-cream">
            {open ? "Fechar" : "Menu"}
            <span className="flex w-4 flex-col gap-[4px]">
              <span className={`h-px w-4 bg-current transition-transform ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-current transition-transform ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>
      {/* menu: painel que desce com perspectiva 3D */}
      <div className={`fixed inset-0 z-40 [perspective:1400px] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-espresso/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`} onClick={close} />
        <div
          className="tone-accent absolute right-4 top-20 w-[min(26rem,calc(100%-2rem))] origin-top rounded-[18px] bg-wine p-6 text-cream shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:right-[max(2rem,calc((100vw-1160px)/2))]"
          style={{ transform: open ? "rotateX(0deg)" : "rotateX(-70deg) translateY(-20px)", opacity: open ? 1 : 0 }}
        >
          <nav aria-label="Menu principal">
            {nav.map((n, i) => (
              <a key={n.href} href={n.href} tabIndex={open ? 0 : -1} onClick={close} className="group flex items-baseline justify-between border-b border-cream/15 py-3 text-[1.9rem] leading-none tracking-[-0.03em]" style={{ transition: `opacity .5s ${0.15 + i * 0.05}s, transform .5s ${0.15 + i * 0.05}s`, opacity: open ? 1 : 0, transform: open ? "none" : "translateY(12px)" }}>
                <span className="transition-transform duration-500 group-hover:translate-x-2">{n.label}</span>
                <span className="text-[0.75rem] text-cream/75">0{i + 1}</span>
              </a>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-1 text-[0.9rem] text-cream/80">
            <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="hover:text-cream">
              WhatsApp {studio.whatsappLabel} ↗
            </a>
            <a href={studio.instagram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="hover:text-cream">
              Instagram ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- topo: fotos em 3D + nome gigante ---------- */
const heroImgs = ["/img/3d/altiplano-living-0.webp", "/img/3d/brisa-0.webp", "/img/3d/memorias-0.webp", "/img/3d/campo-0.webp", "/img/3d/altiplano-lavabo-0.webp", "/img/3d/villa-0.webp", "/img/3d/clinica-0.webp", "/img/3d/neoclassica-0.webp", "/img/3d/piano-0.webp"];

export function Hero() {
  const gl = useWebGL();
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      // depois que o topo sai da tela o valor para de mudar e o React não redesenha mais
      raf = requestAnimationFrame(() => setY(Math.min(window.scrollY, Math.round(window.innerHeight * 1.2))));
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const k = reduced() ? 0 : clamp(y / 800);
  return (
    <section id="inicio" data-title="o início" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-night p-2 md:p-3">
      <div className="tone-dark relative h-full overflow-hidden rounded-[18px] bg-espresso">
        {/* sem WebGL: a foto do living em tela cheia */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${gl ? "opacity-30" : "opacity-100"}`}>
          <Image src={asset("/img/altiplano-living-0.webp")} alt="Living social do Apartamento Altiplano, projeto de Tainá Andrade" fill priority quality={85} sizes="100vw" className="animate-[kenburns_3s_cubic-bezier(0.16,1,0.3,1)_both] object-cover" />
        </div>
        {gl && <HeroScene images={heroImgs} />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-espresso/50" />

        <div className={`${wrap} pointer-events-none relative flex h-full flex-col justify-end pb-6 md:pb-8`} style={{ opacity: 1 - k * 1.2 }}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[24rem] animate-[fadeUp_1s_0.9s_both] text-[1rem] leading-snug text-cream/90 md:text-[1.05rem]">
              Arquitetura de alto padrão em João Pessoa. 18 anos de projetos autorais e personalizados, moldados pelo material, pela emoção e pelo cuidado em cada detalhe.
            </p>
            <div className="pointer-events-auto animate-[fadeUp_1s_1.1s_both]">
              <PillLink href="#projetos">Explore os projetos</PillLink>
            </div>
          </div>
          <h1 className="giant overflow-hidden pt-[0.14em] text-cream" aria-label="Tainá Andrade">
            <span className="flex justify-between" aria-hidden>
              {"TAINÁ ANDRADE".split("").map((c, i) => (
                <span key={i} className="inline-block animate-[riseIn_1.2s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${0.3 + i * 0.045}s`, transform: `translateY(${k * (i % 2 ? 40 : 20)}px)` }}>
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          </h1>
        </div>
        <div className={`${wrap} pointer-events-none absolute inset-x-0 top-24 hidden justify-end md:flex`}>
          <p className="animate-[fadeUp_1s_1.4s_both] text-[0.72rem] uppercase tracking-[0.12em] text-cream/75">Mova o mouse · role para entrar</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- manifesto: palavras que acendem num cartão vinho ---------- */
export function Statement() {
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const text = "Eu acredito que o verdadeiro luxo está em se sentir bem, cercado de quem amamos. Cada detalhe é uma oportunidade de criar algo que permaneça.";
  const words = text.split(" ");
  const lit = Math.round(clamp((p - 0.18) / 0.4) * words.length);
  const tilt = (p - 0.5) * -10;
  return (
    <div ref={ref} className="[perspective:1600px]">
      <div className="tone-accent rounded-[18px] bg-wine px-6 py-16 text-center transition-transform duration-300 md:px-16 md:py-24" style={{ transform: reduced() ? "none" : `rotateX(${tilt}deg)` }}>
        <p className="eyebrow text-cream/90">O estúdio</p>
        <p className="mx-auto mt-6 max-w-[46rem] text-[clamp(1.55rem,3vw,2.6rem)] leading-[1.15] tracking-[-0.03em]">
          {words.map((w, i) => (
            <span key={i} className="transition-colors duration-300" style={{ color: i < lit ? "var(--color-cream)" : "color-mix(in srgb, var(--c-fg) 38%, transparent)" }}>
              {w}{" "}
            </span>
          ))}
        </p>
        <p className="mx-auto mt-8 max-w-[36rem] text-[0.98rem] leading-relaxed text-cream/80">
          À frente da Tainá Andrade Arquitetura, assino projetos de arquitetura e interiores que unem materiais nobres, marcenaria precisa e paisagismo, e acompanho cada obra até a casa estar pronta para ser vivida.
        </p>
      </div>
    </div>
  );
}

/* ---------- projetos: anel 3D grande + galeria grande do projeto da frente ---------- */
type Media = { type: "img"; src: string } | { type: "video"; slug: string };
const mediaOf = (p: (typeof projects)[number]): Media[] => [...p.gallery.map((src) => ({ type: "img" as const, src })), ...(p.videos ?? []).map((slug) => ({ type: "video" as const, slug }))];

export function Projects() {
  const gl = useWebGL();
  const [open, setOpen] = useState<{ p: number; m: number } | null>(null);
  const [front, setFront] = useState(0);
  // a galeria grande só troca quando o anel para (antes, remontava a cada projeto que passava no arrasto)
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setShown(front), 380);
    return () => clearTimeout(t);
  }, [front]);
  const frontRef = useRef(0);
  useEffect(() => {
    frontRef.current = front;
  }, [front]);
  const rot = useRef(0);
  const drag = useRef<{ x: number; r: number; moved: boolean } | null>(null);
  const n = projects.length;
  const step = (Math.PI * 2) / n;
  const goTo = useCallback(
    (i: number) => {
      const target = -i * step;
      const k = Math.round((rot.current - target) / (Math.PI * 2));
      rot.current = target + k * Math.PI * 2;
      setFront(i);
    },
    [step],
  );
  // funções estáveis: o 3D não é redesenhado pelo React quando o título muda
  const onSelect = useCallback((i: number) => (i === frontRef.current ? setOpen({ p: i, m: 0 }) : goTo(i)), [goTo]);
  const pr = projects[front];
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-[1fr_19rem] md:items-end">
        <div>
          <p className="eyebrow text-cream/75">Projetos selecionados</p>
          <h2 className="t-h1 mt-4">Espaços com histórias para contar.</h2>
        </div>
        <p className="text-[0.95rem] text-cream/80">Gire o anel (arraste ou use as setas) e veja as fotos e os vídeos de cada projeto logo abaixo, em tamanho grande.</p>
      </div>

      {gl && (
        <div
          className="relative mt-6 h-[42vh] min-h-[280px] cursor-grab touch-pan-y select-none active:cursor-grabbing md:h-[72vh] md:min-h-[520px]"
          data-cursor="Arraste"
          onPointerDown={(e) => (drag.current = { x: e.clientX, r: rot.current, moved: false })}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.x;
            if (Math.abs(dx) > 4) drag.current.moved = true;
            rot.current = drag.current.r + dx * 0.004;
          }}
          onPointerUp={() => {
            // ao soltar, encaixa no projeto mais próximo
            if (drag.current?.moved) rot.current = Math.round(rot.current / step) * step;
            drag.current = null;
          }}
          onPointerLeave={() => {
            if (drag.current?.moved) rot.current = Math.round(rot.current / step) * step;
            drag.current = null;
          }}
        >
          <RingScene items={projects} rot={rot} onSelect={onSelect} onFront={setFront} />
        </div>
      )}

      {/* controles do anel */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-cream/15 py-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => goTo((front - 1 + n) % n)} className="flex h-11 w-11 rotate-180 items-center justify-center rounded-full border border-cream/30 hover:bg-cream hover:text-night" aria-label="Projeto anterior">
            <IconRight />
          </button>
          <button type="button" onClick={() => goTo((front + 1) % n)} className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 hover:bg-cream hover:text-night" aria-label="Próximo projeto">
            <IconRight />
          </button>
          <div key={pr.slug} className="ml-2 animate-[fadeUp_0.5s_both]">
            <p className="text-[clamp(1.3rem,2.2vw,1.8rem)] leading-tight tracking-[-0.03em]">{pr.title}</p>
            <p className="text-[0.85rem] text-cream/75">
              {pr.kind} | {pr.place} | {pr.year}
            </p>
          </div>
        </div>
        <span className="text-[0.85rem] tabular-nums text-cream/75">
          {String(front + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </div>

      <ProjectStrip key={projects[shown].slug} index={shown} onOpen={(m) => setOpen({ p: shown, m })} />

      {/* todos os projetos */}
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-6">
        {projects.map((x, i) => (
          <button key={x.slug} type="button" onClick={() => goTo(i)} className={`group text-left transition-opacity ${i === front ? "opacity-100" : "opacity-70 hover:opacity-100"}`} aria-pressed={i === front}>
            <span className={`relative block aspect-[3/2] overflow-hidden rounded-[8px] ring-2 transition-all ${i === front ? "ring-cream" : "ring-transparent"}`}>
              <Image src={asset(x.cover)} alt="" fill quality={80} sizes="(min-width: 768px) 190px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </span>
            <span className="mt-1.5 block text-[0.85rem] leading-tight">{x.title}</span>
          </button>
        ))}
      </div>

      {open && <ProjectModal index={open.p} start={open.m} setOpen={setOpen} />}
    </div>
  );
}

/** Fotos e vídeos do projeto em faixa grande, arrastável, com setas. */
function ProjectStrip({ index, onOpen }: { index: number; onOpen: (m: number) => void }) {
  const pr = projects[index];
  const media = mediaOf(pr);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [pos, setPos] = useState(0);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-[40rem] text-[0.98rem] leading-relaxed text-cream/85">{pr.text}</p>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-[0.82rem] text-cream/75">
            {pr.gallery.length} fotos{pr.videos?.length ? ` · ${pr.videos.length} ${pr.videos.length > 1 ? "vídeos" : "vídeo"}` : ""}
          </span>
          <button type="button" onClick={() => scroll(-1)} className="flex h-10 w-10 rotate-180 items-center justify-center rounded-full bg-cream text-night" aria-label="Voltar fotos">
            <IconRight />
          </button>
          <button type="button" onClick={() => scroll(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-night" aria-label="Avançar fotos">
            <IconRight />
          </button>
        </div>
      </div>
      <div
        ref={track}
        data-cursor="Arraste"
        className="no-scrollbar -mx-4 flex items-start snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:snap-none md:px-0"
        onScroll={(e) => {
          const el = e.currentTarget;
          setPos(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !track.current) return;
          drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !track.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          track.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
        onPointerLeave={() => (drag.current = null)}
      >
        {media.map((m, i) =>
          m.type === "img" ? (
            <button
              key={m.src}
              type="button"
              onClick={() => !drag.current?.moved && onOpen(i)}
              className="group relative h-[72vw] w-[88vw] shrink-0 snap-center overflow-hidden rounded-[12px] animate-[fadeUp_0.6s_both] md:h-[64vh] md:max-h-[40rem] md:min-h-[18rem] md:w-auto"
              style={{ animationDelay: `${i * 60}ms` }}
              aria-label={`Ampliar foto ${i + 1} de ${pr.title}`}
            >
              <Image src={asset(m.src)} alt={`${pr.title}: foto ${i + 1}`} width={2400} height={1600} quality={90} sizes="(min-width: 768px) 1100px, 90vw" draggable={false} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] md:w-auto md:max-w-none" />
              <span className="absolute bottom-3 right-3 rounded-full bg-espresso/70 px-3 py-1 text-[0.75rem] text-linen opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">Ampliar ⤢</span>
            </button>
          ) : (
            <div key={m.slug} className="relative h-[72vw] w-[40.5vw] shrink-0 snap-center overflow-hidden rounded-[12px] bg-espresso md:aspect-auto md:h-[64vh] md:max-h-[40rem] md:min-h-[18rem] md:w-auto">
              <video className="h-full w-full object-cover md:w-auto" src={asset(`/video/${m.slug}.mp4`)} poster={asset(`/img/${m.slug === "filme-memorias" ? "memorias-1" : `reel-${m.slug}`}.webp`)} controls playsInline preload="none" />
              <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-espresso/70 px-3 py-1 text-[0.75rem] text-linen backdrop-blur">Vídeo</span>
            </div>
          ),
        )}
      </div>
      <div className="mt-3 h-[2px] overflow-hidden bg-cream/15">
        <div className="h-full origin-left bg-cream transition-transform duration-200" style={{ transform: `scaleX(${Math.max(0.06, pos)})` }} />
      </div>
    </div>
  );
}

/** Visualizador em tela cheia: fotos e vídeos do projeto, informações recolhíveis. */
function ProjectModal({ index, start, setOpen }: { index: number; start: number; setOpen: (v: { p: number; m: number } | null) => void }) {
  const pr = projects[index];
  const media = mediaOf(pr);
  const [img, setImg] = useState(Math.min(start, media.length - 1));
  const [info, setInfo] = useState(false);
  const close = useCallback(() => setOpen(null), [setOpen]);
  const go = useCallback((d: number) => setImg((v) => (v + d + media.length) % media.length), [media.length]);
  const keys = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    },
    [go],
  );
  useLayer(true, close, keys);
  const swipe = useRef<number | null>(null);
  const cur = media[img];
  return (
    <div className="tone-dark fixed inset-0 z-[70] flex animate-[fadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both] flex-col bg-night text-cream" role="dialog" aria-modal="true" aria-label={pr.title}>
      <div className="flex items-center justify-between gap-3 p-3 md:p-4">
        <CloseButton onClick={close} />
        <p className="truncate text-[0.95rem]">
          {pr.title} <span className="text-cream/70">· {String(img + 1).padStart(2, "0")}/{String(media.length).padStart(2, "0")}</span>
        </p>
        <button type="button" onClick={() => setInfo((v) => !v)} className="pill border border-cream/25 hover:bg-cream hover:text-night" aria-expanded={info}>
          {info ? "Fechar info" : "Sobre o projeto"}
        </button>
      </div>
      <div className="relative flex-1 touch-pan-y" onPointerDown={(e) => (swipe.current = e.clientX)} onPointerUp={(e) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 50 && cur.type === "img") go(dx < 0 ? 1 : -1);
      }}>
        {cur.type === "img" ? (
          <div key={cur.src} className="absolute inset-0 animate-[fadeUp_0.45s_both]">
            <Image src={asset(cur.src)} alt={`${pr.title}: foto ${img + 1}`} fill unoptimized sizes="100vw" className="object-contain" />
          </div>
        ) : (
          <video key={cur.slug} className="absolute inset-0 m-auto max-h-full max-w-full animate-[fadeUp_0.45s_both]" src={asset(`/video/${cur.slug}.mp4`)} poster={asset(`/img/${cur.slug === "filme-memorias" ? "memorias-1" : `reel-${cur.slug}`}.webp`)} autoPlay controls playsInline />
        )}
        <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 rotate-180 items-center justify-center rounded-full border border-cream/40 bg-espresso/70 backdrop-blur hover:bg-cream hover:text-night" aria-label="Anterior">
          <IconRight />
        </button>
        <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-cream/40 bg-espresso/70 backdrop-blur hover:bg-cream hover:text-night" aria-label="Próximo">
          <IconRight />
        </button>
        {/* informações por cima, recolhíveis */}
        <aside className={`absolute bottom-0 right-0 top-0 w-full max-w-[24rem] overflow-y-auto bg-coal/95 p-6 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${info ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!info}>
          <p className="eyebrow text-cream/75">
            {pr.kind} | {pr.year}
          </p>
          <h3 className="mt-2 text-[2rem] leading-[1.02] tracking-[-0.04em]">{pr.title}</h3>
          <p className="mt-1 text-cream/80">{pr.place}</p>
          <p className="mt-5 leading-relaxed text-cream/90">{pr.text}</p>
          {pr.facts && (
            <ul className="mt-5 space-y-1.5 border-t border-cream/15 pt-5 text-[0.95rem]">
              {pr.facts.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-sand">✦</span>
                  {f}
                </li>
              ))}
            </ul>
          )}
          {pr.credit && <p className="mt-4 text-[0.82rem] text-cream/75">{pr.credit}</p>}
        </aside>
      </div>
      {/* miniaturas */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto p-3 md:justify-center md:p-4">
        {media.map((m, k) => (
          <button key={k} type="button" onClick={() => setImg(k)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-[6px] transition-opacity ${k === img ? "opacity-100 ring-2 ring-cream" : "opacity-50 hover:opacity-90"}`} aria-label={m.type === "img" ? `Foto ${k + 1}` : "Vídeo"}>
            <Image src={asset(m.type === "img" ? m.src : `/img/${m.slug === "filme-memorias" ? "memorias-1" : `reel-${m.slug}`}.webp`)} alt="" fill quality={60} sizes="80px" className="object-cover" />
            {m.type === "video" && <span className="absolute inset-0 flex items-center justify-center bg-espresso/40 text-linen">▶</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- projeto em destaque: filme em paisagem com cartão que inclina ---------- */
export function Featured() {
  const [open, setOpen] = useState(false);
  const [m, setM] = useState({ x: 0, y: 0 });
  const close = useCallback(() => setOpen(false), []);
  useLayer(open, close);
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const vid = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = vid.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="[perspective:1800px]">
      <div
        className="tone-dark relative overflow-hidden rounded-[18px] transition-transform duration-500 ease-out"
        style={{ transform: reduced() ? "none" : `rotateX(${m.y * -4}deg) rotateY(${m.x * 5}deg) scale(${0.94 + clamp(p * 1.6) * 0.06})` }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setM({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
        }}
        onPointerLeave={() => setM({ x: 0, y: 0 })}
      >
        <div className="relative aspect-[4/5] md:aspect-[16/8]">
          <video ref={vid} className="absolute inset-0 h-full w-full object-cover" src={asset("/video/filme-memorias-preview.mp4")} poster={asset("/img/memorias-1.webp")} muted loop playsInline preload="none" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/35 to-night/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ transform: `translate(${m.x * -14}px, ${m.y * -10}px)` }}>
            <p className="eyebrow text-cream/75">Projeto em destaque · Mostra Artefacto 2026</p>
            <h2 className="mt-4 text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.95] tracking-[-0.05em]">
              Living de
              <br />
              Memórias.
            </h2>
            <p className="mt-4 max-w-[26rem] text-[0.98rem] text-cream/85">A casa dos meus avós, as venezianas, a madeira e o aconchego que o tempo amadurece, mas nunca apaga.</p>
            <button type="button" onClick={() => setOpen(true)} className="pill mt-6 gap-3 bg-cream py-1.5 pl-5 pr-1.5 text-night">
              Assistir ao filme
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night text-cream">▶</span>
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="tone-dark fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-night/96 p-4" role="dialog" aria-modal="true" aria-label="Filme do Living de Memórias">
          <div className="absolute left-4 top-4 md:left-8 md:top-8">
            <CloseButton onClick={close} />
          </div>
          <video className="max-h-[80vh] w-full max-w-5xl animate-[fadeUp_0.6s_both] rounded-[12px]" src={asset("/video/filme-memorias.mp4")} poster={asset("/img/memorias-1.webp")} autoPlay controls playsInline />
        </div>
      )}
    </div>
  );
}

/* ---------- expertise: cartões que giram em 3D ---------- */
export function Expertise() {
  const [flip, setFlip] = useState<number | null>(null);
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {expertise.map((e, i) => (
        <button
          key={e.title}
          type="button"
          onMouseEnter={() => setFlip(i)}
          onMouseLeave={() => setFlip(null)}
          onClick={() => setFlip(flip === i ? null : i)}
          className="group relative h-[26rem] text-left [perspective:1400px]"
          aria-label={`${e.title}: ${e.items.join(", ")}`}
        >
          <div className="relative h-full w-full transition-transform duration-[0.9s] ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d]" style={{ transform: flip === i ? "rotateY(180deg)" : "none" }}>
            {/* frente */}
            <div className="tone-dark absolute inset-0 overflow-hidden rounded-[18px] [backface-visibility:hidden]">
              <Image src={asset(e.image)} alt="" fill quality={88} sizes="(min-width: 768px) 380px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 text-[1.8rem] tracking-[-0.03em]">{e.title}.</p>
              <span className="absolute right-4 top-4 rounded-full bg-night/60 px-3 py-1 text-[0.72rem] backdrop-blur">0{i + 1} · girar</span>
            </div>
            {/* verso */}
            <div className="absolute inset-0 flex flex-col justify-between rounded-[18px] bg-coal p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-[1.8rem] tracking-[-0.03em]">{e.title}.</p>
              <ul className="space-y-2.5">
                {e.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[0.95rem] text-cream/85">
                    <span className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-cream/15 text-[0.65rem]">↗</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ---------- processo: linha do tempo com foto presa ---------- */
export function Process() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <div className="grid gap-8 rounded-[18px] bg-coal p-5 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:p-10">
      <div className="relative hidden md:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[14px] [perspective:1200px]">
          {steps.map((s, i) => (
            <div key={s.n} className="absolute inset-0 transition-all duration-[0.9s] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: i === active ? 1 : 0, transform: i === active ? "none" : `rotateX(${i < active ? 20 : -20}deg) scale(1.05)` }}>
              <Image src={asset(s.image)} alt={s.title} fill quality={88} sizes="460px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative hidden w-px bg-cream/15 md:block">
        <div className="absolute inset-x-0 top-0 bg-cream transition-all duration-700" style={{ height: `${((active + 1) / steps.length) * 100}%` }} />
      </div>
      <div className="space-y-4 md:space-y-[18vh] md:py-[12vh]">
        {steps.map((s, i) => (
          <div key={s.n} ref={(el) => void (refs.current[i] = el)} data-i={i} className={`rounded-[14px] border p-6 transition-all duration-500 ${i === active ? "border-cream/25 bg-night" : "border-transparent bg-night/40 opacity-75"}`}>
            <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[10px] md:hidden">
              <Image src={asset(s.image)} alt="" fill quality={85} sizes="100vw" className="object-cover" />
            </div>
            <p className="text-[0.75rem] text-cream/75">{s.n}</p>
            <p className="mt-2 text-[1.5rem] tracking-[-0.03em]">{s.title}</p>
            <p className="mt-2 leading-relaxed text-cream/80">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- filosofia + escultura 3D de arcos ---------- */
export function Philosophy() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_1.05fr]">
      <RevealImage className="tone-dark group relative aspect-[4/5] overflow-hidden rounded-[18px] bg-espresso md:aspect-auto md:h-[36rem]">
        <Image src={asset("/img/taina-retrato.webp")} alt="Tainá Andrade, arquiteta" fill quality={90} sizes="(min-width: 768px) 560px, 100vw" className="object-cover object-[50%_30%] transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
        <div className="absolute inset-x-3 bottom-3 rounded-[12px] bg-night/80 p-4">
          <p className="text-[1.1rem] tracking-[-0.02em]">Tainá Andrade</p>
          <p className="text-[0.82rem] text-cream/80">Arquiteta · 18 anos de projetos autorais</p>
        </div>
      </RevealImage>
      <div>
        <p className="eyebrow text-cream/75">Nossa filosofia</p>
        <h2 className="t-h1 mt-4">Projetar também é pensar no tempo.</h2>
        <div className="mt-8 border-t border-cream/15">
          {philosophy.map((f, i) => (
            <div key={f.title} className="border-b border-cream/15">
              <button type="button" onClick={() => setOpen(i)} aria-expanded={open === i} className="group flex w-full items-center justify-between gap-4 py-4 text-left">
                <span className={`text-[1.3rem] tracking-[-0.02em] transition-all duration-500 ${open === i ? "translate-x-0 text-cream" : "text-cream/75 group-hover:translate-x-2 group-hover:text-cream"}`}>{f.title}</span>
                <span className={`transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>
                  <IconPlus />
                </span>
              </button>
              <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
                <div className="overflow-hidden">
                  <p className="max-w-[30rem] pb-5 text-cream/80">{f.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- vídeos: carrossel em leque 3D ---------- */
export function Videos() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useLayer(open !== null, close);
  const start = useRef<number | null>(null);
  const n = videos.length;
  const go = (d: number) => setActive((v) => (v + d + n) % n);
  const v = videos.find((x) => x.slug === open);
  // o vídeo da frente só toca (e só baixa) enquanto o leque está na tela
  const fan = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = fan.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div
        ref={fan}
        className="relative h-[30rem] touch-pan-y select-none [perspective:1600px] md:h-[34rem]"
        onPointerDown={(e) => (start.current = e.clientX)}
        onPointerUp={(e) => {
          if (start.current === null) return;
          const dx = e.clientX - start.current;
          start.current = null;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
        data-cursor="Arraste"
      >
        {videos.map((x, i) => {
          let d = i - active;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const ad = Math.abs(d);
          const isActive = d === 0;
          return (
            <VideoCard key={x.slug} x={x} active={isActive} playing={isActive && inView} onClick={() => (isActive ? setOpen(x.slug) : setActive(i))} style={{ transform: `translateX(calc(-50% + ${d * 62}%)) translateZ(${-ad * 140}px) rotateY(${d * -22}deg)`, zIndex: 10 - ad, opacity: ad > 2 ? 0 : 1 - ad * 0.22 }} />
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(-1)} className="flex h-11 w-11 rotate-180 items-center justify-center rounded-full border border-cream/25 hover:bg-cream hover:text-night" aria-label="Vídeo anterior">
          <IconRight />
        </button>
        <p className="min-w-[12rem] text-center">
          <span className="block text-[1.1rem] tracking-[-0.02em]">{videos[active].title}</span>
          <span className="text-[0.82rem] text-cream/80">
            {videos[active].text} · {videos[active].views} visualizações
          </span>
        </p>
        <button type="button" onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 hover:bg-cream hover:text-night" aria-label="Próximo vídeo">
          <IconRight />
        </button>
      </div>
      {v && (
        <div className="tone-dark fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-night/96 p-4" role="dialog" aria-modal="true" aria-label={v.title}>
          <div className="absolute left-4 top-4 md:left-8 md:top-8">
            <CloseButton onClick={close} />
          </div>
          <video className="max-h-[80vh] w-auto max-w-full animate-[fadeUp_0.6s_both] rounded-[12px]" src={asset(`/video/${v.slug}.mp4`)} poster={asset(`/img/reel-${v.slug}.webp`)} autoPlay controls playsInline />
          <p className="text-[0.85rem] text-cream/80">
            {v.title} · {v.views} visualizações
          </p>
        </div>
      )}
    </>
  );
}

function VideoCard({ x, active, playing, onClick, style }: { x: (typeof videos)[number]; active: boolean; playing: boolean; onClick: () => void; style: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing && !reduced()) el.play().catch(() => {});
    else el.pause();
  }, [playing]);
  return (
    <button type="button" onClick={onClick} className="absolute left-1/2 top-0 aspect-[9/16] h-full overflow-hidden rounded-[16px] bg-coal shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={style} aria-label={active ? `Assistir: ${x.title}` : `Mostrar: ${x.title}`}>
      <video ref={ref} className="h-full w-full object-cover" src={asset(`/video/${x.slug}-preview.mp4`)} poster={asset(`/img/reel-${x.slug}.webp`)} muted loop playsInline preload="none" />
      <span className={`absolute inset-0 bg-night transition-opacity duration-700 ${active ? "opacity-0" : "opacity-45"}`} />
      {active && <span className="absolute bottom-4 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-cream text-night">▶</span>}
    </button>
  );
}

/* ---------- depoimentos (Google) ---------- */
export function Testimonials() {
  const [i, setI] = useState(0);
  const n = testimonials.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || reduced()) return;
    const t = setTimeout(() => go(1), 7000);
    return () => clearTimeout(t);
  }, [i, paused, go]);
  const t = testimonials[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="grid gap-3 md:grid-cols-[0.75fr_1.25fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] [perspective:1200px] md:aspect-auto md:min-h-[24rem]">
          {testimonials.map((x, k) => (
            <div key={x.name} className="absolute inset-0 transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: k === i ? 1 : 0, transform: k === i ? "none" : "rotateY(-18deg) scale(1.06)" }}>
              <Image src={asset(x.image)} alt="" fill quality={88} sizes="(min-width: 768px) 440px, 100vw" className="object-cover" />
            </div>
          ))}
          <div className="tone-dark absolute inset-x-3 bottom-3 rounded-[12px] bg-night/80 p-4 backdrop-blur-md">
            <p key={t.name} className="animate-[fadeUp_0.6s_both] text-[1.15rem] tracking-[-0.02em]">
              {t.name}
            </p>
            <p className="text-[0.8rem] text-cream/80">{t.detail}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-[18px] bg-coal p-6 md:p-9">
          <div className="flex items-center justify-between">
            <span className="flex text-sand">
              {[0, 1, 2, 3, 4].map((k) => (
                <IconStar key={k} className="h-3.5 w-3.5" />
              ))}
            </span>
            <span className="text-[0.78rem] tabular-nums text-cream/75">
              {String(i + 1).padStart(2, "0")} | {String(n).padStart(2, "0")}
            </span>
          </div>
          <blockquote key={i} className="my-10 text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.3] tracking-[-0.02em]">
            {`“${t.text}”`.split(" ").map((w, k) => (
              <span key={k} className="inline-block animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: `${k * 22}ms` }}>
                {w}&nbsp;
              </span>
            ))}
          </blockquote>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => go(-1)} className="flex h-10 w-10 rotate-180 items-center justify-center rounded-full bg-cream text-night" aria-label="Anterior">
              <IconRight />
            </button>
            <button type="button" onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-night" aria-label="Próximo">
              <IconRight />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6">
        {testimonials.map((x, k) => (
          <button key={x.name} type="button" onClick={() => setI(k)} className={`border-b pb-2 text-left text-[0.8rem] transition-colors ${k === i ? "border-cream text-cream" : "border-cream/15 text-cream/75 hover:text-cream"}`}>
            {x.name.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- números ---------- */
export function Stats({ items }: { items: { value: number; suffix: string; label: string }[] }) {
  const [ref, v] = useInView<HTMLDivElement>(0.4);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!v) return;
    let raf = 0;
    const s = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - s) / 1600, 1);
      setN(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v]);
  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((s, i) => (
        <div key={s.label} className="rounded-[18px] bg-coal p-5 transition-all duration-700 [perspective:800px]" style={{ transitionDelay: `${i * 90}ms`, opacity: v ? 1 : 0, transform: v ? "none" : "rotateX(-40deg) translateY(30px)" }}>
          <p className="text-[clamp(2.4rem,4.4vw,3.6rem)] leading-none tracking-[-0.05em]">
            {Math.round(s.value * n)}
            {s.suffix}
          </p>
          <p className="mt-3 text-[0.88rem] text-cream/70">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- perguntas ---------- */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-cream/15">
      {faq.map((f, i) => (
        <div key={f.q} className="border-b border-cream/15">
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="group flex w-full items-center justify-between gap-6 py-5 text-left">
            <span className="text-[1.15rem] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1.5">{f.q}</span>
            <span className={`transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>
              <IconPlus />
            </span>
          </button>
          <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <p className="max-w-[40rem] pb-6 leading-relaxed text-cream/80">{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- contato ---------- */
const kinds = ["Casa", "Apartamento / interiores", "Casa de campo ou de praia", "Clínica / comercial", "Retrofit", "Empreendimento"];
export function ContactForm() {
  const [f, setF] = useState({ nome: "", cidade: "", tipo: kinds[0], msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((v) => ({ ...v, [k]: e.target.value }));
  const field = "w-full border-b border-cream/25 bg-transparent py-3 text-[0.98rem] text-cream outline-none transition-colors placeholder:text-cream/50 focus:border-cream";
  return (
    <form
      className="grid gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        window.open(whatsappLink(`Olá, Tainá! Vim pelo site.\nNome: ${f.nome}\nCidade: ${f.cidade}\nProjeto: ${f.tipo}\n${f.msg}`), "_blank", "noopener");
      }}
    >
      <input required value={f.nome} onChange={set("nome")} placeholder="Seu nome" aria-label="Seu nome" className={field} />
      <input required value={f.cidade} onChange={set("cidade")} placeholder="Sua cidade" aria-label="Sua cidade" className={field} />
      <select value={f.tipo} onChange={set("tipo")} aria-label="Tipo de projeto" className={`${field} [&>option]:text-espresso`}>
        {kinds.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <textarea value={f.msg} onChange={set("msg")} rows={3} placeholder="Conte um pouco sobre o projeto" aria-label="Mensagem" className={`${field} resize-none`} />
      <div className="mt-6">
        <button type="submit" className="pill group gap-3 bg-cream py-1.5 pl-5 pr-1.5 text-night">
          <IconWhatsapp className="h-4 w-4" /> Enviar pelo WhatsApp
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-night text-cream transition-transform duration-500 group-hover:rotate-[-45deg]">
            <IconRight />
          </span>
        </button>
      </div>
    </form>
  );
}

/* ---------- rodapé: nome gigante que sobe ---------- */
export function GiantName() {
  const [ref, v] = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="giant flex justify-between overflow-hidden pt-[calc(2rem+0.14em)] text-cream select-none" aria-hidden>
      {"TAINÁ ANDRADE".split("").map((c, i) => (
        <span key={i} className="inline-block transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: v || reduced() ? "none" : "translateY(105%) rotateX(-60deg)", transitionDelay: `${i * 50}ms` }}>
          {c === " " ? " " : c}
        </span>
      ))}
    </div>
  );
}

export { IconInstagram };
export const RevealImg = RevealImage;
