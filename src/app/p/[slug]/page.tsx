import { Metadata } from "next";
import { getFunnelBySlug } from "@/lib/storage/funnels";
import { PublicFunnelClient } from "@/components/public/PublicFunnelClient";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const funnel = await getFunnelBySlug(slug);

  if (!funnel) {
    return {
      title: "Page Introuvable | Tuneliva",
      description: "Cette page de vente n'existe pas.",
    };
  }

  // Image OpenGraph optimisée pour WhatsApp et Facebook
  let ogImage =
    funnel.branding?.logoUrl ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80";

  for (const sec of funnel.sections) {
    if (sec.type === "hero" && (sec as any).imageUrl) {
      ogImage = (sec as any).imageUrl;
      break;
    }
    if (sec.type === "product_showcase" && (sec as any).items?.[0]?.imageUrl) {
      ogImage = (sec as any).items[0].imageUrl;
      break;
    }
  }

  const title =
    funnel.metaTitle || `${funnel.projectName} | Offre Spéciale Officielle`;
  const description =
    funnel.metaDescription ||
    `Commandez ${funnel.projectName} dès maintenant. Livraison express et paiement sécurisé à la livraison ou par Mobile Money.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: funnel.projectName,
        },
      ],
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

export default async function PublicFunnelPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = await searchParams;
  const funnel = await getFunnelBySlug(slug);

  const orderSuccess = sParams?.order_success === "true";
  const paymentError = typeof sParams?.payment_error === "string" ? sParams.payment_error : undefined;
  const orderId = typeof sParams?.order_id === "string" ? sParams.order_id : undefined;
  const paid = sParams?.paid === "true";

  return (
    <PublicFunnelClient
      slug={slug}
      initialFunnel={funnel}
      orderSuccessQuery={orderSuccess}
      paymentErrorQuery={paymentError}
      orderIdQuery={orderId}
      paidQuery={paid}
    />
  );
}
