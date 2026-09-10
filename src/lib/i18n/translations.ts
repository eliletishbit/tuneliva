export type LanguageCode = "fr" | "en" | "es" | "pt" | "ar";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", name: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "pt", name: "Português", flag: "🇵🇹", dir: "ltr" },
  { code: "ar", name: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export const TRANSLATIONS: Record<LanguageCode, {
  header: {
    tagline: string;
    regions: string;
    blog: string;
    myOrders: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    subtitle: string;
    promptPlaceholder: string;
    generateBtn: string;
    generatingBtn: string;
    freeGuarantee: string;
  };
  templates: {
    title: string;
    subtitle: string;
    useTemplate: string;
  };
  features: {
    title: string;
    momoTitle: string;
    momoDesc: string;
    codTitle: string;
    codDesc: string;
    whatsappTitle: string;
    whatsappDesc: string;
    speedTitle: string;
    speedDesc: string;
  };
  footer: {
    copyright: string;
    rights: string;
  };
}> = {
  fr: {
    header: {
      tagline: "Donnez vie à vos tunnels de vente",
      regions: "Afrique • Diaspora • International",
      blog: "📚 Blog",
      myOrders: "Mes Commandes",
    },
    hero: {
      badge: "Pour l'Afrique, la Diaspora et les Vendeurs Internationaux",
      titlePart1: "Donnez vie à vos tunnels & pages de conversion ",
      titleHighlight: "en quelques secondes",
      subtitle: "L'IA génère des pages ultrarapides adaptées à votre audience : Mobile Money (Wave, MTN, Orange, Moov), paiement à la livraison (COD), devises locales et intégration WhatsApp.",
      promptPlaceholder: "Décrivez votre offre (ex: Crème visage éclat bio avec livraison rapide à Abidjan et paiement à la livraison)...",
      generateBtn: "Générer mon Tunnel IA →",
      generatingBtn: "Création de votre page par l'IA...",
      freeGuarantee: "Gratuit • Sans carte requise • Prêt en 15 secondes",
    },
    templates: {
      title: "Modèles d'Élite Prêts à Déployer",
      subtitle: "Sélectionnez un tunnel haute conversion adapté à votre secteur d'activité",
      useTemplate: "Utiliser ce modèle →",
    },
    features: {
      title: "Pourquoi Tuneliva Convertit 3x Plus ?",
      momoTitle: "Paiements Mobile Money Locaux",
      momoDesc: "Encaissez par MTN MoMo, Wave, Moov Money et Orange sans friction.",
      codTitle: "Paiement à la Livraison (COD)",
      codDesc: "Le moyen préféré des acheteurs africains : commandez d'abord, réglez au coursier.",
      whatsappTitle: "Intégration WhatsApp 1-Clic",
      whatsappDesc: "Recevez les commandes et relancez directement les clients sur WhatsApp.",
      speedTitle: "Vitesse Flash & 100% Mobile",
      speedDesc: "Pages chargées en moins de 1,2 seconde, optimisées pour 3G/4G et smartphone.",
    },
    footer: {
      copyright: "Tuneliva — Tunnels de Vente & E-Commerce Haute Performance.",
      rights: "Tous droits réservés.",
    },
  },
  en: {
    header: {
      tagline: "Bring your high-converting sales funnels to life",
      regions: "Africa • Diaspora • Global Markets",
      blog: "📚 Blog",
      myOrders: "My Orders",
    },
    hero: {
      badge: "For Africa, the Diaspora & Global Entrepreneurs",
      titlePart1: "Launch high-converting sales funnels & landing pages ",
      titleHighlight: "in seconds with AI",
      subtitle: "AI creates ultra-fast sales pages tailored to your audience: Mobile Money (Wave, MTN, Orange, Moov), Cash on Delivery (COD), local currencies and WhatsApp integration.",
      promptPlaceholder: "Describe your offer (e.g., Organic skincare cream with express delivery in Lagos and cash on delivery)...",
      generateBtn: "Generate My AI Funnel →",
      generatingBtn: "AI is crafting your sales funnel...",
      freeGuarantee: "100% Free • No Credit Card Required • Live in 15s",
    },
    templates: {
      title: "Elite Ready-to-Deploy Templates",
      subtitle: "Choose a high-converting sales funnel crafted for your business industry",
      useTemplate: "Use this template →",
    },
    features: {
      title: "Why Tuneliva Converts 3x More Customers?",
      momoTitle: "Native Mobile Money Payments",
      momoDesc: "Accept payments with MTN MoMo, Wave, Moov Money, and Orange seamlessly.",
      codTitle: "Cash on Delivery (COD)",
      codDesc: "The #1 preferred checkout in emerging markets: inspect first, pay the courier.",
      whatsappTitle: "1-Click WhatsApp Ordering",
      whatsappDesc: "Receive customer leads and follow up instantly on WhatsApp.",
      speedTitle: "Ultra-Fast Mobile Speed",
      speedDesc: "Pages load in under 1.2s, optimized for smartphones and mobile data.",
    },
    footer: {
      copyright: "Tuneliva — High-Converting E-Commerce & Sales Funnel Builder.",
      rights: "All rights reserved.",
    },
  },
  es: {
    header: {
      tagline: "Crea embudos de venta de alta conversión",
      regions: "África • Diáspora • Internacional",
      blog: "📚 Blog",
      myOrders: "Mis Pedidos",
    },
    hero: {
      badge: "Para África, la Diáspora y Emprendedores Globales",
      titlePart1: "Crea embudos y páginas de venta de alta conversión ",
      titleHighlight: "en segundos con IA",
      subtitle: "La IA genera páginas ultrarrápidas adaptadas a tu audiencia: Mobile Money, pago contra entrega (COD), monedas locales e integración directa con WhatsApp.",
      promptPlaceholder: "Describe tu oferta (ej: Crema facial orgánica con entrega express y pago contra entrega)...",
      generateBtn: "Generar mi Embudo IA →",
      generatingBtn: "La IA está creando tu embudo...",
      freeGuarantee: "Gratis • Sin tarjeta de crédito • Listo en 15 segundos",
    },
    templates: {
      title: "Plantillas de Élite Listas para Usar",
      subtitle: "Selecciona un embudo de alta conversión adaptado a tu sector de negocio",
      useTemplate: "Usar esta plantilla →",
    },
    features: {
      title: "¿Por Qué Tuneliva Convierte 3 Veces Más?",
      momoTitle: "Pagos Móviles Locales",
      momoDesc: "Cobra con Mobile Money y billeteras electrónicas locales sin fricción.",
      codTitle: "Pago Contra Entrega (COD)",
      codDesc: "El método de pago favorito: pide ahora y paga al recibir el producto.",
      whatsappTitle: "Integración Directa con WhatsApp",
      whatsappDesc: "Recibe pedidos y contacta a los clientes al instante por WhatsApp.",
      speedTitle: "Velocidad Ultrarrápida en Móvil",
      speedDesc: "Páginas que cargan en menos de 1,2 segundos para máxima conversión.",
    },
    footer: {
      copyright: "Tuneliva — Embudos de Venta y Comercio Electrónico de Alta Conversión.",
      rights: "Todos los derechos reservados.",
    },
  },
  pt: {
    header: {
      tagline: "Crie funis de vendas de alta conversão",
      regions: "África • Diáspora • Internacional",
      blog: "📚 Blog",
      myOrders: "Meus Pedidos",
    },
    hero: {
      badge: "Para África, Diáspora e Empreendedores Globais",
      titlePart1: "Lance páginas de vendas e funis de alta conversão ",
      titleHighlight: "em segundos com IA",
      subtitle: "A IA gera páginas ultrarrápidas adaptadas ao seu público: Mobile Money, pagamento na entrega (COD), moedas locais e integração direta com WhatsApp.",
      promptPlaceholder: "Descreva a sua oferta (ex: Loja de cosméticos com entrega rápida em Luanda e pagamento na entrega)...",
      generateBtn: "Gerar Meu Funil com IA →",
      generatingBtn: "A IA está criando a sua página...",
      freeGuarantee: "Gratuito • Sem cartão de crédito • Pronto em 15 segundos",
    },
    templates: {
      title: "Modelos de Elite Prontos para Usar",
      subtitle: "Escolha um funil de alta conversão ideal para o seu setor comercial",
      useTemplate: "Usar este modelo →",
    },
    features: {
      title: "Por Que a Tuneliva Converte 3x Mais?",
      momoTitle: "Pagamentos Mobile Money",
      momoDesc: "Receba pagamentos com carteiras digitais e pagamentos locais sem atrito.",
      codTitle: "Pagamento na Entrega (COD)",
      codDesc: "A forma favorita dos clientes: faça o pedido e pague ao receber o produto.",
      whatsappTitle: "Integração Direta com WhatsApp",
      whatsappDesc: "Receba pedidos e responda aos clientes em tempo real pelo WhatsApp.",
      speedTitle: "Velocidade Máxima no Celular",
      speedDesc: "Páginas que carregam em menos de 1,2s, perfeitas para conexões 3G/4G.",
    },
    footer: {
      copyright: "Tuneliva — Funis de Vendas e E-Commerce de Alta Performance.",
      rights: "Todos os direitos reservados.",
    },
  },
  ar: {
    header: {
      tagline: "أنشئ مسارات مبيعات عالية التحويل بالذكاء الاصطناعي",
      regions: "إفريقيا • المغتربون • الأسواق الدولية",
      blog: "📚 المدونة",
      myOrders: "طلباتي",
    },
    hero: {
      badge: "لرواد الأعمال في إفريقيا والشرق الأوسط والعالم",
      titlePart1: "أنشئ صفحات بيع ومسارات تسويقية خارقة ",
      titleHighlight: "في ثوانٍ معدودة بالذكاء الاصطناعي",
      subtitle: "يولد الذكاء الاصطناعي صفحات فائقة السرعة مهيأة لجمهورك: الدفع عبر الهاتف، الدفع عند الاستلام (COD)، العملات المحلية، وربط الطلبات بواتساب.",
      promptPlaceholder: "صف منتجك أو خدمتك (مثال: متجر عطور فاخرة مع توصيل سريع والدفع عند الاستلام)...",
      generateBtn: "توليد مسار البيع بالذكاء الاصطناعي ←",
      generatingBtn: "جاري تصميم صفحتك بالذكاء الاصطناعي...",
      freeGuarantee: "مجاني 100% • بدون بطاقة بنكية • جاهز في 15 ثانية",
    },
    templates: {
      title: "نماذج احترافية جاهزة للإطلاق",
      subtitle: "اختر مسار بيع عالي التحويل مصمم خصيصاً لمجال عملك",
      useTemplate: "استخدم هذا النموذج ←",
    },
    features: {
      title: "لماذا تحقق تونليفا مبيعات أكثر بثلاثة أضعاف؟",
      momoTitle: "الدفع بالهاتف والمحافظ الإلكترونية",
      momoDesc: "استقبل المدفوعات محلياً بدون أي تعقيد.",
      codTitle: "الدفع عند الاستلام (COD)",
      codDesc: "الخيار المفضل للزبائن: عاين المنتج أولاً ثم ادفع لمندوب التوصيل.",
      whatsappTitle: "استقبال الطلبات على واتساب بنقرة واحدة",
      whatsappDesc: "تواصل مع عملائك وتابع الطلبات مباشرة على واتساب.",
      speedTitle: "سرعة تحميل قياسية على الهواتف",
      speedDesc: "صفحات تفتح في أقل من 1.2 ثانية وتعمل بسلاسة على شبكات الهاتف.",
    },
    footer: {
      copyright: "تونليفا — منصة مسارات المبيعات والتجارة الإلكترونية عالية الأداء.",
      rights: "جميع الحقوق محفوظة.",
    },
  },
};
