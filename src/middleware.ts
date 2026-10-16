import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de borda (Edge) para segurança de APIs.
 * Intercepta requisições destinadas a /api/* e valida autenticação antes de alcançar os Route Handlers.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const authHeader = request.headers.get('authorization');

    // Simulação de validação de token na borda (Edge Authentication)
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

  return NextResponse.next();
}

// Compatibilidade com convenção Proxy do Next.js 16+
export const proxy = middleware;

export const config = {
  matcher: ['/api/:path*'],
};
