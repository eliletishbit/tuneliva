/**
 * Normalisateur Phonétique Intelligent pour la Synthèse Vocale E-Commerce
 * Traduit automatiquement les symboles, abréviations monétaires, chiffres et acronymes
 * en français oral fluide pour éviter toute mauvaise prononciation dans les vidéos TikTok.
 */

export function normalizeForSpeech(text: string): string {
  let spoken = text;

  // 1. Suppression des émojis qui perturbent ou font bégayer le moteur vocal
  spoken = spoken.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}\u{200D}\u{FE0F}]/gu,
    " "
  );

  // 2. Numérotations de début de phrase (1., 2., 3.) -> transitions orales naturelles
  spoken = spoken.replace(/(?:^|\n|\.|\!|\?)\s*1\.\s*/gim, ". Premièrement, ");
  spoken = spoken.replace(/(?:^|\n|\.|\!|\?)\s*2\.\s*/gim, ". Deuxièmement, ");
  spoken = spoken.replace(/(?:^|\n|\.|\!|\?)\s*3\.\s*/gim, ". Troisièmement, ");
  spoken = spoken.replace(/(?:^|\n|\.|\!|\?)\s*4\.\s*/gim, ". Quatrièmement, ");
  spoken = spoken.replace(/(?:^|\n|\.|\!|\?)\s*5\.\s*/gim, ". Cinquièmement, ");
  spoken = spoken.replace(/\b1\.\s+/gi, "Premièrement, ");
  spoken = spoken.replace(/\b2\.\s+/gi, "Deuxièmement, ");
  spoken = spoken.replace(/\b3\.\s+/gi, "Troisièmement, ");

  // 3. Montants et Chiffres abrégés (1M, 2M, 1.5M, 10k, 500k, etc.)
  // Millions
  spoken = spoken.replace(/\b1([.,]0)?\s*M\s*FCFA\b/gi, "un million de francs CFA");
  spoken = spoken.replace(/\b1[.,]5\s*M\s*FCFA\b/gi, "un million et demi de francs CFA");
  spoken = spoken.replace(/\b([0-9]+(?:[.,][0-9]+)?)\s*M\s*FCFA\b/gi, "$1 millions de francs CFA");
  spoken = spoken.replace(/\b1([.,]0)?\s*M\b/gi, "un million");
  spoken = spoken.replace(/\b1[.,]5\s*M\b/gi, "un million et demi");
  spoken = spoken.replace(/\b([0-9]+(?:[.,][0-9]+)?)\s*M\b/gi, "$1 millions");

  // Milliers (k)
  spoken = spoken.replace(/\b1\s*k\s*FCFA\b/gi, "mille francs CFA");
  spoken = spoken.replace(/\b([0-9]+(?:[.,][0-9]+)?)\s*k\s*FCFA\b/gi, "$1 mille francs CFA");
  spoken = spoken.replace(/\b1\s*k\b/gi, "mille");
  spoken = spoken.replace(/\b([0-9]+(?:[.,][0-9]+)?)\s*k\b/gi, "$1 mille");

  // Multiplicateurs (x2, x3, x10, 2x, 3x)
  spoken = spoken.replace(/\bx2\b|\b2x\b/gi, "deux fois plus");
  spoken = spoken.replace(/\bx3\b|\b3x\b/gi, "trois fois plus");
  spoken = spoken.replace(/\bx5\b|\b5x\b/gi, "cinq fois plus");
  spoken = spoken.replace(/\bx10\b|\b10x\b/gi, "dix fois plus");

  // 4. Pourcentages (80% -> 80 pour cent, -50% -> moins 50 pour cent, +20% -> plus 20 pour cent)
  spoken = spoken.replace(/-\s*([0-9]+(?:[.,][0-9]+)?)\s*%/g, "moins $1 pour cent");
  spoken = spoken.replace(/\+\s*([0-9]+(?:[.,][0-9]+)?)\s*%/g, "plus $1 pour cent");
  spoken = spoken.replace(/([0-9]+(?:[.,][0-9]+)?)\s*%/g, "$1 pour cent");

  // 5. Durées et Rythmes (24h/24, 7j/7, 24/7, 24h, 30s)
  spoken = spoken.replace(/\b24h\/24\b|\b24\/7\b/gi, "24 heures sur 24, 7 jours sur 7");
  spoken = spoken.replace(/\b7j\/7\b/gi, "7 jours sur 7");
  spoken = spoken.replace(/\b([0-9]+)\s*h\b/gi, "$1 heures");
  spoken = spoken.replace(/\b([0-9]+)\s*min\b/gi, "$1 minutes");
  spoken = spoken.replace(/\b([0-9]+)\s*s\b/gi, "$1 secondes");

  // 6. Devises et Symboles
  spoken = spoken.replace(/\bFCFA\b|\bXOF\b|\bXAF\b/gi, "francs CFA");
  spoken = spoken.replace(/€/g, " euros ");
  spoken = spoken.replace(/\$/g, " dollars ");
  spoken = spoken.replace(/&/g, " et ");
  spoken = spoken.replace(/@/g, " arobase ");
  spoken = spoken.replace(/\bN°\s*([0-9]+)|\bn°\s*([0-9]+)/gi, "numéro $1$2");

  // 7. Expressions business e-commerce et Chiffre d'Affaires
  spoken = spoken.replace(/\b(?:du|de|en|ton|mon|son|le|un)\s+CA\b/gi, (match) => match.replace(/CA/i, "chiffre d'affaires"));
  spoken = spoken.replace(/\bCA\s*(?:mensuel|annuel|record)\b/gi, (match) => match.replace(/CA/i, "chiffre d'affaires"));
  spoken = spoken.replace(/\bROI\b/gi, "retour sur investissement");
  spoken = spoken.replace(/\bSAV\b/gi, "service après-vente");
  spoken = spoken.replace(/\bFAQ\b/gi, "foire aux questions");
  spoken = spoken.replace(/\bB2B\b/gi, "B to B");
  spoken = spoken.replace(/\bB2C\b/gi, "B to C");
  spoken = spoken.replace(/\bSMS\b/gi, "S-M-S");
  spoken = spoken.replace(/\bOTP\b/gi, "O-T-P");
  spoken = spoken.replace(/\bVIP\b/gi, "V-I-P");
  spoken = spoken.replace(/\bTVA\b/gi, "T-V-A");
  spoken = spoken.replace(/\betc\.?/gi, "et cetera");
  spoken = spoken.replace(/\bex\.?:/gi, "par exemple :");
  spoken = spoken.replace(/\bex\.\s+/gi, "par exemple, ");

  // 8. Intelligence Artificielle (IA)
  spoken = spoken.replace(/\bl'IA\b/gi, "l'intelligence artificielle");
  spoken = spoken.replace(/\bune IA\b/gi, "une intelligence artificielle");
  spoken = spoken.replace(/\bpar IA\b/gi, "par intelligence artificielle");
  spoken = spoken.replace(/\bIA\b/gi, "I-A");

  // 9. Moyens de paiement & Vocabulaire local
  spoken = spoken.replace(/\bMoMo\b/gi, "Mo-Mo");
  spoken = spoken.replace(/\bMTN\s*MoMo\b/gi, "M-T-N Mo-Mo");
  spoken = spoken.replace(/\bCOD\b/gi, "paiement à la livraison");
  spoken = spoken.replace(/\bsvp\b/gi, "s'il vous plaît");
  spoken = spoken.replace(/\bvs\b/gi, "contre");
  spoken = spoken.replace(/\bpubs\b/gi, "publicités");
  spoken = spoken.replace(/\bpub\b/gi, "publicité");
  spoken = spoken.replace(/\bads\b/gi, "publicités");
  spoken = spoken.replace(/\bCTA\b/gi, "appel à l'action");
  spoken = spoken.replace(/\bTuneliva\b/gi, "Tou-nè-li-va"); // Diction claire des 3 syllabes
  spoken = spoken.replace(/\bLien en bio\b/gi, "Lien dans la bio");

  // 10. Nettoyage de la ponctuation et des espaces
  spoken = spoken.replace(/['’]/g, "'");
  spoken = spoken.replace(/^\.\s*/, "");
  spoken = spoken.replace(/\s+/g, " ").trim();

  return spoken;
}
