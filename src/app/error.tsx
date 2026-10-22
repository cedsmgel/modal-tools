"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error caught by Next.js Error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center p-6">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        Não foi possível carregar a página
      </h2>
      <p className="text-sm text-zinc-500 max-w-md">
        {error?.message || "Ocorreu uma falha temporária. Por favor, tente novamente."}
      </p>
      <Button onClick={() => reset()} size="sm" variant="outline">
        Recarregar
      </Button>
    </div>
  );
}
