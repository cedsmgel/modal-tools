import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/account(.*)',
  '/hub-matematico(.*)',
  '/financeiro(.*)',
  '/imobiliario(.*)',
  '/fiscal(.*)',
]);

/**
 * Middleware Clerk combinado com proteção de rotas de API e páginas da plataforma.
 */
export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Rotas de API exigem autenticação estrita do Clerk (retorna 401 JSON sem userId)
  if (pathname.startsWith('/api')) {
    const session = await auth();
    if (!session.userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Usuário não autenticado. Acesso negado.',
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Rotas da aplicação protegidas na plataforma web
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Executa APENAS para rotas da API e páginas autenticadas/protegidas da aplicação
    '/api/(.*)',
    '/dashboard(.*)',
    '/account(.*)',
    '/hub-matematico(.*)',
    '/financeiro(.*)',
    '/imobiliario(.*)',
    '/fiscal(.*)',
  ],
};
