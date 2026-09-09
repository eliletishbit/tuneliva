/**
 * Tuneliva TikTok Video Compiler Engine
 * Moteur de rendu 9:16 vertical 100% gratuit et automatique
 * Compile les concepts et scripts en vraies vidéos vidéo/webm ou vidéo/mp4
 * Intègre : animations Ken Burns, sous-titres cinétiques mot par mot (style Alex Hormozi),
 * bande sonore dynamique (Web Audio API) et voix de synthèse TTS (SpeechSynthesis).
 */

import { TikTokVideoPost, TikTokScene } from "./generator";

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

// Fonction utilitaire pour charger une image en toute sécurité avec fallback si CORS
async function loadImageSafe(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Deuxième tentative sans crossOrigin
      const retryImg = new Image();
      retryImg.onload = () => resolve(retryImg);
      retryImg.onerror = () => resolve(null);
      retryImg.src = url;
    };
    img.src = url;
  });
}

// Création d'une ambiance sonore rythmique Lo-Fi / Amapiano via Web Audio API (100% gratuit)
function createAudioTrack(audioCtx: AudioContext, durationSec: number): MediaStreamAudioDestinationNode {
  const destination = audioCtx.createMediaStreamDestination();
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
  masterGain.connect(destination);

  const tempoBpm = 110;
  const beatInterval = 60 / tempoBpm;
  const totalBeats = Math.floor(durationSec / beatInterval);

  // Synthèse de percussions rythmées (Kick + Hi-hat + Bassline)
  for (let i = 0; i < totalBeats; i++) {
    const time = audioCtx.currentTime + i * beatInterval;

    // Kick sur les temps 1 et 3
    if (i % 2 === 0) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.15);
      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.22);
    }

    // Hi-hat sur chaque temps
    const hatOsc = audioCtx.createOscillator();
    const hatGain = audioCtx.createGain();
    hatOsc.type = "triangle";
    hatOsc.frequency.setValueAtTime(7000, time + (i % 2 === 1 ? 0 : beatInterval * 0.5));
    hatGain.gain.setValueAtTime(0.12, time + (i % 2 === 1 ? 0 : beatInterval * 0.5));
    hatGain.gain.exponentialRampToValueAtTime(0.001, time + (i % 2 === 1 ? 0 : beatInterval * 0.5) + 0.05);
    hatOsc.connect(hatGain);
    hatGain.connect(masterGain);
    hatOsc.start(time);
    hatOsc.stop(time + 0.08);

    // Accord mélodique doux tous les 4 temps
    if (i % 4 === 0) {
      const chordNotes = [220, 277.18, 329.63, 440]; // Accord Am
      chordNotes.forEach((freq) => {
        const chordOsc = audioCtx.createOscillator();
        const chordGain = audioCtx.createGain();
        chordOsc.type = "sine";
        chordOsc.frequency.setValueAtTime(freq, time);
        chordGain.gain.setValueAtTime(0.08, time);
        chordGain.gain.exponentialRampToValueAtTime(0.001, time + beatInterval * 3.5);
        chordOsc.connect(chordGain);
        chordGain.connect(masterGain);
        chordOsc.start(time);
        chordOsc.stop(time + beatInterval * 3.8);
      });
    }
  }

  return destination;
}

// Déclencheur vocal TTS (SpeechSynthesis) synchronisé
function speakTextSync(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1.12;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignoré si SpeechSynthesis non disponible
  }
}

/**
 * Compile un TikTokVideoPost en vraie vidéo MP4 / WebM
 * @param post TikTokVideoPost
 * @param onProgress Callback de progression
 */
export async function compileTikTokVideo(
  post: TikTokVideoPost,
  onProgress?: (p: VideoRenderProgress) => void
): Promise<CompiledVideoResult> {
  if (typeof window === "undefined") {
    throw new Error("La compilation vidéo s'exécute dans l'environnement navigateur.");
  }

  // Dimensions verticales standard 9:16 (HD 720 x 1280 pour rapidité et fluidité maximale)
  const WIDTH = 720;
  const HEIGHT = 1280;
  const FPS = 30;
  const TOTAL_DURATION_SEC = post.durationSec || 20;

  // Création du canvas hors écran
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Impossible d'initialiser le contexte Canvas 2D.");
  }

  onProgress?.({
    currentSec: 0,
    totalSec: TOTAL_DURATION_SEC,
    percent: 5,
    statusText: "Préchargement des visuels haute définition...",
  });

  // 1. Préchargement de toutes les images des scènes
  const sceneImages: (HTMLImageElement | null)[] = [];
  for (let i = 0; i < post.scenes.length; i++) {
    const scene = post.scenes[i];
    const img = await loadImageSafe(scene.bgImageUrl);
    sceneImages.push(img);
  }

  // 2. Initialisation Web Audio pour la bande sonore
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  let audioCtx: AudioContext | null = null;
  let audioDestination: MediaStreamAudioDestinationNode | null = null;

  try {
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      audioDestination = createAudioTrack(audioCtx, TOTAL_DURATION_SEC);
    }
  } catch {
    // Si audio bloqué par politique autoplay, continuer avec vidéo muette
  }

  // 3. Configuration du flux MediaStream et MediaRecorder
  const videoStream = canvas.captureStream(FPS);
  const tracks: MediaStreamTrack[] = [...videoStream.getVideoTracks()];

  if (audioDestination && audioDestination.stream) {
    const audioTracks = audioDestination.stream.getAudioTracks();
    if (audioTracks.length > 0) {
      tracks.push(audioTracks[0]);
    }
  }

  const combinedStream = new MediaStream(tracks);

  // Choix du codec supporté (mp4 en priorité si supporté, sinon webm compatible universel)
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
    videoBitsPerSecond: 3_500_000, // 3.5 Mbps haute fidélité
  });

  const recordedChunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  recorder.start(100);

  // Déclencher la première narration vocale
  speakTextSync(post.scenes[0]?.subtitle || post.hookText);

  // 4. Boucle de rendu frame par frame synchronisée
  let lastSpokenSceneIndex = 0;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    recorder.onerror = (err) => reject(err);

    recorder.onstop = () => {
      try {
        if (audioCtx) {
          audioCtx.close();
        }
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
        statusText: "Compilation terminée avec succès !",
      });

      resolve({
        blob,
        url,
        durationSec: TOTAL_DURATION_SEC,
        fileName,
      });
    };

    const renderLoop = () => {
      const elapsedSec = (Date.now() - startTime) / 1000;

      if (elapsedSec >= TOTAL_DURATION_SEC) {
        recorder.stop();
        return;
      }

      // Déterminer la scène active
      let sceneIndex = post.scenes.findIndex(
        (sc) => elapsedSec >= sc.second && elapsedSec < sc.second + sc.durationSec
      );
      if (sceneIndex === -1) {
        sceneIndex = post.scenes.length - 1;
      }

      const activeScene: TikTokScene = post.scenes[sceneIndex] || post.scenes[0];
      const activeImg = sceneImages[sceneIndex] || sceneImages[0];

      // Déclencher la voix TTS au changement de scène
      if (sceneIndex !== lastSpokenSceneIndex) {
        lastSpokenSceneIndex = sceneIndex;
        speakTextSync(activeScene.subtitle);
      }

      // Progression dans la scène actuelle (0 à 1)
      const sceneElapsed = Math.max(0, elapsedSec - activeScene.second);
      const sceneProgress = Math.min(1, sceneElapsed / (activeScene.durationSec || 1));

      // --- DESSIN DU FOND AVEC EFFET KEN BURNS (ZOOM PROGRESSIF) ---
      ctx.fillStyle = "#0a0d18";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (activeImg) {
        const zoom = 1.0 + sceneProgress * 0.12; // Zoom de 1.0x à 1.12x
        const imgWidth = WIDTH * zoom;
        const imgHeight = HEIGHT * zoom;
        const offsetX = (WIDTH - imgWidth) / 2;
        const offsetY = (HEIGHT - imgHeight) / 2;

        ctx.drawImage(activeImg, offsetX, offsetY, imgWidth, imgHeight);
      } else {
        // Dégradé géométrique stylisé si image inaccessible
        const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
        grad.addColorStop(0, "#311042");
        grad.addColorStop(0.5, "#101935");
        grad.addColorStop(1, "#07202b");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
      }

      // Dégradés sombres TikTok (Haut et Bas) pour lisibilité optimale
      const topGrad = ctx.createLinearGradient(0, 0, 0, 260);
      topGrad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, WIDTH, 260);

      const bottomGrad = ctx.createLinearGradient(0, HEIGHT - 420, 0, HEIGHT);
      bottomGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      bottomGrad.addColorStop(1, "rgba(0, 0, 0, 0.92)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, HEIGHT - 420, WIDTH, 420);

      // --- BARRE SUPÉRIEURE TIKTOK ---
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(post.scheduledTime, 40, 50);

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "900 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Pour toi", WIDTH / 2, 70);

      // Badge Pilier / Catégorie
      const catBadgeWidth = 320;
      const catBadgeX = (WIDTH - catBadgeWidth) / 2;
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.beginPath();
      ctx.roundRect(catBadgeX, 95, catBadgeWidth, 38, 19);
      ctx.fill();

      ctx.fillStyle = post.categoryColor || "#38bdf8";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(post.category.toUpperCase(), WIDTH / 2, 120);

      // --- SOUS-TITRES CINÉTIQUES MOT PAR MOT (STYLE ALEX HORMOZI) ---
      ctx.textAlign = "center";
      const subtitleText = activeScene.subtitle;
      const words = subtitleText.split(" ");
      const highlightWordClean = (activeScene.highlightWord || "").toLowerCase().replace(/[^a-zA-Z0-9]/g, "");

      // Mesure et découpage en 2 lignes maximum
      const lines: string[][] = [[]];
      let currentLineLength = 0;

      for (const word of words) {
        if (currentLineLength + word.length > 22 && lines.length < 3) {
          lines.push([word]);
          currentLineLength = word.length;
        } else {
          lines[lines.length - 1].push(word);
          currentLineLength += word.length + 1;
        }
      }

      // Boîte de sous-titres flottante
      const boxHeight = lines.length * 52 + 36;
      const boxY = HEIGHT / 2 - boxHeight / 2;
      const boxWidth = WIDTH - 60;
      const boxX = 30;

      ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dessin des mots avec surbrillance jaune néon sur le mot clé
      lines.forEach((lineWords, lineIdx) => {
        const lineY = boxY + 44 + lineIdx * 50;
        ctx.font = "900 32px sans-serif";

        // Calcul de la largeur totale de la ligne
        const totalLineWidth = lineWords.reduce((acc, w) => acc + ctx.measureText(w + " ").width, 0);
        let currentX = WIDTH / 2 - totalLineWidth / 2;

        lineWords.forEach((word) => {
          const cleanW = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
          const isHighlight = cleanW === highlightWordClean;

          if (isHighlight) {
            ctx.fillStyle = "#facc15"; // Jaune néon TikTok
            ctx.shadowColor = "rgba(250, 204, 21, 0.8)";
            ctx.shadowBlur = 15;
            ctx.font = "900 35px sans-serif";
          } else {
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 4;
            ctx.font = "900 32px sans-serif";
          }

          ctx.textAlign = "left";
          ctx.fillText(word, currentX, lineY);

          // Réinitialiser les ombres
          ctx.shadowBlur = 0;
          currentX += ctx.measureText(word + " ").width;
        });
      });

      // --- INFOS BAS DU SMARTPHONE (PROFIL CRÉATEUR & ENGAGEMENT) ---
      // Profil à gauche
      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("@tuneliva.officiel", 40, HEIGHT - 150);

      // Titre / Hook
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "16px sans-serif";
      const hookShort = post.hookText.slice(0, 52) + (post.hookText.length > 52 ? "..." : "");
      ctx.fillText(hookShort, 40, HEIGHT - 118);

      // Musique avec icône note
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "14px monospace";
      ctx.fillText(`🎵 ${post.musicTrack.slice(0, 36)}`, 40, HEIGHT - 85);

      // Bouton CTA "Lien en bio"
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.roundRect(40, HEIGHT - 65, 300, 32, 16);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("👉 Lien en bio • Découvrir l'article", 190, HEIGHT - 44);

      // --- BARRE LATÉRALE DROITE (LIKES, COMMENTAIRES, PARTAGES) ---
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

      // Vinyle tournant
      const vinylAngle = elapsedSec * 2.5;
      ctx.save();
      ctx.translate(rightX, HEIGHT - 75);
      ctx.rotate(vinylAngle);
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // --- BARRE DE PROGRESSION INFÉRIEURE ---
      const progressWidth = (elapsedSec / TOTAL_DURATION_SEC) * WIDTH;
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(0, HEIGHT - 5, WIDTH, 5);
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(0, HEIGHT - 5, progressWidth, 5);

      // Callback de progression
      const percent = Math.min(99, Math.round((elapsedSec / TOTAL_DURATION_SEC) * 100));
      onProgress?.({
        currentSec: Math.floor(elapsedSec),
        totalSec: TOTAL_DURATION_SEC,
        percent,
        statusText: `Rendu frame par frame 9:16 : ${Math.floor(elapsedSec)}s / ${TOTAL_DURATION_SEC}s (${percent}%)`,
      });

      // Frame suivante
      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  });
}
