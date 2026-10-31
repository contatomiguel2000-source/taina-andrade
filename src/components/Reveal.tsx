"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}

/** Aparece suavemente ao entrar na tela. Com fade=false só marca `is-visible` (para animações próprias). */
export function Reveal({
  children,
  className = "",
  delay = 0,
  fade = true,
  threshold,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  fade?: boolean;
  threshold?: number;
  style?: React.CSSProperties;
}) {
  const [ref, visible] = useInView<HTMLDivElement>(threshold);
  return (
    <div
      ref={ref}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      className={`${fade ? "reveal" : ""} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function Counter({
  value,
  decimals = 0,
  className = "",
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const [ref, visible] = useInView<HTMLSpanElement>(0.4);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}
