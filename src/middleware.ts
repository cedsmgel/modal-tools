import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Middleware Clerk combinado com proteção de rotas de API na borda.
 */
export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/hub-matematico')
  ) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Pula rotas internas do Next.js e arquivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Executa sempre para rotas de API
    '/(api|trpc)(.*)',
  ],
};
