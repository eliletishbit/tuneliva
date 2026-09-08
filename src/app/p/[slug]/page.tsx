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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tuneliva.com";

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
  const canonicalUrl = `${baseUrl}/p/${slug}`;

  return {
    title,
    description,
    keywords: [
      funnel.projectName,
      funnel.branding?.businessName || "",
      "commander en ligne",
      "paiement à la livraison",
      "Mobile Money",
      "Wave",
      "MTN MoMo",
      "livraison rapide Afrique",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: funnel.branding?.businessName || "Tuneliva",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: funnel.projectName,
        },
      ],
      type: "website",
      locale: "fr_FR",
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tuneliva.com";

  const orderSuccess = sParams?.order_success === "true";
  const paymentError = typeof sParams?.payment_error === "string" ? sParams.payment_error : undefined;
  const orderId = typeof sParams?.order_id === "string" ? sParams.order_id : undefined;
  const paid = sParams?.paid === "true";

  // GÉNÉRATION DYNAMIQUE DE SCHÉMAS STRUCTURÉS JSON-LD POUR LES MOTEURS DE RECHERCHE
  const jsonLdSchemas: any[] = [];

  if (funnel) {
    const pageUrl = `${baseUrl}/p/${slug}`;
    let mainImg = funnel.branding?.logoUrl;
    let price = 15000;
    let currency = "XOF";

    // Extraction des prix et images des sections
    for (const sec of funnel.sections) {
      if (sec.type === "pricing" && (sec as any).offer) {
        price = (sec as any).offer.salePrice || (sec as any).offer.regularPrice || price;
        currency = (sec as any).offer.currency || currency;
      }
      if (sec.type === "hero" && (sec as any).imageUrl) {
        mainImg = (sec as any).imageUrl;
      }
      if (sec.type === "faq" && (sec as any).items?.length) {
        // Schéma FAQPage
        jsonLdSchemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (sec as any).items.map((item: any) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        });
      }
    }

    // Schéma principal selon le type de page
    if (funnel.pageType === "event_booking") {
      jsonLdSchemas.push({
        "@context": "https://schema.org",
        "@type": "Event",
        name: funnel.projectName,
        description: funnel.metaDescription || funnel.projectName,
        image: mainImg,
        url: pageUrl,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        organizer: {
          "@type": "Organization",
          name: funnel.branding?.businessName || "Tuneliva Organisateur",
          url: pageUrl,
        },
        offers: {
          "@type": "Offer",
          price: String(price),
          priceCurrency: currency === "FCFA" ? "XOF" : currency,
          url: pageUrl,
          availability: "https://schema.org/InStock",
        },
      });
    } else if (funnel.pageType === "digital_product") {
      jsonLdSchemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        name: funnel.projectName,
        description: funnel.metaDescription || funnel.projectName,
        image: mainImg,
        provider: {
          "@type": "Organization",
          name: funnel.branding?.businessName || "Tuneliva Academy",
        },
        offers: {
          "@type": "Offer",
          price: String(price),
          priceCurrency: currency === "FCFA" ? "XOF" : currency,
          url: pageUrl,
          availability: "https://schema.org/InStock",
        },
      });
    } else {
      // Schéma Produit par défaut
      jsonLdSchemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        name: funnel.projectName,
        description: funnel.metaDescription || funnel.projectName,
        image: mainImg,
        brand: {
          "@type": "Brand",
          name: funnel.branding?.businessName || funnel.projectName,
        },
        offers: {
          "@type": "Offer",
          price: String(price),
          priceCurrency: currency === "FCFA" ? "XOF" : currency,
          url: pageUrl,
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "148",
        },
      });
    }
  }

  return (
    <>
      {jsonLdSchemas.map((schema, sIdx) => (
        <script
          key={sIdx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PublicFunnelClient
        slug={slug}
        initialFunnel={funnel}
        orderSuccessQuery={orderSuccess}
        paymentErrorQuery={paymentError}
        orderIdQuery={orderId}
        paidQuery={paid}
      />
    </>
  );
}
