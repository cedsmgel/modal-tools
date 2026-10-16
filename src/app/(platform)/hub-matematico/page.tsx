"use client";

import * as React from "react";
import {
  Binary,
  Calculator,
  Scale,
  Code2,
  Copy,
  Check,
  ChevronDown,
  Receipt,
  Building2,
  TrendingUp,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const sorted = [...numbers].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  let median: number;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    median = sorted[mid];
  } else {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

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

  const parsedNumbers = React.useMemo(() => {
    if (!inputText.trim()) return [];
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

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
      <CardHeader className="pb-4 border-b border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-indigo-400" />
              Calculadora Estatística Rápida (Array Stats)
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Cole uma lista de números separados por vírgula, espaço ou quebra de linha para análise estatística instantânea.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText("154.20, 162.80, 158.40, 171.10, 169.50, 165.30, 178.00, 174.90")}
              className="h-7 text-[10px] border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
            >
              Exemplo Financeiro
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText("10, 20, 30, 40, 50, 60, 70, 80, 90")}
              className="h-7 text-[10px] border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
            >
              Linear 10-90
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
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
        </div>

        {stats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Média (x̄)</span>
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
              </div>

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
              </div>

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
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                  <span>Soma (Σ)</span>
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
              </div>

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
              </div>

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
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                <div className="text-zinc-400 text-xs mb-1">Extremos [Mín, Máx]</div>
                <div className="font-mono text-base font-bold text-white tabular-nums">
                  [{stats.min}, {stats.max}]
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
                <div className="text-zinc-400 text-xs mb-1">Amplitude (Range)</div>
                <div className="font-mono text-xl font-bold text-white tabular-nums">
                  {stats.range.toLocaleString("pt-BR", { maximumFractionDigits: 4 })}
                </div>
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
        name: "Milha",
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
        name: "Tonelada",
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
            Precisão SI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
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

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Equivalências Calculadas
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
  );
}

// =========================================================================
// 4. CONVERSOR DE EXPRESSÕES PARA LATEX (ACADÊMICO)
// =========================================================================

const LATEX_SNIPPETS = [
  { label: "Fração", code: "\\frac{a}{b}" },
  { label: "Raiz Quadrada", code: "\\sqrt{x}" },
  { label: "Raiz n-ésima", code: "\\sqrt[n]{x}" },
  { label: "Potência", code: "x^{n}" },
  { label: "Subscrito", code: "x_{i}" },
  { label: "Somatório", code: "\\sum_{i=1}^{n} x_i" },
  { label: "Integral", code: "\\int_{a}^{b} f(x) \\, dx" },
  { label: "Limite", code: "\\lim_{x \\to \\infty} f(x)" },
  { label: "Mais/Menos", code: "\\pm" },
  { label: "Vezes", code: "\\times" },
  { label: "Infinito", code: "\\infty" },
  { label: "Pi (π)", code: "\\pi" },
  { label: "Sigma (σ)", code: "\\sigma" },
  { label: "Delta (Δ)", code: "\\Delta" },
];

const PRESET_TEMPLATES = [
  { name: "Bhaskara", code: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { name: "Gaussiana", code: "f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2\\right)" },
  { name: "Juros Compostos", code: "M = C \\cdot (1 + i)^t" },
  { name: "Pitágoras", code: "a^2 + b^2 = c^2" },
  { name: "Euler", code: "e^{i\\pi} + 1 = 0" },
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
    <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
      <CardHeader className="pb-4 border-b border-zinc-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-cyan-400" />
              Conversor de Expressões para LaTeX (Acadêmico)
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Editor de equações matemáticas com inserção rápida e exportação para LaTeX puro, Markdown ($$) e KaTeX.
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit text-[10px] text-zinc-400 border-zinc-800 font-mono">
            LaTeX Standard 2e
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-300">Modelos Prontos</span>
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

        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-300">Inserção Rápida de Símbolos</span>
          <div className="flex flex-wrap gap-1.5">
            {LATEX_SNIPPETS.map((snip) => (
              <button
                key={snip.label}
                type="button"
                onClick={() => insertSnippet(snip.code)}
                className="px-2 py-1 rounded-md text-xs font-mono bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {snip.label}
              </button>
            ))}
          </div>
        </div>

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
            placeholder="Digite comandos LaTeX aqui..."
            rows={3}
            className="font-mono text-sm bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
  );
}

// =========================================================================
// 5. FERRAMENTAS FISCAIS (FISCAL TOOLS)
// =========================================================================

function FiscalToolsSection() {
  const [salesTotal, setSalesTotal] = React.useState<string>("24500");
  const [profit, setProfit] = React.useState<string>("3200");
  const [accumulatedLoss, setAccumulatedLoss] = React.useState<string>("500");
  const [operationType, setOperationType] = React.useState<"swing" | "day" | "fii">("swing");

  const numSales = parseFloat(salesTotal) || 0;
  const numProfit = parseFloat(profit) || 0;
  const numLoss = parseFloat(accumulatedLoss) || 0;

  // Regras tributárias brasileiras de Renda Variável
  const netTaxable = Math.max(0, numProfit - numLoss);
  let taxRate = 0.15;
  let isExempt = false;

  if (operationType === "swing") {
    taxRate = 0.15;
    if (numSales <= 20000 && numProfit > 0) {
      isExempt = true;
    }
  } else if (operationType === "day") {
    taxRate = 0.20;
    isExempt = false;
  } else if (operationType === "fii") {
    taxRate = 0.20;
    isExempt = false;
  }

  const taxDue = isExempt ? 0 : netTaxable * taxRate;

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
      <CardHeader className="pb-4 border-b border-zinc-800/60">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-emerald-400" />
              Simulador Fiscal & Apuração de DARF
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Cálculo automatizado de imposto sobre ganho de capital em operações financeiras com compensação de prejuízos acumulados.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 font-mono">
            Código DARF 6015
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setOperationType("swing")}
            className={`p-3 rounded-xl border text-left transition-all ${
              operationType === "swing"
                ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">Swing Trade (Ações)</div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">Alíquota 15% • Isenção R$ 20k</div>
          </button>
          <button
            type="button"
            onClick={() => setOperationType("day")}
            className={`p-3 rounded-xl border text-left transition-all ${
              operationType === "day"
                ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">Day Trade</div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">Alíquota 20% • Sem isenção</div>
          </button>
          <button
            type="button"
            onClick={() => setOperationType("fii")}
            className={`p-3 rounded-xl border text-left transition-all ${
              operationType === "fii"
                ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            <div className="text-xs font-semibold">Fundos Imobiliários (FII)</div>
            <div className="text-[11px] text-zinc-500 mt-1 font-mono">Alíquota 20% • Ganho de capital</div>
          </button>
          <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-left">
            <div className="text-xs font-semibold text-zinc-300">Vencimento</div>
            <div className="text-[11px] text-zinc-400 mt-1">Último dia útil do mês seguinte</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Volume Total de Vendas (Mês)</label>
            <Input
              type="number"
              value={salesTotal}
              onChange={(e) => setSalesTotal(e.target.value)}
              placeholder="R$ 0,00"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
            <span className="text-[10px] text-zinc-500">Determina isenção de R$ 20k em Swing Trade</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Lucro Líquido Apurado (R$)</label>
            <Input
              type="number"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              placeholder="R$ 0,00"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
            <span className="text-[10px] text-zinc-500">Resultado das operações fechadas</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Prejuízo Acumulado Anterior (R$)</label>
            <Input
              type="number"
              value={accumulatedLoss}
              onChange={(e) => setAccumulatedLoss(e.target.value)}
              placeholder="R$ 0,00"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
            <span className="text-[10px] text-zinc-500">Compensável da mesma modalidade</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
            <span className="text-xs text-zinc-400">Base de Cálculo Tributável</span>
            <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
              {netTaxable.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Lucro deduzido do prejuízo</p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
            <span className="text-xs text-zinc-400">Status Fiscal</span>
            <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
              {isExempt ? (
                <span className="text-emerald-400">Isento (Vendas ≤ R$ 20k)</span>
              ) : (
                <span className="text-zinc-200">Tributável ({(taxRate * 100).toFixed(0)}%)</span>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Regulamentação Receita Federal</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <span className="text-xs text-emerald-400 font-medium">Imposto Devido (DARF a Pagar)</span>
            <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums mt-1">
              {taxDue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Dispensado se valor &lt; R$ 10,00</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================================
// 6. FERRAMENTAS IMOBILIÁRIAS (REAL ESTATE TOOLS)
// =========================================================================

function RealEstateToolsSection() {
  const [propertyValue, setPropertyValue] = React.useState<string>("650000");
  const [monthlyRent, setMonthlyRent] = React.useState<string>("3200");
  const [adminFeePercent, setAdminFeePercent] = React.useState<string>("8");
  const [igpmRate, setIgpmRate] = React.useState<string>("4.8");

  const numProperty = parseFloat(propertyValue) || 0;
  const numRent = parseFloat(monthlyRent) || 0;
  const numFee = parseFloat(adminFeePercent) || 0;
  const numRate = parseFloat(igpmRate) || 0;

  // Rental Yield
  const annualGrossRent = numRent * 12;
  const annualNetRent = annualGrossRent * (1 - numFee / 100);
  const grossYield = numProperty > 0 ? (annualGrossRent / numProperty) * 100 : 0;
  const netYield = numProperty > 0 ? (annualNetRent / numProperty) * 100 : 0;
  const paybackYears = netYield > 0 ? 100 / netYield : 0;

  // Reajuste por Índice
  const adjustedRent = numRent * (1 + numRate / 100);
  const diffRent = adjustedRent - numRent;

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                Calculadora de Rental Yield & Reajuste de Aluguel
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Avaliação de taxa de retorno sobre valor de mercado de imóveis e cálculo de reajuste anual por índices de inflação.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30 font-mono">
              Cap Rate & Yield
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Valor de Mercado do Imóvel</label>
              <Input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Aluguel Mensal Atual</label>
              <Input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="R$ 0,00"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Taxa de Administração (%)</label>
              <Input
                type="number"
                value={adminFeePercent}
                onChange={(e) => setAdminFeePercent(e.target.value)}
                placeholder="8%"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Reajuste IGP-M / IPCA 12m (%)</label>
              <Input
                type="number"
                value={igpmRate}
                onChange={(e) => setIgpmRate(e.target.value)}
                placeholder="4,8%"
                className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Yield Bruto Anual</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {grossYield.toFixed(2)}% <span className="text-xs text-zinc-500 font-normal">a.a.</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Sem dedução de taxas</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Yield Líquido Anual</span>
              <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums mt-1">
                {netYield.toFixed(2)}% <span className="text-xs text-zinc-500 font-normal">a.a.</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Após taxa de {adminFeePercent}%</p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
              <span className="text-xs text-zinc-400">Tempo de Payback</span>
              <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
                {paybackYears.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">anos</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Retorno integral do capital</p>
            </div>

            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5">
              <span className="text-xs text-cyan-400 font-medium">Aluguel Reajustado (+{numRate}%)</span>
              <div className="font-mono text-xl font-bold text-cyan-400 tabular-nums mt-1">
                {adjustedRent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <p className="text-[10px] text-zinc-400 mt-0.5">+{diffRent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================================
// 7. FERRAMENTAS FINANCEIRAS (FINANCIAL TOOLS)
// =========================================================================

function FinancialToolsSection() {
  const [initialCapital, setInitialCapital] = React.useState<string>("10000");
  const [monthlyContribution, setMonthlyContribution] = React.useState<string>("1500");
  const [annualRate, setAnnualRate] = React.useState<string>("12");
  const [periodYears, setPeriodYears] = React.useState<string>("5");

  const pv = parseFloat(initialCapital) || 0;
  const pmt = parseFloat(monthlyContribution) || 0;
  const annual = parseFloat(annualRate) || 0;
  const years = parseFloat(periodYears) || 0;

  // Cálculo de juros compostos com aportes mensais
  const totalMonths = Math.round(years * 12);
  const monthlyRate = Math.pow(1 + annual / 100, 1 / 12) - 1;

  let futureValue = pv * Math.pow(1 + monthlyRate, totalMonths);
  if (monthlyRate > 0) {
    futureValue += pmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  } else {
    futureValue += pmt * totalMonths;
  }

  const totalInvested = pv + pmt * totalMonths;
  const totalInterest = Math.max(0, futureValue - totalInvested);

  return (
    <Card className="bg-zinc-900/40 border-zinc-800/80 shadow-xs">
      <CardHeader className="pb-4 border-b border-zinc-800/60">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Calculadora de Juros Compostos & Aportes Mensais
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Projeção de acumulação de capital com aportes periódicos e taxa de rentabilidade equivalente mensal.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 font-mono">
            Equação de Anuidade (FV)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Aporte Inicial (R$)</label>
            <Input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
              placeholder="R$ 10.000"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Aporte Mensal (R$)</label>
            <Input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="R$ 1.500"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Taxa de Juros (% a.a.)</label>
            <Input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="12%"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
            <span className="text-[10px] text-zinc-500 font-mono">
              Equivalente: {(monthlyRate * 100).toFixed(2)}% a.m.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Prazo do Investimento</label>
            <Input
              type="number"
              value={periodYears}
              onChange={(e) => setPeriodYears(e.target.value)}
              placeholder="5 anos"
              className="font-mono tabular-nums bg-zinc-950 border-zinc-800 text-white"
            />
            <span className="text-[10px] text-zinc-500 font-mono">{totalMonths} meses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
            <span className="text-xs text-zinc-400">Total Desembolsado do Bolso</span>
            <div className="font-mono text-xl font-bold text-white tabular-nums mt-1">
              {totalInvested.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Capital próprio investido</p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70">
            <span className="text-xs text-zinc-400">Total em Juros Gerados</span>
            <div className="font-mono text-xl font-bold text-emerald-400 tabular-nums mt-1">
              +{totalInterest.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5">Rendimento composto acumulado</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <span className="text-xs text-emerald-400 font-medium">Patrimônio Líquido Final</span>
            <div className="font-mono text-2xl font-bold text-emerald-400 tabular-nums mt-1">
              {futureValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Em {years} anos de acumulação</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================================
// PÁGINA PRINCIPAL DO HUB MATEMÁTICO COM OS DOIS MENUS
// =========================================================================

export default function MathHubPage() {
  const [activeTab, setActiveTab] = React.useState<string>("matematico");
  const [activeMathSubTool, setActiveMathSubTool] = React.useState<string>("bases");

  const handleSelectTool = (category: string, subTool?: string) => {
    setActiveTab(category);
    if (subTool) {
      setActiveMathSubTool(subTool);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Cabeçalho com os 2 Menus (Dropdown "Ferramentas" e Dropdown "Categorias") */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hub Matemático & Conversores
            </h1>
            <Badge variant="outline" className="text-[10px] text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
              100% Client-side
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Plataforma computacional unificada com ferramentas categorizadas em Matemático, Fiscal, Imobiliário e Financeiro.
          </p>
        </div>

        {/* Os Dois Menus Solicitados */}
        <div className="flex items-center gap-2.5">
          {/* MENU 1: Dropdown "Ferramentas" com Categorias */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-semibold gap-2 border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs cursor-pointer"
              >
                <Wrench className="h-3.5 w-3.5 text-cyan-400" />
                <span>Ferramentas</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl bg-zinc-950 border-zinc-800 shadow-2xl">
              {/* Categoria Matemático */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 px-2 py-1">
                  <Binary className="h-3.5 w-3.5" />
                  <span>Matemático</span>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("matematico", "bases")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Sistemas Numéricos (Bases 2, 8, 10, 16)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("matematico", "stats")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Calculadora Estatística (Array Stats)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("matematico", "units")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Conversor de Unidades Físicas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("matematico", "latex")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Expressões LaTeX (Acadêmico)
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-zinc-800/80 my-1.5" />

              {/* Categoria Fiscal */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 px-2 py-1">
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Fiscal</span>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("fiscal")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Apuração de DARF & IRPF Renda Variável
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-zinc-800/80 my-1.5" />

              {/* Categoria Imobiliário */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 px-2 py-1">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Imobiliário</span>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("imobiliario")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Rental Yield & Reajuste por IGP-M/IPCA
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-zinc-800/80 my-1.5" />

              {/* Categoria Financeiro */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 px-2 py-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Financeiro</span>
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleSelectTool("financeiro")}
                  className="cursor-pointer text-xs rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-900"
                >
                  Juros Compostos & Aportes Mensais
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* MENU 2: Dropdown "Categorias" / Visualização Rápida */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-semibold gap-2 border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:bg-zinc-900 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
                <span>Categorias</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-xl bg-zinc-950 border-zinc-800 shadow-2xl">
              <DropdownMenuItem
                onClick={() => handleSelectTool("matematico")}
                className="cursor-pointer text-xs rounded-lg px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
              >
                <Binary className="h-4 w-4 text-cyan-400" />
                <span>Módulo Matemático</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelectTool("fiscal")}
                className="cursor-pointer text-xs rounded-lg px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
              >
                <Receipt className="h-4 w-4 text-emerald-400" />
                <span>Módulo Fiscal</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelectTool("imobiliario")}
                className="cursor-pointer text-xs rounded-lg px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
              >
                <Building2 className="h-4 w-4 text-amber-400" />
                <span>Módulo Imobiliário</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSelectTool("financeiro")}
                className="cursor-pointer text-xs rounded-lg px-2.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-900 flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Módulo Financeiro</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navegação Principal por Categorias (Tabs do shadcn) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-zinc-900 border border-zinc-800/80 p-1 rounded-xl flex-wrap h-auto gap-1">
          <TabsTrigger
            value="matematico"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Binary className="h-3.5 w-3.5 text-cyan-400" />
            <span>Matemático</span>
          </TabsTrigger>

          <TabsTrigger
            value="fiscal"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Receipt className="h-3.5 w-3.5 text-emerald-400" />
            <span>Fiscal</span>
          </TabsTrigger>

          <TabsTrigger
            value="imobiliario"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Imobiliário</span>
          </TabsTrigger>

          <TabsTrigger
            value="financeiro"
            className="flex items-center gap-2 data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 text-xs px-3.5 py-2 rounded-lg"
          >
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
            <span>Financeiro</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. MÓDULO MATEMÁTICO (Sub-ferramentas) */}
        <TabsContent value="matematico" className="space-y-6">
          {/* Sub-navegação do Módulo Matemático */}
          <div className="flex flex-wrap gap-2 pb-1 border-b border-zinc-800/60">
            <button
              type="button"
              onClick={() => setActiveMathSubTool("bases")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                activeMathSubTool === "bases"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-900"
              }`}
            >
              Sistemas Numéricos
            </button>
            <button
              type="button"
              onClick={() => setActiveMathSubTool("stats")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                activeMathSubTool === "stats"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-900"
              }`}
            >
              Estatística Rápida
            </button>
            <button
              type="button"
              onClick={() => setActiveMathSubTool("units")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                activeMathSubTool === "units"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-900"
              }`}
            >
              Conversor de Unidades
            </button>
            <button
              type="button"
              onClick={() => setActiveMathSubTool("latex")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                activeMathSubTool === "latex"
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-xs"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-900"
              }`}
            >
              Expressões LaTeX
            </button>
          </div>

          {activeMathSubTool === "bases" && <BaseConverterSection />}
          {activeMathSubTool === "stats" && <ArrayStatsSection />}
          {activeMathSubTool === "units" && <UnitConverterSection />}
          {activeMathSubTool === "latex" && <LatexConverterSection />}
        </TabsContent>

        {/* 2. MÓDULO FISCAL */}
        <TabsContent value="fiscal" className="space-y-4">
          <FiscalToolsSection />
        </TabsContent>

        {/* 3. MÓDULO IMOBILIÁRIO */}
        <TabsContent value="imobiliario" className="space-y-4">
          <RealEstateToolsSection />
        </TabsContent>

        {/* 4. MÓDULO FINANCEIRO */}
        <TabsContent value="financeiro" className="space-y-4">
          <FinancialToolsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
