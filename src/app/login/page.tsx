"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Sparkles,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  KeyRound,
  Send,
  ExternalLink,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const supabase = createClient();

  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authMethod, setAuthMethod] = useState<"password" | "magic_link" | "phone">("password");

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Phone OTP state
  const [phoneCountryCode, setPhoneCountryCode] = useState("+229");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpChannel, setOtpChannel] = useState<"sms" | "whatsapp">("whatsapp");

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Configuration alerts
  const [googleConfigError, setGoogleConfigError] = useState(false);
  const [phoneConfigError, setPhoneConfigError] = useState(false);

  // Détection automatique de session active (ex: validation email / redirection hash / déjà connecté)
  useEffect(() => {
    let isMounted = true;
    const checkActiveSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          window.location.href = redirectPath;
        }
      } catch (err) {
        console.warn("Session check error:", err);
      }
    };
    checkActiveSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session && isMounted) {
        window.location.href = redirectPath;
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [redirectPath, supabase]);

  // 1. CONNEXION / INSCRIPTION EMAIL & MOT DE PASSE
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleConfigError(false);
    setPhoneConfigError(false);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
              redirectPath
            )}`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          window.location.href = redirectPath;
        } else {
          setSuccessMessage(
            "Compte créé avec succès ! Si un email de confirmation vous a été envoyé, cliquez sur le lien pour valider votre inscription."
          );
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (data?.session) {
          window.location.href = redirectPath;
        } else {
          router.push(redirectPath);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.message === "Invalid login credentials"
          ? "Identifiants incorrects. Vérifiez votre email et mot de passe."
          : err.message || "Une erreur est survenue lors de l'authentification."
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. CONNEXION PAR LIEN MAGIQUE (EMAIL SANS MOT DE PASSE)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Veuillez saisir votre adresse email.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setGoogleConfigError(false);
    setPhoneConfigError(false);

    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            redirectPath
          )}`,
        },
      });

      if (error) throw error;

      setSuccessMessage(
        `Lien de connexion instantané envoyé à ${email} ! Consultez votre boîte de réception (et vos spams si besoin) et cliquez sur le lien pour vous connecter immédiatement.`
      );
    } catch (err: any) {
      setErrorMessage(
        err.message || "Impossible d'envoyer le lien de connexion sécurisé."
      );
    } finally {
      setLoading(false);
    }
  };

  // 3. CONNEXION GOOGLE OAUTH
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMessage(null);
    setGoogleConfigError(false);
    setPhoneConfigError(false);

    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            redirectPath
          )}`,
        },
      });

      if (error) {
        if (
          error.message?.includes("provider is not enabled") ||
          error.message?.includes("validation_failed") ||
          (error as any).code === "validation_failed"
        ) {
          setGoogleConfigError(true);
        } else {
          setErrorMessage(error.message);
        }
      }
    } catch (err: any) {
      if (
        err.message?.includes("provider is not enabled") ||
        err.message?.includes("validation_failed")
      ) {
        setGoogleConfigError(true);
      } else {
        setErrorMessage(err.message || "Erreur lors de la connexion avec Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. ENVOI OTP TÉLÉPHONE (WHATSAPP OU SMS)
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMessage("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPhoneConfigError(false);

    const fullPhone = `${phoneCountryCode}${phoneNumber.replace(/\s+/g, "")}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
        options: {
          channel: otpChannel,
        },
      });

      if (error) {
        if (
          error.message?.toLowerCase().includes("unsupported phone provider") ||
          error.message?.toLowerCase().includes("provider") ||
          (error as any).code === "validation_failed"
        ) {
          setPhoneConfigError(true);
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      setOtpSent(true);
      setSuccessMessage(
        `Code de confirmation envoyé par ${
          otpChannel === "whatsapp" ? "WhatsApp" : "SMS"
        } au ${fullPhone}`
      );
    } catch (err: any) {
      if (
        err.message?.toLowerCase().includes("unsupported phone provider") ||
        err.message?.toLowerCase().includes("provider")
      ) {
        setPhoneConfigError(true);
      } else {
        setErrorMessage(
          err.message || "Impossible d'envoyer le code par SMS/WhatsApp."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. VÉRIFICATION OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage("Veuillez saisir le code à 6 chiffres reçu.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const fullPhone = `${phoneCountryCode}${phoneNumber.replace(/\s+/g, "")}`;

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otpCode.trim(),
        type: "sms",
      });

      if (error) throw error;
      router.push(redirectPath);
    } catch (err: any) {
      setErrorMessage(err.message || "Code secret invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A0D18]/95 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
        {/* LOGO & EN-TÊTE UNIVERSEL */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tuneliva Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {authMode === "signin" ? "Connexion à votre espace" : "Créer votre compte"}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {authMode === "signin"
              ? "Gérez vos tunnels, billetteries, formations, lancements et commandes."
              : "Créez vos tunnels de conversion haute performance en quelques clics."}
          </p>
        </div>

        {/* ALERTE SPÉCIALE : ACTIVATION GOOGLE OAUTH */}
        {googleConfigError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Activation de Google OAuth requise dans Supabase</span>
            </div>
            <p className="text-[11px] text-amber-300/90 leading-relaxed">
              Le fournisseur Google n'est pas encore activé dans votre console Supabase. Pour l'activer :
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-300">
              <li>Rendez-vous dans votre tableau de bord Supabase &gt; Authentication &gt; Providers &gt; Google.</li>
              <li>Activez le switch <strong>Enable Google provider</strong>.</li>
              <li>Saisissez vos identifiants Client ID et Client Secret (Google Cloud).</li>
            </ol>
            <div className="pt-1 flex items-center justify-between">
              <a
                href="https://supabase.com/dashboard/project/lqmjupbtxjtbepmpdgsq/auth/providers"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:underline"
              >
                <span>Ouvrir Supabase Providers</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setGoogleConfigError(false);
                  setAuthMethod("password");
                }}
                className="text-[11px] font-bold text-white bg-indigo-600/60 hover:bg-indigo-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Utiliser Email & Mot de passe
              </button>
            </div>
          </div>
        )}

        {/* ALERTE SPÉCIALE : CONFIGURATION SMS / WHATSAPP REQUISE */}
        {phoneConfigError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Passerelle SMS / WhatsApp non configurée dans Supabase</span>
            </div>
            <p className="text-[11px] text-amber-300/90 leading-relaxed">
              Pour envoyer de vrais SMS ou messages WhatsApp via Supabase, un fournisseur externe (Twilio, MessageBird, Vonage) doit être connecté dans <strong>Authentication &gt; Providers &gt; Phone</strong>.
            </p>
            <p className="text-[11px] text-slate-300 font-semibold">
              👉 Pour vous connecter dès maintenant sans attendre de fournisseur SMS : utilisez l'authentification par <strong>Email &amp; Mot de passe</strong> ou le <strong>Lien Magique</strong> ci-dessous !
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPhoneConfigError(false);
                  setAuthMethod("password");
                }}
                className="text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Connexion Email &amp; Mot de passe
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhoneConfigError(false);
                  setAuthMethod("magic_link");
                }}
                className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Lien Magique
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES D'ALERTE GÉNÉRAUX */}
        {errorMessage && !googleConfigError && !phoneConfigError && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* SÉLECTEUR DE MÉTHODE D'AUTHENTIFICATION */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-950 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("password");
              setErrorMessage(null);
              setGoogleConfigError(false);
              setPhoneConfigError(false);
            }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
              authMethod === "password"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Mot de passe</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("magic_link");
              setErrorMessage(null);
              setGoogleConfigError(false);
              setPhoneConfigError(false);
            }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
              authMethod === "magic_link"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Lien Magique</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setErrorMessage(null);
              setGoogleConfigError(false);
              setPhoneConfigError(false);
            }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px] sm:text-xs ${
              authMethod === "phone"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Téléphone OTP</span>
          </button>
        </div>

        {/* 1. FORMULAIRE EMAIL & MOT DE PASSE */}
        {authMethod === "password" && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authMode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Nom complet ou Raison Sociale
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Amina Diallo ou Agence Digitale"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : authMode === "signin" ? (
                <>
                  <span>Se connecter à Tuneliva</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Créer mon compte Tuneliva</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. FORMULAIRE LIEN MAGIQUE SANS MOT DE PASSE */}
        {authMethod === "magic_link" && (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
              ✨ <strong>Connexion 1-clic sans mot de passe :</strong> saisissez votre email et recevez un lien sécurisé d'accès direct dans votre boîte de réception.
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Votre Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>M'envoyer mon lien de connexion</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. FORMULAIRE TÉLÉPHONE / WHATSAPP OTP */}
        {authMethod === "phone" && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Numéro de Téléphone
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className="px-2.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none shrink-0"
                    >
                      <option value="+229">🇧🇯 +229 (Bénin)</option>
                      <option value="+225">🇨🇮 +225 (Côte d'Ivoire)</option>
                      <option value="+221">🇸🇳 +221 (Sénégal)</option>
                      <option value="+228">🇹🇬 +228 (Togo)</option>
                      <option value="+226">🇧🇫 +226 (Burkina)</option>
                      <option value="+237">🇨🇲 +237 (Cameroun)</option>
                      <option value="+223">🇲🇱 +223 (Mali)</option>
                      <option value="+227">🇳🇪 +227 (Niger)</option>
                      <option value="+33">🇫🇷 +33 (France)</option>
                      <option value="+1">🇺🇸 +1 (USA/Canada)</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="97 00 00 00"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Canal de réception du code
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpChannel("whatsapp")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                        otpChannel === "whatsapp"
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : "bg-slate-950 border-white/10 text-slate-400"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpChannel("sms")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                        otpChannel === "sms"
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                          : "bg-slate-950 border-white/10 text-slate-400"
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      <span>SMS Direct</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-95 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Envoyer mon code secret</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Code secret à 6 chiffres
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.5em] text-lg font-mono px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="py-2.5 px-3 rounded-xl border border-white/10 bg-slate-950 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    ← Modifier le numéro
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Valider &amp; Entrer</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SÉPARATEUR OU */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0A0D18] px-3 text-[10px] uppercase font-bold text-slate-500 relative">
            Ou continuer avec
          </span>
        </div>

        {/* BOUTON GOOGLE 1-CLIC */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </button>

        {/* BASCULE INSCRIPTION / CONNEXION */}
        <div className="text-center pt-2 border-t border-white/10">
          {authMode === "signin" ? (
            <p className="text-xs text-slate-400">
              Vous n'avez pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setGoogleConfigError(false);
                  setPhoneConfigError(false);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer"
              >
                Inscrivez-vous ici
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setGoogleConfigError(false);
                  setPhoneConfigError(false);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer"
              >
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#05060A] flex flex-col items-center justify-center text-white space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <span className="text-xs text-slate-400 font-semibold">
            Chargement sécurisé...
          </span>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
