import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Vérification instantanée et universelle de signature TikTok (tout token & tout chemin)
  const tiktokMatch = pathname.match(/tiktok([a-zA-Z0-9_-]+)\.txt$/i);
  if (tiktokMatch) {
    const token = tiktokMatch[1];
    return new Response(`tiktok-developers-site-verification=${token}`, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }

  const host = request.headers.get("host")?.toLowerCase() || "";
  const isDefaultDomain =
    host.includes("tuneliva") ||
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("ngrok") ||
    host.includes("vercel.app");

  // Routage transparent des Noms de Domaine Personnalisés (Custom Domains)
  if (
    !isDefaultDomain &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/p/")
  ) {
    const cleanHost = host.split(":")[0];
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/p/${cleanHost}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const DEFAULT_SUPABASE_URL = "https://lqmjupbtxjtbepmpdgsq.supabase.co";
  const DEFAULT_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbWp1cGJ0eGp0YmVwbXBkZ3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2Mzk0MDcsImV4cCI6MjEwNDIxNTQwN30.XAeyS_nr68fQsc8iJZm1hthwMg5D0eDutj1ZeiXxyl8";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    user = null;
  }

  // Protection du tableau de bord vendeur
  if (pathname.startsWith("/dashboard")) {
    const allCookies = request.cookies.getAll();
    const hasAnyAuthCookie = allCookies.some(
      (c) => c.name.includes("auth-token") || c.name.startsWith("sb-")
    );

    // Si aucune trace de session dans les cookies serveur et aucun user authentifié
    if (!hasAnyAuthCookie && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Si déjà connecté et visite la page de connexion, redirection propre sans boucle
  if (pathname === "/login" && user) {
    const referer = request.headers.get("referer") || "";
    if (!referer.includes("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
