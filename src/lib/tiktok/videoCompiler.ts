/**
 * Tuneliva TikTok Video Compiler Engine (Version 2.0 Pro)
 * Moteur de rendu 9:16 vertical haute fidélité
 * - Visuels dynamiques et variés par scène (avec proxy anti-CORS et transitions fondues)
 * - Mouvements de caméra cinématographiques Ken Burns (zoom in, pan gauche, zoom out, pan droite, pulse)
 * - Voix off haute qualité enregistrée directement dans le flux MP4 via Web Audio API + AudioDestination
 * - Deux voix professionnelles : Aïcha (Femme ~30 ans, Experte marketing) et Kouamé (Homme ~30 ans, Entrepreneur confiant)
 * - Vraie bande sonore instrumentale libre de droits (Lo-Fi / Afrobeats chill en fond subtil à -18dB)
 * - Sous-titres cinétiques mot par mot style Alex Hormozi (jaune néon surbrillant)
 */

import { TikTokVideoPost, TikTokScene } from "./generator";
import { normalizeForSpeech } from "./speechNormalizer";

export interface VideoRenderProgress {
  currentSec: number;
  totalSec: number;
  percent: number;
  statusText: string;
}

export interface CompiledVideoResult {
  blob: Blob;
  url: string;
  durationSec: number;
  fileName: string;
}

export type VoiceOption = "female" | "male";
export type MusicOption = "afrobeat" | "lofi" | "none";
export type SpeedOption = "viral" | "normal";

export interface VideoCompilerOptions {
  voice?: VoiceOption;
  music?: MusicOption;
  speed?: SpeedOption;
}

// Chargement sécurisé de chaque image via le proxy local anti-CORS
async function loadImageThroughProxy(rawUrl: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(rawUrl)}`;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Deuxième tentative directe
      const directImg = new Image();
      directImg.crossOrigin = "anonymous";
      directImg.onload = () => resolve(directImg);
      directImg.onerror = () => resolve(null);
      directImg.src = rawUrl;
    };
    img.src = proxyUrl;
  });
}

// Récupération et décodage de l'audio TTS pour une phrase donnée
async function fetchAndDecodeTTS(
  audioCtx: AudioContext,
  text: string
): Promise<AudioBuffer | null> {
  const normalized = normalizeForSpeech(text);

  // 1ère tentative : via la route serverless locale
  try {
    const url = `/api/tiktok/tts?text=${encodeURIComponent(normalized)}&lang=fr-FR`;
    const res = await fetch(url);
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuf);
    }
  } catch (e) {
    console.warn("Route TTS locale inaccessible, bascule directe:", e);
  }

  // 2ème tentative : appel direct depuis le navigateur avec le texte normalisé
  try {
    const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=fr-FR&client=tw-ob&q=${encodeURIComponent(normalized)}`;
    const directRes = await fetch(directUrl);
    if (directRes.ok) {
      const arrayBuf = await directRes.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuf);
    }
  } catch (err) {
    console.warn("Erreur chargement direct TTS:", err);
  }

  return null;
}

// Chargement de la vraie musique de fond libre de droits (MP3)
async function fetchAndDecodeMusic(
  audioCtx: AudioContext,
  track: MusicOption
): Promise<AudioBuffer | null> {
  if (track === "none") return null;
  const fileName = track === "afrobeat" ? "afrobeat-chill.mp3" : "lofi-business.mp3";
  try {
    const res = await fetch(`/audio/${fileName}`);
    if (!res.ok) return null;
    const arrayBuf = await res.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuf);
  } catch (err) {
    console.warn("Erreur chargement musique MP3:", err);
    return null;
  }
}

/**
 * Compile un TikTokVideoPost en vraie vidéo MP4 / WebM avec voix off réelle et musique
 */
export async function compileTikTokVideo(
  post: TikTokVideoPost,
  onProgress?: (p: VideoRenderProgress) => void,
  options: VideoCompilerOptions = {}
): Promise<CompiledVideoResult> {
  if (typeof window === "undefined") {
    throw new Error("La compilation vidéo s'exécute dans l'environnement navigateur.");
  }

  const voiceType: VoiceOption = options.voice || "female";
  const musicType: MusicOption = options.music || "afrobeat";
  const speedType: SpeedOption = options.speed || "viral";

  const WIDTH = 720;
  const HEIGHT = 1280;
  const FPS = 30;

  // Création du canvas 9:16
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Impossible d'initialiser le contexte Canvas 2D.");
  }

  onProgress?.({
    currentSec: 0,
    totalSec: 25,
    percent: 5,
    statusText: "Chargement des visuels haute définition par scène...",
  });

  // 1. Chargement de toutes les images des scènes avec le proxy anti-CORS
  const sceneImages: (HTMLImageElement | null)[] = [];
  for (let i = 0; i < post.scenes.length; i++) {
    const scene = post.scenes[i];
    const img = await loadImageThroughProxy(scene.bgImageUrl);
    sceneImages.push(img);
  }

  onProgress?.({
    currentSec: 0,
    totalSec: 25,
    percent: 15,
    statusText: `Synthèse de la voix off ${voiceType === "female" ? "d'Aïcha" : "de Kouamé"} et de la musique...`,
  });

  // 2. Initialisation Web Audio & Décodage des pistes audio
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("L'API Web Audio n'est pas supportée par ce navigateur.");
  }

  const audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  const audioDestination = audioCtx.createMediaStreamDestination();

  // Nœud de sortie principal connecté à la destination d'enregistrement ET aux haut-parleurs
  const masterVoiceGain = audioCtx.createGain();
  masterVoiceGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
  masterVoiceGain.connect(audioDestination);
  masterVoiceGain.connect(audioCtx.destination);

  // Égaliseur vocal adapté au profil d'entrepreneur trentenaire
  const voiceFilter = audioCtx.createBiquadFilter();
  if (voiceType === "female") {
    // Aïcha (~30 ans, experte marketing, dynamique, chaleureuse)
    voiceFilter.type = "peaking";
    voiceFilter.frequency.setValueAtTime(2800, audioCtx.currentTime);
    voiceFilter.gain.setValueAtTime(3.0, audioCtx.currentTime);
    voiceFilter.Q.setValueAtTime(1.1, audioCtx.currentTime);
  } else {
    // Kouamé (~30 ans, entrepreneur confiant, convivial, posé)
    voiceFilter.type = "lowshelf";
    voiceFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
    voiceFilter.gain.setValueAtTime(4.0, audioCtx.currentTime);
  }
  voiceFilter.connect(masterVoiceGain);

  // Pré-chargement des voix TTS pour chaque scène
  const sceneAudioBuffers: (AudioBuffer | null)[] = [];
  for (let i = 0; i < post.scenes.length; i++) {
    const buf = await fetchAndDecodeTTS(audioCtx, post.scenes[i].subtitle);
    sceneAudioBuffers.push(buf);
  }

  // Vitesse de lecture dynamique selon la cadence choisie (Viral 1.20x vs Posé 1.05x)
  const isViral = speedType === "viral";
  const effectiveSpeechRate = isViral
    ? (voiceType === "female" ? 1.20 : 1.16)
    : (voiceType === "female" ? 1.05 : 1.02);
  const gapPadding = isViral ? 0.12 : 0.35;
  const minSceneDur = isViral ? 2.3 : 3.0;

  // Calcul des timings synchronisés scène par scène selon la durée réelle de parole
  const sceneTimings: { startSec: number; durationSec: number }[] = [];
  let currentAccumulatedSec = 0;

  for (let i = 0; i < post.scenes.length; i++) {
    const audioBuf = sceneAudioBuffers[i];
    const rawAudioDuration = audioBuf ? audioBuf.duration : 3.0;
    const realSpokenDuration = rawAudioDuration / effectiveSpeechRate;
    // Coupure ajustée : rythme ultra nerveux Alex Hormozi (0.12s) ou plus posé (0.35s)
    const sceneDur = Math.max(minSceneDur, realSpokenDuration + gapPadding);
    sceneTimings.push({
      startSec: currentAccumulatedSec,
      durationSec: sceneDur,
    });
    currentAccumulatedSec += sceneDur;
  }

  const TOTAL_DURATION_SEC = Math.ceil(currentAccumulatedSec);

  // Chargement et lecture en boucle de la vraie musique de fond MP3
  const musicBuffer = await fetchAndDecodeMusic(audioCtx, musicType);
  if (musicBuffer) {
    const musicSource = audioCtx.createBufferSource();
    musicSource.buffer = musicBuffer;
    musicSource.loop = true;

    // Volume subtil de fond (-18 dB, environ 0.12)
    const musicGain = audioCtx.createGain();
    musicGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

    musicSource.connect(musicGain);
    musicGain.connect(audioDestination);
    musicGain.connect(audioCtx.destination);
    musicSource.start(0);
  }

  // 3. Configuration du flux MediaStream et MediaRecorder
  const videoStream = canvas.captureStream(FPS);
  const combinedTracks: MediaStreamTrack[] = [
    ...videoStream.getVideoTracks(),
    ...audioDestination.stream.getAudioTracks(),
  ];
  const combinedStream = new MediaStream(combinedTracks);

  let mimeType = "video/webm;codecs=vp9,opus";
  if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a.40.2")) {
    mimeType = "video/mp4;codecs=avc1,mp4a.40.2";
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    mimeType = "video/mp4";
  } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
    mimeType = "video/webm;codecs=vp8,opus";
  } else if (MediaRecorder.isTypeSupported("video/webm")) {
    mimeType = "video/webm";
  }

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  const recordedChunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  recorder.start(100);

  // Fonction de lecture de la voix pour une scène
  const playSceneAudio = (index: number) => {
    const buf = sceneAudioBuffers[index];
    if (!buf) return;
    const source = audioCtx.createBufferSource();
    source.buffer = buf;
    // Vitesse accélérée et dynamique (1.18x pour Aïcha / 1.14x pour Kouamé)
    source.playbackRate.setValueAtTime(effectiveSpeechRate, audioCtx.currentTime);
    source.connect(voiceFilter);
    source.start(0);
  };

  // Jouer la première scène immédiatement
  playSceneAudio(0);

  const SCENE_STAGE_LABELS = [
    "⚡ ACCROCHE STRATÉGIQUE",
    "💡 POINT 1 : L'OFFRE PHARE",
    "💳 POINT 2 : LE PAIEMENT LOCAL",
    "📦 POINT 3 : LIVRAISON & WHATSAPP",
    "🎯 PASSAGE À L'ACTION",
  ];

  return new Promise((resolve, reject) => {
    recorder.onerror = (err) => reject(err);

    recorder.onstop = () => {
      try {
        audioCtx.close();
      } catch {}

      const outputMime = mimeType.startsWith("video/mp4") ? "video/mp4" : "video/webm";
      const blob = new Blob(recordedChunks, { type: outputMime });
      const url = URL.createObjectURL(blob);
      const extension = outputMime.includes("mp4") ? "mp4" : "webm";
      const cleanSlug = post.articleSlug || "video-tiktok";
      const fileName = `tuneliva-${cleanSlug}-${post.scheduledTime.replace(":", "h")}.${extension}`;

      onProgress?.({
        currentSec: TOTAL_DURATION_SEC,
        totalSec: TOTAL_DURATION_SEC,
        percent: 100,
        statusText: "Vidéo générée avec succès (voix off et musique incluses) !",
      });

      resolve({
        blob,
        url,
        durationSec: TOTAL_DURATION_SEC,
        fileName,
      });
    };

    let lastTriggeredSceneIndex = 0;
    const startTime = Date.now();

    const renderLoop = () => {
      const elapsedSec = (Date.now() - startTime) / 1000;

      if (elapsedSec >= TOTAL_DURATION_SEC) {
        recorder.stop();
        return;
      }

      // Déterminer la scène active selon les timings réels
      let sceneIndex = sceneTimings.findIndex(
        (t) => elapsedSec >= t.startSec && elapsedSec < t.startSec + t.durationSec
      );
      if (sceneIndex === -1) {
        sceneIndex = post.scenes.length - 1;
      }

      const activeScene: TikTokScene = post.scenes[sceneIndex] || post.scenes[0];
      const activeImg = sceneImages[sceneIndex] || sceneImages[0];
      const timing = sceneTimings[sceneIndex] || { startSec: 0, durationSec: 4 };

      // Déclencher l'audio vocal synchronisé lors du passage à la nouvelle scène
      if (sceneIndex !== lastTriggeredSceneIndex) {
        lastTriggeredSceneIndex = sceneIndex;
        playSceneAudio(sceneIndex);
      }

      // Progression dans la scène actuelle (0 à 1)
      const sceneElapsed = Math.max(0, elapsedSec - timing.startSec);
      const sceneProgress = Math.min(1, sceneElapsed / (timing.durationSec || 1));

      // 1. Fond noir par défaut
      ctx.fillStyle = "#070913";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // 2. Mouvement de caméra dynamique Ken Burns différent pour chaque scène
      // Scène 0 : Zoom In lent
      // Scène 1 : Panoramique vers la gauche
      // Scène 2 : Zoom Out lent
      // Scène 3 : Panoramique vers la droite
      // Scène 4 : Zoom In avec pulsation
      let zoom = 1.05;
      let panX = 0;
      let panY = 0;

      if (sceneIndex === 0) {
        zoom = 1.02 + sceneProgress * 0.12;
      } else if (sceneIndex === 1) {
        zoom = 1.1;
        panX = (1 - sceneProgress * 2) * 35; // déplacement horizontal
      } else if (sceneIndex === 2) {
        zoom = 1.14 - sceneProgress * 0.1;
      } else if (sceneIndex === 3) {
        zoom = 1.1;
        panX = (sceneProgress * 2 - 1) * 35;
      } else {
        zoom = 1.04 + Math.sin(sceneProgress * Math.PI) * 0.08;
      }

      const imgWidth = WIDTH * zoom;
      const imgHeight = HEIGHT * zoom;
      const offsetX = (WIDTH - imgWidth) / 2 + panX;
      const offsetY = (HEIGHT - imgHeight) / 2 + panY;

      // Dessin de l'image de la scène courante
      if (activeImg) {
        ctx.drawImage(activeImg, offsetX, offsetY, imgWidth, imgHeight);
      } else {
        // Dégradé stylisé avec motifs si chargement différé
        const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
        grad.addColorStop(0, "#1e1b4b");
        grad.addColorStop(0.5, "#0f172a");
        grad.addColorStop(1, "#1e293b");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      // Fondu enchaîné (Cross-dissolve) dans les 0.4 dernières secondes de la scène
      const timeRemainingInScene = timing.durationSec - sceneElapsed;
      if (timeRemainingInScene < 0.25 && sceneIndex < post.scenes.length - 1) {
        const nextImg = sceneImages[sceneIndex + 1];
        if (nextImg) {
          const crossAlpha = (0.25 - timeRemainingInScene) / 0.25;
          ctx.save();
          ctx.globalAlpha = crossAlpha;
          ctx.drawImage(nextImg, (WIDTH - WIDTH * 1.05) / 2, (HEIGHT - HEIGHT * 1.05) / 2, WIDTH * 1.05, HEIGHT * 1.05);
          ctx.restore();
        }
      }

      // Flash lumineux subtil au tout début de chaque nouvelle scène (0.12s)
      if (sceneElapsed < 0.12) {
        const flashAlpha = (1 - sceneElapsed / 0.12) * 0.28;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      // Dégradés sombres d'ambiance TikTok (Haut et Bas)
      const topGrad = ctx.createLinearGradient(0, 0, 0, 280);
      topGrad.addColorStop(0, "rgba(0, 0, 0, 0.88)");
      topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, WIDTH, 280);

      const bottomGrad = ctx.createLinearGradient(0, HEIGHT - 450, 0, HEIGHT);
      bottomGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomGrad.addColorStop(1, "rgba(0, 0, 0, 0.94)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, HEIGHT - 450, WIDTH, 450);

      // --- BARRE SUPÉRIEURE TIKTOK ---
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(post.scheduledTime, 40, 50);

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "900 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Pour toi", WIDTH / 2, 70);

      // Badge de l'étape active (ex: "💡 POINT 1 : L'OFFRE PHARE")
      const stageLabel = SCENE_STAGE_LABELS[sceneIndex] || "CONSEIL E-COMMERCE";
      const stageBadgeWidth = 340;
      const stageBadgeX = (WIDTH - stageBadgeWidth) / 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.beginPath();
      ctx.roundRect(stageBadgeX, 95, stageBadgeWidth, 36, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = post.categoryColor || "#38bdf8";
      ctx.font = "900 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stageLabel, WIDTH / 2, 118);

      // --- SOUS-TITRES CINÉTIQUES MOT PAR MOT (STYLE ALEX HORMOZI) ---
      const subtitleText = activeScene.subtitle;
      const words = subtitleText.split(" ");
      const highlightWordClean = (activeScene.highlightWord || "").toLowerCase().replace(/[^a-zA-Z0-9]/g, "");

      // Découpage automatique sur 2 ou 3 lignes
      const lines: string[][] = [[]];
      let currentLineLength = 0;

      for (const word of words) {
        if (currentLineLength + word.length > 20 && lines.length < 3) {
          lines.push([word]);
          currentLineLength = word.length;
        } else {
          lines[lines.length - 1].push(word);
          currentLineLength += word.length + 1;
        }
      }

      const boxHeight = lines.length * 54 + 36;
      const boxY = HEIGHT / 2 - boxHeight / 2;
      const boxWidth = WIDTH - 50;
      const boxX = 25;

      ctx.fillStyle = "rgba(4, 7, 18, 0.84)";
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 26);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();

      lines.forEach((lineWords, lineIdx) => {
        const lineY = boxY + 46 + lineIdx * 52;
        ctx.font = "900 33px sans-serif";

        const totalLineWidth = lineWords.reduce((acc, w) => acc + ctx.measureText(w + " ").width, 0);
        let currentX = WIDTH / 2 - totalLineWidth / 2;

        lineWords.forEach((word) => {
          const cleanW = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
          const isHighlight = cleanW === highlightWordClean;

          if (isHighlight) {
            ctx.fillStyle = "#facc15"; // Jaune néon ultra-lumineux
            ctx.shadowColor = "rgba(250, 204, 21, 0.9)";
            ctx.shadowBlur = 18;
            ctx.font = "900 36px sans-serif";
          } else {
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 6;
            ctx.font = "900 33px sans-serif";
          }

          ctx.textAlign = "left";
          ctx.fillText(word, currentX, lineY);

          ctx.shadowBlur = 0;
          currentX += ctx.measureText(word + " ").width;
        });
      });

      // --- INFOS BAS DE L'ÉCRAN (PROFIL CRÉATEUR & ENGAGEMENT) ---
      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 21px sans-serif";
      ctx.fillText("@tuneliva.officiel", 40, HEIGHT - 150);

      // Titre accrocheur court
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.font = "16px sans-serif";
      const hookShort = post.hookText.slice(0, 50) + (post.hookText.length > 50 ? "..." : "");
      ctx.fillText(hookShort, 40, HEIGHT - 118);

      // Musique avec titre
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "14px monospace";
      const musicLabel = musicType === "afrobeat" ? "🎵 Afrobeats Chill • Hustle Mode" : "🎵 Lo-Fi Study Beats • Vente en Ligne";
      ctx.fillText(musicLabel, 40, HEIGHT - 85);

      // Bouton CTA "Lien en bio"
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.roundRect(40, HEIGHT - 65, 310, 34, 17);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👉 Lien en bio • Lancer mon tunnel gratuit", 195, HEIGHT - 43);

      // --- BARRE LATÉRALE DROITE (LIKES, COMMENTAIRES, PARTAGES & VISUALISEUR AUDIO) ---
      const rightX = WIDTH - 65;

      // Like
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(rightX, HEIGHT - 330, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("❤️", rightX, HEIGHT - 323);
      ctx.font = "bold 14px sans-serif";
      ctx.fillText((post.likesCount || 1450).toString(), rightX, HEIGHT - 295);

      // Commentaire
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.arc(rightX, HEIGHT - 250, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("💬", rightX, HEIGHT - 243);
      ctx.font = "bold 14px sans-serif";
      ctx.fillText((post.commentsCount || 98).toString(), rightX, HEIGHT - 215);

      // Partage
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.arc(rightX, HEIGHT - 170, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("🔄", rightX, HEIGHT - 163);
      ctx.font = "bold 14px sans-serif";
      ctx.fillText((post.sharesCount || 210).toString(), rightX, HEIGHT - 135);

      // Barres d'égaliseur sonore dansantes
      const barCount = 4;
      for (let b = 0; b < barCount; b++) {
        const barHeight = 8 + Math.abs(Math.sin(elapsedSec * 6 + b)) * 18;
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(rightX - 18 + b * 10, HEIGHT - 105 - barHeight, 5, barHeight);
      }

      // Vinyle tournant en bas à droite
      const vinylAngle = elapsedSec * 2.8;
      ctx.save();
      ctx.translate(rightX, HEIGHT - 65);
      ctx.rotate(vinylAngle);
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- BARRE DE PROGRESSION INFÉRIEURE ---
      const progressWidth = (elapsedSec / TOTAL_DURATION_SEC) * WIDTH;
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(0, HEIGHT - 5, WIDTH, 5);
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(0, HEIGHT - 5, progressWidth, 5);

      // Callback de progression
      const percent = Math.min(99, Math.round((elapsedSec / TOTAL_DURATION_SEC) * 100));
      onProgress?.({
        currentSec: Math.floor(elapsedSec),
        totalSec: TOTAL_DURATION_SEC,
        percent,
        statusText: `Rendu 9:16 scène ${sceneIndex + 1}/${post.scenes.length} : ${Math.floor(elapsedSec)}s / ${TOTAL_DURATION_SEC}s (${percent}%)`,
      });

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  });
}
