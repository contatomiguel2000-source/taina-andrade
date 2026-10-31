import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const host = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tainá Andrade Arquitetura | Alto padrão em João Pessoa",
  description:
    "Arquitetura e interiores de alto padrão em João Pessoa (PB). 18 anos de projetos autorais e personalizados: casas, casas de campo, apartamentos, clínicas e empreendimentos, com acompanhamento até a entrega.",
  openGraph: {
    title: "Tainá Andrade Arquitetura",
    description: "Arquitetura de alto padrão em João Pessoa. Projetos autorais e personalizados, do primeiro traço à casa pronta.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${host.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
