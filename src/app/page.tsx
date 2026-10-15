import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { getCategories } from "@/lib/data";
import { getPageLanguage } from "@/lib/language";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { PopularServicesSection } from "@/components/home/popular-services-section";
import { CscSection } from "@/components/home/csc-section";
import { AiSection } from "@/components/home/ai-section";
import { TrackingSection } from "@/components/home/tracking-section";
import { VaultSection } from "@/components/home/vault-section";
import { JobsSection } from "@/components/home/jobs-section";
import { WhyHowSection } from "@/components/home/why-how-section";
import {
  NewsletterSection,
  SocialSection,
} from "@/components/home/social-sections";
import { AppSection, CtaSection } from "@/components/home/closing-sections";
import { organizationSchema } from "@/config/home";

export const metadata: Metadata = {
  title: "GovGuide AI — Clear guidance for public services",
  description:
    "Understand public services, prepare documents, find in-person help, and follow official sources with independent guidance from GovGuide AI.",
  keywords: [
    "government services",
    "CSC",
    "PAN card",
    "Aadhaar",
    "scholarship",
    "government jobs",
    "income certificate",
  ],
  openGraph: {
    title: "GovGuide AI — Clear guidance for public services",
    description: "Understand public services, prepare documents and follow official sources.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GovGuide AI — Clear guidance for public services",
    description: "Independent guidance to help you understand public services and your next steps.",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const [{ languages, languageCode }, categoriesResult] = await Promise.all([
    getPageLanguage(params.lang),
    getCategories(),
  ]);

  return (
    <SiteShell languages={languages} languageCode={languageCode}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <main id="main-content">
        <HeroSection languageCode={languageCode} />
        <CategoriesSection
          categories={categoriesResult.data}
          languageCode={languageCode}
        />
        <CscSection languageCode={languageCode} />
        <PopularServicesSection languageCode={languageCode} />
        <AiSection />
        <TrackingSection languageCode={languageCode} />
        <VaultSection languageCode={languageCode} />
        <JobsSection languageCode={languageCode} />
        <WhyHowSection languageCode={languageCode} />
        <SocialSection />
        <AppSection languageCode={languageCode} />
        <NewsletterSection />
        <CtaSection languageCode={languageCode} />
      </main>
    </SiteShell>
  );
}
