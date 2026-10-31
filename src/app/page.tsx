import Image from "next/image";
import { Cursor, SmoothScroll, Split } from "@/components/FX";
import { BackButton } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { ContactForm, Expertise, Faq, Featured, GiantName, Header, Hero, Philosophy, PillLink, Process, Projects, Statement, Stats, Testimonials, Videos } from "@/components/Site";
import { IconInstagram, IconPin, IconWhatsapp } from "@/components/Icons";
import { nav, stats, studio } from "@/lib/data";
import { asset } from "@/lib/base-path";
import { wrap } from "@/lib/ui";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <BackButton />
      <Header />
      <main>
        <Hero />

        {/* Estúdio */}
        <section id="estudio" data-title="Estúdio" className="py-20 md:py-28">
          <div className={wrap}>
            <Statement />
            <div className="mt-3">
              <Stats items={stats} />
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" data-title="Projetos" className="tone-dark bg-night py-16 md:py-24">
          <div className={wrap}>
            <Projects />
          </div>
        </section>

        {/* Mostra */}
        <section id="mostra" data-title="Mostra Artefacto" className="py-16 md:py-24">
          <div className={wrap}>
            <Featured />
          </div>
        </section>

        {/* Expertise */}
        <section id="expertise" data-title="Expertise" className="py-16 md:py-24">
          <div className={wrap}>
            <div className="mb-10 grid gap-6 md:grid-cols-[1fr_17rem] md:items-end">
              <div>
                <p className="eyebrow text-cream/75">Expertise</p>
                <Split text="Espaços pensados. Detalhes com propósito." className="t-h1 mt-4 max-w-[34rem]" />
              </div>
              <p className="text-[0.95rem] text-cream/75">Passe o mouse (ou toque) para girar cada cartão e ver o que entra em cada serviço.</p>
            </div>
            <Expertise />
          </div>
        </section>

        {/* Processo */}
        <section id="processo" data-title="Processo" className="py-16 md:py-24">
          <div className={wrap}>
            <div className="mb-10 grid gap-6 md:grid-cols-[1fr_17rem] md:items-end">
              <div>
                <p className="eyebrow text-cream/75">Processo</p>
                <Split text="Do primeiro traço à casa pronta." className="t-h1 mt-4 max-w-[30rem]" />
              </div>
              <p className="text-[0.95rem] text-cream/75">Uma casa onde você entra e mora, sem sentir que ainda falta alguma coisa.</p>
            </div>
            <Process />
            <div className="mt-8 flex justify-center">
              <PillLink href={studio.whatsapp}>Começar um projeto</PillLink>
            </div>
          </div>
        </section>

        {/* Filosofia + 3D */}
        <section id="filosofia" data-title="Filosofia" className="py-16 md:py-24">
          <div className={wrap}>
            <Philosophy />
          </div>
        </section>

        {/* Vídeos */}
        <section id="videos" data-title="Vídeos" className="overflow-hidden py-16 md:py-24">
          <div className={wrap}>
            <div className="mb-10 grid gap-6 md:grid-cols-[1fr_17rem] md:items-end">
              <div>
                <p className="eyebrow text-cream/75">Em movimento</p>
                <Split text="Os projetos, por dentro." className="t-h1 mt-4" />
              </div>
              <p className="text-[0.95rem] text-cream/75">Arraste ou use as setas. Clique no vídeo da frente para assistir com som.</p>
            </div>
            <Videos />
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" data-title="Depoimentos" className="py-16 md:py-24">
          <div className={wrap}>
            <div className="mb-10 grid gap-6 md:grid-cols-[1fr_17rem] md:items-end">
              <div>
                <p className="eyebrow text-cream/75">Palavras gentis</p>
                <Split text="Os espaços falam. As pessoas também." className="t-h1 mt-4 max-w-[30rem]" />
              </div>
              <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-[0.95rem] text-cream/75 underline-offset-4 hover:underline">
                {studio.rating} no Google · {studio.reviewCount} avaliações ↗
              </a>
            </div>
            <Testimonials />
          </div>
        </section>

        {/* Perguntas */}
        <section id="perguntas" data-title="Perguntas" className="py-16 md:py-24">
          <div className={`${wrap} grid gap-10 md:grid-cols-[1fr_1.5fr]`}>
            <div>
              <p className="eyebrow text-cream/75">Perguntas</p>
              <Split text="Antes de você chamar." className="t-h1 mt-4" />
            </div>
            <Faq />
          </div>
        </section>

        {/* Contato */}
        <section id="contato" data-title="Contato" className="py-16 md:py-24">
          <div className={`${wrap} grid gap-3 md:grid-cols-2`}>
            <Reveal className="tone-accent rounded-[18px] bg-wine p-6 md:p-10">
              <p className="eyebrow text-cream/90">Vamos conversar</p>
              <Split text="Vamos criar algo extraordinário." className="t-h1 mt-4 max-w-[24rem]" />
              <p className="mt-4 max-w-[24rem] text-cream/80">Todo espaço significativo começa com uma conversa. Preencha e a mensagem abre pronta no WhatsApp.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Reveal>
            <Reveal className="relative min-h-[22rem] overflow-hidden rounded-[18px]" delay={120}>
              <Image src={asset("/img/altiplano-vinho-0.webp")} alt="Espaço do vinho no living social do Apartamento Altiplano" fill quality={90} sizes="(min-width: 768px) 580px, 100vw" className="object-cover" />
              <div className="tone-dark absolute inset-x-3 bottom-3 rounded-[12px] bg-night/80 p-4 text-[0.9rem] backdrop-blur-md">
                <p className="flex gap-2">
                  <IconPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {studio.address}
                  </a>
                </p>
                <p className="mt-2 text-cream/75">
                  <a href={studio.phoneHref} className="hover:text-cream">
                    {studio.phone}
                  </a>{" "}
                  ·{" "}
                  <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                    WhatsApp {studio.whatsappLabel}
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="p-2 md:p-3">
        <div className="tone-dark overflow-hidden rounded-[18px] bg-night pt-14">
          <div className={`${wrap} grid gap-10 md:grid-cols-[1.4fr_0.6fr_0.6fr_1fr]`}>
            <div>
              <Image src={asset("/img/logo-claro.png")} alt="Monograma Tainá Andrade" width={36} height={42} unoptimized className="mb-6 h-10 w-auto" />
              <p className="eyebrow text-cream/80">Vamos conversar</p>
              <p className="mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.08] tracking-[-0.035em]">
                Um espaço em mente?
                <br />
                Vamos dar uma história a ele.
              </p>
              <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-[0.95rem] hover:underline">
                <IconWhatsapp className="h-4 w-4" /> {studio.whatsappLabel} ↗
              </a>
            </div>
            <nav aria-label="Navegação do rodapé">
              <p className="eyebrow text-cream/80">Navegue</p>
              <ul className="mt-3 space-y-1.5 text-[0.92rem]">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="hover:underline">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="eyebrow text-cream/80">Social</p>
              <a href={studio.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 text-[0.92rem] hover:underline">
                <IconInstagram className="h-4 w-4" /> Instagram ↗
              </a>
            </div>
            <div>
              <p className="eyebrow text-cream/80">Estúdio</p>
              <p className="mt-3 text-[0.92rem] leading-relaxed">{studio.address}</p>
              <p className="mt-2 text-[0.85rem] text-cream/70">{studio.hours}</p>
            </div>
          </div>
          <div className={`${wrap} mt-12 flex flex-wrap justify-between gap-3 border-t border-cream/20 pt-5 text-[0.75rem] text-cream/70`}>
            <p>© 2026 Tainá Andrade Arquitetura</p>
            <p>Arquitetura de alto padrão · João Pessoa, PB</p>
            <a href="#inicio" className="hover:text-cream">
              Voltar ao topo ↑
            </a>
          </div>
          <div className={wrap}>
            <GiantName />
          </div>
        </div>
      </footer>
    </>
  );
}
