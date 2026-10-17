import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Middleware Clerk combinado com proteção de rotas de API e páginas da plataforma.
 */
export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Rotas de API exigem autenticação estrita do Clerk (retorna 401 JSON sem userId)
  if (pathname.startsWith('/api')) {
    const session = await auth();
    if (!session.userId) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'Usuário não autenticado. Acesso negado.',
        },
        { status: 401 }
      );
    }
    return;
  }

  // Rotas da aplicação protegidas na plataforma web
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/hub-matematico') ||
    pathname.startsWith('/financeiro') ||
    pathname.startsWith('/imobiliario') ||
    pathname.startsWith('/fiscal')
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
