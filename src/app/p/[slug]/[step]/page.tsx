import { Metadata } from "next";
import { getFunnelBySlug } from "@/lib/storage/funnels";
import { PublicFunnelClient } from "@/components/public/PublicFunnelClient";

interface Props {
  params: Promise<{ slug: string; step: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, step } = await params;
  const funnel = await getFunnelBySlug(slug);

  if (!funnel) {
    return {
      title: "Étape Introuvable | Tuneliva",
      description: "Cette étape de tunnel n'existe pas.",
    };
  }

  const matchedStep = funnel.steps?.find(
    (st) => st.slug === step || st.id === step
  );

  const stepName = matchedStep?.name || step;
  const title = `${funnel.projectName} - ${stepName} | Tuneliva`;
  const description =
    funnel.metaDescription ||
    `Commandez ${funnel.projectName} dès maintenant. Livraison express et paiement sécurisé.`;

  let ogImage =
    funnel.branding?.logoUrl ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80";

  for (const sec of funnel.sections) {
    if (sec.type === "hero" && (sec as any).imageUrl) {
      ogImage = (sec as any).imageUrl;
      break;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PublicFunnelStepPage({ params, searchParams }: Props) {
  const { slug, step } = await params;
  const sParams = await searchParams;
  const funnel = await getFunnelBySlug(slug);

  return (
    <PublicFunnelClient
      slug={slug}
      stepSlug={step}
      initialFunnel={funnel}
      orderSuccessQuery={sParams?.order_success === "true"}
    />
  );
}
