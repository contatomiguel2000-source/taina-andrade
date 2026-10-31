"use client";

import { useEffect, useState } from "react";

/*
  Navegação com "voltar":
  - Ao clicar num link interno (#secao), guardamos de onde a pessoa saiu e criamos uma entrada no histórico.
    Aparece o botão "Voltar para ..." e o botão voltar do navegador/celular também leva de volta ao ponto exato.
  - Janelas (projeto, fotos, vídeos) também entram no histórico: o voltar do celular fecha a janela.
*/

type JumpState = { kind: "jump"; from: number; label: string };
type LayerState = { kind: "layer"; id: number };
type NavState = JumpState | LayerState | null;

let current: NavState = null;
const listeners = new Set<(s: NavState) => void>();
const setCurrent = (s: NavState) => {
  current = s;
  listeners.forEach((l) => l(s));
};

const scrollToY = (y: number) => {
  if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: "smooth" });
};

/** Nome da seção onde a pessoa está (usa data-title das seções). */
function sectionLabel(y: number) {
  let label = "o início";
  document.querySelectorAll<HTMLElement>("[data-title]").forEach((s) => {
    if (s.getBoundingClientRect().top + window.scrollY <= y + window.innerHeight * 0.35) label = s.dataset.title!;
  });
  return label;
}

let layerSeq = 0;
const closers = new Map<number, () => void>();

/** Liga uma janela (modal) ao histórico: o voltar do celular fecha a janela. */
export function useHistoryLayer(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const id = ++layerSeq;
    closers.set(id, close);
    const st: LayerState = { kind: "layer", id };
    history.pushState(st, "");
    setCurrent(st);
    return () => {
      closers.delete(id);
      // fechou pelo botão/Esc: desfaz a entrada do histórico sem mexer na rolagem
      if (history.state?.kind === "layer" && history.state.id === id) history.back();
    };
  }, [open, close]);
}

/** Botão "Voltar" + controle do histórico. Colocar uma vez na página. */
export function BackButton() {
  const [state, setState] = useState<NavState>(null);
  useEffect(() => {
    const l = (s: NavState) => setState(s);
    listeners.add(l);

    // links internos: guarda o ponto de saída antes do Lenis rolar
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = a?.getAttribute("href");
      if (!a || !href || href === "#") return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      // a rolagem é feita aqui (e não pelo navegador), senão o salto de âncora dispara um popstate vazio
      e.preventDefault();
      if (a.dataset.noBack === undefined) {
        const y = window.scrollY;
        const st: JumpState = { kind: "jump", from: y, label: sectionLabel(y) };
        history.pushState(st, "", href);
        setCurrent(st);
      }
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -64, duration: 1.2 });
      else target.scrollIntoView({ behavior: "smooth" });
    };

    const onPop = (e: PopStateEvent) => {
      const prev = current;
      if (prev?.kind === "layer") {
        closers.get(prev.id)?.(); // voltar com janela aberta: fecha a janela
      } else if (prev?.kind === "jump") {
        scrollToY(prev.from); // voltar depois de um salto: retorna ao ponto exato
      }
      setCurrent((e.state as NavState) ?? null);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      listeners.delete(l);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const jump = state?.kind === "jump" ? state : null;
  return (
    <button
      type="button"
      onClick={() => history.back()}
      className={`fixed bottom-5 left-4 z-[65] flex items-center gap-3 border border-cream/25 bg-wine py-3 pl-3 pr-5 ring-1 ring-ink/10 text-left text-cream shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-night md:bottom-8 md:left-8 ${
        jump ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-hidden={!jump}
      tabIndex={jump ? 0 : -1}
    >
      <span className="flex h-8 w-8 items-center justify-center border border-cream/30 text-lg leading-none">←</span>
      <span className="leading-tight">
        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-cream/70">Voltar para</span>
        <span className="block text-[0.85rem] font-semibold uppercase tracking-[0.02em]">{jump?.label ?? ""}</span>
      </span>
    </button>
  );
}
