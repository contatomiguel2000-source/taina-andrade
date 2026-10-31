// Conteúdo real: Instagram @tainaandrade.arq (bio, legendas, destaques), Linktree e Google Maps.

const whatsappNumber = "558391223345";

export const studio = {
  name: "Tainá Andrade",
  office: "Tainá Andrade Arquitetura",
  city: "João Pessoa, PB",
  address: "Tour Genève, R. Ana Guedes de Vasconcelos, 81, sala 807, Altiplano Cabo Branco, João Pessoa (PB)",
  phone: "(83) 3034-4058",
  phoneHref: "tel:+558330344058",
  whatsappLabel: "(83) 9122-3345",
  whatsappNumber,
  whatsapp: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá, Tainá! Vim pelo site e quero conversar sobre um projeto.")}`,
  instagram: "https://www.instagram.com/tainaandrade.arq/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Tain%C3%A1+Andrade+Arquitetura+Jo%C3%A3o+Pessoa",
  hours: "Seg. a sex., a partir das 8h",
  rating: "5,0",
  reviewCount: 20,
};

export function whatsappLink(text: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { label: "Estúdio", href: "#estudio" },
  { label: "Projetos", href: "#projetos" },
  { label: "Mostra", href: "#mostra" },
  { label: "Expertise", href: "#expertise" },
  { label: "Vídeos", href: "#videos" },
  { label: "Contato", href: "#contato" },
];

export const stats = [
  { value: 18, suffix: "", label: "anos de experiência" },
  { value: 15, suffix: "", label: "anos de escritório, celebrados em 2025" },
  { value: 7, suffix: "", label: "projetos no Condomínio das Américas" },
  { value: 5, suffix: ",0", label: "no Google, com 20 avaliações" },
];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  place: string;
  year: string;
  cover: string;
  tex: string; // textura do anel 3D (1800px, 3:2)
  videos?: string[]; // vídeos do projeto (slug em /video), entram na galeria
  text: string;
  facts?: string[];
  gallery: string[];
  credit?: string;
};

export const projects: Project[] = [
  {
    slug: "altiplano",
    videos: ["living-social","lavabo","banho-master"],
    title: "Apartamento Altiplano",
    kind: "Residencial",
    place: "Altiplano Cabo Branco, João Pessoa",
    year: "2026",
    cover: "/img/altiplano-living-0.webp",
    tex: "/img/ring/altiplano-living-0.webp",
    text: "Um living social pensado para acolher, reunir e criar boas memórias. Do hall à adega climatizada, da cozinha ao lavabo em mármore Marrom Imperial: texturas, tons envolventes e uma atmosfera de conforto. Acompanhamos até o fim, com a casa montada e pronta para ser vivida.",
    facts: ["Living social com espaço do vinho", "Lavabo em mármore Marrom Imperial", "Sala de banho em mármore Matarazzo", "Acompanhamento até a entrega"],
    gallery: [
      "/img/altiplano-living-0.webp",
      "/img/altiplano-living-1.webp",
      "/img/altiplano-living-2.webp",
      "/img/altiplano-vinho-0.webp",
      "/img/altiplano-vinho-2.webp",
      "/img/altiplano-hall-0.webp",
      "/img/altiplano-cozinha-0.webp",
      "/img/altiplano-gourmet-0.webp",
      "/img/altiplano-lavabo-0.webp",
      "/img/altiplano-banho-0.webp",
      "/img/altiplano-suite-0.webp",
    ],
  },
  {
    slug: "living-de-memorias",
    videos: ["filme-memorias","memorias"],
    title: "Living de Memórias",
    kind: "Mostra Artefacto 2026",
    place: "Artefacto João Pessoa",
    year: "2026",
    cover: "/img/memorias-0.webp",
    tex: "/img/ring/memorias-0.webp",
    text: "Com o tema Maturidade, criei um ambiente inspirado na minha infância e na casa dos meus avós. Trouxe as venezianas, os tons quentes, a madeira e a sensação de aconchego daquele lar: um projeto com gostinho de casa de vó.",
    facts: ["Tema: Maturidade", "50 anos da Artefacto", "Venezianas, madeira e tons quentes"],
    gallery: ["/img/memorias-0.webp", "/img/memorias-1.webp", "/img/memorias-2.webp", "/img/memorias-3.webp", "/img/memorias-4.webp", "/img/memorias-5.webp"],
  },
  {
    slug: "casa-de-campo",
    videos: ["casa-campo"],
    title: "Casa de Campo",
    kind: "Arquitetura",
    place: "Projeto residencial",
    year: "2025",
    cover: "/img/campo-0.webp",
    tex: "/img/ring/campo-0.webp",
    text: "Uma casa de campo atemporal que se projeta sobre a paisagem sem disputar com ela. Volumes leves, estrutura sutil, madeira, travertino e brises em equilíbrio com o terreno.",
    facts: ["Madeira, travertino e brises", "Volumes sobre o declive"],
    gallery: ["/img/campo-0.webp", "/img/campo-1.webp", "/img/campo-2.webp", "/img/campo-b-0.webp", "/img/campo-b-1.webp", "/img/campo-c-0.webp", "/img/campo-c-1.webp"],
  },
  {
    slug: "casa-brisa",
    videos: ["casa-brisa"],
    title: "Casa Brisa",
    kind: "Arquitetura",
    place: "Bananeiras, PB",
    year: "2025",
    cover: "/img/brisa-0.webp",
    tex: "/img/ring/brisa-0.webp",
    text: "189 m² pensados para desacelerar. Nesta casa de campo, cada detalhe foi desenhado para abraçar o entorno e valorizar o que a natureza oferece de mais raro: silêncio, leveza e contemplação.",
    facts: ["189 m²", "Casa de campo na serra"],
    gallery: ["/img/brisa-0.webp", "/img/brisa-1.webp", "/img/brisa-2.webp", "/img/brisa-3.webp"],
  },
  {
    slug: "clinica",
    title: "Clínica Dra. Bárbara Bandeira",
    kind: "Retrofit comercial",
    place: "João Pessoa, PB",
    year: "2025",
    cover: "/img/clinica-0.webp",
    tex: "/img/ring/clinica-0.webp",
    text: "Retrofit de uma clínica dermatofuncional: linhas suaves, marcenaria sob medida e a presença do mármore constroem uma atmosfera serena. A luz natural, filtrada por tecidos leves, reforça a calma e a identidade do espaço.",
    facts: ["Retrofit completo", "Recepção em pedra natural", "Lavabo em mármore profundo"],
    gallery: ["/img/clinica-0.webp", "/img/clinica-1.webp", "/img/clinica-2.webp", "/img/clinica-b-0.webp", "/img/clinica-recepcao-0.webp", "/img/clinica-recepcao-1.webp", "/img/clinica-lavabo-0.webp"],
    credit: "Fotos: @isarolim_fotoarq",
  },
  {
    slug: "villa-mediterranea",
    title: "Villa Mediterrânea",
    kind: "Arquitetura",
    place: "Projeto residencial",
    year: "2026",
    cover: "/img/villa-0.webp",
    tex: "/img/ring/villa-0.webp",
    text: "Inspirada na arquitetura toscana, uma casa de volumes acolhedores, aberturas em arco e paleta suave: o charme das villas mediterrâneas num olhar contemporâneo.",
    gallery: ["/img/villa-0.webp", "/img/villa-1.webp", "/img/villa-2.webp", "/img/villa-b-0.webp", "/img/villa-b-1.webp"],
  },
  {
    slug: "neoclassica",
    videos: ["neoclassica"],
    title: "Residência Neoclássica",
    kind: "Arquitetura",
    place: "Projeto residencial",
    year: "2026",
    cover: "/img/neoclassica-0.webp",
    tex: "/img/ring/neoclassica-0.webp",
    text: "Onde o rigor do neoclássico encontra a leveza da modernidade: simetria, tons terrosos, pedra e esquadrias em contraste, e uma entrada de degraus iluminados.",
    gallery: ["/img/neoclassica-0.webp", "/img/neoclassica-1.webp", "/img/neoclassica-2.webp", "/img/neoclassica-b-0.webp", "/img/neoclassica-b-1.webp"],
  },
  {
    slug: "apartamento-do-piano",
    title: "Apartamento do Piano",
    kind: "Interiores",
    place: "João Pessoa, PB",
    year: "2026",
    cover: "/img/piano-0.webp",
    tex: "/img/ring/piano-0.webp",
    text: "Um living em que o piano conduz a composição. Cristaleira iluminada, materiais nobres e mobiliário elegante desenham um espaço sofisticado, leve e atemporal.",
    gallery: ["/img/piano-0.webp", "/img/piano-1.webp", "/img/piano-2.webp", "/img/piano-b-0.webp", "/img/piano-b-1.webp"],
    credit: "Fotos: @isarolim_fotoarq",
  },
  {
    slug: "casa-brises",
    videos: ["brises"],
    title: "Casa dos Brises",
    kind: "Arquitetura",
    place: "Condomínio Bosque das Orquídeas",
    year: "2025",
    cover: "/img/brises-0.webp",
    tex: "/img/ring/brises-0.webp",
    text: "Volumes marcantes, brises metálicos e revestimentos naturais desenham uma fachada integrada ao paisagismo. No térreo, um espaço gourmet com piscina pensado para bons momentos.",
    gallery: ["/img/brises-0.webp", "/img/brises-1.webp", "/img/brises-2.webp", "/img/brises-b-0.webp", "/img/brises-gourmet-0.webp", "/img/brises-gourmet-1.webp"],
  },
  {
    slug: "atemporal",
    title: "Projeto de 2019",
    kind: "Interiores",
    place: "João Pessoa, PB",
    year: "2019",
    cover: "/img/atemporal-0.webp",
    tex: "/img/ring/atemporal-0.webp",
    text: "Um projeto que começou em 2019 e permanece atual. Escolhas bem pensadas atravessam o tempo: projetar também é pensar em espaços que não dependam de tendências passageiras.",
    gallery: ["/img/atemporal-0.webp", "/img/atemporal-1.webp", "/img/atemporal-2.webp", "/img/atemporal-3.webp", "/img/atemporal-4.webp"],
  },
  {
    slug: "edificio-beira-mar",
    title: "Edifício à beira-mar",
    kind: "Arquitetura",
    place: "Projeto multifamiliar",
    year: "2025",
    cover: "/img/edificio-0.webp",
    tex: "/img/ring/edificio-0.webp",
    text: "Linhas orgânicas, curvas suaves e materiais nobres numa composição que valoriza cada vista para o mar, com leveza, precisão e identidade.",
    gallery: ["/img/edificio-0.webp", "/img/edificio-1.webp", "/img/edificio-2.webp", "/img/edificio-b-0.webp", "/img/edificio-b-1.webp"],
  },
  {
    slug: "suite-mostra-2025",
    title: "Suíte Refúgio",
    kind: "Mostra Artefacto 2025",
    place: "Artefacto João Pessoa",
    year: "2025",
    cover: "/img/suite-mostra-0.webp",
    tex: "/img/ring/suite-mostra-0.webp",
    text: "Um refúgio que acolhe corpo e alma. Paleta terrosa, formas orgânicas, texturas suaves e obras de arte escolhidas a dedo para desacelerar sem abrir mão da sofisticação.",
    gallery: ["/img/suite-mostra-0.webp", "/img/suite-mostra-1.webp", "/img/suite-mostra-2.webp", "/img/suite-mostra-w-0.webp", "/img/suite-mostra-w-1.webp"],
    credit: "Fotos: @isarolim_fotoarq",
  },
];

export const expertise = [
  {
    title: "Arquitetura",
    image: "/img/brisa-1.webp",
    items: ["Casas de alto padrão", "Casas de campo e de praia", "Retrofit de fachadas", "Edifícios e empreendimentos"],
  },
  {
    title: "Interiores",
    image: "/img/altiplano-vinho-0.webp",
    items: ["Living social e gourmet", "Adegas climatizadas", "Lavabos e salas de banho", "Marcenaria e curadoria de objetos"],
  },
  {
    title: "Acompanhamento",
    image: "/img/altiplano-cozinha-1.webp",
    items: ["Visitas de obra", "Fidelidade ao projeto aprovado", "Montagem e finalização", "A casa pronta para morar"],
  },
];

export const steps = [
  { n: "01", title: "Escuta", text: "Tudo começa entendendo quem vai viver ali: rotina, gostos, memórias e o que a casa precisa contar.", image: "/img/altiplano-hall-0.webp" },
  { n: "02", title: "Projeto autoral", text: "Arquitetura e paisagismo caminham juntos desde o início. Cada escolha tem um porquê, e nada segue tendência só por seguir.", image: "/img/campo-1.webp" },
  { n: "03", title: "Obra", text: "Entre poeira, decisões e imprevistos, é ali que eu também gosto de estar: cada medida conferida, cada paginação alinhada.", image: "/img/altiplano-banho-0.webp" },
  { n: "04", title: "Finalização", text: "Da montagem da cozinha à escolha dos utensílios e objetos: uma casa onde você entra e mora, sem sentir que falta alguma coisa.", image: "/img/altiplano-gourmet-0.webp" },
];

export const philosophy = [
  { title: "Escolhas que atravessam o tempo", text: "O tempo passa, o bom design permanece. Projetos de 10 anos atrás continuam fazendo sentido." },
  { title: "Detalhes com propósito", text: "Cada escolha tem um porquê. É isso que transforma um projeto em um lar com identidade." },
  { title: "Arquitetura e paisagismo juntos", text: "A integração desde o primeiro traço deixa a casa e a natureza conversarem com naturalidade." },
  { title: "Presença até o fim", text: "Do primeiro traço à última almofada: acompanhar cada etapa é o que garante o resultado." },
];

export const videos = [
  { slug: "living-social", title: "Living social", text: "Altiplano Cabo Branco", views: "68 mil" },
  { slug: "lavabo", title: "O lavabo", text: "Mármore Marrom Imperial", views: "14,8 mil" },
  { slug: "memorias", title: "Living de Memórias", text: "Mostra Artefacto 2026", views: "6,4 mil" },
  { slug: "casa-brisa", title: "Casa Brisa", text: "189 m² na serra", views: "3 mil" },
  { slug: "banho-master", title: "Banheiro master", text: "O luxo silencioso", views: "9,7 mil" },
  { slug: "casa-campo", title: "Casa de Campo", text: "Atemporal, sobre a paisagem", views: "2,6 mil" },
  { slug: "neoclassica", title: "Residência Neoclássica", text: "Simetria e pedra", views: "3,2 mil" },
  { slug: "brises", title: "Casa dos Brises", text: "Bosque das Orquídeas", views: "3 mil" },
];

export const testimonials = [
  { text: "Superou nossa expectativa, desde o atendimento inicial até a entrega do projeto e acompanhamento da obra! Tainá foi super atenciosa, entendeu exatamente o que queríamos e entregou além do contratado. Admiramos o cuidado nos pequenos detalhes que transformaram um apartamento em nosso lar!", name: "Sandra Paulo Neto", detail: "Projeto e acompanhamento de obra", image: "/img/altiplano-living-1.webp" },
  { text: "A arquiteta Tainá Andrade trouxe inovação e criatividade para o meu projeto! Fiquei muito feliz com o resultado final.", name: "Antonio Augusto Romero de Andrade", detail: "Avaliação no Google", image: "/img/brises-0.webp" },
  { text: "Muito capricho, bom gosto, dedicação em todos os detalhes e equipe nota 1000.", name: "Alda Farias", detail: "Avaliação no Google", image: "/img/altiplano-lavabo-0.webp" },
  { text: "Arquiteta super atenciosa, competente, pontual e com excelente bom gosto!", name: "Angela Paulo Neto de Melo", detail: "Avaliação no Google", image: "/img/piano-0.webp" },
  { text: "A melhor arquiteta da cidade! Projetos lindos, sofisticados e inspiradores!", name: "Nicolle Luna", detail: "Avaliação no Google", image: "/img/memorias-1.webp" },
  { text: "Responsável, competente, atenciosa, gentil e com um bom gosto extraordinário.", name: "Priscilla", detail: "Avaliação no Google", image: "/img/clinica-0.webp" },
];

export const faq = [
  { q: "Onde fica o escritório?", a: "No Tour Genève, no Altiplano Cabo Branco, em João Pessoa (PB). Atendemos João Pessoa, Campina Grande, Bananeiras e outras cidades." },
  { q: "Que tipo de projeto vocês fazem?", a: "Arquitetura e interiores de alto padrão: casas, casas de campo, apartamentos, clínicas, retrofit de fachadas e empreendimentos para construtoras." },
  { q: "Vocês acompanham a obra?", a: "Sim. Acompanhamos cada etapa, das primeiras decisões à finalização, com a casa montada, organizada e pronta para ser vivida." },
  { q: "Como peço um orçamento?", a: "Pelo WhatsApp ou pelo formulário aqui embaixo. Conte o tipo de projeto, a cidade e o momento da obra, e retornamos com os próximos passos." },
];
