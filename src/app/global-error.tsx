"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught by Next.js GlobalError boundary:", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-zinc-950 text-white font-sans p-4">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold">Ocorreu um erro no carregamento</h2>
          <p className="text-sm text-zinc-400">
            {error?.message || "Falha temporária ao inicializar o serviço."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-xs font-semibold bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
