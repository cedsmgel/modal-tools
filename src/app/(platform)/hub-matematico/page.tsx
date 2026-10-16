"use client";

import * as React from "react";
import {
  Binary,
  Calculator,
  Scale,
  Code2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// =========================================================================
// 1. CONVERSOR DE SISTEMAS NUMÉRICOS (BASE CONVERTER)
// =========================================================================

type NumberBase = 2 | 8 | 10 | 16;

interface BaseOption {
  label: string;
  name: string;
  base: NumberBase;
  prefix: string;
  placeholder: string;
  validator: RegExp;
}

const BASE_OPTIONS: BaseOption[] = [
  {
    label: "Binário (Base 2)",
    name: "Binário",
    base: 2,
    prefix: "0b",
    placeholder: "Ex: 1010110",
    validator: /^[01]+$/,
  },
  {
    label: "Octal (Base 8)",
    name: "Octal",
    base: 8,
    prefix: "0o",
    placeholder: "Ex: 126",
    validator: /^[0-7]+$/,
  },
  {
    label: "Decimal (Base 10)",
    name: "Decimal",
    base: 10,
    prefix: "",
    placeholder: "Ex: 86",
    validator: /^[0-9]+$/,
  },
  {
    label: "Hexadecimal (Base 16)",
    name: "Hexadecimal",
    base: 16,
    prefix: "0x",
    placeholder: "Ex: 56 ou 2A",
    validator: /^[0-9a-fA-F]+$/,
  },
];

function formatBinaryWithSpaces(binStr: string): string {
  // Agrupa em nibbles (blocos de 4 bits) da direita para a esquerda
  const padded = binStr.padStart(Math.ceil(binStr.length / 4) * 4, "0");
  return padded.replace(/(.{4})/g, "$1 ").trim();
}

function BaseConverterSection() {
  const [inputValue, setInputValue] = React.useState<string>("42");
  const [currentBase, setCurrentBase] = React.useState<NumberBase>(10);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const activeOption = BASE_OPTIONS.find((b) => b.base === currentBase) || BASE_OPTIONS[2];
  const cleanInput = inputValue.trim().replace(/^0[bBoOxX]/, "");
  const isValid = cleanInput === "" || activeOption.validator.test(cleanInput);

  let bigIntValue: bigint | null = null;
  if (isValid && cleanInput !== "") {
    try {
      if (currentBase === 2) bigIntValue = BigInt(`0b${cleanInput}`);
      else if (currentBase === 8) bigIntValue = BigInt(`0o${cleanInput}`);
      else if (currentBase === 10) bigIntValue = BigInt(cleanInput);
      else if (currentBase === 16) bigIntValue = BigInt(`0x${cleanInput}`);
    } catch {
      bigIntValue = null;
    }
  }

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const getConvertedValues = () => {
    if (bigIntValue === null) {
      return {
        bin: "—",
        binFormatted: "—",
        oct: "—",
        dec: "—",
        hex: "—",
        bits: 0,
        bytes: 0,
      };
    }
    const bin = bigIntValue.toString(2);
    return {
      bin,
      binFormatted: formatBinaryWithSpaces(bin),
      oct: bigIntValue.toString(8),
      dec: bigIntValue.toString(10),
      hex: bigIntValue.toString(16).toUpperCase(),
      bits: bin.length,
      bytes: Math.ceil(bin.length / 8),
    };
  };

  const converted = getConvertedValues();

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Binary className="h-4 w-4 text-emerald-400" />
                Conversor de Sistemas Numéricos
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Conversão instantânea bidirecional entre Decimal, Binário, Hexadecimal e Octal com precisão inteira arbitrária (BigInt).
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-zinc-400 border-zinc-800 font-mono">
              Base Radix Engine
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Seletor de Base de Entrada & Input */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Base de Origem</label>
              <div className="grid grid-cols-2 gap-1.5">
                {BASE_OPTIONS.map((opt) => (
                  <button
                    key={opt.base}
                    type="button"
                    onClick={() => {
                      setCurrentBase(opt.base);
                      if (bigIntValue !== null) {
                        setInputValue(bigIntValue.toString(opt.base));
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors border ${
                      currentBase === opt.base
                        ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                        : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <span className="block font-semibold">{opt.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">Base {opt.base}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">
                  Valor de Entrada ({activeOption.label})
                </label>
                {cleanInput && (
                  <button
                    type="button"
                    onClick={() => setInputValue("")}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={activeOption.placeholder}
                  className={`font-mono text-base tabular-nums h-11 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 ${
                    !isValid ? "border-rose-500/80 focus-visible:ring-rose-500" : ""
                  }`}
                />
              </div>
              {!isValid ? (
                <p className="text-[11px] text-rose-400">
                  Dígito inválido para {activeOption.name}. Utilize apenas caracteres válidos desta base.
                </p>
              ) : (
                <p className="text-[11px] text-zinc-500 font-mono">
                  {bigIntValue !== null ? `${converted.bits} bits (${converted.bytes} byte${converted.bytes > 1 ? "s" : ""}) alocados` : "Aguardando entrada numérica..."}
                </p>
              )}
            </div>
          </div>

          {/* Grade de Resultados das 4 Bases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {BASE_OPTIONS.map((opt) => {
              let val = "—";
              let displayVal = "—";
              if (bigIntValue !== null) {
                if (opt.base === 2) {
                  val = converted.bin;
                  displayVal = converted.binFormatted;
                } else if (opt.base === 8) {
                  val = converted.oct;
                  displayVal = converted.oct;
                } else if (opt.base === 10) {
                  val = converted.dec;
                  displayVal = Number(converted.dec).toLocaleString("pt-BR");
                } else if (opt.base === 16) {
                  val = converted.hex;
                  displayVal = `0x${converted.hex}`;
                }
              }

              const isCopied = copiedKey === `base-${opt.base}`;

              return (
                <div
                  key={opt.base}
                  className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4 transition-all hover:border-zinc-700/80"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-zinc-400">
                      {opt.name} <span className="font-mono text-zinc-500 text-[10px]">(Base {opt.base})</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(val !== "—" ? val : "", `base-${opt.base}`)}
                      disabled={val === "—"}
                      className="h-7 px-2 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      {isCopied ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="h-3 w-3" /> Copiado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="h-3 w-3" /> Copiar
                        </span>
                      )}
                    </Button>
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-white tabular-nums tracking-wide break-all select-all">
                    {displayVal}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================================
// 2. CALCULADORA ESTATÍSTICA RÁPIDA (ARRAY STATS)
// =========================================================================

interface StatsResult {
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  isAmodal: boolean;
  varianceSample: number;
  variancePop: number;
  stdDevSample: number;
  stdDevPop: number;
  min: number;
  max: number;
  range: number;
}

function computeStatistics(numbers: number[]): StatsResult | null {
  if (numbers.length === 0) return null;

  const n = numbers.length;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / n;

  // Ordenação para mediana, min e max
  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  // Mediana
  let median: number;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    median = sorted[mid];
  } else {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // Moda
  const frequencyMap = new Map<number, number>();
  for (const num of numbers) {
    frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
  }

  let maxFreq = 0;
  for (const freq of frequencyMap.values()) {
    if (freq > maxFreq) maxFreq = freq;
  }

  const modes: number[] = [];
  let isAmodal = false;
  if (maxFreq === 1 && n > 1) {
    isAmodal = true;
  } else {
    for (const [val, freq] of frequencyMap.entries()) {
      if (freq === maxFreq) modes.push(val);
    }
    modes.sort((a, b) => a - b);
  }

  // Variâncias e Desvios Padrão
  const sumSquaresDiff = numbers.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
  const variancePop = sumSquaresDiff / n;
  const stdDevPop = Math.sqrt(variancePop);

  const varianceSample = n > 1 ? sumSquaresDiff / (n - 1) : 0;
  const stdDevSample = Math.sqrt(varianceSample);

  return {
    count: n,
    sum,
    mean,
    median,
    modes,
    isAmodal,
    varianceSample,
    variancePop,
    stdDevSample,
    stdDevPop,
    min,
    max,
    range,
  };
}

function ArrayStatsSection() {
  const [inputText, setInputText] = React.useState<string>(
    "12, 24, 35, 18, 42, 24, 56, 31, 24, 60"
  );
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  // Parser robusto: extrai números separados por vírgula, espaço, ponto e vírgula ou nova linha
  const parsedNumbers = React.useMemo(() => {
    if (!inputText.trim()) return [];
    // Substitui vírgulas isoladas ou separadores por espaço para tokenizar
    const tokens = inputText
      .replace(/;/g, " ")
      .replace(/,/g, " ")
      .split(/\s+/)
      .filter((t) => t.trim() !== "");

    const validNums: number[] = [];
    for (const t of tokens) {
      const parsed = parseFloat(t);
      if (!isNaN(parsed) && isFinite(parsed)) {
        validNums.push(parsed);
      }
    }
    return validNums;
  }, [inputText]);

  const stats = React.useMemo(() => computeStatistics(parsedNumbers), [parsedNumbers]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const loadExample = (type: "finance" | "symmetric" | "simple") => {
    if (type === "finance") {
      setInputText("154.20, 162.80, 158.40, 171.10, 169.50, 165.30, 178.00, 174.90");
    } else if (type === "symmetric") {
      setInputText("10, 20, 30, 40, 50, 60, 70, 80, 90");
    } else {
      setInputText("5, 8, 12, 8, 14, 8, 19, 21, 25");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Calculator className="h-4 w-4 text-indigo-400" />
                Calculadora Estatística Rápida (Array Stats)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Cole uma lista de números separados por vírgula, espaço ou quebra de linha para análise estatística univariada instantânea.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample("finance")}
                className="h-7 text-[10px] border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
              >
                Exemplo Financeiro
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExample("symmetric")}
                className="h-7 text-[10px] border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
              >
                Linear 10-90
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Textarea de Entrada */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Conjunto Amostral de Dados (N = {parsedNumbers.length})
              </label>
              {inputText && (
                <button
                  type="button"
                  onClick={() => setInputText("")}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Limpar dados
                </button>
              )}
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: 10, 25, 14, 32, 45 ou cole valores de uma planilha..."
              rows={3}
              className="font-mono text-sm tabular-nums bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
            <p className="text-[11px] text-zinc-500">
              Formatos aceitos: números inteiros ou decimais separados por vírgula (<code className="text-zinc-400">,</code>), ponto e vírgula (<code className="text-zinc-400">;</code>), espaços ou quebra de linha.
            </p>
          </div>

          {/* Grid de Métricas Estatísticas Calculadas */}
          {stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {/* Média */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Média Aritmética (x̄)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(stats.mean.toString(), "mean")}
                      className="h-5 w-5 p-0 text-zinc-500 hover:text-white"
                    >
                      {copiedKey === "mean" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-white tabular-nums">
                    {stats.mean.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Soma dividida por N</p>
                </div>

                {/* Mediana */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Mediana (Md)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(stats.median.toString(), "median")}
                      className="h-5 w-5 p-0 text-zinc-500 hover:text-white"
                    >
                      {copiedKey === "median" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-white tabular-nums">
                    {stats.median.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Ponto central 50% ordenado</p>
                </div>

                {/* Moda */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Moda (Mo)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(stats.isAmodal ? "Amodal" : stats.modes.join(", "), "mode")}
                      className="h-5 w-5 p-0 text-zinc-500 hover:text-white"
                    >
                      {copiedKey === "mode" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-white tabular-nums truncate">
                    {stats.isAmodal ? "Amodal" : stats.modes.join(", ")}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {stats.isAmodal ? "Valores sem repetição" : `Frequência de maior repetição`}
                  </p>
                </div>

                {/* Soma Total */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Soma Total (Σ)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(stats.sum.toString(), "sum")}
                      className="h-5 w-5 p-0 text-zinc-500 hover:text-white"
                    >
                      {copiedKey === "sum" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-white tabular-nums">
                    {stats.sum.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Somatório de todos os termos</p>
                </div>

                {/* Desvio Padrão Amostral */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Desvio Padrão (s)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(stats.stdDevSample.toString(), "stdDevSample")}
                      className="h-5 w-5 p-0 text-zinc-500 hover:text-white"
                    >
                      {copiedKey === "stdDevSample" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
                    {stats.stdDevSample.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Amostral (divisão N - 1)</p>
                </div>

                {/* Variância Amostral */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                    <span>Variância (s²)</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(stats.varianceSample.toString(), "varianceSample")}
                      className="h-5 w-5 p-0 text-zinc-500 hover:text-white"
                    >
                      {copiedKey === "varianceSample" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <div className="font-mono text-xl font-bold text-white tabular-nums">
                    {stats.varianceSample.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Grau de dispersão amostral</p>
                </div>

                {/* Mínimo e Máximo */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="text-zinc-400 text-xs mb-1">Extremos [Mín, Máx]</div>
                  <div className="font-mono text-base font-bold text-white tabular-nums">
                    [{stats.min}, {stats.max}]
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Menor e maior valor</p>
                </div>

                {/* Amplitude */}
                <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                  <div className="text-zinc-400 text-xs mb-1">Amplitude (Range)</div>
                  <div className="font-mono text-xl font-bold text-white tabular-nums">
                    {stats.range.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Diferença entre Máx e Mín</p>
                </div>
              </div>

              {/* Informações populacionais complementares */}
              <div className="rounded-lg bg-zinc-950/50 border border-zinc-800 p-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                <div>
                  <span className="text-zinc-500">Desvio Padrão Populacional (σ): </span>
                  <span className="text-zinc-200 tabular-nums">{stats.stdDevPop.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Variância Populacional (σ²): </span>
                  <span className="text-zinc-200 tabular-nums">{stats.variancePop.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Elementos (N): </span>
                  <span className="text-zinc-200 tabular-nums">{stats.count}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Insira pelo menos um número válido acima para processar as estatísticas.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================================
// 3. CONVERSOR DE UNIDADES FÍSICAS / CIENTÍFICAS
// =========================================================================

type UnitCategory = "temperature" | "length" | "mass" | "storage";

interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // Conversão de/para unidade base da categoria
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

const CATEGORIES: Record<
  UnitCategory,
  { label: string; description: string; baseUnit: string; units: UnitDefinition[] }
> = {
  temperature: {
    label: "Temperatura",
    description: "Escalas termométricas fundamentais (Celsius, Fahrenheit, Kelvin e Rankine).",
    baseUnit: "Celsius",
    units: [
      {
        id: "celsius",
        name: "Graus Celsius",
        symbol: "°C",
        toBase: (c) => c,
        fromBase: (c) => c,
      },
      {
        id: "fahrenheit",
        name: "Graus Fahrenheit",
        symbol: "°F",
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      {
        id: "kelvin",
        name: "Kelvin",
        symbol: "K",
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15,
      },
      {
        id: "rankine",
        name: "Rankine",
        symbol: "°R",
        toBase: (r) => ((r - 491.67) * 5) / 9,
        fromBase: (c) => ((c + 273.15) * 9) / 5,
      },
    ],
  },
  length: {
    label: "Comprimento",
    description: "Medidas métricas decimais e sistema imperial britânico/americano.",
    baseUnit: "Metro",
    units: [
      {
        id: "meter",
        name: "Metro",
        symbol: "m",
        toBase: (m) => m,
        fromBase: (m) => m,
      },
      {
        id: "kilometer",
        name: "Quilômetro",
        symbol: "km",
        toBase: (km) => km * 1000,
        fromBase: (m) => m / 1000,
      },
      {
        id: "centimeter",
        name: "Centímetro",
        symbol: "cm",
        toBase: (cm) => cm * 0.01,
        fromBase: (m) => m / 0.01,
      },
      {
        id: "millimeter",
        name: "Milímetro",
        symbol: "mm",
        toBase: (mm) => mm * 0.001,
        fromBase: (m) => m / 0.001,
      },
      {
        id: "mile",
        name: "Milha Terrestre",
        symbol: "mi",
        toBase: (mi) => mi * 1609.344,
        fromBase: (m) => m / 1609.344,
      },
      {
        id: "yard",
        name: "Jarda",
        symbol: "yd",
        toBase: (yd) => yd * 0.9144,
        fromBase: (m) => m / 0.9144,
      },
      {
        id: "foot",
        name: "Pé",
        symbol: "ft",
        toBase: (ft) => ft * 0.3048,
        fromBase: (m) => m / 0.3048,
      },
      {
        id: "inch",
        name: "Polegada",
        symbol: "in",
        toBase: (inc) => inc * 0.0254,
        fromBase: (m) => m / 0.0254,
      },
    ],
  },
  mass: {
    label: "Massa",
    description: "Padrões de massa do Sistema Internacional (SI) e unidades imperiais.",
    baseUnit: "Quilograma",
    units: [
      {
        id: "kilogram",
        name: "Quilograma",
        symbol: "kg",
        toBase: (kg) => kg,
        fromBase: (kg) => kg,
      },
      {
        id: "gram",
        name: "Grama",
        symbol: "g",
        toBase: (g) => g * 0.001,
        fromBase: (kg) => kg * 1000,
      },
      {
        id: "milligram",
        name: "Miligrama",
        symbol: "mg",
        toBase: (mg) => mg * 0.000001,
        fromBase: (kg) => kg * 1000000,
      },
      {
        id: "tonne",
        name: "Tonelada Métrica",
        symbol: "t",
        toBase: (t) => t * 1000,
        fromBase: (kg) => kg / 1000,
      },
      {
        id: "pound",
        name: "Libra",
        symbol: "lb",
        toBase: (lb) => lb * 0.45359237,
        fromBase: (kg) => kg / 0.45359237,
      },
      {
        id: "ounce",
        name: "Onça",
        symbol: "oz",
        toBase: (oz) => oz * 0.028349523125,
        fromBase: (kg) => kg / 0.028349523125,
      },
    ],
  },
  storage: {
    label: "Armazenamento de Dados",
    description: "Capacidade de dados digitais em padrão binário (1024) e decimal (1000).",
    baseUnit: "Byte",
    units: [
      {
        id: "byte",
        name: "Byte",
        symbol: "B",
        toBase: (b) => b,
        fromBase: (b) => b,
      },
      {
        id: "kilobyte",
        name: "Kilobyte (KB)",
        symbol: "KB",
        toBase: (kb) => kb * 1000,
        fromBase: (b) => b / 1000,
      },
      {
        id: "kibibyte",
        name: "Kibibyte (KiB)",
        symbol: "KiB",
        toBase: (kib) => kib * 1024,
        fromBase: (b) => b / 1024,
      },
      {
        id: "megabyte",
        name: "Megabyte (MB)",
        symbol: "MB",
        toBase: (mb) => mb * 1000000,
        fromBase: (b) => b / 1000000,
      },
      {
        id: "mebibyte",
        name: "Mebibyte (MiB)",
        symbol: "MiB",
        toBase: (mib) => mib * 1048576,
        fromBase: (b) => b / 1048576,
      },
      {
        id: "gigabyte",
        name: "Gigabyte (GB)",
        symbol: "GB",
        toBase: (gb) => gb * 1000000000,
        fromBase: (b) => b / 1000000000,
      },
      {
        id: "gibibyte",
        name: "Gibibyte (GiB)",
        symbol: "GiB",
        toBase: (gib) => gib * 1073741824,
        fromBase: (b) => b / 1073741824,
      },
      {
        id: "terabyte",
        name: "Terabyte (TB)",
        symbol: "TB",
        toBase: (tb) => tb * 1000000000000,
        fromBase: (b) => b / 1000000000000,
      },
    ],
  },
};

function formatUnitValue(val: number): string {
  if (isNaN(val) || !isFinite(val)) return "—";
  if (Math.abs(val) >= 1e9 || (Math.abs(val) < 1e-4 && val !== 0)) {
    return val.toExponential(6);
  }
  // Formata com até 6 casas decimais e remove zeros à direita desnecessários
  return parseFloat(val.toFixed(6)).toLocaleString("pt-BR", {
    maximumFractionDigits: 6,
  });
}

function UnitConverterSection() {
  const [selectedCategory, setSelectedCategory] = React.useState<UnitCategory>("temperature");
  const [inputValue, setInputValue] = React.useState<string>("100");
  const [sourceUnitId, setSourceUnitId] = React.useState<string>("celsius");
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const categoryData = CATEGORIES[selectedCategory];

  // Garante unidade válida de forma declarativa sem efeitos colaterais
  const sourceUnit =
    categoryData.units.find((u) => u.id === sourceUnitId) || categoryData.units[0];
  const currentSourceUnitId = sourceUnit.id;

  const numInput = parseFloat(inputValue);
  const isValidNumber = !isNaN(numInput) && isFinite(numInput);
  const baseValue = isValidNumber ? sourceUnit.toBase(numInput) : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-400" />
                Conversor de Unidades Físicas & Científicas
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                {categoryData.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-zinc-400 border-zinc-800 font-mono">
              Precisão Decimal SI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Seletor de Categoria */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORIES) as UnitCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSourceUnitId(CATEGORIES[cat].units[0].id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  selectedCategory === cat
                    ? "bg-zinc-800 text-white border-zinc-700 shadow-xs"
                    : "bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {CATEGORIES[cat].label}
              </button>
            ))}
          </div>

          {/* Campo de Entrada e Seletor de Unidade de Origem */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Valor para Conversão
              </label>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: 100"
                className="font-mono text-base tabular-nums h-11 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Unidade de Origem
              </label>
              <select
                value={currentSourceUnitId}
                onChange={(e) => setSourceUnitId(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-white shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
              >
                {categoryData.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista Dinâmica de Equivalências Convertidas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Equivalências Calculadas em Tempo Real
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryData.units.map((unit) => {
                const convertedNum = baseValue !== null ? unit.fromBase(baseValue) : NaN;
                const formatted = formatUnitValue(convertedNum);
                const isSource = unit.id === currentSourceUnitId;
                const isCopied = copiedKey === `unit-${unit.id}`;

                return (
                  <div
                    key={unit.id}
                    className={`rounded-xl border p-3.5 transition-all flex items-center justify-between ${
                      isSource
                        ? "bg-zinc-900/90 border-amber-500/40 shadow-xs"
                        : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700/80"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-zinc-300 truncate">
                          {unit.name}
                        </span>
                        {isSource && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[9px] px-1 py-0">
                            Origem
                          </Badge>
                        )}
                      </div>
                      <div className="font-mono text-base font-bold text-white tabular-nums tracking-wide mt-1 truncate">
                        {formatted} <span className="text-xs font-normal text-zinc-400">{unit.symbol}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(`${formatted} ${unit.symbol}`, `unit-${unit.id}`)}
                      disabled={formatted === "—"}
                      className="h-7 px-2 text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800 shrink-0"
                    >
                      {isCopied ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="h-3 w-3" />
                        </span>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================================
// 4. CONVERSOR DE EXPRESSÕES PARA LATEX (ACADÊMICO)
// =========================================================================

interface LatexSnippet {
  label: string;
  code: string;
  category: "algebra" | "calculus" | "symbols" | "templates";
}

const LATEX_SNIPPETS: LatexSnippet[] = [
  // Álgebra & Frações
  { label: "Fração", code: "\\frac{a}{b}", category: "algebra" },
  { label: "Raiz Quadrada", code: "\\sqrt{x}", category: "algebra" },
  { label: "Raiz n-ésima", code: "\\sqrt[n]{x}", category: "algebra" },
  { label: "Potência", code: "x^{n}", category: "algebra" },
  { label: "Subscrito", code: "x_{i}", category: "algebra" },

  // Cálculo & Análise
  { label: "Somatório", code: "\\sum_{i=1}^{n} x_i", category: "calculus" },
  { label: "Integral Definida", code: "\\int_{a}^{b} f(x) \\, dx", category: "calculus" },
  { label: "Limite", code: "\\lim_{x \\to \\infty} f(x)", category: "calculus" },
  { label: "Derivada Parcial", code: "\\frac{\\partial f}{\\partial x}", category: "calculus" },

  // Símbolos Frequentes
  { label: "Mais ou Menos (±)", code: "\\pm", category: "symbols" },
  { label: "Vezes (×)", code: "\\times", category: "symbols" },
  { label: "Infinito (∞)", code: "\\infty", category: "symbols" },
  { label: "Aproximado (≈)", code: "\\approx", category: "symbols" },
  { label: "Pi (π)", code: "\\pi", category: "symbols" },
  { label: "Sigma (σ)", code: "\\sigma", category: "symbols" },
  { label: "Delta (Δ)", code: "\\Delta", category: "symbols" },
  { label: "Theta (θ)", code: "\\theta", category: "symbols" },
];

const PRESET_TEMPLATES = [
  {
    name: "Fórmula de Bhaskara",
    code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  },
  {
    name: "Distribuição Normal (Gaussiana)",
    code: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2\\right)",
  },
  {
    name: "Juros Compostos (Montante)",
    code: "M = C \\cdot (1 + i)^t",
  },
  {
    name: "Teorema de Pitágoras",
    code: "a^2 + b^2 = c^2",
  },
  {
    name: "Identidade de Euler",
    code: "e^{i\\pi} + 1 = 0",
  },
  {
    name: "Modelo Black-Scholes (Call)",
    code: "C(S, t) = S_t \\cdot N(d_1) - K e^{-r(T-t)} \\cdot N(d_2)",
  },
];

function LatexConverterSection() {
  const [latexInput, setLatexInput] = React.useState<string>(
    "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
  );
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) {
      setLatexInput((prev) => `${prev} ${snippet}`);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const current = textareaRef.current.value;
    const updated = current.substring(0, start) + snippet + current.substring(end);
    setLatexInput(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + snippet.length, start + snippet.length);
      }
    }, 50);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Code2 className="h-4 w-4 text-cyan-400" />
                Conversor de Expressões para LaTeX (Acadêmico)
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Editor interativo com atalhos de sintaxe matemática e templates prontos para exportação em LaTeX puro, Markdown ($$) e KaTeX.
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit text-[10px] text-zinc-400 border-zinc-800 font-mono">
              LaTeX Standard 2e
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Templates Prontos */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-300">Modelos Prontos para Teste</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => setLatexInput(tpl.code)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Atalhos de Snippets Rápidos */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-300">Inserção Rápida de Operadores & Símbolos</span>
            <div className="flex flex-wrap gap-1.5">
              {LATEX_SNIPPETS.map((snip) => (
                <button
                  key={snip.label}
                  type="button"
                  onClick={() => insertSnippet(snip.code)}
                  className="px-2 py-1 rounded-md text-xs font-mono bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  title={snip.code}
                >
                  {snip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor de LaTeX */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                Código da Expressão Matemática
              </label>
              {latexInput && (
                <button
                  type="button"
                  onClick={() => setLatexInput("")}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
            <Textarea
              ref={textareaRef}
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              placeholder="Digite comandos LaTeX aqui, ex: \frac{a}{b} + \sqrt{c}"
              rows={4}
              className="font-mono text-sm bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500"
            />
          </div>

          {/* Opções de Cópia e Exportação */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Opção 1: LaTeX Puro */}
            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">LaTeX Puro</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(latexInput, "latex-pure")}
                  disabled={!latexInput.trim()}
                  className="h-6 text-[10px] px-2 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  {copiedKey === "latex-pure" ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> Copiado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copiar
                    </span>
                  )}
                </Button>
              </div>
              <pre className="text-[11px] font-mono text-zinc-400 bg-zinc-900/60 p-2 rounded-lg overflow-x-auto select-all">
                {latexInput || "—"}
              </pre>
            </div>

            {/* Opção 2: Markdown Display Math ($$) */}
            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">Markdown Bloco ($$)</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`$$\n${latexInput}\n$$`, "latex-display")}
                  disabled={!latexInput.trim()}
                  className="h-6 text-[10px] px-2 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  {copiedKey === "latex-display" ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> Copiado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copiar
                    </span>
                  )}
                </Button>
              </div>
              <pre className="text-[11px] font-mono text-cyan-400 bg-zinc-900/60 p-2 rounded-lg overflow-x-auto select-all">
                {latexInput ? `$$\n${latexInput}\n$$` : "—"}
              </pre>
            </div>

            {/* Opção 3: Markdown Linha ($) */}
            <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-300">Markdown Inline ($)</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(`$${latexInput}$`, "latex-inline")}
                  disabled={!latexInput.trim()}
                  className="h-6 text-[10px] px-2 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  {copiedKey === "latex-inline" ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> Copiado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copiar
                    </span>
                  )}
                </Button>
              </div>
              <pre className="text-[11px] font-mono text-zinc-400 bg-zinc-900/60 p-2 rounded-lg overflow-x-auto select-all">
                {latexInput ? `$${latexInput}$` : "—"}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================================
// PÁGINA PRINCIPAL DO HUB MATEMÁTICO & CONVERSORES
// =========================================================================

export default function MathHubPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hub Matemático & Conversores
            </h1>
            <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              Client-side Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Conjunto de utilitários de alta precisão para conversão de bases numéricas, análise estatística rápida, escalas físicas e formatação acadêmica LaTeX.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-900 text-zinc-300 border-zinc-800 text-[11px] px-2.5 py-1">
            <Sparkles className="h-3 w-3 mr-1.5 text-emerald-400" /> Zero Latência
          </Badge>
        </div>
      </div>

      {/* Navegação por Abas (shadcn Tabs) */}
      <Tabs defaultValue="bases" className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl flex-wrap h-auto gap-1">
          <TabsTrigger
            value="bases"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Binary className="h-3.5 w-3.5" />
            <span>Sistemas Numéricos</span>
          </TabsTrigger>

          <TabsTrigger
            value="stats"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>Estatística Rápida</span>
          </TabsTrigger>

          <TabsTrigger
            value="units"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>Conversor de Unidades</span>
          </TabsTrigger>

          <TabsTrigger
            value="latex"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Expressões LaTeX</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba 1: Bases Numéricas */}
        <TabsContent value="bases" className="space-y-4">
          <BaseConverterSection />
        </TabsContent>

        {/* Aba 2: Estatística Rápida */}
        <TabsContent value="stats" className="space-y-4">
          <ArrayStatsSection />
        </TabsContent>

        {/* Aba 3: Conversor de Unidades */}
        <TabsContent value="units" className="space-y-4">
          <UnitConverterSection />
        </TabsContent>

        {/* Aba 4: LaTeX */}
        <TabsContent value="latex" className="space-y-4">
          <LatexConverterSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
