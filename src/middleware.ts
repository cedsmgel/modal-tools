import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Middleware Clerk combinado com proteção de rotas de API na borda.
 */
export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer mock-token') {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Acesso não autorizado na borda. Header "Authorization: Bearer mock-token" é obrigatório.',
        },
        { status: 401 }
      );
    }
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
